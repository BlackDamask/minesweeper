import { useState, ReactElement, useEffect } from "react";
import { GameData } from './data';
import { ReactComponent as FlagIcon } from './flag.svg';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";

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
        default: '#28cc0a',
        clicked: '#fdd08a',
        withBomb: '#bb8c44',
    },
    'dark-tile': {
        default: '#39ff13',
        clicked: '#caa66e',
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
        { currentGameData, setCurrentGameData, selectedOption, selectedMode,selectedZoom}: 
        { currentGameData: GameData, setCurrentGameData:  React.Dispatch<React.SetStateAction<GameData>>, selectedOption: number, selectedMode: number, selectedZoom: number}
    ) 
{
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (currentGameData.isGameOver) {
            onOpen();
        }
    }, [currentGameData.isGameOver, onOpen]);

    const setFlaggedTile = (rowIndex: number, colIndex: number) => {
        currentGameData.setFlaggedTile(rowIndex, colIndex);
        setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
    
    } 
    const setRevealedTile = (colIndex: number, rowIndex: number) => {
        if (!currentGameData.gameField[rowIndex][colIndex].isFlagged) {
            currentGameData.handleClickOnTile(colIndex, rowIndex);
            setCurrentGameData(Object.assign(Object.create(Object.getPrototypeOf(currentGameData)), currentGameData));
        }
    }

    const handleClick = (rowIndex: number, colIndex: number) => {
        if(selectedMode === 1){
            setRevealedTile(colIndex, rowIndex);
        }
        else{
            setFlaggedTile(colIndex, rowIndex);
        }
    };

    const handleRightClick = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        e.preventDefault();
        if(selectedMode === 1){
            setFlaggedTile(colIndex, rowIndex);
        }
        else{
            setRevealedTile(colIndex ,rowIndex );
        }
    };

    const showModalContent = (isWon: boolean): ReactElement => {
        if (isWon) {
            return (
                <ModalContent backgroundColor="#28cc0a">
                    <ModalHeader textAlign="center" fontSize="3xl" textColor={'#052e16'}  className="font-customFont">You won</ModalHeader>
                    <ModalBody pb={6} fontSize="2xl" textColor={'#052e16'}  className="font-customFont">
                        <p>{`Your time: ${currentGameData.time}`}</p>
                        <p>Your record:</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" color="white" borderColor="#000000" backgroundColor="#052e16" mr={5} onClick={() => { setCurrentGameData(new GameData(selectedOption)); onClose(); }}>
                            Retry
                        </Button>
                        <Button colorScheme="gray" onClick={onClose}>Show field</Button>
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
                        <Button colorScheme="gray" borderColor="#000000" textColor={'#000000'} backgroundColor="#ceffff" mr={5} onClick={() => { setCurrentGameData(new GameData(selectedOption)); onClose(); }}>
                            Retry
                        </Button>
                        <Button colorScheme="blue" color={'white'} backgroundColor={'#032448'} onClick={onClose}>Show field</Button>
                    </ModalFooter>
                </ModalContent>
            );
        }
    };

    return (
        <div>
            
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
                    if(tile.hasBomb){
                        backgroundColor= tileColorMap[tileColor].withBomb;
                    }

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



