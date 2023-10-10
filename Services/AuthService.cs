

using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.DTOs.Request.User;
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
        public async Task<int> Register(UserRegisterRequest u)
        {
            using var connection = _ctx.CreateConnection();
            var hashedPassword = _passwordHasher.Hash(u.password);
            u.password = hashedPassword;
            if(await isEmailExist(u.email) == true) throw new EmailConflictException();
            if(await isNameExist(u.name) == true) throw new NameConflictException();
            
            var param = u.ToParameters();
            
            int cnt = await connection.ExecuteAsync("[ACCOUNT].[Register]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return cnt;
        }
        public async Task<bool> isEmailExist(string email)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@email", email);
            bool ok = await connection.ExecuteScalarAsync<bool>("[ACCOUNT].[isEmailExist]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return ok;

        }
        public async Task<bool> isNameExist(string name)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@name", name);
            bool ok = await connection.ExecuteScalarAsync<bool>("[ACCOUNT].[isNameExist]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return ok;
        }
    }
}