import { Spinner, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "../../api/axios";
import { useGameContext } from "../../GameProvider";
import { Tile } from "../Game/data";

interface GameStartResponse {
    data: {
        gameField: Tile[][],
        colBeginIndex: number;
        rowBeginIndex: number;
        enemyName: string;
        enemyProgress: number;
        startTime: number;
    };
    message: string;
    success: boolean;
}

export default function SearchingForGame() {
    const game = useGameContext();
    const auth = useContext(AuthContext);
    const isMounted = useRef(false); 
    const toast = useToast();
    
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        if (isMounted.current) return; 

        isMounted.current = true;
        game?.setCurrentGameData(null);

        axios.post<GameStartResponse>(
            "/player/add-to-queue",
            {},
            {
                headers: { Authorization: `Bearer ${auth?.accessToken}` },
            }
        ).then(response => {
            const data = response.data.data;
            if (data) {
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
                game?.setStartTime(data.startTime);
            }
        }).catch(error => {
            console.error("Error adding to queue:", error);
        }); 

    }, [auth, toast, game]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 640); // Tailwind `sm` is 640px
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    if (isSmallScreen) {
        return (
            <div className="h-full w-full flex flex-col justify-center bg-black">
                <main className=" h-2/3 flex flex-col items-center justify-evenly">
                    <h1 className="text-2xl text-white text-center">
                    Searching for game
                </h1>
                <Spinner color="#d1d5db" size="xl" thickness="4px" />
                <h2 className="text-2xl  text-white">
                    {formatTime(timeElapsed)}
                </h2>
                </main>
            </div>
        );
    }

    return (
        <main className="w-full max-w-sm md:max-w-lg lg:max-w-xl aspect-square xl:max-w-2xl mx-auto p-6 bg-gray-950 rounded-2xl border-slate-900 border-4 flex flex-col items-center justify-evenly shadow-lg">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white text-center">
                Searching for game
            </h1>
            <Spinner color="#d1d5db" size="xl" thickness="4px" />
            <h2 className="text-lg sm:text-2xl md:text-3xl text-white">
                {formatTime(timeElapsed)}
            </h2>
        </main>
    );
}



