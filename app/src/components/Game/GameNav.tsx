import RestartGameEmoji from '../../components/Game/RestartGameEmoji/RestartGameEmoji';
import { GameData } from '../../components/Game/data';

import { Dispatch, SetStateAction } from 'react';

interface GameNavProps {
  timer: string;
  selectedZoom: number;
  currentGameData: GameData;
  selectedOption: number;
  setCurrentGameData: Dispatch<SetStateAction<GameData>>;
  setStartTime: Dispatch<SetStateAction<number | null>>;
  selectedStyle: string;
}

export default function GameNav({
  timer,
  selectedZoom,
  currentGameData,
  selectedOption,
  setCurrentGameData,
  setStartTime,
  selectedStyle
}: GameNavProps) {
  return (
    selectedStyle === 'modern' ? (
      <nav className="flex items-center justify-between w-full  " style={{ height: `${selectedZoom * 2}px` }}>
        {/* Timer */}
        <div
          style={{
            width: `${selectedZoom * 3}px`,
            fontSize: `${selectedZoom * 1.2}px`,
            color: 'white',
          }}
          className="flex justify-start items-center font-pixelFont"
        >
          {timer}
        </div>

        {/* Restart Button */}
        <div
          style={{ width: `${selectedZoom * 2}px` }}
          className="flex justify-center items-center"
        >
          <RestartGameEmoji
            selectedStyle={selectedStyle}
            setCurrentGameData={setCurrentGameData}
            currentGameData={currentGameData}
            selectedOption={selectedOption}
            zoom={selectedZoom}
            setStartTime={setStartTime}
          />
        </div>

        {/* Bomb Counter */}
        <div
          style={{
            width: `${selectedZoom * 3}px`,
            fontSize: `${selectedZoom * 1.2}px`,
            color: 'white',
            textAlign: 'right',
          }}
          className="flex justify-center items-center font-pixelFont"
        >
          {currentGameData.numberOfBombs - currentGameData.numberOfFlags}
        </div>
      </nav>

    ) : (
      <nav className='flex justify-between items-center text-black'>
        <div
          style={{
            width: `${selectedZoom * 3}px`,
            height: `${selectedZoom * 2}px`,
            fontSize: `${selectedZoom * 1.2}px`,
            color: 'white',
          }}
          className='flex justify-center items-center font-pixelFont'
        >
          {timer}
        </div>
        <div
          className="flex h-full justify-center items-center"
          style={{ width: `${selectedZoom * 2}px` }}
        >
          <RestartGameEmoji
            selectedStyle={selectedStyle}
            setCurrentGameData={setCurrentGameData}
            currentGameData={currentGameData}
            selectedOption={selectedOption}
            zoom={selectedZoom}
            setStartTime={setStartTime}
          />
        </div>
        <div
          style={{
            width: `${selectedZoom * 3}px`,
            height: `${selectedZoom * 2}px`,
            fontSize: `${selectedZoom * 1.2}px`,
            color: 'white',
          }}
          className='flex justify-center items-center font-pixelFont'
        >
          {currentGameData.numberOfBombs - currentGameData.numberOfFlags}
        </div>
      </nav>
    )
  );
}