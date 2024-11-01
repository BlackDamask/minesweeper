import { useState, ReactElement } from 'react';
import { ReactComponent as WierdFace} from './*_*.svg';
import { ReactComponent as SmileFace} from './smile.svg';

export default function RestartGameEmoji(){
    const [isHovered, setIsHovered] = useState(false);

  // Event handlers for hover
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='pb-3'
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