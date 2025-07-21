import '../../index.css';
import './Layout.css';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav/Nav';
import { AuthContext } from '../../AuthProvider';
import { useContext, useEffect } from 'react';
import { useDisclosure, Image, useToast } from '@chakra-ui/react';
import NotAuthorizedModal from '../../components/Modals/NotAuthorizedModal';
import { motion } from 'framer-motion';
import GameInvitationBar from "../../components/Game/GameInvitationBar";
import { useGameContext } from '../../GameProvider';
import axios from '../../api/axios';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const gameContext = useGameContext();
  const navigate = useNavigate();
  const toast = useToast();
   
  

  const {isOpen ,onOpen, onClose} = useDisclosure();

  const handlePvpButtonClick = () : void => {
    if(auth?.isLoggedIn){
      navigate("/multiplayer");
    }
    else{
      onOpen();
    }
  }
  useEffect(() => {
    axios.delete(
      "/player/remove-from-queue",
      {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
      }
  ).catch(error => {
      console.error("Error removing from queue:", error);
  });
  }, [auth?.accessToken]);

  useEffect(() => {
        if (gameContext?.shallRedirectToMultiplayerPage) {
            navigate("/multiplayer");
            toast({ 
                title: "Redirecting",
                status: "warning",
                description: "You are in game, redirecting to multiplayer..." 
            });
        }
      }, [gameContext?.shallRedirectToMultiplayerPage, navigate]);

  return (
    <main className='w-screen h-full min-h-screen items-center flex flex-col bg-gray-950 text-center'>
      <GameInvitationBar />
      <Nav/>
      <div className="w-[calc(100%-40px)] sm:w-[calc(100%-80px)]  ml-14 sm:ml-20 px-4 sm:px-6 lg:px-8 my-8">
         <header>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-widest font-orbitronFont"
          >
          MINESWEEPER
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            className="text-xl sm:text-2xl md:text-3xl mt-4 uppercase text-[#85ECFA] tracking-widest font-audiowideFont"
          >
            BATTLE
          </motion.h2>
        </header> 
        <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-y-20  mt-20'>
          {/* Hide preview image on small screens */}
          <div className=' hidden md:flex h-60 sm:h-80 p-4 sm:p-12 xl:p-24 2xl:p-12 justify-center items-center'>
            <Link to="/single">
            <Image
              className="self-left w-full  max-w-md"
              onContextMenuCapture={(e) => e.preventDefault()}
              src="./game-preview.png"
              alt="Return"
              borderRadius="lg"
              cursor='pointer'
            />
            </Link>
          </div>
          <div className='h-fit sm:h-80 p-2 sm:p-5 flex flex-col justify-center'>
            <div className='flex items-center justify-center w-full h-fit text-[#85ECFA] text-2xl sm:text-4xl font-bold'>
              <p dangerouslySetInnerHTML={{ __html: t('play_minesweeper_online') }} />
            </div>
            <div className='pvp flex mt-5 h-20 sm:h-24 w-full  rounded-lg text-white hover:bg-purple-800 border-b-[3px] border-[#0d5bab] cursor-pointer text-start'
            onClick={handlePvpButtonClick}>
              <span className='flex w-full gap-3 h-full'>
                <div className='w-fit h-full'>
                  <img alt='' src="./shovel-pvp.svg" className='h-full aspect-square' />
                </div>
                <div className='w-3/4 sm:w-4/5 flex flex-col'>
                  <h1 className='text-base sm:text-lg '>{t('pvp')}</h1>
                  <span className='flex cursor-pointer text-xs sm:text-sm '><p dangerouslySetInnerHTML={{ __html: t('difficulty_levels') }}/> </span>
                </div>
              </span>
            </div>
            <Link to="/single">
            <div className='single flex mt-3 h-20 sm:h-24 w-full  bg-sky-500 rounded-lg border-b-[3px] border-green-900 cursor-pointer'>
              <span className='flex w-full h-full'>
                <div className='w-fit h-full aspect-square p-2'>
                <img alt='' src="./bomb-shape.png" className='h-full aspect-square' />
              </div>
              <div className='w-2/3 sm:w-3/5 flex flex-col text-start justify-center ml-[10px]'>
                <h1 className='text-base sm:text-xl  text-white'>{t('single_player')}</h1>
                <span className='flex text-white cursor-pointer text-xs sm:text-sm'><p dangerouslySetInnerHTML={{ __html: t('difficulty_levels') }}/> </span>
              </div>
              </span>
            </div>
          </Link>
          </div>
          <div className='flex items-center justify-center w-full  h-full text-[#85ECFA] text-2xl sm:text-4xl font-bold'>
              <p dangerouslySetInnerHTML={{ __html: t('play_with_friends') }}/>    
          </div>
          <div className='flex justify-center items-center w-full '>
            <Image
              className="self-left w-3/4 lg:w-2/3 xl:w-1/2 max-w-md"
              onContextMenuCapture={(e) => e.preventDefault()}
              src="./unity.png"
              alt="Return"
              borderRadius="lg"
              cursor='pointer'
            />
          </div>
        </div>
      </div>
      <NotAuthorizedModal isOpen={isOpen} onClose={onClose} />
    </main>
  );
}
