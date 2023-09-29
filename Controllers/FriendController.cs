using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Notification;
using Qinqii.DTOs.Request.User;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Parameters;
using Qinqii.Models.Type;
using Qinqii.Service;

namespace Qinqii.Controllers;

[Authorize]
public class FriendController : ControllerBase
{
    private readonly FriendService _friendService;
    private readonly UserService _user;
    private NotificationService _notificationService;

    public FriendController(FriendService friendService, UserService user, NotificationService notificationService)
    {
        _friendService = friendService;
        _user = user;
        _notificationService = notificationService;
    }
    [HttpGet("user/people-you-may-know")]
    public async Task<IActionResult> GetPeopleYouMayKnow(GetPeopleYouMayKnowRequest request)
    {
        var list = await _friendService.GetPeopleYouMayKnow(request);
        return Ok(list);
    }
    [HttpGet("user/friend-requests")]
    public async Task<IActionResult> GetUserIncomingFriendRequests()
    {
        int user_id = HttpContext.GetUserId();
        var u = await _user.GetFriendRequests(user_id);
        return Ok(u);
    }
    [HttpPatch("user/update-friend-status")]
    public async Task<IActionResult> UpdateFriendStatus([FromBody] EditFriendStatusRequest request)
    {
        await _user.UpdateFriendStatus(request);

        if (request.status == FriendRequestStatusType.ACCEPTED)
        {
            var receiver = await _friendService.GetFriendRequestSenderId(request.id);

            var sender = await _friendService.GetFriendRequestReceiverId(request.id);
            await _notificationService.Notify(receiver, sender, NotificationType.FRIEND_ACCEPT);
        }
        return Ok();
    }
    [HttpGet("user/friends")]
    public async Task<IActionResult> GetUserFriends(int id)
    {
        var u = await _user.GetFriends(id);
        return new JsonResult(u);
    }
    [HttpPost("user/send-friend-request")]
    public async Task<IActionResult> SendFriendRequest([FromBody] CreateFriendRequest request)
    {
        int request_id = await _friendService.CreateFriendRequest(request);
        await _notificationService.Notify(
            request.friend_id,
            request.user_id,
            NotificationType.FRIEND_REQUEST,
            new List<INotificationParameter>()
            {
                 new FriendRequestIdParameter(request_id.ToString()),
            });
        var sender = await _user.GetUser(request.user_id); // sender
        await _friendService.BroadcastFriendRequest(sender, request.friend_id, request_id);
        return Ok();
    }
    [HttpGet("user/friendsWithName")]
    public async Task<IActionResult> GetUserFriendsWithName(string startWith)
    {
        var u = await _user.FindFriendsByName(startWith, HttpContext.GetUserId());
        return Ok(u);
    }
    [HttpGet("user/findByName")]
    public async Task<IActionResult> FindUserByName(string startWith)
    {
        var u = await _user.FindUserByName(startWith);
        return Ok(u);
    }
}