using System.Net;
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
    private readonly FriendRepository _friendRepository;
    private readonly UserRepository _user;
    private NotificationService _notificationService;

    public FriendController(FriendRepository friendRepository, UserRepository user, NotificationService notificationService)
    {
        _friendRepository = friendRepository;
        _user = user;
        _notificationService = notificationService;
    }

    [HttpGet("user/people-you-may-know")]
    public async Task<IActionResult> GetPeopleYouMayKnow(GetPeopleYouMayKnowRequest request)
    {
        var queryResult = await _friendRepository.GetPeopleYouMayKnow(request);
        if (queryResult.isSucceed) 
            return Ok(queryResult.data);
        throw new HttpStatusCodeException(HttpStatusCode.NotFound, "No user found");
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
            var receiver = await _friendRepository.GetFriendRequestSenderId(request.id);

            var sender = await _friendRepository.GetFriendRequestReceiverId(request.id);
            await _notificationService.Notify(receiver, sender, NotificationType.FRIEND_ACCEPT);
        }
        return Ok();
    }
    [HttpGet("user/friends")]
    public async Task<IActionResult> GetUserFriends(int user_id)
    {
        var u = await _user.GetFriends(user_id);
        return new JsonResult(u);
    }
    
    [HttpPost("user/send-friend-request")]
    public async Task<IActionResult> SendFriendRequest([FromBody] CreateFriendRequest request)
    {
        int request_id = await _friendRepository.CreateFriendRequest(request);
        await _notificationService.Notify(
            request.friend_id,
            request.user_id,
            NotificationType.FRIEND_REQUEST,
            new List<INotificationParameter>()
            {
                 new FriendRequestIdParameter(request_id.ToString()),
                 new UserIdParameter(request.user_id.ToString())
            });
        var sender = await _user.GetUser(request.user_id); // sender
        await _friendRepository.BroadcastFriendRequest(sender, request.friend_id, request_id);
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
    [HttpPost("user/cancel-friend-request")]
    public async Task<IActionResult> CancelFriendRequest([FromBody] CancelFriendRequest request)
    {
        await _friendRepository.CancelFriendRequest(request);
        return Ok();
    }
    [HttpPost("user/unfriend")]
    public async Task<IActionResult> Unfriend([FromBody] UnfriendRequest request)
    {
        await _friendRepository.Unfriend(request);
        return Ok();
    }
}