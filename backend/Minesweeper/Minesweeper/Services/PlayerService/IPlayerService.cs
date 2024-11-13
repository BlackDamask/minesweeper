using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;

namespace Minesweeper.Services.PlayerService
{
    public interface IPlayerService
    {
        Task<ServiceResponse<string>> Register(RegisterPlayerDTO newPlayer);
        Task<ServiceResponse<string>> Login(string username, string password);
    }
}
