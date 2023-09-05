using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.DTOs.Request.Notification;

namespace Qinqii.Controllers;
[Route("notification")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }
    [HttpGet("all")]
    public async Task<IActionResult> GetNotifications (GetNotificationsRequest request)
    {
        var notifications =  await _notificationService.GetNotifications(request);
        return Ok(notifications);
    }
}