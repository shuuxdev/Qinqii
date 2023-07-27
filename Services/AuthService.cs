

using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.Models;
namespace Qinqii.Service
{
    public class AuthService
    {
        private readonly DapperContext _ctx;
        
        public AuthService(DapperContext ctx)
        {
            _ctx = ctx;
            
        }
        public async Task<int> Login(string username, string password)
        {            using var connection = _ctx.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@username", username, dbType: System.Data.DbType.String);
                param.Add("@password", password, dbType: System.Data.DbType.String);
            
                int user_id = await connection.QuerySingleAsync<int>("[ACCOUNT].[Login]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return user_id;

        }
    }
}