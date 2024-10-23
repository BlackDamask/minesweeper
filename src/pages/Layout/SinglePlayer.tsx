import Header from '../../components/Header';
import Game from '../../components/Game/Game';
import { GameData } from '../../components/Game/data';
export default function SinglePlayer(){
    var gameData = new GameData(1);
    return(
        <div>
            <Header/>
            <main className='flex justify-center'>
                <Game gameData={gameData}/>
            </main>
        </div>
    );
}