import { Select } from '@chakra-ui/react';  
import './GameControls.css';
import { useTranslation } from 'react-i18next';

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
  selectedMode,
  setSelectedMode,
  selectedStyle,
  setSelectedStyle,
}: ControlsProps) {
  
  const { t } = useTranslation();

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
          <option className='text-black' value={'modern'}>{t('modern_tiles')}</option>
          <option className='text-black' value={'default'}>{t('classic_tiles')}</option>
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
        onChange={handleSelectMode}
        value={selectedMode}
      >
        <option className='text-black' value={1}>{t('reveal_mode')}</option>
        <option className='text-black' value={2}>{t('flag_mode')}</option>
      </Select>
    </div>
  );
}