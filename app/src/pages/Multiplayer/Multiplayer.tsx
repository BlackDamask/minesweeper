
import { useToast } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav";
import SearchingForGame from "../../components/SearchingForGame/SearchingForGame";
import * as signalR from '@microsoft/signalr'

export default function Multiplayer(){
    const toast = useToast();

    const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7036/game")
    .build();
    connection.on("GameStarted", () => {
        console.log(`Game started!`);
        toast({
            title: "Game  started",
            status: 'success',
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


