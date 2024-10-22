import { ReactElement } from "react";
import { GameData } from "./data";

var showBombCount = (bombCount : number) : ReactElement => {
    let color: string; 
    switch(bombCount){
        case 1:
            color = 'blue-700';
            break;
        case 2: 
            color = 'green-700';
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
    }
    return(<div></div>);
}

export default function Game() {
    var gameData = new GameData(1);

    console.log(gameData.gameField);
    return (
        <div className="bg-green-950 h-fit w-fit p-5 ">
            {gameData.gameField.map((r, rowIndex) => (
                <div className="flex" key={rowIndex}>
                    {r.map((t, colIndex) => (
                        
                        <div
                            key={colIndex}
                            className="flex items-center justify-center text-5xl h-14 w-14 font-customFont"
                            style={{ backgroundColor: t.color === 'light-tile' ? '#28cc0a' : '#39ff13' }} // Temporary inline styles for testing
                        >
                            
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}                                                                   