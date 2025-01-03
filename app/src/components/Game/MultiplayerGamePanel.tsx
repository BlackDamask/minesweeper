import { useGameContext } from '../../GameProvider';
import Game from '../../components/Game/Game';
import { GameData, Tile } from '../../components/Game/data';
import { Select} from '@chakra-ui/react';
import { useEffect, useState } from 'react';


const generateResizeValues = () =>{
    let resizeValues = [];
    for(let i=10; i<=60;i=i+2){
        resizeValues.push(i);
    };
    return(resizeValues);
}

export default function MultiplayerGamePanel({gameField, colIndex, rowIndex, selectedOption} 
    : 
    {gameField : Tile[][], colIndex: number, rowIndex: number, selectedOption: number}) 
{
    const game = useGameContext();

    const [selectedZoom, setSelectedZoom] = useState(26);
    const [currentGameData, setCurrentGameData] = useState<GameData>(new GameData({gameField: gameField, colStartIndex: colIndex, rowStartIndex: rowIndex}));
    const [selectedMode, setSelectedMode] = useState<number>(1);
    const [startTime, setStartTime] = useState<number | null>(null);

    const handleSelectMode = (event: any) => {
        const selectedMode = Number(event.target.value); // Convert to number\
        setSelectedMode(selectedMode);
    };

    const handleSelectZoom = (event : any) => {
        const selectedValue = event.target.value;
        setSelectedZoom(selectedValue);
    };

    const resizeValues : number[] = generateResizeValues();

    useEffect(() => {
        const onGameFieldChange = () => {
            console.warn("gamesield changed")
            game?.setGameField(currentGameData.gameField);
        };

        onGameFieldChange();
    }, [currentGameData, game]);
    
    return(
        <main className='flex flex-col ml-14'>
            <div className=''>
                    <Select 
                        width={'7rem'} 
                        marginBottom={4} 
                        color={'black'} 
                        borderColor={"#1e9907"} 
                        backgroundColor={"#28cc0a"}
                        onChange={handleSelectZoom}
                        value={selectedZoom}
                        defaultValue={26}
                    >
                        {resizeValues.map((value) => (
                            <option key={value} value={value} >🔍 {value}</option>
                        ))}
                    </Select>
                    <Select
                         width={'7rem'}
                         marginBottom={4}
                         color={'black'}
                         bg='#28cc0a' size='md' _hover={{backgroundColor: '#39ff13'}} 
                         variant='filled'
                         onChange={handleSelectMode}
                         value = {selectedMode}
                    >
                        <option value={1}>👆 💣</option>
                        <option value={2}>👆 🚩</option>
                    </Select>
                </div>
            <div className='h-fit w-fit'>
                
                <div className='flex'>
                    
                
                </div>
                
                <div className="bg-[#1e9907] h-full w-full pt-3 border-t rounded-xl ">
                <nav className='flex justify-between items-center text-black'>
                        <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px` }} className='flex justify-center items-center font-pixelFont'>
                            00:00
                        </div>
                        <div className="flex h-full justify-center items-center" style={{width: `${selectedZoom*2}px`}}>

                        </div>
                        <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px` }} className='flex justify-center items-center font-pixelFont'>
                            {currentGameData.numberOfBombs-currentGameData.numberOfFlags}
                        </div>

                    </nav>
                    <div className='h-3 w-full bg-[#1e9907]'></div>
                    <Game 
                        currentGameData={currentGameData} 
                        setCurrentGameData = {setCurrentGameData} 
                        selectedOption = {selectedOption} 
                        selectedMode = {selectedMode}
                        selectedZoom = {selectedZoom}
                        setStartTime={setStartTime}
                        startTime={startTime}
                    />
                </div>
            </div>
        </main>
    )
}