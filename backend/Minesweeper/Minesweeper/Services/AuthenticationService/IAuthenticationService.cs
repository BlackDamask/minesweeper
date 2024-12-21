using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;

namespace Minesweeper.Services.AuthenticationService
{
    public interface IAuthenticationService
    {
        Task<ServiceResponse<string>> Register(RegisterPlayerDTO newPlayer);
        Task<ServiceResponse<LoginPlayerResponseDTO>> Login(LoginPlayerDTO player);
        Task<ServiceResponse<string>> RefreshToken(string refreshToken);
    }
}
