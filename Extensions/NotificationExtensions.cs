using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Models;

namespace Qinqii.Extensions;

public static class NotificationExtensions
{
    public static async Task SendNotificationToOneUser(this IHubContext<QinqiiHub> 
    hubContext, Notification notification)
    {
        await hubContext.Clients.User(notification.user_id.ToString()).SendAsync
        ("ReceiveNotification", notification);
        
    }
    public static async Task SendNotificationToMultipleUsers(this 
    IHubContext<QinqiiHub> hubContext, List<Notification> notifications)
    {
        foreach (var notification in notifications)
        {
            await hubContext.Clients.User(notification.user_id.ToString()).SendAsync
            ("ReceiveNotification", notification);
        }
    }
    public static async Task SendNotificationToAllUsers(this 
    IHubContext<QinqiiHub> hubContext, Notification notification)
    {
        await hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
    }
}