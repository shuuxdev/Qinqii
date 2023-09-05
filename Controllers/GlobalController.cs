using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Notification;
using Qinqii.DTOs.Request.Reaction;
using Qinqii.Enums;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Parameters;
using Qinqii.Service;

namespace Qinqii.Controllers;

//this is the controller for all the fucking actions that you have no ideas where should you put it -.-
[ApiController]
public class GlobalController : ControllerBase
{
    private readonly PostService _postService;
    private readonly NotificationService _notificationService;
    private readonly IHubContext<QinqiiHub> _hubContext;
    private CommentService _commentService;

    public GlobalController(PostService postService, NotificationService 
    notificationService, IHubContext<QinqiiHub> hubContext, CommentService commentService)
    {
        _postService = postService;
        _notificationService = notificationService;
        _hubContext = hubContext;
        _commentService = commentService;
    }

    [HttpPatch("react")]
    public async Task<IActionResult> SendReaction(
        [FromBody] CreateReactionRequest request)
    {
        
        var dto = await _postService.SendReact(request);
        int author_id = 0;
        if (request.entity_type == (EntityType.POST))
            author_id = await _postService.GetPostAuthorId(request.entity_id);
        if(request.entity_type == (EntityType.COMMENT))
            author_id = await _commentService.GetCommentAuthorId(request.entity_id);
        
        var parameters = request.entity_type switch
        {
            "POST" => new List<INotificationParameter>()
            {
                new PostIdParameter(request.entity_id.ToString()),
                new EmojiParameter(request.emoji)
            },
            "COMMENT" => new List<INotificationParameter>()
            {
                new CommentIdParameter(request.entity_id.ToString()),
                new EmojiParameter(request.emoji)
            },
            _ => throw new ArgumentOutOfRangeException()
        };
        
        var notiRequest = new CreateNotificationRequest()
        {
            actor_id = request.user_id,
            user_id = author_id,
            notification_type = request.entity_type == EntityType.POST ?  NotificationType
            .LIKE_POST : NotificationType.LIKE_COMMENT,
            notification_params = parameters
        };
        var notification = await _notificationService.CreateNotification(notiRequest);
        await _hubContext.SendNotificationToOneUser(notification);    
        return Ok(dto);
    }
    

    [HttpDelete("undo-react")]
    public async Task<IActionResult> UndoReaction(
        DeleteReactionRequest react)
    {
        await _postService.UndoReact(react);
        return Ok();
    }
}