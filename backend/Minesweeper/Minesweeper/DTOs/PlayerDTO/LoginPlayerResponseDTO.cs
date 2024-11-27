namespace Minesweeper.DTOs.PlayerDTO
{
    public class LoginPlayerResponseDTO
    {
        public required string AccesToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
