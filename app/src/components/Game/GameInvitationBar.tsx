import { useGameContext } from "../../GameProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function GameInvitationBar() {
    const gameContext = useGameContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!gameContext?.gameInvitation) return null;

    const handleAccept = async () => {
        if (gameContext.gameInvitation !== null) {
            await gameContext.acceptPvpGameInvitation(gameContext.gameInvitation.id);
            gameContext.setGameInvitation(null);
            navigate("/multiplayer");
        }
    };

    const handleDiscard = () => {
        gameContext.setGameInvitation(null);
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
            <div className="bg-blue-900 text-white px-6 py-4 rounded-b-xl shadow-lg flex items-center gap-6">
                <span>
                    <b>{gameContext.gameInvitation.name}</b> {t('invitedYouToGame')} Elo: {gameContext.gameInvitation.elo}
                </span>
                <div className="flex items-center">
                    <Button colorScheme="green" size="sm" onClick={handleAccept}>{t('game.accept')}</Button>
                    <Button colorScheme="red" size="sm" onClick={handleDiscard}>{t('game.discard')}</Button>
                </div>
            </div>
        </div>
    );
}