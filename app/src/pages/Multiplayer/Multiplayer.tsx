import Nav from "../../components/Nav/Nav";
import SearchingForGame from "../../components/SearchingForGame/SearchingForGame";



export default function Multiplayer(){
    return(
        <main className='w-screen h-screen flex flex-row bg-slate-900 justify-center items-center'>
            <Nav></Nav>
            <SearchingForGame></SearchingForGame>

        </main>
    );

}