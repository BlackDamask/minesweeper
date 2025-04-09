using Minesweeper.DTOs;
using Minesweeper.DTOs.GameDTO;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using System.Security.Claims;

namespace Minesweeper.Services.PlayerService
{
    public interface IPlayerService
    {
        
        Task<ServiceResponse<GetPlayerDTO>> GetProfile(string playerId);
        Task<ServiceResponse<GameBeginDTO>> AddPlayerToQueue(string playerId);
        Task<ServiceResponse<string>> RemovePlayerFromQueue(string playerId);
        Task<ServiceResponse<string>> ChangeUserName(string playerId, string userName);
    }
}
