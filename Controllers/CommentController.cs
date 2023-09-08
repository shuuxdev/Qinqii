using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Comment;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Parameters;
using Qinqii.Service;
using Qinqii.Utilities;

namespace Qinqii.Controllers;

public class CommentController : ControllerBase
{
    private readonly PostService _postService;
    private readonly CommentService _commentService;
    private readonly ILogger<PostController> _logger;
    private readonly IWebHostEnvironment _env;
    private readonly NotificationService _notificationService;
    private readonly IHubContext<QinqiiHub> _hubContext;
    public CommentController(PostService postService,
        ILogger<PostController> logger, IWebHostEnvironment env,
        NotificationService notificationService,
        IHubContext<QinqiiHub> hubContext,
        CommentService commentService
        
        )
    {
        _postService = postService;
        _logger = logger;
        _env = env;
        _notificationService = notificationService;
        _hubContext = hubContext;
        _commentService = commentService;
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
        var c = await _commentService.CreateComment(comment, user_id);

        var authorId = await _postService.GetPostAuthorId(comment.post_id);
        var parameters = new List<INotificationParameter>()
        {
            new PostIdParameter(c.post_id.ToString()),
            new CommentIdParameter(c.comment_id.ToString()),
            new ContentParameter(comment.content)
        };
        
        await _notificationService.Notify(authorId, user_id,NotificationType.COMMENT, parameters);
        return Ok(c);
    }

    [HttpPatch("comment/edit")]
    public async Task<IActionResult> EditComment([FromBody] EditCommentRequest
        comment)
    {
        // sửa [FromBody] sang [FromForm]
        // ở phần insert: cần lưu ảnh, tệp lên server trước khi lưu vào database
        
        var c = await _commentService.EditComment(comment);

        return Ok(c);
    }

    [HttpDelete("comment/delete")]
    public async Task<IActionResult> DeleteComment(DeleteCommentRequest comment)
    {
        await _commentService.DeleteComment(comment);
        return Ok();
    }
}