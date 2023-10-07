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
    private readonly PostRepository _postRepository;
    private readonly NotificationService _notificationService;
    private readonly IHubContext<QinqiiHub> _hubContext;
    private CommentRepository _commentRepository;

    public GlobalController(PostRepository postRepository, NotificationService 
    notificationService, IHubContext<QinqiiHub> hubContext, CommentRepository commentRepository)
    {
        _postRepository = postRepository;
        _notificationService = notificationService;
        _hubContext = hubContext;
        _commentRepository = commentRepository;
    }

    [HttpPatch("react")]
    public async Task<IActionResult> SendReaction(
        [FromBody] CreateReactionRequest request)
    {
        
        var dto = await _postRepository.SendReact(request);
        int author_id = 0;
        if (request.entity_type == (EntityType.POST))
            author_id = await _postRepository.GetPostAuthorId(request.entity_id);
        if(request.entity_type == (EntityType.COMMENT))
            author_id = await _commentRepository.GetCommentAuthorId(request.entity_id);
        
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
    public async Task<IActionResult> UndoReaction(int id)
    {
        await _postRepository.UndoReact(new DeleteReactionRequest(){id = id, user_id = HttpContext.GetUserId()});
        return Ok();
    }
}