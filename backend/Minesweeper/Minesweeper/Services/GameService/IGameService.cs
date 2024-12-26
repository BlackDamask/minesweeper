using Minesweeper.models;

namespace Minesweeper.Services.GameService
{
    public interface IGameService
    {
        public Task<ServiceResponse<bool>> IsPlayerInGame(string playerId);
    }
}
