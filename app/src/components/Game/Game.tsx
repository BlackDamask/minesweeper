import { useState, ReactElement, useEffect } from "react";
import { GameData } from './data';
import { ReactComponent as FlagIcon } from './flag.svg';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import { useGameContext } from "../../GameProvider";

const textColorMap: { [key: number]: string } = {
    1: 'text-blue-700',
    2: 'text-fuchsia-700',
    3: 'text-red-700',
    4: 'text-purple-700',
    5: 'text-orange-600',
    6: 'text-teal-500',
    7: 'text-rose-600',
    8: 'text-zinc-600',
};

type TileColor = 'light-tile' | 'dark-tile';

const tileColorMap: { [key in TileColor]: { default: string; clicked: string; withBomb: string } } = {
    'light-tile': {
        default: '#A8B7CB',
        clicked: '#ffe7ba',
        withBomb: '#bb8c44',
    },
    'dark-tile': {
        default: '#8C9FcA',
        clicked: '#E8B768',
        withBomb: '#bb8c44',
    },
};

const showBombCount = (bombCount: number | null): ReactElement => {
    if (bombCount === null || bombCount === 0) {
        return <p></p>;
    }

    const colorClass = textColorMap[bombCount] || '';
    return <p className={colorClass}>{bombCount}</p>;
};

export default function Game(
        { currentGameData, setCurrentGameData, selectedOption, selectedMode,selectedZoom, setStartTime, startTime, isExploaded, setIsExploaded}: 
        { 
            currentGameData: GameData,
            setCurrentGameData:  React.Dispatch<React.SetStateAction<GameData>>, 
            setStartTime: React.Dispatch<React.SetStateAction<number | null>>, 
            startTime: number | null, 
            selectedOption: number, 
            selectedMode: number, 
            selectedZoom: number, 
            isExploaded: boolean | undefined,
            setIsExploaded: React.Dispatch<React.SetStateAction<boolean>> | undefined
        }
    ) 
{
    const game = useGameContext();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (currentGameData.isGameOver) {
            onOpen();
            setStartTime(null);
        }
    }, [currentGameData.isGameOver, onOpen, setStartTime]);

    const setFlaggedTile = (rowIndex: number, colIndex: number) => {
        currentGameData.setFlaggedTile(rowIndex, colIndex);
        setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
    
    } 
    const setRevealedTile = (colIndex: number, rowIndex: number) => {
        if (!currentGameData.gameField[rowIndex][colIndex].isFlagged) {
            if(isExploaded !== undefined && setIsExploaded !== undefined){
                if(currentGameData.gameField[rowIndex][colIndex].hasBomb){
                    currentGameData.setFlaggedTile(colIndex,rowIndex);
                    setIsExploaded(true);
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
                                            currentGameData.setFlaggedTile(newRow,newCol);
                                            setIsExploaded(true);
                                    }
                                    else if(!currentGameData.gameField[newRow][newCol].isFlagged && !currentGameData.gameField[newRow][newCol].isRevealed){
                                        currentGameData.handleClickOnTile(colIndex, rowIndex);
                                        
                                        setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
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
        if(!isExploaded){
            if(!startTime){
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
                        <Button colorScheme="green" color="white" borderColor="#000000" backgroundColor="#052e16" mr={5} onClick={() => { setCurrentGameData(new GameData({difficulty:selectedOption})); setStartTime(null); onClose(); }}>
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
                        <Button colorScheme="gray" borderColor="#000000" textColor={'#000000'} backgroundColor="#ceffff" mr={5} onClick={() => { setCurrentGameData(new GameData({difficulty:selectedOption})); setStartTime(null); onClose(); }}>
                            Retry
                        </Button>
                        <Button colorScheme="blue" color={'white'} backgroundColor={'#032448'} onClick={onClose}>Show field</Button>
                    </ModalFooter>
                </ModalContent>
            );
        }
    };

    return (
        <div style={{ filter: game?.isExploaded ? 'invert(1)' : 'none' }}>
            
            {currentGameData.gameField.map((row, rowIndex) => (
                <div className={`flex w-fit h-fit text-xl`} key={rowIndex} >
                   {row.map((tile, colIndex) => {
                    const tileColor = tile.color as TileColor;

                    // Determine the background color for the tile
                    let backgroundColor = tile.isRevealed
                        ? tile.hasBomb
                            ? tileColorMap[tileColor].withBomb
                            : tileColorMap[tileColor].clicked
                        : tileColorMap[tileColor].default;

                    // Set hover effect darker only if the tile is revealed
                    const hoverStyle = tile.isRevealed
                        ? { filter: 'brightness(100%)' } // Darken the tile on hover
                        : {};

                    return (
                        <div
                            key={colIndex}
                            className={`flex items-center justify-center font-customFont cursor-pointer`}
                            style={{
                                width: `${selectedZoom}px`,
                                height: `${selectedZoom}px`,
                                fontSize: `${selectedZoom}px`,
                                backgroundColor,
                                ...hoverStyle, // Apply hover style dynamically
                            }}
                            onClick={() => handleClick(rowIndex, colIndex)} // Left click
                            onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)} // Right click
                            onMouseOver={(e) => {
                                if (tile.isRevealed) e.currentTarget.style.filter = 'brightness(90%)';
                            }} // Add dark effect on hover
                            onMouseOut={(e) => {
                                if (tile.isRevealed) e.currentTarget.style.filter = 'none';
                            }} // Reset dark effect when mouse leaves
                        >
                            {tile.isRevealed && !tile.isFlagged
                                ? showBombCount(tile.nearbyBombs)
                                : null}

                            {tile.isFlagged && !tile.isRevealed && (
                                <FlagIcon width="0.90em" height="0.90em" />
                            )}
                            {tile.hasBomb && tile.isRevealed && (
                                <img
                                    className="h-3/4 m-2"
                                    alt=""
                                    src="./logo192.png"
                                />
                            )}
                        </div>
                    );
                })}
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



