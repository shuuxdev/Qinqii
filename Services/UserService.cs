using System.Data;
using System.Diagnostics;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.Enums;
using Qinqii.Models;
using Qinqii.Models.Attachment;
using Qinqii.Models.Post;

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
                var u = await connection.QuerySingleAsync<UserProfile>("[ACCOUNT].[Profile]",
                    commandType: System.Data.CommandType.StoredProcedure, param: param);
                connection.Dispose();
                return u;
        }
        public async Task<IEnumerable<Friend>> GetFriends(int id)
        {
            using var connection = _ctx.CreateConnection();
                var param = new DynamicParameters();
                param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
                IEnumerable<Friend> user = await connection.QueryAsync<Friend>("[ACCOUNT].[Friends]", commandType: System.Data.CommandType.StoredProcedure, param: param);

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
        public async Task<int> UpdateFriendStatus(FriendStatusAction friendStatus)
        {            using var connection = _ctx.CreateConnection();

                var param = new DynamicParameters();
                param.Add("@action", friendStatus.action, dbType: System.Data.DbType.String);
                param.Add("@id", friendStatus.id, dbType: System.Data.DbType.Int32);
                int row_affected = await connection.ExecuteAsync("[dbo].[UPDATE_Friendship]", commandType: System.Data.CommandType.StoredProcedure, param: param);
                return row_affected;
        }
        public async Task<IEnumerable<PostDTO>> GetUserPosts(int id)
        {            using var connection = _ctx.CreateConnection();

            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            var reader = await connection.QueryMultipleAsync("[ACCOUNT].GetPosts", commandType: System.Data.CommandType.StoredProcedure, param: param);

            var attachments =             await reader.ReadAsync<AttachmentDTO>();
            var posts = await reader.ReadAsync<PostDTO>();
            posts.ToList().ForEach(post => post.attachments.AddRange
            (attachments.Where(att => att.attachment_of == EntityType.Post 
            && att.entity_id == post.post_id)));
            return posts;
        }
        public async Task<IEnumerable<AttachmentDTO>> GetUserVideos(int id)
        {            using var connection = _ctx.CreateConnection();

            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            var reader = await connection.QueryMultipleAsync("[ACCOUNT].GetVideos", commandType: System.Data.CommandType.StoredProcedure, param: param);
            
            var attachments =             await reader.ReadAsync<AttachmentDTO>();
            return attachments;

        }
        public async Task<IEnumerable<AttachmentDTO>> GetUserImages(int id)
        {            using var connection = _ctx.CreateConnection();

            var param = new DynamicParameters();
            param.Add("@user_id", id, dbType: System.Data.DbType.Int32);
            var reader = await connection.QueryMultipleAsync("[ACCOUNT].GetImages", commandType: System.Data.CommandType.StoredProcedure, param: param);
            
            
            var attachments =             await reader.ReadAsync<AttachmentDTO>();
         
            return attachments;
        }
    }
}
