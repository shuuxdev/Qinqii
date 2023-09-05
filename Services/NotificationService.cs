

using System.Data;
using System.Runtime.InteropServices;
using Dapper;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Utilities;

public class NotificationService
{
    private readonly IHubContext<QinqiiHub> _hubContext;
    private readonly DapperContext _ctx;

    private readonly ConnectionManager _connectionManager;
    public NotificationService(IHubContext<QinqiiHub> hubContext, DapperContext ctx, ConnectionManager connectionManager)
    {
        _hubContext = hubContext;
        _ctx = ctx;
        _connectionManager = connectionManager;
    }
    
    public async Task<IEnumerable<Notification>> GetNotifications(GetNotificationsRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        var reader = await connection.QueryMultipleAsync("[NOTIFICATION].Get", param, commandType: CommandType.StoredProcedure);
        var notifications = await reader.ToNotifications();
        return notifications;
    }
    public async Task<Notification> GetNotification(GetNotificationRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        var reader = await connection.QueryMultipleAsync("[NOTIFICATION].Get", param, commandType: CommandType.StoredProcedure);
        var notification = await reader.ToNotification();
        return notification;
    }
    public async Task<Notification> CreateNotification(CreateNotificationRequest 
    request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        if(request.notification_params.Count > 0)
            param.Add("@notification_param", request.notification_params.ToTableValuedParameters());    
        
        var reader = await connection.QueryMultipleAsync("[NOTIFICATION].Create", param, commandType: CommandType.StoredProcedure);
        var notification = await reader.ToNotification();
        return notification;
    }
    public async Task MarkAsRead(MarkAsReadRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        await connection.ExecuteAsync("[NOTIFICATION].MarkAsRead", param, commandType: CommandType.StoredProcedure);
    }
    public async Task DeleteNotification(DeleteNotificationRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        await connection.ExecuteAsync("[NOTIFICATION].Delete", param, commandType: CommandType.StoredProcedure);
    }
}

