using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using Qinqii.DTOs.Request.Contact;
using Qinqii.DTOs.Request.Message;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.QueryResult;
using Qinqii.Utilities;

namespace Qinqii.Service
{
    public class MessageRepository
    {
        private readonly DapperContext _ctx;
        public MessageRepository(DapperContext ctx )
        {
            _ctx = ctx;
        }
        public async Task<int> GetConversationIdWithUser(int user_id, int recipient_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@user_id", user_id);
            param.Add("@recipient_id", recipient_id);
            var conversation_id = await connection.QueryFirstOrDefaultAsync<int>("[MESSAGE].[GetConversationIdWithUser]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return conversation_id;
        }
        public async Task<Message> CreateMessage(CreateMessageRequest message, IEnumerable<AttachmentIdsTVP> attachment_ids)
        {
              using var connection = _ctx.CreateConnection();
              var param = message.ToParameters();
              param.Add("@tvp", attachment_ids.ToTableValuedParameters());
                var reader = await connection.QueryMultipleAsync("[MESSAGE].[Create]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return await reader.ToMessage();
        }
        
        public async Task<QueryResult> DeleteMessage(int user_id, int message_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@user_id", user_id);
            param.Add("@message_id", message_id);
            var row = await connection.ExecuteAsync("[MESSAGE].[Delete]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            var result = new QueryResult(row, row == 1);
            return result;
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
        public async Task MarkMessageAsRead (MarkMessagesAsReadRequest request)
        {
            using var connection = _ctx.CreateConnection();
            var param =  request.ToParameters();
            await connection.ExecuteAsync("[MESSAGE].[MarkAsRead]", commandType: System.Data.CommandType.StoredProcedure, param: param);
        }
        public async Task<int> GetConversationIdByMessageId(int message_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@message_id", message_id);
            int conversationId = await connection.QuerySingleAsync<int>("[MESSAGE].[GetConversationIdByMessageId]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return conversationId;
        }
        public async Task<int> GetMessageSenderIdByMessageId(int message_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@message_id", message_id);
            int senderId = await connection.QuerySingleAsync<int>("[MESSAGE].[GetMessageSenderIdByMessageId]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return senderId;
        }
        public async Task<int> GetMessageIdByReactionId(int reaction_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@reaction_id", reaction_id);
            int messageId = await connection.QuerySingleAsync<int>("[MESSAGE].[GetMessageIdByReactionId]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return messageId;
        }
        public async Task<int> GetMessageRecipientIdByMessageId(int message_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@message_id", message_id);
            int recipientId = await connection.QuerySingleAsync<int>("[MESSAGE].[GetMessageRecipientIdByMessageId]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return recipientId;
        }
    }
}