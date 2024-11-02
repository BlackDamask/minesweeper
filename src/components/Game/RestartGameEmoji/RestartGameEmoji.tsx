import { useState, ReactElement } from 'react';
import { ReactComponent as WierdFace} from './*_*.svg';
import { ReactComponent as SmileFace} from './smile.svg';
import { GameData } from '../data';

export default function RestartGameEmoji({setCurrentGameData, selectedOption} : {setCurrentGameData: React.Dispatch<React.SetStateAction<GameData>>, selectedOption: number}){
    const [isHovered, setIsHovered] = useState(false);

  // Event handlers for hover
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='pb-3'
        onClick={() => {setCurrentGameData(new GameData(selectedOption))}}
        >
        {isHovered ? (
            // SVG displayed on hover
            <SmileFace className='h-[4em]'></SmileFace>
        ) : (
            // Default SVG displayed when not hovered
            <WierdFace className='h-[4em]'></WierdFace>
        )}
        </div>
    );
}