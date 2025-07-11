import { useState} from 'react';
import { ReactComponent as WierdFace} from './mean.svg';
import { ReactComponent as SmileFace} from './smile.svg';
import { GameData } from '../data';
import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
import React from 'react';

export default function RestartGameEmoji({
    selectedStyle,
    setCurrentGameData,
    currentGameData,
    selectedOption,
    zoom,
    setStartTime
}: {
    selectedStyle: string,
    setCurrentGameData: React.Dispatch<React.SetStateAction<GameData>>,
    currentGameData: GameData,
    selectedOption: number,
    zoom: number,
    setStartTime: React.Dispatch<React.SetStateAction<number | null>>
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
        setStartTime(null);
    };

    const handleButtonClick = () => {
        if (currentGameData.isStarted) {
            onOpen();  // Show popover only if the game has started
        } else {
            setCurrentGameData(new GameData({difficulty:selectedOption}));
            setStartTime(null);
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
                        className='text-center flex items-center justify-center cursor-pointer'

                        onClick={handleButtonClick}
                    >

                        {
                            selectedStyle === 'modern' ?
                            <div className=' h-full text-blue-300  font-bold font-audiowideFont '
                                style={{
                                    height: `${zoom * 2}px`,
                                    fontSize: `${zoom * 0.7}px`,
                                }}
                            >
                                <p className='text-center h-full flex  items-center'>RESTART</p>
                            </div>
                                
                            :
                            isHovered ? (
                                <SmileFace style={{width: `${zoom*2}px`}}  />
                            ) : (
                                <WierdFace style={{width: `${zoom*2}px`}} />
                            )
                        }
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