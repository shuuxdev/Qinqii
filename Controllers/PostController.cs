using Microsoft.AspNetCore.Authorization;
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

[Authorize]
public class PostController : ControllerBase
{
    private readonly PostService _postService;
    private readonly ILogger<PostController> _logger;
    private readonly IWebHostEnvironment _env;
    private readonly NotificationService _notificationService;
    private readonly IHubContext<QinqiiHub> _hubContext;
    public PostController(PostService postService,
        ILogger<PostController> logger, IWebHostEnvironment env,
        NotificationService notificationService,
        IHubContext<QinqiiHub> hubContext)
    {
        _postService = postService;
        _logger = logger;
        _env = env;
        _notificationService = notificationService;
        _hubContext = hubContext;
    }

   

    [HttpPatch("post/edit")]
    public async Task<IActionResult> EditPost([FromBody] EditPostRequest post)
    {
        // sửa [FromBody] sang [FromForm]
        // ở phần insert: cần lưu ảnh, tệp lên server trước khi lưu vào database
        
        await _postService.EditPost(post);
        return Ok();
    }
    
    [HttpPost("post/create")]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostRequest 
    post, CancellationToken token)
    {
        if (post.attachments != null)
            post.attachment_links.AddRange(
                await Server.UploadAsync(post.attachments, _env.WebRootPath));
            await _postService.CreatePost(post, token);

        return Ok();
    }

    [HttpDelete("post/delete")]
    public async Task<IActionResult> DeletePost(DeletePostRequest post)
    {
        await _postService.DeletePost(post);
        return Ok();
    }
}