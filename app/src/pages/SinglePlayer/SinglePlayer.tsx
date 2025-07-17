import GamePanel from '../../components/Game/GamePanel';
import Nav from '../../components/Nav/Nav';
import GameInvitationBar from "../../components/Game/GameInvitationBar";
import { useGameContext } from '../../GameProvider';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { AuthContext } from '../../AuthProvider';
export function SinglePlayer(){
    const gameContext = useGameContext();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

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
        }
      }, [gameContext?.shallRedirectToMultiplayerPage, navigate]);
    
    return(
        <main className='w-screen h-screen flex flex-row bg-gray-950 overflow-auto'>
            <GameInvitationBar />
            <Nav/>
            <div className='w-[calc(100%-56px)] sm:w-[calc(100%-80px)]  ml-14 sm:ml-20 mt-5'>
                <GamePanel></GamePanel>
            </div>
        </main>
    );
}