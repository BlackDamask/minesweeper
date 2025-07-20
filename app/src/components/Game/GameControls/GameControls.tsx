import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, useDisclosure, Image, Select } from '@chakra-ui/react';
import Controls from './Controls';
import './GameControls.css';
import { useTranslation } from 'react-i18next';

export default function GameControls(props: {
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
    ) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const handleSelectZoom = (event: any) => {
    const selectedValue = Number(event.target.value);
    props.setSelectedZoom(selectedValue);
  };

  const handleSelectChange = (event: any) => {
    const selectedValue = Number(event.target.value);
    props.setSelectedOption(selectedValue);
    props.setCurrentGameData((prev: any) => new prev.constructor({ difficulty: selectedValue }));
    props.setStartTime(null);
  };

  return (
    <>
      <div className='flex items-center mb-4 w-10 ml-0 sm:ml-5 md:ml-7 lg:ml-10 xl:ml-12'>
        <Image
          className="self-left"
          
          src="./settings-icon.svg"
          alt={t('settings')}
          borderRadius="lg"
          onClick= {onOpen}
          cursor='pointer'
        />
        <div className='flex gap-4 ml-4'>
          <Select
            className='content'
            width={['6rem', '7rem', '7rem']}
            fontSize={['0.7rem','1rem']}
            textAlign={'center'}
            color={'white'}
            size='md' 
            padding={'0 0 0 0'}
            borderColor={'#93c5fd'}
            borderWidth={'4px'}
            onChange={handleSelectZoom}
            value={props.selectedZoom}
            defaultValue={26}
          >
            {props.resizeValues.map((value) => (
              <option className='text-black' key={value}  value={value}>🔍 {value}</option>
            ))}
          </Select>
          <Select
            className='content'
            width={['8rem', '10rem', '11rem']}
            fontSize={['0.7rem','1rem']}
            color={'white'}
            borderColor={'#93c5fd'}
            borderWidth={'4px'}
            rounded={'md'}
            onChange={handleSelectChange}
            value={props.selectedOption}>
            <option className='text-black' value={1}>Beginner</option>
            <option className='text-black' value={2}>Intermediate</option>
            <option className='text-black' value={3}>Expert</option>
          </Select>
        </div>
      </div>
    
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent
          backgroundColor={'#18181b'}>
          <ModalHeader 
          className='text-blue-300'>{t('game_controls')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Controls {...props} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
