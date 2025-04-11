import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { ReactComponent as Trophy } from "./trophy.svg";
import { ReactElement, useContext } from "react";
import { useGameContext } from "../../GameProvider";
import { AuthContext } from "../../AuthProvider";
import { getMaxListeners } from "process";

export default function MultiplayerGameEnd({isOpen, onClose} : {isOpen: boolean, onClose: () => void}) {
    const game = useGameContext();
    const auth = useContext(AuthContext)
    
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
                            <section className="flex justify-center mt-4 ">
                                <div className="w-20 flex-col flex items-center ">
                                    <Avatar boxShadow="0 0 15px #00FF00" name={auth?.user?.playerName}></Avatar>
                                    <p className="w-full text-ellipsis overflow-hidden  text-base text-gray-200 font-ubuntuFont text-center mt-2">{auth?.user?.playerName}</p>
                                </div>
                                <p className = "mx-4">vs</p>
                                <div className="w-20 flex-col flex items-center ">
                                    <Avatar name={game?.enemyName}></Avatar>
                                    <p className=" w-full text-ellipsis overflow-hidden text-base text-gray-200 font-ubuntuFont text-center mt-2">{game?.enemyName}</p>
                                </div>
                            </section>
                            <section className="font-ubuntuFont w-full ">
                                <div className="flex flex-col my-4 justify-center w-full items-center">
                                    <h2 className="text-xl">Your Rating:</h2>
                                    <h1 className="text-2xl">{game?.currentElo}</h1>
                                </div>
                            </section>
                            <section>
                                <p>{`Your time: 00:00`}</p>
                                <p>Your record:</p>
                            </section>
                            
                            
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green"  mr={5} onClick={() => { game?.setIsGameStarted(false); }}>
                            New Game 
                        </Button>
                        <Button colorScheme="white" onClick={onClose}>Show field</Button>
                    </ModalFooter>
                </ModalContent>

            );
        } else {
            return (
                <ModalContent backgroundColor="#3b3938">
                    <ModalHeader textAlign="center" fontSize="3xl" textColor={'white'} className="font-customFont rounded-t-md flex justify-evenly items-center">
                        <p className="self-center">You lost</p>              
                    </ModalHeader>
                    <ModalBody pb={6} backgroundColor="#262421" fontSize="2xl" textColor={'white'} className="font-customFont">
                            <section className="flex justify-center mt-4 ">
                                <div className="w-20 flex-col flex items-center ">
                                    <Avatar boxShadow="0 0 15px #FF0000" name={auth?.user?.playerName}></Avatar>
                                    <p className="w-full text-ellipsis overflow-hidden  text-base text-gray-200 font-ubuntuFont text-center mt-2">{auth?.user?.playerName}</p>
                                </div>
                                <p className = "mx-4">vs</p>
                                <div className="w-20 flex-col flex items-center ">
                                    <Avatar boxShadow="0 0 15px #00FF00" name={game?.enemyName}></Avatar>
                                    <p className=" w-full text-ellipsis overflow-hidden text-base text-gray-200 font-ubuntuFont text-center mt-2">{game?.enemyName}</p>
                                </div>
                            </section>
                            <section className="font-ubuntuFont w-full ">
                                <div className="flex flex-col my-4 justify-center w-full items-center">
                                    <h2 className="text-xl">Your Rating:</h2>
                                    <h1 className="text-2xl">{game?.currentElo}</h1>
                                </div>
                            </section>
                            <section>
                                <p>{`Your time: 00:00`}</p>
                                <p>Your record:</p>
                            </section>
                            
                            
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green"  mr={5} onClick={() => { game?.setIsGameStarted(false); }}>
                            New Game 
                        </Button>
                        <Button colorScheme="white" onClick={onClose}>Show field</Button>
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