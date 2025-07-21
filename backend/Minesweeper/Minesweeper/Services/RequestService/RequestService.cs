using Microsoft.EntityFrameworkCore;
using Minesweeper.models;
using Minesweeper.data;
using Minesweeper.DTOs.FriendDTO; // Assuming your DbContext is here

namespace Minesweeper.Services.RequestService;

public class RequestService : IRequestService
{
    private readonly ApplicationDbContext context;

    public RequestService(ApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<ServiceResponse<bool>> CreateFriendRequest(string requestingPlayerId,string playerId)
    {
        var response = new ServiceResponse<bool>();

        try
        {
            if (playerId == requestingPlayerId)
                throw new Exception("You cannot send a friend request to yourself.");

            var requestedPlayer = await context.Users.FindAsync(playerId);
            var requestingPlayer = await context.Users.FindAsync(requestingPlayerId);

            if (requestedPlayer == null || requestingPlayer == null)
                throw new Exception("One or both players do not exist.");

            if (requestedPlayer.FriendsId != null && requestedPlayer.FriendsId.Contains(requestingPlayerId))
                throw new Exception("Players are already friends.");
            if (requestingPlayer.FriendsId != null && requestingPlayer.FriendsId.Contains(playerId))
                throw new Exception("Players are already friends.");
                
            var existingRequest = context.Requests.FirstOrDefault(r =>
                r.Type == "Friend" &&
                ((r.RequestedPlayerId == playerId && r.RequestingPlayerId == requestingPlayerId) ||
                 (r.RequestedPlayerId == requestingPlayerId && r.RequestingPlayerId == playerId))
            );
            if (existingRequest != null)
                throw new Exception("A friend request already exists between these players.");

            var request = new Request
            {
                Id = Guid.NewGuid().ToString(),
                Type = "Friend",
                CreatedAt = DateTime.UtcNow,
                RequestedPlayerId = playerId,
                RequestingPlayerId = requestingPlayerId
            };

            context.Requests.Add(request);
            await context.SaveChangesAsync();

            response.Data = true;
            response.Success = true;
        }
        catch (Exception ex)
        {
            response.Data = false;
            response.Success = false;
            response.Message = ex.Message;
        }

        return response;
    }

    public async Task<ServiceResponse<bool>> AcceptFriendRequest(string requestId)
    {
        var response = new ServiceResponse<bool>();
        try
        {
            var request = await context.Requests.FindAsync(requestId);
            if (request == null || request.Type != "Friend")
                throw new Exception("Friend request not found.");

            var requestedPlayer = await context.Users.FindAsync(request.RequestedPlayerId);
            var requestingPlayer = await context.Users.FindAsync(request.RequestingPlayerId);

            if (requestedPlayer == null || requestingPlayer == null)
                throw new Exception("One or both players do not exist.");

            // Add each other as friends
            requestedPlayer.FriendsId ??= new List<string>();
            requestingPlayer.FriendsId ??= new List<string>();

            if (!requestedPlayer.FriendsId.Contains(request.RequestingPlayerId))
                requestedPlayer.FriendsId.Add(request.RequestingPlayerId);

            if (!requestingPlayer.FriendsId.Contains(request.RequestedPlayerId))
                requestingPlayer.FriendsId.Add(request.RequestedPlayerId);

            // Remove the request
            context.Requests.Remove(request);

            await context.SaveChangesAsync();

            response.Data = true;
            response.Success = true;
        }
        catch (Exception ex)
        {
            response.Data = false;
            response.Success = false;
            response.Message = ex.Message;
        }
        return response;
    }

    public async Task<ServiceResponse<bool>> RejectFriendRequest(string requestId)
    {
        var response = new ServiceResponse<bool>();
        try
        {
            var request = await context.Requests.FindAsync(requestId);
            if (request == null || request.Type != "Friend")
                throw new Exception("Friend request not found.");

            // Remove the request
            context.Requests.Remove(request);
            await context.SaveChangesAsync();

            response.Data = true;
            response.Success = true;
        }
        catch (Exception ex)
        {
            response.Data = false;
            response.Success = false;
            response.Message = ex.Message;
        }
        return response;
    }

    public async Task<ServiceResponse<List<FriendRequestDTO>>> GetFriendRequestsForUser(string userId)
    {
        var response = new ServiceResponse<List<FriendRequestDTO>>();
        try
        {
            var requests = await context.Requests
                .Where(r => r.Type == "Friend" && r.RequestedPlayerId == userId)
                .ToListAsync();

            var requesterIds = requests.Select(r => r.RequestingPlayerId).ToList();

            var requesters = await context.Users
                .Where(u => requesterIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.PlayerName);

            var result = requests.Select(r => new FriendRequestDTO
            {
                RequestId = r.Id,
                RequestingPlayerId = r.RequestingPlayerId,
                RequestingPlayerName = r.RequestingPlayerId != null && requesters.ContainsKey(r.RequestingPlayerId)
                    ? requesters[r.RequestingPlayerId]
                    : null,
                CreatedAt = r.CreatedAt
            }).ToList();

            response.Data = result;
            response.Success = true;
        }
        catch (Exception ex)
        {
            response.Data = null;
            response.Success = false;
            response.Message = ex.Message;
        }
        return response;
    }
}