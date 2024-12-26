import GamePanel from '../../components/Game/GamePanel';
import Nav from '../../components/Nav/Nav';

export default function SinglePlayer(){
    
    return(
        <main className='w-screen h-screen flex flex-row bg-slate-900'>
            <Nav/>
            <div className='ml-[5rem] w-[calc(100%-5rem)]'>
                <h1 className='ml-14 my-6 text-3xl text-gray-300 '>
                    Single Player
                </h1>
                <GamePanel></GamePanel>
            </div>
        </main>
    );
}