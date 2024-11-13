namespace Minesweeper.models
{
    public class Player
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public int Points { get; set; }

    }
}
