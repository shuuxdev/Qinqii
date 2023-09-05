using Qinqii.Models.Attributes;
using Qinqii.Models.Interfaces;

namespace Qinqii.DTOs.Request.Notification;

public class CreateNotificationRequest
{
    public int user_id { get; set; }
    public int actor_id { get; set; }
    
    public string notification_type { get; set; }
    
    [IgnoreDapperParameter]
    public List<INotificationParameter> notification_params { get; set; } = new();

}