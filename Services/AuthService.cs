

using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.Models;
using Qinqii.Utilities;

namespace Qinqii.Service
{
    public class AuthService
    {
        private readonly DapperContext _ctx;
        private readonly PasswordHasher _passwordHasher;

        public AuthService(DapperContext ctx, PasswordHasher _passwordHasher)
        {
            _ctx = ctx;
            this._passwordHasher = _passwordHasher;
        }
        public async Task<int> Login(string email, string password)
        {        
                using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@email", email, dbType: System.Data.DbType.String);
                 var account = await connection.QuerySingleAsync<Account>("[ACCOUNT].GetByEmail", commandType: System.Data.CommandType.StoredProcedure, param: param);
                 if(_passwordHasher.Verify(account.hashed_password, password))
                 {
                     return account.user_id;
                 }
                return -1;
        }
        public async Task<int> Register(string password, string email)
        {
            using var connection = _ctx.CreateConnection();
            var hashedPassword = _passwordHasher.Hash(password);
            var param = new DynamicParameters();
            param.Add("@password", hashedPassword, dbType: System.Data.DbType.String);
            param.Add("@email", email,
                dbType: System.Data.DbType.String);
            int cnt = await connection.ExecuteAsync("[ACCOUNT].[Register]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return cnt;
        }
        
    }
}