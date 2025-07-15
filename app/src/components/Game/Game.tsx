import {  ReactElement, useEffect} from "react";
import { GameData } from './data';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,  useDisclosure, useToast } from "@chakra-ui/react";
import { useGameContext } from "../../GameProvider";
import ModernTile from "./Tiles/ModernTile";
import DefaultTile from "./Tiles/DefaultTile";


export default function Game(
        { currentGameData,selectedStyle, setCurrentGameData, selectedOption, selectedMode,selectedZoom, setStartTime, startTime, isExploaded, playerExploaded}: 
        { 
            currentGameData: GameData,
            setCurrentGameData:  React.Dispatch<React.SetStateAction<GameData>>, 
            selectedOption: number, 
            selectedMode: number, 
            selectedZoom: number, 
            setStartTime: React.Dispatch<React.SetStateAction<number | null>> | null, 
            startTime: number | null, 
            isExploaded: boolean | undefined,
            playerExploaded: (() => void) | undefined,
            selectedStyle: string
        }
    ) 
{
    const game = useGameContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {

        toast({
            title: "Game Started",
            status: "success",
            isClosable: true,
        });
    }, [toast]);

    useEffect(() => {
        if (currentGameData.isGameOver && setStartTime) {
            onOpen();
            setStartTime(null);
        }
    }, [currentGameData.isGameOver, onOpen, setStartTime]);


    const setFlaggedTile = (colIndex: number, rowIndex: number) => {
        currentGameData.setFlaggedTile(colIndex, rowIndex);
        setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
    
    } 
    const setRevealedTile = (colIndex: number, rowIndex: number) => {
        if (!currentGameData.gameField[rowIndex][colIndex].isFlagged) {
            if(isExploaded !== undefined && playerExploaded !== undefined){
                if(currentGameData.gameField[rowIndex][colIndex].hasBomb){
                    setFlaggedTile(colIndex,rowIndex);
                    playerExploaded();
                }
                else if(currentGameData.gameField[rowIndex][colIndex].isRevealed){
                    let nearbyFlags = 0;
                    for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 1; y++) {
                            if (x === 0 && y === 0) continue; // Skip the current tile
                
                            const newRow = rowIndex + x;
                            const newCol = colIndex + y;
                
                            if (newRow >= 0 && newRow < currentGameData.numberOfTilesY && newCol >= 0 && newCol < currentGameData.numberOfTilesX) {
                                if (currentGameData.gameField[newRow][newCol].isFlagged) {
                                    nearbyFlags++;
                                }
                            }
                        }
                    }
                    if(currentGameData.gameField[rowIndex][colIndex].nearbyBombs === nearbyFlags){
                        for (let x = -1; x <= 1; x++) {
                            for (let y = -1; y <= 1; y++) {
                                if (x === 0 && y === 0) continue; 
                    
                                const newRow = rowIndex + x;
                                const newCol = colIndex + y;
                    
                                if (newRow >= 0 && newRow < currentGameData.numberOfTilesY && newCol >= 0 && newCol < currentGameData.numberOfTilesX) {
                                    if (currentGameData.gameField[newRow][newCol].hasBomb && !currentGameData.gameField[newRow][newCol].isFlagged) {
                                        setFlaggedTile(newCol,newRow);
                                        playerExploaded();
                                    }
                                    else if(!currentGameData.gameField[newRow][newCol].isFlagged && !currentGameData.gameField[newRow][newCol].isRevealed && !currentGameData.gameField[newRow][newCol].hasBomb){
                                        currentGameData.handleClickOnTile(newCol, newRow);
                                        
                                        setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
                                    }
                                    else if(currentGameData.gameField[newRow][newCol].isFlagged && !currentGameData.gameField[newRow][newCol].hasBomb){
                                        setFlaggedTile(newCol,newRow);
                                    }
                                }
                            }
                        }
                    }
                }
                else{
                    currentGameData.handleClickOnTile(colIndex, rowIndex);
                    setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
                }
            }
            else{
                currentGameData.handleClickOnTile(colIndex, rowIndex);
                setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
            }
        }
    }

    const handleClick = (rowIndex: number, colIndex: number) => {
        console.log(isExploaded)
        if(!isExploaded){
            if(!startTime && setStartTime){
                setStartTime(Date.now());
            }
            if(selectedMode === 1){
                setRevealedTile(colIndex, rowIndex);
            }
            else{
                setFlaggedTile(colIndex, rowIndex);
            }
        }
    };

    const handleRightClick = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        if(!isExploaded){
            e.preventDefault();
            if(selectedMode === 1){
                setFlaggedTile(colIndex, rowIndex);
            }
            else{
                setRevealedTile(colIndex ,rowIndex );
            }
        }
        
    };


    const showModalContent = (isWon: boolean): ReactElement => {
        if (isWon) {
            return (
                <ModalContent backgroundColor="#F1A10C">
                    <ModalHeader textAlign="center" fontSize="3xl" textColor={'#052e16'}  className="font-customFont">You won</ModalHeader>
                    <ModalBody pb={6} fontSize="2xl" textColor={'#052e16'}  className="font-customFont">
                        <p>{`Your time: ${currentGameData.time}`}</p>
                        <p>Your record:</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" color="white" borderColor="#000000" backgroundColor="#052e16" mr={5} onClick={
                            () => 
                            { 
                                setCurrentGameData(new GameData({difficulty:selectedOption}));
                                if(setStartTime)
                                    setStartTime(null);
                                onClose(); 
                            }}>
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
                        {`Your time: ${currentGameData.time}`}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" borderColor="#000000" textColor={'#000000'} backgroundColor="#ceffff" mr={5} onClick={
                            () => 
                            { 
                                setCurrentGameData(new GameData({difficulty:selectedOption})); 
                                if(setStartTime)
                                    setStartTime(null); 
                                onClose(); 
                            }}>
                            Retry
                        </Button>
                        <Button colorScheme="blue" color={'white'} backgroundColor={'#032448'} onClick={onClose}>Show field</Button>
                    </ModalFooter>
                </ModalContent>
            );
        }
    };


    return (
        <div  style={{ filter: game?.isExploaded ? 'blur(3px)' : 'none' }}>
            
            {currentGameData.gameField.map((row, rowIndex) => (
                <div className={`flex w-fit h-fit text-xl`} key={rowIndex} >
                   {row.map((tile, colIndex) => (
                        selectedStyle === "modern" ? (
                            <ModernTile
                                key={colIndex}
                                tile={tile}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                selectedZoom={selectedZoom}
                                handleClick={handleClick}
                                handleRightClick={handleRightClick}
                            />
                        ) : (
                            <DefaultTile
                                key={colIndex}
                                tile={tile}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                selectedZoom={selectedZoom}
                                handleClick={handleClick}
                                handleRightClick={handleRightClick}
                            />
                        )
                    ))}
                </div>
            ))}
            
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
                <ModalOverlay
                    bg="none"
                    backdropFilter="auto"
                    backdropInvert="70%"
                    backdropBlur="2px"
                />
                {showModalContent(currentGameData.isWin)}
            </Modal>
        </div>
        
    );
}


