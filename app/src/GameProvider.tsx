import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "./AuthProvider";
import { GameData, Tile } from "./components/Game/data";
 
interface GameStartResponse {
  gameField: Tile[][],
  colBeginIndex: number;
  rowBeginIndex: number;
  enemyName: string;
  enemyProgress: number;
  startTime: number;
}

interface GameEndResponse {
  isWon: boolean;
  newElo: number;
  eloChange: number;
}

interface ReceiveProgressResponse {
  progress: number; 
  isExploaded:boolean;
}
interface SendProgressResponse {
  progress: number; 
  isExploaded:boolean;
}

interface StartCoordinates {
  colIndex: number;
  rowIndex: number;
}

interface GameContextType {
  isGameStarted: boolean;
  isGameEnded: boolean | undefined;
  isExploaded: boolean;
  isWon: boolean;

  currentGameData: GameData | null;
  gameField: Tile[][];
  startCoordinates: StartCoordinates;
  startTime: number;
  
  isEnemyExploaded: boolean;
  enemyProgress: number;
  enemyName: string;

  currentElo: number;
  eloChange: number;
  
  playerExploaded:() => void;

  setGameField: React.Dispatch<React.SetStateAction<Tile[][]>>;
  setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExploaded: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentGameData: React.Dispatch<React.SetStateAction<GameData | null>>;
  setStartCoordinates: React.Dispatch<React.SetStateAction<StartCoordinates>>;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
  setEnemyProgress: React.Dispatch<React.SetStateAction<number>>;
  setEnemyName: React.Dispatch<React.SetStateAction<string>>;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const auth = useContext(AuthContext);
  const accessToken = auth?.accessToken;
  
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isExploaded, setIsExploaded] = useState(false);
  const [isEnemyExploaded, setIsEnemyExploaded] = useState(false);
  const [enemyName, setEnemyName] = useState("Opponent");
  const [enemyProgress, setEnemyProgress] = useState<number>(0);
  const [gameField, setGameField] = useState<Tile[][]>([[]]);
  const [currentGameData, setCurrentGameData] = useState<GameData | null>(null);
  const [startCoordinates, setStartCoordinates] = useState<StartCoordinates>({ colIndex: 0, rowIndex: 0 });
  const [startTime, setStartTime] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [currentElo, setCurrentElo] = useState<number>(500);
  const [eloChange, setEloChange] = useState<number>(0);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const playerExploaded = () =>
    {
      console.log("set to true");
      setIsExploaded(true);
      setTimeout(() => {
        console.log("set to false");
        setIsExploaded(false);
      }, 5000); 
    }

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7036/game", {
        accessTokenFactory: () => accessToken ?? "",
      })
      .withAutomaticReconnect()
      .build(); 

    connectionRef.current = connection;

    

  }, [accessToken,connectionRef]);

  useEffect(() => {
    const connection = connectionRef.current;
    if(connection){
      if(connection.state !== "Connected")
        connection.start().catch((e) => "Failed to connect to websocket: " + e);
          connection.on("GameStarted", (response: GameStartResponse) => {
            toast({
              title: "GameDataReceived",
              description: response.enemyName,
              status: "info",
              isClosable: true
            })
            setEnemyName(response.enemyName);
            setGameField(response.gameField);
            setStartCoordinates({ colIndex: response.colBeginIndex, rowIndex: response.rowBeginIndex });
            setEnemyProgress(response.enemyProgress);
            setStartTime(response.startTime);
            setIsGameStarted(true);
            setIsGameEnded(false);
            console.log(response);
          });
      
          connection.on("SetNotIsExploaded", () => {
            console.warn("ReceivedSetNotIsExploaded");
            setIsExploaded(false);
          });
          
      
          connection.on("ReceiveProgress", (response: ReceiveProgressResponse) => {
            setEnemyProgress(response.progress);
            setIsEnemyExploaded(response.isExploaded);
          });
      
          connection.on("ReceiveSystemMessage", (message: string) => {
            console.log("System message received:", message);
            toast({
              title: "System Message",
              description: message,
              status: "info",
              isClosable: true,
            });
          });
      
          
      
          connection.on("GameEnd", (response: GameEndResponse) => {
            console.warn(response);
            if(response.isWon){
              setIsGameEnded(true);
              setIsWon(true);
              currentGameData!.isGameOver = true;
            }
            else{
              setIsGameEnded(true);
              setIsWon(false);
              currentGameData!.isGameOver = true;
            }
            setCurrentElo(response.newElo);
            setEloChange(response.eloChange);
          });
    }
  }, [connectionRef,currentGameData, toast]); 

  useEffect(() => {
    const connection = connectionRef.current;

    const sendProgress = () =>{
      if(connection && connection.state === "Connected"){
        if(currentGameData?.maxNumberOfRevealedTiles){
          const progress = currentGameData?.countRevealedTiles() / currentGameData?.maxNumberOfRevealedTiles * 100;
          if(currentGameData.isExploaded !== undefined){
            const progressData: SendProgressResponse = {
              progress: progress,
              isExploaded: isExploaded,
            };
          
            console.warn(currentGameData.isExploaded);
            
                  connection.invoke("SendProgress", progressData)
          } 
        }
      }
    }
    sendProgress();
  }, [currentGameData, isExploaded]);


  return (
    <GameContext.Provider value={{ 
      isGameStarted,
      isGameEnded,
      isExploaded,
      isEnemyExploaded,
      isWon,

      enemyProgress,
      gameField,
      startCoordinates,
      startTime,
      currentGameData, 
      enemyName,
      eloChange,
      currentElo,

      setGameField,
      setIsExploaded,
      playerExploaded,
      setStartTime,
      setEnemyProgress,
      setCurrentGameData,
      setStartCoordinates, 
      setIsGameStarted, 
      setEnemyName,
      }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    console.error("useGameContext must be used within a GameProvider");
  }
  return context;
};
