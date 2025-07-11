import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, useDisclosure, Image, Select } from '@chakra-ui/react';
import Controls from '../Controls';
import './GameControls.css';

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
      <div className='flex items-center mb-4 w-10'>
        <Image
          className="self-left"
          
          src="./settings-icon.svg"
          alt="Return"
          borderRadius="lg"
          onClick= {onOpen}
          cursor='pointer'
        />
        <div className='flex gap-4 ml-4'>
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
            value={props.selectedZoom}
            defaultValue={26}
          >
            {props.resizeValues.map((value) => (
              <option  key={value} value={value}>🔍 {value}</option>
            ))}
          </Select>
          <Select
            width={'10rem'}
            color={'white'}
            bg='#4A619B' size='md' _hover={{ backgroundColor: '#314167' }}
            variant='filled'
            onChange={handleSelectChange}
            value={props.selectedOption}>
            <option className='text-black' value={1}>Beginner</option>
            <option className='text-black' value={2}>Indermediate</option>
            <option className='text-black' value={3}>Expert</option>
          </Select>
        </div>
      </div>
    
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Controls</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Controls {...props} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
