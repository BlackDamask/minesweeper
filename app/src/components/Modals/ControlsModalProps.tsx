import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';
import Controls from '../Game/Controls';

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

export default function ControlsModal(props: ControlsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" mb={4}>
        Open Controls
      </Button>
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