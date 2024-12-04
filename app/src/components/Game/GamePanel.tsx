import Game from '../../components/Game/Game';
import { GameData } from '../../components/Game/data';
import RestartGameEmoji from '../../components/Game/RestartGameEmoji/RestartGameEmoji';
import { Select, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ReactComponent as Cursor } from './cursor.svg';
import { ReactComponent as FlagIcon } from '../../components/Game/flag.svg';
import { ReactComponent as HandLens } from '../../components/Game/hand-lens.svg';
import { useState } from 'react';

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
    const [currentGameData, setCurrentGameData] = useState<GameData>(new GameData(selectedOption));
    const [selectedMode, setSelectedMode] = useState<number>(1);

    const handleSelectChange = (event : any) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    };

    const handleSelectZoom = (event : any) => {
        const selectedValue = event.target.value;
        setSelectedZoom(selectedValue);
    };

    const resizeValues : number[] = generateResizeValues();
    
    return(
        <main className='flex justify-center'>
            <div className='h-fit w-fit'>
                
                <div className='flex'>
                    <Select 
                        width={'calc(content-fit + 3em)'} 
                        marginBottom={2} 
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
                
                </div>
                
                <div className="bg-[#1e9907] h-full w-full pt-3 border-t rounded-xl ">
                    <nav className='flex justify-between items-center px-3 text-black'>
                        <Select
                        width={'8rem'}
                        bg='#28cc0a' size='md' _hover={{backgroundColor: '#39ff13'}} 
                        variant='filled'
                        onChange={handleSelectChange}
                        value={selectedOption}>
                            <option value={1}>Beginner</option>
                            <option value={2}>Indermediate</option>
                            <option value={3}>Expert</option>
                        </Select>
                        <RestartGameEmoji 
                            setCurrentGameData = {setCurrentGameData} 
                            currentGameData = {currentGameData} 
                            selectedOption = {selectedOption}
                        />
                        <a onClick={() => 
                            {
                                if(selectedMode === 1){
                                    setSelectedMode(2)
                                }
                                else{
                                    setSelectedMode(1);
                                }
                            }
                        } className='cursor-pointer'>
                            <div className='flex'>
                                <Cursor className='h-[4em]'/>
                                {selectedMode === 1 ? 
                                    <img
                                    alt=''
                                    className='h-[4em] w-[4em]'
                                    src='./bomb-shape.png'
                                    />
                                :
                                    <span className='w-[4em]'>
                                        <FlagIcon className='h-[4em] w-[3em]'></FlagIcon>
                                    </span>
                                }
                            </div>
                        </a>
                    </nav>
                    <div className='h-3 w-full bg-[#1e9907]'></div>
                    <Game 
                        currentGameData={currentGameData} 
                        setCurrentGameData = {setCurrentGameData} 
                        selectedOption = {selectedOption} 
                        selectedMode = {selectedMode}
                        selectedZoom = {selectedZoom}
                        
                    />
                </div>
            </div>
        </main>
    )
    
}