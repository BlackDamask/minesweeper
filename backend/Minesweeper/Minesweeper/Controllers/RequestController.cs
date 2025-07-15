using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minesweeper.Services.RequestService;
using System.Security.Claims;

namespace Minesweeper.Controllers;

[ApiController]
[Route("api/request")]
public class RequestController : ControllerBase
{
    private readonly IRequestService requestService;

    public RequestController(IRequestService requestService)
    {
        this.requestService = requestService;
    }

    [HttpPost("friend")]
    public async Task<IActionResult> CreateFriendRequest([FromQuery] string playerId, [FromQuery] string requestingPlayerId)
    {
        var result = await requestService.CreateFriendRequest(requestingPlayerId, playerId);
        if (result.Success)
            return Ok(result);
        return BadRequest(result);
    }

    [HttpPost("accept")]
    public async Task<IActionResult> AcceptFriendRequest([FromQuery] string requestId)
    {
        var result = await requestService.AcceptFriendRequest(requestId);
        if (result.Success)
            return Ok(result);
        return BadRequest(result);
    }

    [HttpPost("reject")]
    public async Task<IActionResult> RejectFriendRequest([FromQuery] string requestId)
    {
        var result = await requestService.RejectFriendRequest(requestId);
        if (result.Success)
            return Ok(result);
        return BadRequest(result);
    }

    [Authorize]
    [HttpGet("my-friend-requests")]
    public async Task<IActionResult> GetMyFriendRequests()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var result = await requestService.GetFriendRequestsForUser(userId);
        if (result.Success)
            return Ok(result.Data);
        return BadRequest(result.Message);
    }
}