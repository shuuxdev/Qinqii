using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using Qinqii.DTOs.Request.Contact;
using Qinqii.DTOs.Request.Message;
using Qinqii.Models;
using Qinqii.Utilities;

namespace Qinqii.Service
{
    public class MessageService
    {
        private readonly DapperContext _ctx;
        public MessageService(DapperContext ctx )
        {
            _ctx = ctx;
        }
        public async Task<Message> CreateMessage(CreateMessageRequest message)
        {
              using var connection = _ctx.CreateConnection();
              var param = message.ToParameters();
                var msg = await connection.QuerySingleAsync<Message>("[MESSAGE].[Create]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return msg;
        }
        public async Task<IEnumerable<Conversation>> GetContacts
        (GetContactsRequest contact)
        {
            using var connection = _ctx.CreateConnection();
            var param = contact.ToParameters();
                var conversations = (await connection.QueryAsync<Conversation>("[ACCOUNT].[Contacts]", commandType: System.Data.CommandType.StoredProcedure, param: param));
                return conversations;

        }
        public async Task<IEnumerable<Message>> GetMessages
        (GetMessagesRequest request)
        {
            using var connection = _ctx.CreateConnection();
            var param = request.ToParameters();
            var messages = (await connection.QueryAsync<Message>("[MESSAGE].[Get]", commandType: System.Data.CommandType.StoredProcedure, param: param));
            return messages;
        }
    }
}