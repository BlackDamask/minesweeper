import Game from '../../components/Game/Game';
import { GameData } from '../../components/Game/data';
import RestartGameEmoji from '../../components/Game/RestartGameEmoji/RestartGameEmoji';
import { Select } from '@chakra-ui/react';
import { ReactComponent as Cursor } from './cursor.svg';
import { ReactComponent as FlagIcon } from '../../components/Game/flag.svg';
import { useState } from 'react';

export default function GamePanel() 
{
    const [selectedOption, setSelectedOption] = useState<number>(1);
    const [currentGameData, setCurrentGameData] = useState<GameData>(new GameData(selectedOption));
    const [selectedMode, setSelectedMode] = useState<number>(1);

    const handleSelectChange = (event : any) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        
        console.log('Selected option:', selectedValue);
    };
    return(
        <main className='flex justify-center'>
            <div className="bg-[#1e9907] h-fit w-fit pt-3 border-t rounded-xl overflow-hidden">
                <nav className='flex justify-between items-center px-3 text-black'>
                    <Select
                    width={'8rem'}
                    bg='#28cc0a' size='md' _hover={{backgroundColor: '#39ff13'}} 
                    variant='filled'
                    onChange={handleSelectChange}
                    value={selectedOption}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
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
                    
                />
            </div>
        </main>
    )
    
}