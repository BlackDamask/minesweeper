import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, useDisclosure, Image } from '@chakra-ui/react';
import Controls from '../Game/GameControls/Controls';

interface ControlsModalProps {
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

export default function GameControls(props: ControlsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    <Image
      className="self-left w-[3.3em]"
      src="./settings-icon.svg"
      alt="Return"
      borderRadius="lg"
      onClick= {onOpen}
      cursor='pointer'

  />
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