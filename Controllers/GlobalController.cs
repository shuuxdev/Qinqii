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
public class GlobalController : ControllerBase
{
    private readonly PostRepository _postRepository;
    private readonly NotificationService _notificationService;
    private readonly MessageRepository _messageRepository;
    private readonly IHubContext<QinqiiHub> _hubContext;
    private CommentRepository _commentRepository;
    private readonly ILogger<GlobalController> _logger;

    public GlobalController(PostRepository postRepository, NotificationService 
    notificationService, MessageRepository messageRepository,  IHubContext<QinqiiHub> hubContext, CommentRepository commentRepository,
        ILogger<GlobalController> logger)
    {
        
        _postRepository = postRepository;
        _notificationService = notificationService;
        _messageRepository = messageRepository;
        _hubContext = hubContext;
        _commentRepository = commentRepository;
        _logger = logger;
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
            _ =>  null
        };
    
        if (parameters != null)
        {
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
        }

        if (request.entity_type == EntityType.MESSAGE)
        {
            int message_sender_id = await _messageRepository.GetMessageSenderIdByMessageId(request.entity_id); 
            int message_recipient_id = await _messageRepository.GetMessageRecipientIdByMessageId(request.entity_id);
            var reaction_payload = new
            {
                id = dto.reaction_id,
                message_id = dto.entity_id,
                reactor_name = dto.reactor_name,
                reactor_id = dto.reactor_id,
                reactor_avatar = dto.reactor_avatar, 
                created_at = dto.created_at,
                emoji = request.emoji
            };
            _logger.LogCritical("message_sender_id: " + message_sender_id);
            _logger.LogCritical("message_recipient_id: " + message_recipient_id);
            await _hubContext.Clients.User(message_sender_id.ToString()).SendAsync("ReceiveReaction", reaction_payload);
            await _hubContext.Clients.User(message_recipient_id.ToString()).SendAsync("ReceiveReaction", reaction_payload);
        }
        return Ok(dto);
    }
    

    [HttpDelete("undo-react")]
    public async Task<IActionResult> UndoReaction(DeleteReactionRequest request)
    {
        if (request.entity_type == EntityType.MESSAGE)
        {
            int message_id = await _messageRepository.GetMessageIdByReactionId(request.id);
            if (message_id != 0)
            {
                int message_sender_id = await _messageRepository.GetMessageSenderIdByMessageId(message_id); 
                int message_recipient_id = await _messageRepository.GetMessageRecipientIdByMessageId(message_id);

                var payload = new
                {
                    id = request.id,
                    message_id = message_id
                };
            
       
                await _hubContext.Clients.User(message_sender_id.ToString()).SendAsync("ReceiveUndoReaction", payload);
                await _hubContext.Clients.User(message_recipient_id.ToString()).SendAsync("ReceiveUndoReaction", payload);
            }
        }
        await _postRepository.UndoReact(new DeleteReactionRequest(){id = request.id, user_id = HttpContext.GetUserId()});
        return Ok();
    }
    [HttpDelete("undo-react-test")]
    public async Task<IActionResult> Test(DeleteReactionRequest request)
    {
     
        return Ok();
    }
    
}