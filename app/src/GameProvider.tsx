import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "./AuthProvider";
import { GameData, Tile } from "./components/Game/data";

interface GameStartResponse {
  gameField: Tile[][],
  colBeginIndex: number;
  rowBeginIndex: number;
}

interface StartCoordinates {
  colIndex: number;
  rowIndex: number;
}

interface GameContextType {
  isGameStarted: boolean;
  isGameEnded: boolean | undefined;
  playerProgress: number;
  enemyProgress: number;
  gameField: Tile[][];
  setGameField: React.Dispatch<React.SetStateAction<Tile[][]>>;
  startCoordinates: StartCoordinates;
  setCurrentGameData: React.Dispatch<React.SetStateAction<GameData | null>>;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const auth = useContext(AuthContext);
  const accessToken = auth?.accessToken;
  
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [playerProgress, setPlayerProgress] = useState<number>(0);
  const [enemyProgress, setEnemyProgress] = useState<number>(0);
  const [gameField, setGameField] = useState<Tile[][]>([[]]);
  const [currentGameData, setCurrentGameData] = useState<GameData | null>(null);
  const [startCoordinates, setStartCoordinates] = useState<StartCoordinates>({ colIndex: 0, rowIndex: 0 });

  // Ref for the SignalR connection
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7036/game", {
        accessTokenFactory: () => accessToken ?? "",
      })
      .build();

    connectionRef.current = connection;

    connection.on("GameStarted", (response: GameStartResponse) => {
      console.log(response);
      setGameField(response.gameField);
      setStartCoordinates({ colIndex: response.colBeginIndex, rowIndex: response.rowBeginIndex });
      setIsGameStarted(true);
      toast({
        title: "Game Started",
        status: "success",
        isClosable: true,
      });
    });

    connection.on("ReceiveGameField", () => {
      toast({
        title: "Game Field Received",
        description: "",
        status: "info",
        isClosable: true,
      });
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

    connection.start().catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      connection.stop()
        .then(() => console.log("SignalR Connection Stopped"))
        .catch((err) => console.error("Error stopping SignalR connection:", err));
    };
  }, [accessToken, toast]);

  useEffect(() => {
    const connection = connectionRef.current;
    if (connection) {
      console.log("connection");
      connection.invoke("SendGameField").catch((err) => {
        console.error("Error sending game field:", err);
      });
    }
  }, [currentGameData]);

  return (
    <GameContext.Provider value={{ isGameStarted, isGameEnded, playerProgress, setGameField, enemyProgress, gameField, startCoordinates, setCurrentGameData }}>
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
