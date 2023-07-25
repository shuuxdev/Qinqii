using System.Data;
using System.Diagnostics;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.Models;
namespace Qinqii.Service
{
    public class UserService
    {
        private readonly DapperContext _ctx;

        public UserService(DapperContext ctx)
        {
            _ctx = ctx;
        }
        public async Task<UserProfile> GetProfile(int id)
        {
                using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
                var u = await connection.QuerySingleAsync<UserProfile>("[dbo].[GET_Profile]",
                    commandType: System.Data.CommandType.StoredProcedure, param: param);
                connection.Dispose();
                return u;
        }
        public async Task<IEnumerable<Friend>> GetFriends(int id)
        {
            using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
                IEnumerable<Friend> user = await connection.QueryAsync<Friend>("[dbo].[GET_Friends]", commandType: System.Data.CommandType.StoredProcedure, param: param);

                return user;
        }
        public async Task<IEnumerable<Friend>> GetFriendRequests(int id)
        {            
            
               using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
                IEnumerable<Friend> user = await connection.QueryAsync<Friend>("[dbo].[GET_FriendRequests]",
                    commandType: System.Data.CommandType.StoredProcedure, param: param);
                return user;
        }
        public async Task<int> UpdateFriendStatus(FriendStatusAction friendStatus)
        {            using var connection = _ctx.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@action", friendStatus.action, dbType: System.Data.DbType.String);
                param.Add("@id", friendStatus.id, dbType: System.Data.DbType.Int32);
                int row_affected = await connection.ExecuteAsync("[dbo].[UPDATE_Friendship]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return row_affected;
        }
    }
}