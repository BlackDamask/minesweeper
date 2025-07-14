using Minesweeper.models;

namespace Minesweeper.Services.RequestService;

public interface IRequestService
{
    Task<ServiceResponse<bool>> CreateFriendRequest(string playerId, string requestingPlayerId);  
}