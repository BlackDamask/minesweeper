import { ReactElement } from 'react';
import {Tile} from '../data';
import { ReactComponent as FlagIcon } from './flag.svg';


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

export default function DefaultTile({ tile,rowIndex, colIndex, selectedZoom, handleClick, handleRightClick }: { tile: Tile,rowIndex:number, colIndex: number, selectedZoom: number, handleClick: (rowIndex: number, colIndex: number) => void, handleRightClick: (e: React.MouseEvent,rowIndex:number, colIndex: number) => void }) {

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
        className={`flex items-center justify-center font-customFont cursor-pointer`}
        style={{
            width: `${selectedZoom}px`,
            height: `${selectedZoom}px`,
            fontSize: `${selectedZoom}px`,
            backgroundColor,
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