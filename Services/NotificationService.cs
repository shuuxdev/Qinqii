

using System.Data;
using System.Runtime.InteropServices;
using Dapper;
using Microsoft.AspNetCore.SignalR;
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

    public async Task CreateNotification(NotificationDTO _)
    {
        using var connection = _ctx.CreateConnection();

        using var dt = new DataTable();
        dt.Columns.Add("notification_id", typeof(int));
        dt.Columns.Add("param_name", typeof(string));
        dt.Columns.Add("param_value", typeof(string));

        _.paramDTOs.ForEach((param) =>
        {
            dt.Rows.Add(param.notification_id, param.param_name, param.param_value);
        });
        var param = new DynamicParameters();
        param.Add("@user_id", _.user_id, DbType.Int32);
        param.Add("@actor_id", _.actor_id, DbType.Int32);
        param.Add("@notification_type", _.notification_type, DbType.String);
        param.Add("@notification_param", dt.AsTableValuedParameter(), DbType.String);
        await connection.ExecuteScalarAsync("[NOTIFICATION].Create", param, commandType: CommandType.StoredProcedure);
        
        
    }
    public async Task MarkAsRead(int notification_id, int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new
        {
            notification_id,
            user_id
        };
        await connection.ExecuteAsync("[NOTIFICATION].MarkAsRead", param, commandType: CommandType.StoredProcedure);
    }
    public async Task DeleteNotification(int notification_id, int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new
        {
            notification_id,
            user_id
        };
        await connection.ExecuteAsync("[NOTIFICATION].Delete", param, commandType: CommandType.StoredProcedure);
    }
}

