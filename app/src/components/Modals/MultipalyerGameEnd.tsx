import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { ReactComponent as Trophy } from "./trophy.svg";
import { ReactComponent as XCircle } from "./x-circle.svg";
import { ReactElement, useContext, useEffect } from "react";
import { useGameContext } from "../../GameProvider";
import { AuthContext } from "../../AuthProvider";
import ModalGameInvitation from "../Game/ModalGameInvitation";

export default function MultiplayerGameEnd({isOpen, onClose} : {isOpen: boolean, onClose: () => void}) {
    const game = useGameContext();
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (game?.isGameStarted) {
            onClose();
        }
    }, [game?.isGameStarted, onClose]);
    
    const showEloChange = (): ReactElement => {
        const eloChange = game?.eloChange;
    
        if (eloChange === undefined || eloChange === null) return <h1> </h1>;
    
        const isPositive = eloChange > 0;
        const color = isPositive ? 'green' : 'red';
        const sign = isPositive ? '+' : '';
    
        return (
            <h1 className="text-2xl" style={{ color: color }}>
                ({sign}{eloChange})
            </h1>
        );
    };

    
    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        
        <ModalOverlay
            bg="none"
            backdropFilter="auto"
            backdropInvert="70%"
            backdropBlur="2px"
        />
        <ModalContent bg={'#0A0A0A'} borderWidth={'4px'} borderColor={'#85ECFA'} borderRadius={'2xl'}>
            <ModalHeader textAlign="center" fontSize="3xl" textColor={'#85ECFA'} className="font-customFont rounded-t-md flex justify-evenly items-center">
                {game?.isWon ? (
                    <>
                        <Trophy className="font-xl h-[1.5em] w-[1.5em] mr-2 text-green-400"/> 
                        <p className="self-center">You won</p>
                        <span className="h-[1.5em] w-[1.5em]"></span>
                    </>
                ) : (
                    <>
                        <XCircle className="font-xl h-[1.5em] w-[1.5em] mr-2 text-red-400"/>
                        <p className="self-center">You lost</p>
                        <span className="h-[1.5em] w-[1.5em]"></span>
                    </>
                )}
            </ModalHeader>
            <ModalBody pb={6} backgroundColor="#262421" fontSize="2xl" textColor={'white'} className="font-customFont">
                <section className="flex justify-center mt-4 ">
                    <div className="w-20 flex-col flex items-center ">
                        <Avatar boxShadow={game?.isWon ? "0 0 15px #00FF00" : "0 0 15px #FF0000"} name={auth?.user?.playerName}></Avatar>
                        <p className="w-full text-ellipsis overflow-hidden  text-base text-gray-200 font-ubuntuFont text-center mt-2">{auth?.user?.playerName}</p>
                    </div>
                    <p className = "mx-4">vs</p>
                    <div className="w-20 flex-col flex items-center ">
                        <Avatar boxShadow={game?.isWon ? "0 0 15px #FF0000" : "0 0 15px #00FF00"} name={game?.enemyName}></Avatar>
                        <p className=" w-full text-ellipsis overflow-hidden text-base text-gray-200 font-ubuntuFont text-center mt-2">{game?.enemyName}</p>
                    </div>
                </section>
                <section className="font-ubuntuFont w-full ">
                    <div className="flex flex-col my-4 justify-center w-full items-center">
                        <h2 className="text-xl text-white">Your Rating:</h2>
                        <span className="flex"><h1 className="text-2xl">{game?.currentElo}</h1>{showEloChange()}</span>
                    </div>
                </section>
                {game?.isWon && (
                <section>
                    <p className="text-white">{`Your time: ${game?.currentGameData?.time} seconds`}</p>
                    <p className="text-white">
                        Your record: {(() => {
                            const modeIndex = 0;
                            if (!auth?.isLoggedIn) return "Authorize to save your best time";
                            if (!auth?.records || auth.records[modeIndex] == null) return "No record yet";
                            return `${auth.records[modeIndex]} seconds`;
                        })()}
                    </p>
                </section>
                )}
                <ModalGameInvitation />
            </ModalBody>
            <ModalFooter>
                
                <Button colorScheme="green" mr={5} onClick={() => { game?.resetMultiplayerGame(); }}>
                    New Game
                </Button>
                <Button colorScheme="white" onClick={onClose}>Show field</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    );
}