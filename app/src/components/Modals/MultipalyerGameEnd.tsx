import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { ReactComponent as Trophy } from "./trophy.svg";
import { ReactElement } from "react";
import { useGameContext } from "../../GameProvider";

export default function MultiplayerGameEnd({isOpen, onClose} : {isOpen: boolean, onClose: () => void}) {
    const game = useGameContext();
    
    const showModalContent = (isWon: boolean | undefined): ReactElement => {
        if (isWon) {
            return (
                <ModalContent backgroundColor="#3b3938">
                    <ModalHeader textAlign="center" fontSize="3xl" textColor={'white'} className="font-customFont rounded-t-md flex justify-evenly items-center">
                        <Trophy className="font-xl h-[1.5em] w-[1.5em] mr-2"/> 
                        <p className="self-center">You won</p>
                        <span className="h-[1.5em] w-[1.5em]"></span>
                        
                    </ModalHeader>
                    <ModalBody pb={6} backgroundColor="#262421" fontSize="2xl" textColor={'white'} className="font-customFont">
                            <section className="flex justify-center">
                                <Avatar name="fdasf"></Avatar>vs
                            </section>
                            
                            <section>
                                <p>{`Your time: 00:00`}</p>
                                <p>Your record:</p>
                            </section>
                            
                            
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" color="white" borderColor="#000000" backgroundColor="#052e16" mr={5} onClick={() => { }}>
                            Retry
                        </Button>
                        <Button colorScheme="white" onClick={onClose}>Show field</Button>
                    </ModalFooter>
                </ModalContent>

            );
        } else {
            return (
                <ModalContent backgroundColor="#ffffff">
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
                
                {showModalContent(game?.isWon)}
            </Modal>
    );
}