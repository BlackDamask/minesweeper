import GamePanel from '../../components/Game/GamePanel';
import Nav from '../../components/Nav/Nav';
import GameInvitationBar from "../../components/Game/GameInvitationBar";
import { useGameContext } from '../../GameProvider';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { AuthContext } from '../../AuthProvider';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
export function SinglePlayer(){
    const { t } = useTranslation();
    const gameContext = useGameContext();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const toast = useToast();

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
                    title: t('redirecting'),
                    status: "warning",
                    description: t('redirectingDescription')
                });
            }
          }, [gameContext?.shallRedirectToMultiplayerPage, navigate, t, toast]);
    return(
        <main className='w-screen h-screen pt-2 pl-2 flex flex-row bg-gray-950 overflow-auto'>
            <GameInvitationBar />
            <Nav/>
            <div className='w-[calc(100%-56px)] sm:w-[calc(100%-80px)] xl:w-[calc(100%-160px)]  ml-14 sm:ml-20 xl:ml-40 mt-5'>
                <GamePanel></GamePanel>
            </div>
        </main>
    );
}