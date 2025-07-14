import GamePanel from '../../components/Game/GamePanel';
import Nav from '../../components/Nav/Nav';

export default function SinglePlayer(){
    
    return(
        <main className='w-screen h-screen flex flex-row bg-gray-950 overflow-auto'>
            <Nav/>
            <div className='ml-[2rem] sm:ml-[5rem] w-[calc(100%-5rem)] mt-5'>
                <GamePanel></GamePanel>
            </div>
        </main>
    );
}