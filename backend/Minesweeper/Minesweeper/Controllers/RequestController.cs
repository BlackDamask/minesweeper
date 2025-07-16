using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minesweeper.Services.RequestService;
using Minesweeper.DTOs.RequestDTO;
using System.Security.Claims;

namespace Minesweeper.Controllers;

[ApiController]
[Route("api/request")]
[Authorize] // Require authorization for all endpoints
public class RequestController : ControllerBase
{
    private readonly IRequestService requestService;

    public RequestController(IRequestService requestService)
    {
        this.requestService = requestService;
    }

    [HttpPost("friend")]
    public async Task<IActionResult> CreateFriendRequest([FromBody] FriendRequestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();
        var result = await requestService.CreateFriendRequest(userId, dto.RequestingPlayerId);
        if (result.Success)
            return Ok(result);
        return BadRequest(result);
    }

    [HttpPost("accept")]
    public async Task<IActionResult> AcceptFriendRequest([FromBody] FriendRequestActionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();
        var result = await requestService.AcceptFriendRequest(dto.RequestId);
        if (result.Success)
            return Ok(result);
        return BadRequest(result);
    }

    [HttpPost("reject")]
    public async Task<IActionResult> RejectFriendRequest([FromBody] FriendRequestActionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();
        var result = await requestService.RejectFriendRequest(dto.RequestId);
        if (result.Success)
            return Ok(result);
        return BadRequest(result);
    }

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