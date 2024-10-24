import { useState, ReactElement, useEffect } from "react";
import { GameData } from "./data";
import { ReactComponent as FlagIcon } from './flag.svg';

const textColorMap: { [key: number]: string } = {
    1: 'text-blue-700',
    2: 'text-fuchsia-700',
    3: 'text-red-700',
    4: 'text-purple-700',
    5: 'text-orange-600',
    6: 'text-teal-500',
    7: 'text-rose-600',
    8: 'text-zinc-600',
};

type TileColor = 'light-tile' | 'dark-tile';

const tileColorMap: { [key in TileColor]: { default: string; clicked: string } } = {
    'light-tile': {
        default: '#28cc0a',  
        clicked: '#d3d3d3',  
    },
    'dark-tile': {
        default: '#39ff13',  
        clicked: '#a9a9a9',  
    },
};

const showBombCount = (bombCount: number | null): ReactElement => {
    if (bombCount === null || bombCount === 0) {
        return <p></p>; 
    }

    const colorClass = textColorMap[bombCount] || '';
    return <p className={colorClass}>{bombCount}</p>;
};

export default function Game({ gameData }: { gameData: GameData }) {
    const [currentGameData, setCurrentGameData] = useState<GameData>(gameData);

    useEffect(() => {
        setCurrentGameData(gameData); 
    }, [gameData]);

    const handleClick = (rowIndex: number, colIndex: number) => {
        if (!currentGameData.gameField[rowIndex][colIndex].isFlagged) {
            currentGameData.setRevealedTile(rowIndex, colIndex);
            setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));

        }
    };

    const handleRightClick = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        e.preventDefault();
        currentGameData.setFlaggedTile(rowIndex, colIndex);
        setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));

    };

    return (
        <div className="bg-green-950 h-fit w-fit p-5">
            {currentGameData.gameField.map((row, rowIndex) => (
                <div className="flex" key={rowIndex}>
                    {row.map((tile, colIndex) => {
                        const tileColor = tile.color as TileColor;

                        return (
                            <div
                                key={colIndex}
                                className="flex items-center justify-center text-5xl h-14 w-14 font-customFont cursor-pointer"
                                style={{
                                    backgroundColor: currentGameData.gameField[rowIndex][colIndex].isRevealed
                                        ? tileColorMap[tileColor].clicked // Color after click
                                        : tileColorMap[tileColor].default // Default color before click
                                }}
                                onClick={() => handleClick(rowIndex, colIndex)} // Left click
                                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)} // Right click
                            >
                                {currentGameData.gameField[rowIndex][colIndex].isRevealed &&
                                !currentGameData.gameField[rowIndex][colIndex].isFlagged
                                    ? showBombCount(tile.nearbyBombs)
                                    : null}

                                {currentGameData.gameField[rowIndex][colIndex].isFlagged &&
                                !currentGameData.gameField[rowIndex][colIndex].isRevealed && (
                                    <FlagIcon width="0.90em" height="0.90em" />
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}



