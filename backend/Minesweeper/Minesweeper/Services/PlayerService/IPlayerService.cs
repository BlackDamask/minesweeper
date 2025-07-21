using Minesweeper.DTOs.GameDTO;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;

namespace Minesweeper.Services.PlayerService
{
    public interface IPlayerService
    {
        
        Task<ServiceResponse<GetPlayerDTO>> GetProfile(string playerId);
        Task<ServiceResponse<GameBeginDTO>> AddPlayerToQueue(string playerId);
        Task<ServiceResponse<string>> RemovePlayerFromQueue(string playerId);
        Task<ServiceResponse<string>> ChangeUserName(string playerId, string userName);
        Task<ServiceResponse<List<GetPlayerDTO>>> GetAllPlayers();
        Task<ServiceResponse<List<GetPlayerDTO>>> SearchPlayersByName(string namePart, string currentPlayerId);
        Task<ServiceResponse<List<GetPlayerDTO>>> GetFriends(string playerId);
        Task<ServiceResponse<int?[]>> GetRecords(string playerId);
        Task<ServiceResponse<int?[]>> SetRecords(string playerId, int?[] newRecords);
        Task<ServiceResponse<bool>> RemoveFriend(string playerId, string friendId);
    }
}
