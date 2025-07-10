import { ReactElement } from 'react';
import {Tile} from '../data';
import { ReactComponent as FlagIcon } from './flag.svg';


const textColorMap: { [key: number]: string } = {
    1: 'text-blue-500',
    2: 'text-fuchsia-500',
    3: 'text-red-500',
    4: 'text-purple-400',
    5: 'text-orange-500',
    6: 'text-teal-500',
    7: 'text-rose-500',
    8: 'text-zinc-500',
};

type TileColor = 'light-tile' | 'dark-tile';

const tileColorMap: { [key in TileColor]: { default: string; clicked: string; withBomb: string } } = {
    'light-tile': {
        default: '#25313f',
        clicked: '#25313fAA',
        withBomb: '#bb8c44',
    },
    'dark-tile': {
        default: '#25313f',
        clicked: '#25313fAA',
        withBomb: '#bb8c44',
    },
    };

const glowColorMap: { [key: number]: string } = {
    1: '0 0 8px #1e40af, 0 0 16px #1e40af',        // blue-700
    2: '0 0 8px #a21caf, 0 0 16px #a21caf',        // fuchsia-700
    3: '0 0 8px #b91c1c, 0 0 16px #b91c1c',        // red-700
    4: '0 0 8px #7e22ce, 0 0 16px #7e22ce',        // purple-700
    5: '0 0 8px #ea580c, 0 0 16px #ea580c',        // orange-600
    6: '0 0 8px #14b8a6, 0 0 16px #14b8a6',        // teal-500
    7: '0 0 8px #be123c, 0 0 16px #be123c',        // rose-600
    8: '0 0 8px #52525b, 0 0 16px #52525b',        // zinc-600
};

const showBombCount = (bombCount: number | null): ReactElement => {
    if (bombCount === null || bombCount === 0) {
        return <p></p>;
    }

    const colorClass = textColorMap[bombCount] || '';
    const glow = glowColorMap[bombCount] || '';
    return (
        <p
            className={colorClass}
            style={glow ? { textShadow: glow } : undefined}
        >
            {bombCount}
        </p>
    );
};

export default function ModernTile({ tile,rowIndex, colIndex, selectedZoom, handleClick, handleRightClick }: { tile: Tile,rowIndex:number, colIndex: number, selectedZoom: number, handleClick: (rowIndex: number, colIndex: number) => void, handleRightClick: (e: React.MouseEvent,rowIndex:number, colIndex: number) => void }) {

    const tileColor = tile.color as TileColor;

    let backgroundColor = tile.isRevealed
        ? tile.hasBomb
            ? tileColorMap[tileColor].withBomb
            : tileColorMap[tileColor].clicked
        : tileColorMap[tileColor].default;

    const hoverStyle = tile.isRevealed
        ? { filter: 'brightness(100%)' } 
        : {};

  return (
    <div
        key={colIndex}
        className={`flex aspect-square items-center justify-center   text-center font-audiowideFont cursor-pointer`}
        style={{
            width: `${selectedZoom }px`,
            height: `${selectedZoom }px`, 
            fontSize: `${selectedZoom * 0.7}px`, 
            boxShadow: `inset ${selectedZoom/12}px ${selectedZoom/12}px ${selectedZoom/15}px #37495d, inset -${selectedZoom/12}px -${selectedZoom/12}px ${selectedZoom/15}px #1a2128`,
            borderRadius: `${selectedZoom/5}px`,
            margin: `${selectedZoom/10}px`,
            backgroundColor: backgroundColor,
            ...hoverStyle, 
        }}
        onClick={() => handleClick(rowIndex, colIndex)}
        onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)} 
        onMouseOver={(e) => {
            if (tile.isRevealed) e.currentTarget.style.filter = 'brightness(90%)';
        }} 
        onMouseOut={(e) => {
            if (tile.isRevealed) e.currentTarget.style.filter = 'none';
        }} 

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
}