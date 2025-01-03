import { Progress } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav";
import SearchingForGame from "../../components/SearchingForGame/SearchingForGame";
import MultiplayerGamePanel from "../../components/Game/MultiplayerGamePanel";
import { useGameContext } from "../../GameProvider";


export default function Multiplayer() {
  const game = useGameContext();

  return (
    <main className="w-screen h-screen flex flex-row bg-slate-900">
      <Nav></Nav>
      <div className="ml-[5rem] w-[calc(100%-5rem)] ">
        
        {game?.isGameStarted ? (
          <div>
          <div className="w-full h-fit my-5 pl-14 flex">
          <div className="w-1/2 h-fit pr-4">
            <h1 className="text-xl my-2 text-gray-300">Player 1</h1>
            <Progress className="rounded-md" colorScheme="green" value={64} hasStripe></Progress>
          </div>
          <div className="w-1/2 h-fit pr-4">
            <h1 className="text-xl my-2 text-gray-300">Player 2</h1>
            <Progress className="rounded-md" value={44} colorScheme="pink" hasStripe></Progress>
          </div>
        </div>
          <MultiplayerGamePanel
            gameField={game?.gameField}
            colIndex={game?.startCoordinates.colIndex}
            rowIndex={game?.startCoordinates.rowIndex}
            selectedOption={1}
          ></MultiplayerGamePanel>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <SearchingForGame></SearchingForGame>
          </div>
        )}
      </div>
    </main>
  );
}



