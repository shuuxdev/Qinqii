using Microsoft.AspNetCore.Mvc;

namespace Qinqii.DTOs.Request.Notification;

public class DeleteNotificationRequest
{
    public int user_id { get; set; }
    [BindProperty(Name = "id")]
    public int notification_id { get; set; }
}