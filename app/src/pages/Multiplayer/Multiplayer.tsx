
import { useToast } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav";
import SearchingForGame from "../../components/SearchingForGame/SearchingForGame";
import * as signalR from '@microsoft/signalr'
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";

export default function Multiplayer(){
    const toast = useToast();
    const auth = useContext(AuthContext);
    
    const accesToken = auth?.accessToken;

    const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7036/game", {
                accessTokenFactory: () => {
                    console.log(accesToken);
                    return accesToken ?? ""; 
                }
            })
            .build();

    connection.on("GameStarted", () => {
        console.log(`Game started!`);
        toast({
            title: "Game  started",
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

    connection.start().catch(err => console.error(err.toString()));
    return(
        <main className='w-screen h-screen flex flex-row bg-slate-900 justify-center items-center'>
            <Nav></Nav>
            <SearchingForGame></SearchingForGame>

        </main>
    );

}


