using Minesweeper.models;
using Minesweeper.data; // Assuming your DbContext is here

namespace Minesweeper.Services.RequestService;

public class RequestService : IRequestService
{
    private readonly ApplicationDbContext context;

    public RequestService(ApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<ServiceResponse<bool>> CreateFriendRequest(string playerId, string requestingPlayerId)
    {
        var response = new ServiceResponse<bool>();

        try
        {
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
}