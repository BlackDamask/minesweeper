import { useEffect, useContext, useState } from "react";
import { useToast } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav";
import SearchingForGame from "../../components/SearchingForGame/SearchingForGame";
import * as signalR from '@microsoft/signalr';
import { AuthContext } from "../../AuthProvider";
import GamePanel from "../../components/Game/GamePanel";
import { GameData, Tile } from "../../components/Game/data";
import MultiplayerGamePanel from "../../components/Game/MultiplayerGamePanel";

interface GameStartResponse{
    gameField: Tile[][],
    colBeginIndex: number,
    rowBeginIndex: number,
}

interface StartCoordinates{
    colIndex: number,
    rowIndex: number
}

export default function Multiplayer() {
    const toast = useToast();
    const auth = useContext(AuthContext);
    const accessToken = auth?.accessToken;

    // State to track whether the game has started
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [gameField, setGameField] = useState<Tile[][]>([[]] as Tile[][]);
    const [startCoordinates, setStartCoordinates] = useState<StartCoordinates>({colIndex : 0, rowIndex : 0});

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7036/game", {
                accessTokenFactory: () => {
                    console.log(accessToken);
                    return accessToken ?? ""; 
                }
            })
            .build();
        
        connection.on("GameStarted", (response : GameStartResponse) => {
            console.log(response);
            console.warn(response.colBeginIndex);
            console.warn(response.rowBeginIndex);
            setGameField(response.gameField);
            setStartCoordinates({colIndex: response.colBeginIndex, rowIndex: response.rowBeginIndex});
            setIsGameStarted(true);
            toast({
                title: "Game Started",
                status: 'success',
                isClosable: true,
            });
        });

        connection.on("ReceiveSystemMessage", (message: string) => {
            console.log("System message received:", message);
            toast({
                title: "System Message",
                description: message,
                status: 'info',
                isClosable: true,
            });
        });

        connection.start()
            .catch(err => console.error("SignalR Connection Error:", err));

        // Cleanup function to stop the connection when the component unmounts
        return () => {
            connection.stop()
                .then(() => console.log("SignalR Connection Stopped"))
                .catch(err => console.error("Error stopping SignalR connection:", err));
        };
    }, [accessToken, toast]);

    return (
        <main className='w-screen h-screen flex flex-row bg-slate-900 justify-center items-center'>
            <Nav></Nav>
            {isGameStarted ? <MultiplayerGamePanel gameField={gameField} colIndex={startCoordinates.colIndex} rowIndex={startCoordinates.rowIndex}></MultiplayerGamePanel> : <SearchingForGame></SearchingForGame>}
        </main>
    );
}


