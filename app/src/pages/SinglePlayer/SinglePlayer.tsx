import GamePanel from '../../components/Game/GamePanel';
import Nav from '../../components/Nav/Nav';

export default function SinglePlayer(){
    
    return(
        <main className='w-screen h-screen flex flex-row bg-gray-950 overflow-auto'>
            <Nav/>
            <div className='w-[calc(100%-56px)] sm:w-[calc(100%-80px)]  ml-14 sm:ml-20 mt-5'>
                <GamePanel></GamePanel>
            </div>
        </main>
    );
}