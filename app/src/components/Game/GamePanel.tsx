import Game from '../../components/Game/Game';
import { GameData } from '../../components/Game/data';
import RestartGameEmoji from '../../components/Game/RestartGameEmoji/RestartGameEmoji';
import { Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const generateResizeValues = () =>{
    let resizeValues = [];
    for(let i=10; i<=60;i=i+2){
        resizeValues.push(i);
    };
    return(resizeValues);
}

export default function GamePanel() 
{
    const [selectedZoom, setSelectedZoom] = useState(26);
    const [selectedOption, setSelectedOption] = useState<number>(1);
    const [currentGameData, setCurrentGameData] = useState<GameData>(new GameData({difficulty:selectedOption}));
    const [selectedMode, setSelectedMode] = useState<number>(1);
    const [startTime, setStartTime] = useState<number | null>(null);

    const handleSelectChange = (event : any) => {
        const selectedValue = Number(event.target.value);
        setSelectedOption(selectedValue);
        console.log(selectedValue);
        setCurrentGameData(new GameData({difficulty: selectedValue}));
        setStartTime(null);
    };

    const handleSelectMode = (event: any) => {
        const selectedMode = Number(event.target.value); // Convert to number\
        setSelectedMode(selectedMode);
    };

    const handleSelectZoom = (event : any) => {
        const selectedValue = event.target.value;
        setSelectedZoom(selectedValue);
    };

    const resizeValues : number[] = generateResizeValues();
    const [timer, setTimer] = useState("00:00");

    

    useEffect(() => {
        const getTime = () => {
            if(startTime){
                const time = Date.now() - startTime ;
                let minutes = String(Math.floor((time / 1000 / 60) % 60));
                let seconds = String(Math.floor((time / 1000) % 60));
                if(minutes.length === 1){
                    minutes = "0"+minutes
                }
                if(seconds.length === 1){
                    seconds = "0"+seconds
                }
                setTimer(minutes+":"+ seconds);
            }
            else{
                setTimer("00:00");
            }
            
        };
        const interval = setInterval(() => getTime(), 1000);
        
        return () => clearInterval(interval);
      }, [startTime]);
    
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
                         bg='#4A619B' size='md' _hover={{backgroundColor: '#314167'}} 
                         variant='filled'
                         onChange={handleSelectMode}
                         value = {selectedMode}
                    >
                        <option value={1}>👆 💣</option>
                        <option value={2}>👆 🚩</option>
                    </Select>
                    <Select
                        width={'10rem'}
                        marginBottom={4} 
                        color={'white'}
                        bg='#4A619B' size='md' _hover={{backgroundColor: '#314167'}} 
                        variant='filled'
                        onChange={handleSelectChange}
                        value={selectedOption}>
                            <option className='text-black' value={1}>Beginner</option>
                            <option className='text-black' value={2}>Indermediate</option>
                            <option className='text-black' value={3}>Expert</option>
                    </Select>
                    
                </div>
            <div className='h-fit w-fit'>
                
                <div className="bg-[#4A619B] h-full w-full pt-3 border-t rounded-xl ">
                    <nav className='flex justify-between items-center text-black'>
                        <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px`, color:"white" }} className='flex justify-center items-center font-pixelFont'>
                            {timer}
                        </div>
                        <div className="flex h-full justify-center items-center" style={{width: `${selectedZoom*2}px`}}>
                        <RestartGameEmoji 
                            setCurrentGameData = {setCurrentGameData} 
                            currentGameData = {currentGameData} 
                            selectedOption = {selectedOption}
                            zoom = {selectedZoom}
                            setStartTime={setStartTime}
                        />
                        </div>
                        <div style={{width: `${selectedZoom*3}px`, height: `${selectedZoom*2}px`,fontSize: `${selectedZoom*1.2}px`, color:"white"  }} className='flex justify-center items-center font-pixelFont'>
                            {currentGameData.numberOfBombs-currentGameData.numberOfFlags}
                        </div>

                    </nav>
                    <div className='h-3 w-full bg-[#5D789CX]'></div>
                    <Game 
                        currentGameData = {currentGameData} 
                        setCurrentGameData = {setCurrentGameData} 
                        selectedOption = {selectedOption} 
                        selectedMode = {selectedMode}
                        selectedZoom = {selectedZoom}
                        setStartTime = {setStartTime}
                        startTime = {startTime}
                        isExploaded = {undefined}
                        playerExploaded = {undefined}
                    />
                </div>
            </div>
        </main>
    )
    
}

