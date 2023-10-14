using Dapper;
using Qinqii.Entities;
using Qinqii.Enums;
using Qinqii.Models;
using Qinqii.Models.Attachments;

namespace Qinqii.Extensions
{
    public static class ReaderMappingExtensions
    {
        public static async Task<Notification> ToNotification(this SqlMapper
            .GridReader reader)
        {
            var notification = await reader.ReadSingleOrDefaultAsync<Notification>();
            if (notification == null) return null;
            var p = await reader.ReadAsync<NotificationParameter>();
            notification.notification_params = p.ToDictionary(param => param
                .param_name,param => param.param_value);
            return notification;
        }
        public static async Task<IEnumerable<Notification>> ToNotifications(this SqlMapper
            .GridReader reader)
        {
            var notifications = await reader.ReadAsync<Notification>();
            var parameters = await reader.ReadAsync<NotificationParameter>();

            return notifications.Select(notification => 
            {
                notification.notification_params = parameters
                    .Where(param => param.notification_id == notification.notification_id)
                    .ToDictionary(param => param.param_name, param => param.param_value);

                return notification;
            });         
        }
        public static async Task<IEnumerable<Post>> ToPosts(this SqlMapper.GridReader reader)
        {
            var posts = await reader.ReadAsync<Post>();
            var comments = await reader.ReadAsync<Comment>();
            //need to manually mapping later
            var _attachments = await reader.ReadAsync<Attachment>();
            
            var reactions = await reader.ReadAsync<Reaction>();
            var thumbnail = await reader.ReadAsync<VideoThumbnail>();
            var attachments = ToAttachmentsWithThumbnails(_attachments, thumbnail);

        
            foreach (var comment in comments)
            {
                comment.attachments = attachments.Where(a => a.entity_id == comment
                    .comment_id && a.entity_type == EntityType.COMMENT).ToList();
                comment.reactions = reactions.Where(r => r.entity_id == comment.comment_id && r.entity_type == EntityType.COMMENT).ToList();
            }
            foreach (var post in posts)
            {
                post.attachments = attachments.Where(a => a.entity_id == post.post_id && a.entity_type == EntityType.POST).ToList();
                post.reactions = reactions.Where(r => r.entity_id == post.post_id && r.entity_type == EntityType.POST).ToList();
                post.comments = comments.Where(c => c.post_id == post.post_id).ToList();
            }
            return posts;
        }
        public static async Task<Post> ToPost(this SqlMapper.GridReader reader)
        {
            var post = await reader.ReadSingleAsync<Post>();
            var comments = await reader.ReadAsync<Comment>();
            var _attachments = await reader.ReadAsync<Attachment>();
            var reactions = await reader.ReadAsync<Reaction>();
            var thumbnail = await reader.ReadAsync<VideoThumbnail>();
            var attachments = ToAttachmentsWithThumbnails(_attachments, thumbnail);

            foreach (var comment in comments)
            {
                comment.attachments = attachments.Where(a => a.entity_id == comment
                    .comment_id && a.entity_type == EntityType.COMMENT).ToList();
                comment.reactions = reactions.Where(r => r.entity_id == comment.comment_id && r.entity_type == EntityType.COMMENT).ToList();
            }
            post.attachments = attachments.Where(a => a.entity_id == post.post_id && a.entity_type == EntityType.POST).ToList();
            post.reactions = reactions.Where(r => r.entity_id == post.post_id && r.entity_type == EntityType.POST).ToList();
            post.comments = comments.Where(c => c.post_id == post.post_id).ToList();
            return post;
        }
        
        private static List<Attachment> ToAttachmentsWithThumbnails(IEnumerable<Attachment> _attachments, IEnumerable<VideoThumbnail> thumbnail)
        {
            List<Attachment> attachments = new List<Attachment>();
            
            foreach(var attachment in _attachments)
            {
                if (attachment.attachment_type == AttachmentType.VIDEO)
                {
                    Entity.VideoAttachment videoAttachment = new Entity.VideoAttachment();
                    videoAttachment.attachment_id = attachment.attachment_id;
                    videoAttachment.attachment_link = attachment.attachment_link;
                    videoAttachment.attachment_type = AttachmentType.VIDEO;
                    videoAttachment.thumbnail = thumbnail.FirstOrDefault(t => t.video_id == attachment.attachment_id)?.thumbnail;
                    videoAttachment.entity_id = attachment.entity_id;
                    videoAttachment.entity_type = attachment.entity_type;
                    attachments.Add(videoAttachment);                    
                }
                else if (attachment.attachment_type == AttachmentType.IMAGE)
                {
                    Entity.ImageAttachment imageAttachment = new Entity.ImageAttachment();
                    imageAttachment.attachment_id = attachment.attachment_id;
                    imageAttachment.attachment_link = attachment.attachment_link;
                    imageAttachment.attachment_type = AttachmentType.IMAGE;
                    imageAttachment.entity_id = attachment.entity_id;
                    imageAttachment.entity_type = attachment.entity_type;
                    attachments.Add(imageAttachment);
                }
            }

            return attachments;
        }
        
        public static async Task<IEnumerable<Message>> ToMessages(this SqlMapper.GridReader reader)
        {
            var messages = await reader.ReadAsync<Message>();
            var _attachments = await reader.ReadAsync<Attachment>();
            var thumbnail = await reader.ReadAsync<VideoThumbnail>();
            var reactions = await reader.ReadAsync<Reaction>();
            
            var attachments = ToAttachmentsWithThumbnails(_attachments, thumbnail);

            foreach (var message in messages)
            {
                message.attachments = attachments.Where(a => a.entity_id == message.message_id && a.entity_type == EntityType.MESSAGE);
                message.reactions = reactions.Where(r => r.entity_id == message.message_id && r.entity_type == EntityType.MESSAGE);
            }
            return messages;
        }
        public static async Task<Message> ToMessage(this SqlMapper.GridReader reader)
        {
            var message = await reader.ReadSingleAsync<Message>();
            var _attachments = await reader.ReadAsync<Attachment>();
            var thumbnail = await reader.ReadAsync<VideoThumbnail>();
            
            var attachments = ToAttachmentsWithThumbnails(_attachments, thumbnail);
            message.attachments = attachments.Where(a => a.entity_id == message.message_id && a.entity_type == EntityType.MESSAGE);
            return message;
        }
        public static async Task<IEnumerable<Story>> ToStories(this SqlMapper.GridReader reader)
        {
            var stories = await reader.ReadAsync<Story>();
            var frames = await reader.ReadAsync<Frame>();
            var viewers = await reader.ReadAsync<FrameViewer>();
            foreach (var story in stories)
            {
                story.frames = frames.Where(f => f.story_id == story.story_id).ToList();
                story.viewers = viewers.Where(v => v.story_id == story.story_id).ToList();
            }
            return stories;
        }

        public static async Task<IEnumerable<Comment>> ToComments(this SqlMapper.GridReader reader)
        {
            var comments = await reader.ReadAsync<Comment>();
            //assume that attachments are images only, no videos include
            var attachments = await reader.ReadAsync<Attachment>();
            var reactions = await reader.ReadAsync<Reaction>();

            foreach (var comment in comments)
            {
                comment.attachments = attachments.Where(a => a.entity_id == comment
                    .comment_id && a.entity_type == EntityType.COMMENT).ToList();
                comment.reactions = reactions.Where(r => r.entity_id == comment.comment_id && r.entity_type == EntityType.COMMENT).ToList();
            }
            return comments;
        }
    }
    
}
