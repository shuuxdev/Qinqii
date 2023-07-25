using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using Qinqii.Models;
namespace Qinqii.Service
{
    public class MessageService
    {
        private readonly DapperContext _ctx;
        public MessageService(DapperContext ctx )
        {
            _ctx = ctx;
        }
        public async Task<int> SendMessage(Message message)
        {
              using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@message_text", message.message_text, dbType: System.Data.DbType.String);
                param.Add("@conversation_id", message.conversation_id, dbType: System.Data.DbType.String);
                param.Add("@sender_id", message.sender_id, dbType: System.Data.DbType.Int32);
                var msg = await connection.ExecuteScalarAsync<int>("[dbo].[SEND_Message]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                
                return msg;
        }
        public async Task<IEnumerable<Conversation>> GetContacts(int user_id)
        {
            using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", user_id, dbType: System.Data.DbType.Int32);
                var conversations = (await connection.QueryAsync<Conversation>("[dbo].[GET_Contacts]", commandType: System.Data.CommandType.StoredProcedure, param: param));
                return conversations;

        }
        public async Task<IEnumerable<Message>> GetMessages(int conversation_id)
        {
            using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@conversation_id", conversation_id, dbType: System.Data.DbType.Int32);
                var messages = (await connection.QueryAsync<Message>("[dbo].[GET_Messages]", commandType: System.Data.CommandType.StoredProcedure, param: param));
                return messages;

        }
    }
}