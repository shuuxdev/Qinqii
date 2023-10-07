using System.Data;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.DTOs.Request.Contact;
using Qinqii.DTOs.Request.User;
using Qinqii.Enums;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.Paging;
using Qinqii.Models.QueryResult;
using Qinqii.Utilities;

namespace Qinqii.Service
{
    public class UserRepository
    {
        private readonly DapperContext _ctx;

        public UserRepository(DapperContext ctx)
        {
            _ctx = ctx;
        }
        public async Task<User> GetUser(int id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            var u = await connection.QuerySingleAsync<User>("[ACCOUNT].[User]",
                commandType: System.Data.CommandType.StoredProcedure, param: param);
            return u;
        }
        public async Task<UserProfile> GetProfile(int id)
        {
                using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
                var u = await connection.QuerySingleAsync<UserProfile>("[ACCOUNT].[Profile]",
                    commandType: System.Data.CommandType.StoredProcedure, param: param);
                connection.Dispose();
                return u;
        }
        public async Task<IEnumerable<PostImage>> GetUserPostImages(int id, int page, int pageSize)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            param.Add("@page", page, dbType: System.Data.DbType.Int32);
            param.Add("@page_size", pageSize, dbType: System.Data.DbType.Int32);
            
            var postImages = await connection.QueryAsync<PostImage>("[ACCOUNT].[GetUserPostImages]", commandType: CommandType.StoredProcedure, param: param);
            return postImages;
        } 
        public async Task<IEnumerable<Contact>> GetContacts
            (GetContactsRequest contact)
        {
            using var connection = _ctx.CreateConnection();
            var param = contact.ToParameters();
            var contacts = (await connection.QueryAsync<Contact>("[ACCOUNT].[Contacts]", commandType: System.Data.CommandType.StoredProcedure, param: param));
            
            var messages = await Task.WhenAll<IEnumerable<Message>>(contacts.Select(async (contact) =>
            {
                var param = new DynamicParameters();
                param.Add("@conversation_id", contact.conversation_id, dbType: System.Data.DbType.Int32);
                var reader =await  connection.QueryMultipleAsync("[MESSAGE].[Get]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                var messages = await reader.ToMessages();
                return messages;
            }));
            for (int i = 0; i < contacts.Count(); i++)
            {
                contacts.ElementAt(i).messages = messages.ElementAt(i);
            }
            return contacts;

        }
        public async Task<IEnumerable<PostVideoThumbnail>> GetUserPostVideoThumbnails(int id, int page, int pageSize)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            param.Add("@page", page, dbType: System.Data.DbType.Int32);
            param.Add("@page_size", pageSize, dbType: System.Data.DbType.Int32);
            var reader = await connection.QueryMultipleAsync("[ACCOUNT].[GetUserPostVideoThumbnails]",
                commandType: System.Data.CommandType.StoredProcedure, param: param);
            var thumbnails = await reader.ReadAsync<PostVideoThumbnail>();
            return thumbnails;
        }
        public async Task<IEnumerable<Friend>> GetFriends(int id)
        {
            using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
                IEnumerable<Friend> user = await connection.QueryAsync<Friend>("[ACCOUNT].[Friends]", commandType: System.Data.CommandType.StoredProcedure, param: param);

                return user;
        }

        public async Task<IEnumerable<Friend>> FindFriendsByName(string name, int user_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@name", name, dbType: System.Data.DbType.String);
            param.Add("@user_id", user_id, dbType: System.Data.DbType.Int32);
            IEnumerable<Friend> user = await connection.QueryAsync<Friend>("[ACCOUNT].[FriendsWithName]", commandType: System.Data.CommandType.StoredProcedure, param: param);

            return user;
        }
        public async Task<IEnumerable<User>>  FindUserByName(string name)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@name", name, dbType: System.Data.DbType.String);
            IEnumerable<User> user = await connection.QueryAsync<User>("[dbo].[find_user]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return user;
        }
        public async Task<IEnumerable<FriendRequest>> GetFriendRequests(int id)
        {            
            
               using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
                IEnumerable<FriendRequest> user = await connection
                .QueryAsync<FriendRequest>("[ACCOUNT].[FriendRequests]",
                    commandType: System.Data.CommandType.StoredProcedure, 
                    param: param);
                if (user == null) user = new List<FriendRequest>();
                return user;
        }

        public async Task<QueryResult> UpdateProfile(UserProfile profile)
        {
            using var connection = _ctx.CreateConnection();
            var param = profile.ToParameters();
            int row = await connection.ExecuteAsync("[dbo].[pcUpdateProfile]", commandType: CommandType.StoredProcedure, param: param);
            var result = new QueryResult(row, row == 1);
            return result;
        }
       
        public async Task UpdateFriendStatus(EditFriendStatusRequest editFriendStatus)
        {            using var connection = _ctx.CreateConnection();

            var param = editFriendStatus.ToParameters();
                int row = await connection.ExecuteAsync("[ACCOUNT].[UpdateFriendStatus]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                if(row != 1) throw new InvalidOperationException("Cannot update friend status");
        }
        public async Task<IEnumerable<Post>> GetUserPosts(int id, Page page)
        {            using var connection = _ctx.CreateConnection();

            var param = page.ToParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);

            var reader = await connection.QueryMultipleAsync("[ACCOUNT].GetPosts", commandType: System.Data.CommandType.StoredProcedure, param: param);
              var posts = await reader.ToPosts();
            return posts;
        }
        public async Task<IEnumerable<Attachment>> GetUserVideos(int id)
        {            using var connection = _ctx.CreateConnection();

            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            var reader = await connection.QueryMultipleAsync("[ACCOUNT].GetVideos", commandType: System.Data.CommandType.StoredProcedure, param: param);
            
            var attachments  =await reader.ReadAsync<Attachment>();
            return attachments;

        }
        public async Task<IEnumerable<Attachment>> GetUserImages(int id)
        {            using var connection = _ctx.CreateConnection();

            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            var reader = await connection.QueryMultipleAsync("[ACCOUNT].GetImages", commandType: System.Data.CommandType.StoredProcedure, param: param);
            
            
            var attachments =             await reader.ReadAsync<Attachment>();
         
            return attachments;
        }

        public async Task DeleteMessage(int messageId)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@message_id", messageId, dbType: System.Data.DbType.Int32);
            await connection.ExecuteAsync("[MESSAGE].[Delete]", commandType: System.Data.CommandType.StoredProcedure, param: param);
        }

        public async Task ReactToMessage(int messageId, int reactionId)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@message_id", messageId, dbType: System.Data.DbType.Int32);
            param.Add("@reaction_id", reactionId, dbType: System.Data.DbType.Int32);
            await connection.ExecuteAsync("[MESSAGE].[React]", commandType: System.Data.CommandType.StoredProcedure, param: param);
        }
        public async Task<string> GetRelationship(int user1_id, int user2_id)
        {
            using var connection = _ctx.CreateConnection();
            var param = new DynamicParameters();
            param.Add("@user1_id", user1_id, dbType: System.Data.DbType.Int32);
            param.Add("@user2_id", user2_id, dbType: System.Data.DbType.Int32);
            var relationship = await connection.QuerySingleAsync<string>("[ACCOUNT].[GetRelationship]", commandType: System.Data.CommandType.StoredProcedure, param: param);
            return relationship;
        }
    }
    
}
