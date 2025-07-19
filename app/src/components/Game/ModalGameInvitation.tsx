import { useGameContext } from "../../GameProvider";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ModalGameInvitation() {
    const gameContext = useGameContext();
    const navigate = useNavigate();

    if (!gameContext?.gameInvitation) return null;

    const handleAccept = async () => {
        if (gameContext.gameInvitation !== null) {
            gameContext.resetMultiplayerGame();
            await gameContext.acceptPvpGameInvitation(gameContext.gameInvitation.id);
            gameContext.setGameInvitation(null);
            navigate("/multiplayer");
        }
    };

    const handleDiscard = () => {
        gameContext.setGameInvitation(null);
    };
    return (
        <div className="w-full z-50 flex justify-center py-4 px-5 bg-green-900 font-ubuntuFont">
                <span className="w-3/4">
                    <b>{gameContext.gameInvitation.name}</b> invites you to play! Elo: {gameContext.gameInvitation.elo}
                </span>
                <span className="w-1/4 gap-2 flex flex-col">
                    <Button className="w-full font-ubuntuFont" colorScheme="green" onClick={handleAccept}>Accept</Button>
                    <Button className="w-full" colorScheme="red"  onClick={handleDiscard}>Discard</Button>
                </span>
                
            
        </div>
    );
}
