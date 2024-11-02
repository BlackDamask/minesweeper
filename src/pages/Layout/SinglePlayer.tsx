import Header from '../../components/Header';
import Game from '../../components/Game/Game';
import { GameData } from '../../components/Game/data';
import RestartGameEmoji from '../../components/Game/RestartGameEmoji/RestartGameEmoji';
import { Select } from '@chakra-ui/react';
import { ReactComponent as Cursor } from './cursor.svg'
import { useState } from 'react';
export default function SinglePlayer(){
    const [selectedOption, setSelectedOption] = useState<number>(1);
    const [currentGameData, setCurrentGameData] = useState<GameData>(new GameData(selectedOption));

    const handleSelectChange = (event : any) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        
        console.log('Selected option:', selectedValue);
    };
    return(
        <div>
            <Header/>
            <main className='flex justify-center'>
                <div className="bg-green-950 h-fit w-fit p-5">
                    <nav className='flex justify-between items-center'>
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
                        <RestartGameEmoji setCurrentGameData = {setCurrentGameData} selectedOption = {selectedOption}/>
                        <div className='flex'>
                            <Cursor className='h-[4em]'/>
                            <img
                            className='h-[4em]'
                            src='./logo192.png'
                            />
                            
                        </div>

                    </nav>
                    <Game currentGameData={currentGameData} setCurrentGameData = {setCurrentGameData} selectedOption = {selectedOption}/>
                </div>
            </main>
        </div>
    );
}