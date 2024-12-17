using Minesweeper.DTOs;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using System.Security.Claims;

namespace Minesweeper.Services.PlayerService
{
    public interface IPlayerService
    {
        Task<ServiceResponse<string>> Register(RegisterPlayerDTO newPlayer);
        Task<ServiceResponse<LoginPlayerResponseDTO>> Login(LoginPlayerDTO player);
        Task<ServiceResponse<string>> RefreshToken(string refreshToken);
        Task<ServiceResponse<GetPlayerDTO>> GetProfile(string playerId);
        Task<ServiceResponse<string>> AddPlayerToQueue(string playerId);
        Task<ServiceResponse<int>> ChangePoints(string playerId, int pointsChange);
    }
}
