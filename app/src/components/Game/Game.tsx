import {  ReactElement, useContext, useEffect, useRef, useState } from "react";
import { GameData } from './data';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,  useDisclosure, useToast } from "@chakra-ui/react";
import { useGameContext } from "../../GameProvider";
import ModernTile from "./Tiles/ModernTile";
import DefaultTile from "./Tiles/DefaultTile";
import { AuthContext } from "../../AuthProvider";
import axios from '../../api/axios';


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
    const auth = useContext(AuthContext);
    const game = useGameContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const toastShownRef = useRef(false);
    

    useEffect(() => {
        if (auth?.isLoggedIn && auth?.accessToken) {
            axios.get("player/records", {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if (res.data?.data && Array.isArray(res.data.data)) {
                    auth?.setRecords(res.data.data);
                }
            })
            .catch(() => auth?.setRecords([null, null, null]));
        }
    }, [auth?.isLoggedIn, auth?.accessToken]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!toastShownRef.current) {
            toast({
                title: "Game Started",
                status: "success",
                isClosable: true,
            });
            toastShownRef.current = true;
        }
    }, []);



    useEffect(() => {
        if (currentGameData.isGameOver && setStartTime) {
            onOpen();
            setStartTime(null);
            if (
                currentGameData.isWin &&
                auth?.isLoggedIn &&
                auth?.accessToken &&
                currentGameData.time !== null
            ) {
                const modeIndex = selectedOption - 1;
                const currentRecord = auth?.records[modeIndex];
                const newTime = currentGameData.time;
                if (currentRecord === null || newTime < currentRecord) {
                    const newRecords: (number | null)[] = [null, null, null];
                    newRecords[modeIndex] = newTime;
                    axios.put("/player/records", newRecords, {
                        headers: {
                            Authorization: `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json"
                        }
                    })
                    .then(res => {
                        if (res.data?.data && Array.isArray(res.data.data)) {
                            auth?.setRecords(res.data.data);
                        }
                    });
                }
            }
        }
    }, [currentGameData.isGameOver, onOpen, setStartTime,currentGameData.isWin, auth?.isLoggedIn, auth?.accessToken, currentGameData.time, auth?.records, selectedOption]);


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
                            if (x === 0 && y === 0) continue; 
                
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
        const modeIndex = selectedOption - 1;
        let recordDisplay: string;
        if (!auth?.isLoggedIn) {
            recordDisplay = "Authorize to save your best time";
        } else if (auth?.records[modeIndex] === null) {
            recordDisplay = "No record yet";
        } else {
            recordDisplay = `${auth?.records[modeIndex]} seconds`;
        }
        if (isWon) {
            return (
                <ModalContent bg={'#0A0A0A'} borderWidth={'4px'} borderColor={'#85ECFA'} borderRadius={'2xl'}>
                    <ModalHeader textAlign="center" fontSize="3xl" textColor={'#85ECFA'}  className="font-audiowideFont">You won</ModalHeader>
                    <ModalBody pb={6} fontSize="2xl"   className="font-customFont">
                        <p className="text-violet-400">{`Your time: ${currentGameData.time} seconds`}</p>
                        <p className="text-violet-400">Your record: {recordDisplay}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="cyan"  mr={5} onClick={
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
                <ModalContent bg={'#0A0A0A'} borderWidth={'4px'} borderColor={'#f87171'} borderRadius={'2xl'}>
                    <ModalHeader textAlign="center" fontSize="3xl"   className="font-audiowideFont text-red-500">
                        Game Over
                    </ModalHeader>
                    <ModalBody pb={6} fontSize="2xl" textColor={'#ceffff'}  className="font-customFont">
                        {`Your time: ${currentGameData.time} seconds`}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="cyan" borderColor="#000000" backgroundColor={'#ceffff'} textColor={'#000000'}  mr={5} onClick={
                            () => 
                            { 
                                setCurrentGameData(new GameData({difficulty:selectedOption})); 
                                if(setStartTime)
                                    setStartTime(null); 
                                onClose(); 
                            }}>
                            Retry
                        </Button>
                        <Button colorScheme="blue" color={'white'} backgroundColor={'#000000'} onClick={onClose}>Show field</Button>
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
                    backdropBlur="2px"
                />
                {showModalContent(currentGameData.isWin)}
            </Modal>
        </div>
        
    );
}


