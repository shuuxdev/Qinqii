using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using Qinqii.DTOs.Request.Contact;
using Qinqii.DTOs.Request.Message;
using Qinqii.Extensions;
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
        public async Task<Message> CreateMessage(CreateMessageRequest message, IEnumerable<AttachmentIdsTVP> attachment_ids)
        {
              using var connection = _ctx.CreateConnection();
              var param = message.ToParameters();
              param.Add("@tvp", attachment_ids.ToTableValuedParameters());
                var reader = await connection.QueryMultipleAsync("[MESSAGE].[Create]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return await reader.ToMessage();
        }
        
        public async Task<IEnumerable<Message>> GetMessages
        (GetMessagesRequest request)
        {
            using var connection = _ctx.CreateConnection();
            var param = request.ToParameters();
            var reader = (await connection.QueryMultipleAsync("[MESSAGE].[Get]", commandType: System.Data.CommandType.StoredProcedure, param: param));
            var messages = await reader.ToMessages();
            return messages;
        }
    }
}