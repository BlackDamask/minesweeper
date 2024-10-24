import Header from '../../components/Header';
import Game from '../../components/Game/Game';
export default function SinglePlayer(){
    return(
        <div>
            <Header/>
            <main className='flex justify-center '>
                <Game/>
            </main>
        </div>
    );
}