namespace Qinqii.DTOs.Request.Notification;

public class MarkAsReadRequest
{
    public int notification_id { get; set; }
    public int user_id { get; set; }
}