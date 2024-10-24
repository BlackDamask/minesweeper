import { ReactElement } from "react";
import { GameData } from "./data";

var showBombCount = (bombCount: number | null): ReactElement => {
    if (bombCount === null || bombCount === 0) {
        return <p ></p>; // Empty tile for 0 or null bomb count
    }

    let color: string;
    switch (bombCount) {
        case 1:
            color = 'blue-700';
            break;
        case 2:
            color = 'fuchsia-700';
            break;
        case 3:
            color = 'red-700';
            break;
        case 4:
            color = 'purple-700';
            break;
        case 5:
            color = 'orange-600';
            break;
        case 6:
            color = 'teal-500';
            break;
        case 7:
            color = 'rose-600';
            break;
        case 8:
            color = 'zinc-600';
            break;
        default:
            color = '';
            break;
    }

    // Return the bomb count with the correct color
    return <p className={`text-${color}`}>{bombCount}</p>;
};


export default function Game() {
    var gameData = new GameData(1);

    console.log(gameData.gameField);
    return (
        <div className="bg-green-950 h-fit w-fit mt-0 md:mt-20 p-5 ">
            {gameData.gameField.map((r, rowIndex) => (
                <div className="flex" key={rowIndex}>
                    {r.map((t, colIndex) => (
                        <div
                            key={colIndex}
                            className="flex items-center justify-center text-5xl lg:text-6xl xl:text-7xl h-14 w-14 lg:h-20 lg:w-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 font-customFont"
                            style={{ backgroundColor: t.color === 'light-tile' ? '#28cc0a' : '#39ff13' }} 
                        >
                            {showBombCount(t.nearbyBombs)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}