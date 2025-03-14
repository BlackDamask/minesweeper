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
  enemyProgress: number;
  gameField: Tile[][];
  isExploaded: boolean;
  isEnemyExploaded: boolean;
  setGameField: React.Dispatch<React.SetStateAction<Tile[][]>>;
  startCoordinates: StartCoordinates;
  setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExploaded: React.Dispatch<React.SetStateAction<boolean>>;
  playerExploaded:() => void;
  setCurrentGameData: React.Dispatch<React.SetStateAction<GameData | null>>;
  setStartCoordinates: React.Dispatch<React.SetStateAction<StartCoordinates>>;
  setEnemyProgress: React.Dispatch<React.SetStateAction<number>>;
  setEnemyName: React.Dispatch<React.SetStateAction<string>>;
  currentGameData: GameData | null;
  enemyName: string;
  isWon: boolean;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const auth = useContext(AuthContext);
  const accessToken = auth?.accessToken;
  
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isExploaded, setIsExploaded] = useState(false);
  const [isEnemyExploaded, setIsEnemyExploaded] = useState(true);
  const [enemyName, setEnemyName] = useState("Opponent");
  const [enemyProgress, setEnemyProgress] = useState<number>(0);
  const [gameField, setGameField] = useState<Tile[][]>([[]]);
  const [currentGameData, setCurrentGameData] = useState<GameData | null>(null);
  const [startCoordinates, setStartCoordinates] = useState<StartCoordinates>({ colIndex: 0, rowIndex: 0 });
  const [isWon, setIsWon] = useState<boolean>(false);
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
      .build(); 

    connectionRef.current = connection;

    connection.on("GameStarted", (response: GameStartResponse) => {
      setEnemyName(response.enemyName);
      setGameField(response.gameField);
      setStartCoordinates({ colIndex: response.colBeginIndex, rowIndex: response.rowBeginIndex });
      setIsGameStarted(true);
      setIsGameEnded(false);
      toast({
        title: "Game Started",
        status: "success",
        isClosable: true,
      });
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

    

    connection.on("GameWon", () => {
      setIsGameEnded(true);
      setIsWon(true);
      currentGameData!.isGameOver = true;
    });
    
    connection.on("GameLost", () => {
      setIsGameEnded(true);
      setIsWon(false);
      currentGameData!.isGameOver = true;
    });

    connection.start().catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      connection.stop()
        .then(() => console.log("SignalR Connection Stopped"))
        .catch((err) => console.error("Error stopping SignalR connection:", err));
    };
  }, [accessToken, currentGameData, toast]);

  useEffect(() => {
    const connection = connectionRef.current;
    

    const sendProgress = () =>{
      if(currentGameData?.maxNumberOfRevealedTiles && connection ){
        const progress = currentGameData?.countRevealedTiles() / currentGameData?.maxNumberOfRevealedTiles * 100;
        if(currentGameData.isExploaded !== undefined){
          const progressData: SendProgressResponse = {
            progress: progress,
            isExploaded: isExploaded,
          };
        
          console.warn(currentGameData.isExploaded);
          connection.invoke("SendProgress", progressData)
            .catch((err) => {
              console.error("Error sending game field:", err);
            });
        }
      }
    }
    sendProgress();
  }, [currentGameData, isExploaded]);


  return (
    <GameContext.Provider value={{ 
      isGameStarted,
      isGameEnded,
      setGameField,
      isExploaded,
      isEnemyExploaded,
      setIsExploaded,
      playerExploaded,
      enemyProgress,
      setEnemyProgress,
      gameField,
      startCoordinates,
      setCurrentGameData,
      setStartCoordinates, 
      setIsGameStarted, 
      currentGameData, 
      enemyName, 
      setEnemyName,
      isWon 
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
