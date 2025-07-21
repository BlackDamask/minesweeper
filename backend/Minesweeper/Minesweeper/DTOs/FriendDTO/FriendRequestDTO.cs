namespace Minesweeper.DTOs.FriendDTO;

public class FriendRequestDTO
{
    public string RequestId { get; set; }
    public string? RequestingPlayerId { get; set; }
    public string? RequestingPlayerName { get; set; }
    public DateTime CreatedAt { get; set; }
}
