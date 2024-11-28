namespace Minesweeper.DTOs.PlayerDTO
{
    public class LoginPlayerResponseDTO
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
