import { Select } from '@chakra-ui/react';  
import './GameControls.css';

interface ControlsProps {
  selectedZoom: number;
  setSelectedZoom: (zoom: number) => void;
  resizeValues: number[];
  selectedMode: number;
  setSelectedMode: (mode: number) => void;
  selectedOption: number;
  setSelectedOption: (option: number) => void;
  setCurrentGameData: (data: any) => void;
  setStartTime: (time: number | null) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
}

export default function Controls({
  setSelectedZoom,
  selectedMode,
  setSelectedMode,
  setSelectedOption,
  setCurrentGameData,
  setStartTime,
  selectedStyle,
  setSelectedStyle,
}: ControlsProps) {
  

  const handleSelectMode = (event: any) => {
    const selectedMode = Number(event.target.value);
    setSelectedMode(selectedMode);
  };

  

  const handleStyleChange = (event: any) => {
    setSelectedStyle(event.target.value);
  };

  return (
    <div className='controls'>
      <div className='flex gap-4'>
        <Select
          className='content'
          width={'11rem'}
          marginBottom={4}
          color={'white'}
          borderColor={'#93c5fd'}
          borderWidth={'4px'}
          bg='transparent' size='md'
          onChange={handleStyleChange}
          value={selectedStyle}
        >
          <option value={'modern'}>⬜️ Modern tiles</option>
          <option value={'default'}> ⬜️ Classic tiles</option>
        </Select>
      </div>
      <Select
        className='content'
        borderColor={'#93c5fd'}
        borderWidth={'4px'}
        width={'7rem'}
        marginBottom={4}
        color={'white'}
        bg='transparent' size='md' 
        variant='filled'
        onChange={handleSelectMode}
        value={selectedMode}
      >
        <option value={1}>👆 💣</option>
        <option value={2}>👆 🚩</option>
      </Select>
    </div>
  );
}