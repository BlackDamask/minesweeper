import Game from '../../components/Game/Game';
import { GameData } from '../../components/Game/data';
import { useEffect, useState } from 'react';
import Controls from './GameControls/Controls';
import GameNav from './GameNav';
import { useDisclosure } from '@chakra-ui/react';

import GameControls from './GameControls/GameControls';

const generateResizeValues = () => {
    let resizeValues = [];
    for (let i = 10; i <= 60; i = i + 2) {
        resizeValues.push(i);
    };
    return (resizeValues);
}

const getDefaultZoom = () => {
    if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) return 26; // mobile
        if (window.innerWidth < 1024) return 36; // tablet
        return 46; // desktop
    }
    return 26;
};

export default function GamePanel() {
    const [selectedZoom, setSelectedZoom] = useState(() => getDefaultZoom());
    const [selectedOption, setSelectedOption] = useState<number>(1);
    const [currentGameData, setCurrentGameData] = useState<GameData>(new GameData({ difficulty: selectedOption }));
    const [selectedMode, setSelectedMode] = useState<number>(1);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>("modern");

    const resizeValues: number[] = generateResizeValues();
    const [timer, setTimer] = useState("00:00");
    

    useEffect(() => {
        const getTime = () => {
            if (startTime) {
                const time = Date.now() - startTime;
                let minutes = String(Math.floor((time / 1000 / 60) % 60));
                let seconds = String(Math.floor((time / 1000) % 60));
                if (minutes.length === 1) {
                    minutes = "0" + minutes
                }
                if (seconds.length === 1) {
                    seconds = "0" + seconds
                }
                setTimer(minutes + ":" + seconds);
            }
            else {
                setTimer("00:00");
            }

        };
        const interval = setInterval(() => getTime(), 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    let fullBgColor = selectedStyle === "modern" ? "transparent" : "#4A619B";
    let marginBgColor = selectedStyle === "modern" ? "transparent" : "#5D789C";

    return (
        <main className='flex flex-col'>


        <GameControls
                selectedZoom={selectedZoom}
                setSelectedZoom={setSelectedZoom}
                resizeValues={resizeValues}
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                setCurrentGameData={setCurrentGameData}
                setStartTime={setStartTime}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
            />
            <div className='h-fit w-[calc(100%-84px)] flex justify-center items-center'>
                <div className={`ml-14 h-full w-fit pt-3 rounded-xl`}
                    style={{
                        backgroundColor: fullBgColor,
                    }}>
                    <GameNav
                        timer={timer}
                        selectedZoom={selectedZoom}
                        currentGameData={currentGameData}
                        selectedOption={selectedOption}
                        setCurrentGameData={setCurrentGameData}
                        setStartTime={setStartTime}
                        selectedStyle={selectedStyle}
                    />
                    <div className='h-3 w-full '
                        style={{
                            backgroundColor: marginBgColor,
                        }}
                    ></div>
                    <Game
                        currentGameData={currentGameData}
                        setCurrentGameData={setCurrentGameData}
                        selectedOption={selectedOption}
                        selectedMode={selectedMode}
                        selectedZoom={selectedZoom}
                        setStartTime={setStartTime}
                        startTime={startTime}
                        isExploaded={undefined}
                        playerExploaded={undefined}
                        selectedStyle={selectedStyle}
                    />
                </div>
            </div>
        </main>
    )

}

