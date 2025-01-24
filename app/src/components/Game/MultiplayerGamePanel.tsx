import { useGameContext } from '../../GameProvider';
import Game from '../../components/Game/Game';
import { GameData, Tile } from '../../components/Game/data';
import { Select, useDisclosure} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MultiplayerGameEnd from '../Modals/MultipalyerGameEnd';


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
    const [currentGameData, setCurrentGameData] = useState<GameData>(
        new GameData({ gameField: gameField, colStartIndex: colIndex, rowStartIndex: rowIndex })
    );
    const [selectedMode, setSelectedMode] = useState<number>(1);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isWon, setIsWon] = useState<boolean>(false);
    const [isGameEnded, setIsGameEnded] = useState<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSelectMode = (event: any) => {
        const selectedMode = Number(event.target.value); 
        setSelectedMode(selectedMode);
    };

    const handleSelectZoom = (event : any) => {
        const selectedValue = event.target.value;
        setSelectedZoom(selectedValue);
    };

    const resizeValues : number[] = generateResizeValues();

    useEffect(() => {
        const onGameFieldChange = () => {
            game?.setCurrentGameData(currentGameData);
        };
        
        const onIsGameEndedChange = () => {
            console.log("Game Ended:", game?.isGameEnded);
            console.log("Game Won:", game?.isWon);
            if (game?.isGameEnded ) {
                onOpen();
            }
        };
    
        onGameFieldChange();
        onIsGameEndedChange();
    }, [currentGameData, game, onOpen]);
    
    
    return(
        <main className='flex flex-col ml-14'>
            <div className=''>
                    <Select 
                        width={'7rem'} 
                        marginBottom={4} 
                        color={'white'} 
                        borderColor={"#4a619b"} 
                        bg='#4A619B' size='md' _hover={{backgroundColor: '#314167'}} 
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
                         color={'white'} 
                        borderColor={"#4a619b"} 
                        bg='#4A619B' size='md' _hover={{backgroundColor: '#314167'}} 
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
                
                <div className="bg-[#4A619B] h-full w-full pt-3 border-t rounded-xl ">
                <nav className='flex justify-between items-center text-white'>
                        <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px` }} className='flex justify-center items-center font-pixelFont'>
                            00:00
                        </div>
                        <div className="flex h-full justify-center items-center" style={{width: `${selectedZoom*2}px`}}>

                        </div>
                        <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px` }} className='flex justify-center items-center font-pixelFont'>
                            {currentGameData.numberOfBombs-currentGameData.numberOfFlags}
                        </div>

                    </nav>
                    <div className='h-3 w-full bg-[#4A619B]'></div>
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
            <MultiplayerGameEnd isOpen = {isOpen} onClose={onClose} />
        </main>
    )
}