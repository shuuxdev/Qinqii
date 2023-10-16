using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Comment;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Enums;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Parameters;
using Qinqii.Service;
using Qinqii.Utilities;

namespace Qinqii.Controllers;
[Authorize]

public class CommentController : ControllerBase
{
    private readonly PostRepository _postRepository;
    private readonly CommentRepository _commentRepository;
    private readonly MediaService _mediaService;
    private readonly ILogger<PostController> _logger;
    private readonly IWebHostEnvironment _env;
    private readonly NotificationService _notificationService;
    private readonly IHubContext<QinqiiHub> _hubContext;    
    public CommentController(PostRepository postRepository,
        ILogger<PostController> logger, IWebHostEnvironment env,
        NotificationService notificationService,
        IHubContext<QinqiiHub> hubContext,
        CommentRepository commentRepository,
        MediaService mediaService
        )
    {
        _postRepository = postRepository;
        _logger = logger;
        _env = env;
        _notificationService = notificationService;
        _hubContext = hubContext;
        _commentRepository = commentRepository;
        _mediaService = mediaService;
    }

    [HttpPost("comment/create")]
    public async Task<IActionResult> CreateComment(
        [FromForm] CreateCommentRequest comment)
    {
        var user_id = HttpContext.GetUserId();
        if (user_id != 0 && comment.attachments != null)
            comment.attachment_links.AddRange(
                await Server.UploadAsync(comment.attachments,
                    _env.WebRootPath));
        var c = await _commentRepository.CreateComment(comment, user_id);

        var authorId = await _postRepository.GetPostAuthorId(comment.post_id);
        var parameters = new List<INotificationParameter>()
        {
            new PostIdParameter(c.post_id.ToString()),
            new CommentIdParameter(c.comment_id.ToString()),
            
        };
        await _notificationService.Notify(authorId, user_id,NotificationType.COMMENT, parameters);
        if (comment.parent_id != null)
        {
            parameters.Add(new ParentIdParameter(comment.parent_id.ToString()));
            int parentAuthorId = await _commentRepository.GetCommentAuthorId(comment.parent_id.Value);
            await _notificationService.Notify(parentAuthorId, user_id, NotificationType.REPLY, parameters);
        }
        
        return Ok(c);
    }

    [HttpPatch("comment/edit")]
    public async Task<IActionResult> EditComment([FromForm] EditCommentRequest
        comment)
    {
        // sửa [FromBody] sang [FromForm]
        // ở phần insert: cần lưu ảnh, tệp lên server trước khi lưu vào database
        comment.attachments.AddRange(comment.deleted_attachments.Select((a) => new AttachmentUpdateTVP()
        {
            attachment_id = a,
            action = "DELETE"
        }));
        if (comment.new_attachments != null)
        {
            var pathList = await Server.UploadAsync(comment.new_attachments, _env.WebRootPath);
        
            comment.attachments.AddRange(pathList.Select((path) => new AttachmentUpdateTVP()
            {
                attachment_type = "IMAGE",
                attachment_link = path,
                action = "INSERT"
            }));    
        }
        
        //if (comment.new_attachments != null)
        var c = await _commentRepository.EditComment(comment);

        return Ok(c);
    }

    [HttpDelete("comment/delete")]
    public async Task<IActionResult> DeleteComment(DeleteCommentRequest comment)
    {
        await _commentRepository.DeleteComment(comment);
        return Ok();
    }
    
    [HttpGet("comment/get")]
    public async Task<IActionResult> GetCommentsOfPost(GetCommentsOfPostRequest request)
    {
        var comments = await _commentRepository.GetCommentsByPostId(request);
        return Ok(comments);
    }
}   