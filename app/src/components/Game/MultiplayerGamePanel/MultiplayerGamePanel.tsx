import { useGameContext } from '../../../GameProvider';
import Game from '../Game';
import { GameData, Tile } from '../data';
import { Select, useDisclosure} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import MultiplayerGameEnd from '../../Modals/MultipalyerGameEnd';
import './MultiplayerGamePanel.css';
import { AuthContext } from '../../../AuthProvider';
import axios from '../../../api/axios';
import { useTranslation } from 'react-i18next';


const generateResizeValues = () =>{
    let resizeValues = [];
    for(let i=10; i<=60;i=i+2){
        resizeValues.push(i);
    };
    return(resizeValues);
}

const getDefaultZoom = () => {
    if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) return 26; // mobile
        if (window.innerWidth < 1024) return 36; // tablet
        return 46; // desktop
    }
    return 26;
};


export default function MultiplayerGamePanel({gameField, colIndex, rowIndex, selectedOption} 
    : 
    {gameField : Tile[][], colIndex: number, rowIndex: number, selectedOption: number}) 
{
    const { t } = useTranslation();
    const game = useGameContext();
    const auth = useContext(AuthContext);

    const [selectedZoom, setSelectedZoom] = useState(() => getDefaultZoom());
    const [currentGameData, setCurrentGameData] = useState<GameData>(
        new GameData({ gameField: gameField, colStartIndex: colIndex, rowStartIndex: rowIndex })
    );
    const [selectedMode, setSelectedMode] = useState<number>(1);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [timer, setTimer] = useState("00:00");
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        const getTime = () => {
            if (game?.startTime) {
                const time = Date.now() - game?.startTime - 57*60000 - 36000;
                let minutes = Math.floor((time / 1000 / 60) % 60);
                let seconds = Math.floor((time / 1000) % 60);
                setMinutes(minutes);
                setSeconds(seconds);
                let minutesString = minutes.toString();
                let secondsString = seconds.toString();
                if (minutesString.length === 1) {
                    minutesString = "0" + minutesString;
                }
                if (secondsString.length === 1) {
                    secondsString = "0" + secondsString;
                }
                setTimer(minutesString + ":" + secondsString);
            } else {
                setTimer("00:00");
                setMinutes(0);
                setSeconds(0);
            }
        };

        if (!game?.isGameEnded) {
            interval = setInterval(getTime, 1000);
        } else {
            // Optionally set timer to final value here
            getTime();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [game?.startTime, game?.isGameEnded]);

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
        onGameFieldChange();
    }, [currentGameData, game]);

    useEffect(() => {
        if (game?.isGameEnded) {
            console.log(currentGameData.isWin);
            console.log(auth?.isLoggedIn);
            console.log(auth?.accessToken);
            console.log(currentGameData.time);
            let time = minutes * 60 + seconds;
            currentGameData.time = time;
            if (
                currentGameData.isWin &&
                auth?.isLoggedIn &&
                auth?.accessToken &&
                currentGameData.time !== null
            ) {
                const modeIndex = selectedOption - 1;
                const currentRecord = auth?.records[modeIndex];
                const newTime = currentGameData.time;
                if (currentRecord === null || newTime < currentRecord) {
                    const newRecords: (number | null)[] = [null, null, null];
                    newRecords[modeIndex] = newTime;
                    axios.put("/player/records", newRecords, {
                        headers: {
                            Authorization: `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json"
                        }
                    })
                    .then(res => {
                        if (res.data?.data && Array.isArray(res.data.data)) {
                            auth?.setRecords(res.data.data);
                        }
                    });
                }
            }
            onOpen();
        }
    }, [game?.isGameEnded, currentGameData, auth, minutes, seconds, selectedOption, onOpen]);
    
    
    return(
        <main className='flex flex-col ml-14'>
            <div className='flex gap-5'>
                    <Select
                        className='content'
                        width={'7rem'}
                        textAlign={'center'}
                        color={'white'}
                        size='md' 
                        padding={'0 0 0 0'}
                        borderColor={'#93c5fd'}
                        borderWidth={'4px'}
                        onChange={handleSelectZoom}
                        value={selectedZoom}
                        defaultValue={26}
                        >
                        {resizeValues.map((value) => (
                            <option className='text-black' key={value} value={value} >🔍 {value}</option>
                        ))}
                    </Select>
                    <Select
                        className='content'
                        borderColor={'#93c5fd'}
                        borderWidth={'4px'}
                        width={'7rem'}
                        marginBottom={4}
                        color={'white'}
                        bg='transparent' size='md' 
                        onChange={handleSelectMode}
                        value={selectedMode}
                    >
                        <option value={1}>👆 💣</option>
                        <option value={2}>👆 🚩</option>
                    </Select>
                </div>
            <div className='h-fit w-fit'>
                
            <div className={`flex mt-5 ${game?.isExploaded ? 'text-white' : 'text-transparent'} text-xl `}>
                <p>{t('youExploded')}</p>
            </div>
                
                <div className="h-full w-full pt-3 rounded-xl ">
                <nav className='flex justify-between items-center text-white'>
                <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px`, color:"white" }} className='flex justify-center items-center font-pixelFont'>
                            {timer}
                        </div>
                        <div className="flex h-full justify-center items-center" style={{width: `${selectedZoom*2}px`}}>

                        </div>
                        <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px` }} className='flex justify-center items-center font-pixelFont'>
                            {currentGameData.numberOfBombs-currentGameData.numberOfFlags}
                        </div>

                    </nav>
                    <div className='h-3 w-full'></div>
                    <Game 
                        currentGameData = {currentGameData} 
                        setCurrentGameData = {setCurrentGameData} 
                        selectedOption = {selectedOption} 
                        selectedMode = {selectedMode}
                        selectedZoom = {selectedZoom}
                        setStartTime = {null}
                        startTime = {null}
                        isExploaded = {game?.isExploaded}
                        playerExploaded = {game?.playerExploaded}
                        selectedStyle='modern'
                    />
                </div>
            </div>
            <MultiplayerGameEnd isOpen = {isOpen} onClose={onClose} />
        </main>
    )
}