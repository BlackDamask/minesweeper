using System.Reflection.Metadata.Ecma335;

namespace Minesweeper.models;

public class Request
{
    public required string Id { get; set; }
    public required string Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string RequestedPlayerId { get; set; }
    public string? RequestingPlayerId { get; set; }
}