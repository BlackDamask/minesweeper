namespace Minesweeper.DTOs.PlayerDTO
{
    public class AddPlayerDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
