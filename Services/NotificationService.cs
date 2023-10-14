

using System.Data;
using System.Formats.Asn1;
using System.Runtime.InteropServices;
using Dapper;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.QueryResult;
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
    public async Task<QueryResult> MarkAsRead(MarkAsReadRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        var row = await connection.ExecuteAsync("[NOTIFICATION].MarkAsRead", param, commandType: CommandType.StoredProcedure);
        var result = new QueryResult(row, row == 1);
        return result;
    }
    public async Task<QueryResult> DeleteNotification(DeleteNotificationRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        int row = await connection.ExecuteAsync("[NOTIFICATION].Delete", param, commandType: CommandType.StoredProcedure);
        var result = new QueryResult(row, row == 1);
        return result;
    }
    public async Task Notify(int receiver_id, int sender_id, string notification_type,  List<INotificationParameter> parameters = null)
    {
        var notificationPayload = new CreateNotificationRequest()
        {
            notification_params = parameters ?? new List<INotificationParameter>(),
            notification_type = notification_type ,
            user_id = receiver_id,
            actor_id = sender_id
        };
        var notification = await CreateNotification(notificationPayload);
        await _hubContext.SendNotificationToOneUser(notification);
    }    
    public async Task<bool> IsNotificationExist(int notification_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@notification_id", notification_id);
        var row = await connection.ExecuteScalarAsync<int>("[NOTIFICATION].IsNotificationExist", param, commandType: CommandType.StoredProcedure);
        return row == 1;
    }
}

