import { Select } from '@chakra-ui/react';

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
          width={'11rem'}
          marginBottom={4}
          color={'white'}
          borderColor={'#4a619b'}
          bg='#4A619B' size='md' _hover={{ backgroundColor: '#314167' }}
          onChange={handleStyleChange}
          value={selectedStyle}
        >
          <option value={'modern'}>⬜️ Modern tiles</option>
          <option value={'default'}> ⬜️ Classic tiles</option>
        </Select>
      </div>
      <Select
        width={'7rem'}
        marginBottom={4}
        color={'white'}
        bg='#4A619B' size='md' _hover={{ backgroundColor: '#314167' }}
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