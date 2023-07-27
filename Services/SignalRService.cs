using System.Data;
using Dapper;
using Qinqii.Models;
namespace Qinqii.Service
{
    public class SignalRService
    {
        private readonly DapperContext _ctx;
        public SignalRService(DapperContext ctx)
        {
            _ctx = ctx;
        }
        
        public async Task<int> MapConnectionIdToUser(UserConnectionInfo user)
        {
            using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@connection_id", user.connection_id, dbType: System.Data.DbType.String);
                param.Add("@ip", user.ip_address, dbType: System.Data.DbType.String);
                param.Add("@device", user.device, dbType: System.Data.DbType.String);
                param.Add("@user_id", user.user_id, dbType: System.Data.DbType.Int32);
                int row_inserted = await connection.ExecuteAsync("[dbo].[UPDATE_Connection]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return row_inserted;
        }
        public async Task<string> GetConnection(int user_id)
        {

            using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", user_id, dbType: System.Data.DbType.Int32);
                string connectionId = await connection.QuerySingleAsync<string>("[ACCOUNT].[Connection]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return connectionId;
        }
    }
}