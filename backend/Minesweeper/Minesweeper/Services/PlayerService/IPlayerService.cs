using Minesweeper.DTOs;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using System.Security.Claims;

namespace Minesweeper.Services.PlayerService
{
    public interface IPlayerService
    {
        
        Task<ServiceResponse<GetPlayerDTO>> GetProfile(string playerId);
        Task<ServiceResponse<string>> AddPlayerToQueue(string playerId);
        Task<ServiceResponse<string>> RemovePlayerFromQueue(string playerId);
        Task<ServiceResponse<int>> ChangePoints(string playerId, int pointsChange);
        Task<ServiceResponse<string>> ChangeUserName(string playerId, string userName);
    }
}
