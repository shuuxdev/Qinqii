using System.Net;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Models;
using Qinqii.Models.Paging;

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
    [HttpPost("mark-as-read")]
    public async Task<IActionResult> MarkAsRead([FromBody]MarkAsReadRequest request)
    {
        var result =  await _notificationService.MarkAsRead(request);
        if(!result.isSucceed)throw  new HttpStatusCodeException(HttpStatusCode.Conflict, "Notification not found");
        return Ok();
    }
    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteNotification(DeleteNotificationRequest request)
    {
        bool isNotificationExist = await _notificationService.IsNotificationExist(request.notification_id);
        if (!isNotificationExist) throw new HttpStatusCodeException(HttpStatusCode.NotFound, "Notification not found");
        var result = await _notificationService.DeleteNotification(request);
        if(result.isSucceed)
        return Ok();
        throw new HttpStatusCodeException(HttpStatusCode.BadRequest, "Failed to delete notification");
    }
    
}