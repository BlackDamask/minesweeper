import { GameData } from "./data";

export default function Game() {
    var gameData = new GameData(1);
    return (
        <div className="bg-green-950 h-fit w-fit p-5 ">
            {gameData.gameField.map((r, rowIndex) => (
                <div className="flex" key={rowIndex}>
                    {r.map((t, colIndex) => (
                        
                        <div
                            key={colIndex}
                            className="h-14 w-14 "
                            style={{ backgroundColor: t.color === 'light-tile' ? '#28cc0a' : '#39ff13' }} // Temporary inline styles for testing
                        >
                            
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}                                                                   