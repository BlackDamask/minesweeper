import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "./AuthProvider";
import { GameData, Tile } from "./components/Game/data";
import { useNavigate } from "react-router-dom";
 
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
  winnersTime: number | null;
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

interface GameInvitation {
  id: string;
  name: string;
  elo: number;
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

  gameInvitation: GameInvitation | null;
  
  playerExploaded:() => void;
  sendPvpGameInvitation: (invitedPlayerId: string) => Promise<void>;
  acceptPvpGameInvitation: (inviterPlayerId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<boolean>;
  rejectFriendRequest: (requestId: string) => Promise<boolean>;

  setGameField: React.Dispatch<React.SetStateAction<Tile[][]>>;
  setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExploaded: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentGameData: React.Dispatch<React.SetStateAction<GameData | null>>;
  setStartCoordinates: React.Dispatch<React.SetStateAction<StartCoordinates>>;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
  setEnemyProgress: React.Dispatch<React.SetStateAction<number>>;
  setEnemyName: React.Dispatch<React.SetStateAction<string>>;
  setGameInvitation: React.Dispatch<React.SetStateAction<GameInvitation | null>>;
  resetMultiplayerGame: () => void;
  shallRedirectToMultiplayerPage: boolean;
  setShallRedirectToMultiplayerPage: React.Dispatch<React.SetStateAction<boolean>>;
  winnersTime: string;
  setWinnersTime: React.Dispatch<React.SetStateAction<string>>;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const auth = useContext(AuthContext);
  const accessToken = auth?.accessToken;
  
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(true);
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
  const [gameInvitation, setGameInvitation] = useState<GameInvitation | null>(null);
  const [shallRedirectToMultiplayerPage, setShallRedirectToMultiplayerPage] = useState(false);
  const [winnersTime, setWinnersTime] = useState<string >("00:00");


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
      .withUrl("http://localhost:5150/game", {
        accessTokenFactory: () => accessToken ?? "",
      })
      .withAutomaticReconnect()
      .build(); 

    connectionRef.current = connection;

    

  }, [accessToken, connectionRef]);

  useEffect(() => {
    const connection = connectionRef.current;
    if(connection){
      if(connection.state !== "Connected")
        connection.start().catch((e) => "Failed to connect to websocket: " + e);
          connection.on("GameStarted", (response: GameStartResponse) => {
            setShallRedirectToMultiplayerPage(true);
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
      
          connection.on("ReceivePvpGameInvitation", (invitation: GameInvitation) => {
            console.log("Received PvP Game Invitation in GameProvider", invitation);
            if(isGameEnded){
              setGameInvitation(invitation);
            }
          });
      
          
      
          connection.on("GameEnd", (response: GameEndResponse) => {
            console.warn(response);
            if(response.isWon){
              setShallRedirectToMultiplayerPage(false);
              setIsGameEnded(true);
              setIsWon(true);
              if (currentGameData) currentGameData.isGameOver = true;
            }
            else{
              setShallRedirectToMultiplayerPage(false);
              setIsGameEnded(true);
              setIsWon(false);
              if (currentGameData) currentGameData.isGameOver = true;
            }
            const time = Date.now() - startTime - 57 * 60000 - 36000; // Adjusted time calculation
            if (typeof time === "number" && !isNaN(time)) {
              let minutes = String(Math.floor((time / 1000 / 60) % 60));
              let seconds = String(Math.floor((time / 1000) % 60));
              if (minutes.length === 1) {
                minutes = "0" + minutes;
              }
              if (seconds.length === 1) {
                seconds = "0" + seconds;
              }
              setWinnersTime(`${minutes}:${seconds}`);
            } else {
              setWinnersTime("00:00");
            }
            setCurrentElo(response.newElo);
            setEloChange(response.eloChange);
            // Do NOT resetMultiplayerGame here, only on button click
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


  const sendPvpGameInvitation = async (invitedPlayerId: string) => {
    const connection = connectionRef.current;
    if (connection && connection.state === "Connected") {
      try {
        await connection.invoke("SendPvpGameInvitation", invitedPlayerId);
        toast({
          title: "Invitation sent!",
          status: "success",
          isClosable: true,
        });
      } catch (err: any) {
        console.error("Error sending PvP game invitation:", err);
        toast({
          title: "Failed to send invitation",
          description: err.message || "Please try again.",
          status: "warning",
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Not connected to game server",
        status: "error",
        isClosable: true,
      });
    }
  };

  const acceptPvpGameInvitation = async (inviterPlayerId: string) => {
    const connection = connectionRef.current;
    if (connection && connection.state === "Connected") {
      try {
        await connection.invoke("AcceptPvpGameInvitation", inviterPlayerId);
      } catch (err: any) {
        toast({
          title: "Failed to accept invitation",
          description: err.message || "Please try again.",
          status: "error",
          isClosable: true,
          position: "top",
        });
      }
    } else {
      try {
        await connection?.start();
        await connection?.invoke("AcceptPvpGameInvitation", inviterPlayerId);
      } catch (err: any) {
        toast({
          title: "Not connected to game server",
          status: "error",
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    if (!auth?.accessToken) return false;
    try {
      const response = await fetch(`/request/accept?requestId=${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      const data = await response.json();
      if (data && data.success) {
        toast({
          title: "Friend request accepted!",
          status: "success",
          isClosable: true,
        });
        return true;
      }
    } catch (err: any) {
      toast({
        title: "Failed to accept friend request",
        description: err.message || "Please try again.",
        status: "warning",
        isClosable: true,
      });
    }
    return false;
  };

  const rejectFriendRequest = async (requestId: string) => {
    if (!auth?.accessToken) return false;
    try {
      const response = await fetch(`/request/reject?requestId=${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      const data = await response.json();
      if (data && data.success) {
        toast({
          title: "Friend request rejected!",
          status: "success",
          isClosable: true,
        });
        return true;
      }
    } catch (err: any) {
      toast({
        title: "Failed to reject friend request",
        description: err.message || "Please try again.",
        status: "warning",
        isClosable: true,
      });
    }
    return false;
  };

  const resetMultiplayerGame = () => {
    setIsGameStarted(false);
    setIsGameEnded(false);
    setCurrentGameData(null);
    setGameField([[]]);
    setStartCoordinates({ colIndex: 0, rowIndex: 0 });
    setEnemyProgress(0);
    setEnemyName("Opponent");
    setIsExploaded(false);
    setIsEnemyExploaded(false);
    setGameInvitation(null);
    setStartTime(0);
    setIsWon(false);
    setEloChange(0);
    // Optionally reset other state as needed
  };

  // Save game state before unload
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("gameState", JSON.stringify({ 
        isGameStarted,
        isGameEnded,
        isExploaded,
        isEnemyExploaded,
        isWon,
        shallRedirectToMultiplayerPage,

        enemyProgress,
        gameField,
        startCoordinates,
        startTime,
        currentGameData, 
        enemyName,
        eloChange,
        currentElo,

        gameInvitation,
        winnersTime,
      }));
    });
    return () => window.removeEventListener("beforeunload", () => {});
  }, [isGameStarted, isGameEnded, isExploaded, isEnemyExploaded, isWon, shallRedirectToMultiplayerPage, enemyProgress, gameField, startCoordinates, startTime, currentGameData, enemyName, eloChange, currentElo, gameInvitation, winnersTime]);

  // Restore game state on load
  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      const {
        isGameStarted,
        isGameEnded,
        isExploaded,
        isEnemyExploaded,
        isWon,
        shallRedirectToMultiplayerPage,

        enemyProgress,
        gameField,
        startCoordinates,
        startTime,
        currentGameData, 
        enemyName,
        eloChange,
        currentElo,

        gameInvitation,
        
        winnersTime,
      } = JSON.parse(savedState);

      setIsGameStarted(isGameStarted);
      setIsGameEnded(isGameEnded);
      setIsExploaded(isExploaded);
      setIsEnemyExploaded(isEnemyExploaded);
      setIsWon(isWon);
      setShallRedirectToMultiplayerPage(shallRedirectToMultiplayerPage);

      setEnemyProgress(enemyProgress);
      setGameField(gameField);
      setStartCoordinates(startCoordinates);
      setStartTime(startTime);
      setCurrentGameData(currentGameData); 
      setEnemyName(enemyName);
      setEloChange(eloChange);
      setCurrentElo(currentElo);

      setGameInvitation(gameInvitation);
      
      // setGameInvitation,

      // setGameField,
      // setIsExploaded,
      // playerExploaded,
      // setStartTime,
      // setEnemyProgress,
      // setCurrentGameData,
      // setStartCoordinates, 
      // setIsGameStarted, 
      // setEnemyName,
      // setShallRedirectToMultiplayerPage,
      // sendPvpGameInvitation,
      // acceptPvpGameInvitation,
      // acceptFriendRequest,
      // rejectFriendRequest,
      // resetMultiplayerGame,
      setWinnersTime(winnersTime);
    }
  }, []);
  

  return (
    <GameContext.Provider value={{ 
      isGameStarted,
      isGameEnded,
      isExploaded,
      isEnemyExploaded,
      isWon,
      shallRedirectToMultiplayerPage,

      enemyProgress,
      gameField,
      startCoordinates,
      startTime,
      currentGameData, 
      enemyName,
      eloChange,
      currentElo,

      gameInvitation,
      
      setGameInvitation,

      setGameField,
      setIsExploaded,
      playerExploaded,
      setStartTime,
      setEnemyProgress,
      setCurrentGameData,
      setStartCoordinates, 
      setIsGameStarted, 
      setEnemyName,
      setShallRedirectToMultiplayerPage,
      sendPvpGameInvitation,
      acceptPvpGameInvitation,
      acceptFriendRequest,
      rejectFriendRequest,
      resetMultiplayerGame,
      winnersTime,
      setWinnersTime,
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
