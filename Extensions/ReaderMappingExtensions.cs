using Dapper;
using Qinqii.Enums;

namespace Qinqii.Extensions;

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
        var attachments = await reader.ReadAsync<Attachment>();
        var reactions = await reader.ReadAsync<Reaction>();
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
}