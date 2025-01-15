import { Spinner, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "../../api/axios";
import {  useGameContext } from "../../GameProvider";
import { Tile } from "../Game/data";

interface GameStartResponse {
    data:{
        gameField: Tile[][],
        colBeginIndex: number;
        rowBeginIndex: number;
        enemyName: string;
        enemyProgress: number;
    };
    message:string;
    success:boolean;
}

export default function SearchingForGame() {
    const game = useGameContext();
    const auth = useContext(AuthContext);
    const isMounted = useRef(false); 
    const toast = useToast();

    useEffect(() => {
        if (isMounted.current) return; 
        isMounted.current = true;

        axios.post<GameStartResponse>(
            "/player/add-to-queue",
            {},
            {
                headers: { Authorization: `Bearer ${auth?.accessToken}` },
            }
        ).then(response => {
            const data = response.data.data;
            if(data){
                toast({
                    title: "Game info",
                    description: "You are already in a game",
                });
                console.warn(data);
                game?.setEnemyProgress(data.enemyProgress);
                game?.setEnemyName(data.enemyName);
                game?.setGameField(data.gameField);
                game?.setStartCoordinates({ colIndex: data.colBeginIndex, rowIndex: data.rowBeginIndex });
                game?.setIsGameStarted(true);
            }
        }).catch(error => {
            console.error("Error adding to queue:", error);
        });

        return () => {
            axios.delete(
                "/player/remove-from-queue",
                {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` },
                }
            ).then(response => {
                console.log("Removed from queue:", response.data);
            }).catch(error => {
                console.error("Error removing from queue:", error);
            });
        };
    }, [auth, toast, game]);

    return (
        <main className="h-2/3 aspect-square bg-slate-950 rounded-2xl flex flex-col items-center justify-evenly">
            <h1 className="text-4xl text-gray-300">Searching for game</h1>
            <Spinner color="#d1d5db" size={"xl"} thickness="4px" />
            <h2 className="text-3xl text-gray-300">00:00</h2>
        </main>
    );
}

