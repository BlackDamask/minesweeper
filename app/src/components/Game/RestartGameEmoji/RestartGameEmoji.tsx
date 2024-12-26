import { useState, ReactElement } from 'react';
import { ReactComponent as WierdFace} from './mean.svg';
import { ReactComponent as SmileFace} from './smile.svg';
import { GameData } from '../data';
import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
import React from 'react';

export default function RestartGameEmoji({
    setCurrentGameData,
    currentGameData,
    selectedOption,
    zoom
}: {
    setCurrentGameData: React.Dispatch<React.SetStateAction<GameData>>,
    currentGameData: GameData,
    selectedOption: number,
    zoom: number
}) {
    const [isHovered, setIsHovered] = useState(false);
    const initialFocusRef = React.useRef<HTMLDivElement>(null);
    const { onOpen, onClose, isOpen } = useDisclosure();

    // Event handlers for hover
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const handleRestartClick = () => {
        onClose();
        setCurrentGameData(new GameData({difficulty:selectedOption}));
    };

    const handleButtonClick = () => {
        if (currentGameData.isStarted) {
            onOpen();  // Show popover only if the game has started
        } else {
            setCurrentGameData(new GameData({difficulty:selectedOption}));  // Restart game directly
        }
    };
    return (
        <>
            <Popover
                initialFocusRef={initialFocusRef}
                placement='right'
                closeOnBlur={false}
                isOpen={isOpen}
                onClose={onClose}
            >
                <PopoverTrigger>
                    <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className='aspect-square'
                        onClick={handleButtonClick}
                    >
                        {isHovered ? (
                            <SmileFace style={{width: `${zoom*2}px`}}  />
                        ) : (
                            <WierdFace style={{width: `${zoom*2}px`}} />
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent bg='gray.800' borderColor='gray.900' color='#ceffff'>
                    <PopoverArrow bg='gray.900' />
                    <PopoverCloseButton />
                    <PopoverHeader borderColor='gray.900'>Warning</PopoverHeader>
                    <PopoverBody>Are you sure you want to end the current game and start a new one?</PopoverBody>
                    <PopoverFooter borderColor='gray.900'>
                        <Button bg='red.400' color='gray.800' onClick={handleRestartClick} mr='1em'>
                            Restart
                        </Button>
                        <Button bg='#ceffff' color='gray.800' onClick={onClose}>
                            Continue
                        </Button>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        </>
    );
}