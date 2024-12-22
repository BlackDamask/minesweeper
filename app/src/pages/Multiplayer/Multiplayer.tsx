import { useEffect, useContext, useState } from "react";
import { useToast } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav";
import SearchingForGame from "../../components/SearchingForGame/SearchingForGame";
import * as signalR from '@microsoft/signalr';
import { AuthContext } from "../../AuthProvider";
import GamePanel from "../../components/Game/GamePanel";

export default function Multiplayer() {
    const toast = useToast();
    const auth = useContext(AuthContext);
    const accessToken = auth?.accessToken;

    // State to track whether the game has started
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7036/game", {
                accessTokenFactory: () => {
                    console.log(accessToken);
                    return accessToken ?? ""; 
                }
            })
            .build();
        
        connection.on("GameStarted", () => {
            setIsGameStarted(true); // Update state when the game starts
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
            {isGameStarted ? <GamePanel></GamePanel> : <SearchingForGame></SearchingForGame>}
        </main>
    );
}


