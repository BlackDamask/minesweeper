import '../../index.css';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav/Nav';
import { AuthContext } from '../../AuthProvider';
import { useContext } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import NotAuthorizedModal from '../../components/Modals/NotAuthorizedModal';

export default function Layout() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate(); 

  const {isOpen ,onOpen, onClose} = useDisclosure();

  const handlePvpButtonClick = () : void => {
    if(auth?.isLoggedIn){
      navigate("/multiplayer");
    }
    else{
      onOpen();
    }
  }

  return (
    <main className='w-screen h-screen flex flex-row bg-slate-900'>
      
      <Nav/>
      <div className="w-[100%]">
        
        <h1 className='ml-16 sm:ml-24 my-6 text-3xl text-gray-300'>
          Start a new game
        </h1>
        
        <div className='flex flex-col space-y-5'>
          <Link to="/single">
            <div className='flex  ml-14 sm:ml-24 h-24 w-[calc(100%-40px)] lg:w-[80%] bg-green-700 hover:bg-green-800 rounded-lg border-b-[3px] border-green-900  cursor-pointer'>
              <div className='w-1/3 sm:w-1/5 h-full p-3 '>
                <img alt='' src="./bomb-shape.png" className='h-full aspect-square' />
              </div>
              <div className='w-4/5 flex flex-col p-4  '>
                <h1 className='text-xl sm:text-2xl text-white'>Single Player</h1>
                <span className='flex text-white cursor-pointer text-sm sm:text-base'><p><u>Beginner 9x9</u> <u>Indermediate 16x16</u> <u>Expert 30x16</u></p> </span>
              </div>
            </div>
          </Link>
          <div className='flex  ml-14 sm:ml-24 h-24 w-[calc(100%-40px)] lg:w-[80%] rounded-lg text-white bg-[#1072d6] hover:bg-[#0d5bab] border-b-[3px] border-[#0d5bab] cursor-pointer'
            onClick={handlePvpButtonClick}>
            <div className='w-1/3 sm:w-1/5 h-full p-3 '>
              <img alt='' src="./shovel-pvp.svg" className='h-full aspect-square' />
            </div>
            <div className='w-4/5 flex flex-col p-4  '>
              <h1 className='text-lg sm:text-2xl'>PvP</h1>
              <span className='flex cursor-pointer text-sm sm:text-base'><p><u>Beginner 9x9</u> <u>Indermediate 16x16</u> <u>Expert 30x16</u></p> </span>
            </div>
          </div>
          <div className="flex  ml-14 sm:ml-24 h-24 w-[calc(100%-40px)] lg:w-[80%] bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg border-b-[3px] border-fuchsia-900 cursor-pointer">

            <div className='w-1/3 sm:w-1/5 h-full p-3 '>
              <img alt='' src="./coop-game.png" className='h-full aspect-square' />
            </div>
            <div className='w-4/5 flex flex-col p-4  '>
              <h1 className='text-2xl text-white text-lg sm:text-2xl'>Cooperative game</h1>
              <span className='flex text-white cursor-pointer text-sm sm:text-base'> <p><u>Beginner 9x9</u> <u>Indermediate 16x16</u> <u>Expert 30x16</u></p> </span>
            </div>
          </div>
        </div>
      </div>
      <div className='w-[calc(30%-5rem)]'>

      </div>
       <NotAuthorizedModal isOpen={isOpen} onClose={onClose} />
    </main>
  );
}
 