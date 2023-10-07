using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Models;

namespace Qinqii.Controllers;
[Route("notification")]
[Authorize]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }
    [HttpGet("all")]
    public async Task<IActionResult> GetNotifications ()
    {
        var request = new GetNotificationsRequest()
        {
            user_id = HttpContext.GetUserId(),
        };
        var notifications =  await _notificationService.GetNotifications(request);
        return Ok(notifications);
    }
    [HttpPost("mark-as-read")]
    public async Task<IActionResult> MarkAsRead(MarkAsReadRequest request)
    {
        var result =  await _notificationService.MarkAsRead(request);
        if(!result.isSucceed)throw  new HttpStatusCodeException(HttpStatusCode.Conflict, "Notification not found");
        return Ok();
    }
}