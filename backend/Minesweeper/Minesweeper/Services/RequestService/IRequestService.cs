using Minesweeper.DTOs.FriendDTO;
using Minesweeper.models;

namespace Minesweeper.Services.RequestService;

public interface IRequestService
{
    Task<ServiceResponse<bool>> CreateFriendRequest(string playerId, string requestingPlayerId);  
    Task<ServiceResponse<bool>> AcceptFriendRequest(string requestId);
    Task<ServiceResponse<bool>> RejectFriendRequest(string requestId);
    Task<ServiceResponse<List<FriendRequestDTO>>> GetFriendRequestsForUser(string userId);
}