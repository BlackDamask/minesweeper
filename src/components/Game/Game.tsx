import { useState, ReactElement } from "react";
import { GameData } from "./data";

// Define a color map for bomb count text colors
const colorMap: { [key: number]: string } = {
    1: 'text-blue-700',
    2: 'text-fuchsia-700',
    3: 'text-red-700',
    4: 'text-purple-700',
    5: 'text-orange-600',
    6: 'text-teal-500',
    7: 'text-rose-600',
    8: 'text-zinc-600',
};

// Define valid tile color types
type TileColor = 'light-tile' | 'dark-tile';

// Define a tile color map for default and clicked colors
const tileColorMap: { [key in TileColor]: { default: string; clicked: string } } = {
    'light-tile': {
        default: '#28cc0a',  // light gray for default
        clicked: '#d3d3d3',  // light green for clicked
    },
    'dark-tile': {
        default: '#39ff13',  // dark gray for default
        clicked: '#a9a9a9',  // bright green for clicked
    },
};

// Function to show bomb count with appropriate color
var showBombCount = (bombCount: number | null): ReactElement => {
    if (bombCount === null || bombCount === 0) {
        return <p></p>;
    }

    const colorClass = colorMap[bombCount] || '';
    return <p className={`${colorClass}`}>{bombCount}</p>;
};

export default function Game({ gameData }: { gameData: GameData }) {
    // Track revealed state for each tile
    const [revealedTiles, setRevealedTiles] = useState<boolean[][]>(
        gameData.gameField.map(row => row.map(() => false)) // Initialize all tiles as not revealed
    );

    // Handle click to reveal the tile
    const handleClick = (rowIndex: number, colIndex: number) => {
        const newRevealedTiles = [...revealedTiles];
        newRevealedTiles[rowIndex][colIndex] = true;
        setRevealedTiles(newRevealedTiles);
    };

    return (
        <div className="bg-green-950 h-fit w-fit p-5 ">
            {gameData.gameField.map((row, rowIndex) => (
                <div className="flex" key={rowIndex}>
                    {row.map((tile, colIndex) => {
                        // Assert that tile.color is one of the valid TileColor values
                        const tileColor = tile.color as TileColor;

                        return (
                            <div
                                key={colIndex}
                                className="flex items-center justify-center text-5xl h-14 w-14 font-customFont cursor-pointer"
                                style={{
                                    backgroundColor: revealedTiles[rowIndex][colIndex]
                                        ? tileColorMap[tileColor].clicked // Color after click
                                        : tileColorMap[tileColor].default // Default color before click
                                }}
                                onClick={() => handleClick(rowIndex, colIndex)} // Handle tile click
                            >
                                {/* Show bomb count only if the tile has been clicked */}
                                {revealedTiles[rowIndex][colIndex] ? showBombCount(tile.nearbyBombs) : null}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}


