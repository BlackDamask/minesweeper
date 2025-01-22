import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { ReactElement } from "react";

export default function MultiplayerGameEnd({isOpen, onClose, isWon} : {isOpen: boolean, onClose: () => void, isWon: boolean}) {
    const showModalContent = (isWon: boolean): ReactElement => {
        if (isWon) {
            return (
                <ModalContent backgroundColor="#F1A10C">
                    <ModalHeader textAlign="center" fontSize="3xl" textColor={'#052e16'}  className="font-customFont">You won</ModalHeader>
                    <ModalBody pb={6} fontSize="2xl" textColor={'#052e16'}  className="font-customFont">
                        <p>{`Your time: 00:00`}</p>
                        <p>Your record:</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" color="white" borderColor="#000000" backgroundColor="#052e16" mr={5} 
                        onClick={() => { }}>
                            Retry
                        </Button>
                        <Button colorScheme="white" onClick={onClose}>Show field</Button>
                    </ModalFooter>
                </ModalContent>
            );
        } else {
            return (
                <ModalContent backgroundColor="#08396B">
                    <ModalHeader textAlign="center" fontSize="3xl" textColor={'#ceffff'}  className="font-customFont">
                        Game Over
                    </ModalHeader>
                    <ModalBody pb={6} fontSize="2xl" textColor={'#ceffff'}  className="font-customFont">
                        {`Your time: 00:00`}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" borderColor="#000000" textColor={'#000000'} backgroundColor="#ceffff" mr={5} 
                            onClick={() => {}}>
                            Retry
                        </Button>
                        <Button colorScheme="blue" color={'white'} backgroundColor={'#032448'} onClick={onClose}>Show field</Button>
                    </ModalFooter>
                </ModalContent>
            );
        }
    };
    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
                <ModalOverlay
                    bg="none"
                    backdropFilter="auto"
                    backdropInvert="70%"
                    backdropBlur="2px"
                />
                {showModalContent(isWon)}
            </Modal>
    );
}