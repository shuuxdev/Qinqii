using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Models;
using Qinqii.Models.Comment;
using Qinqii.Models.Post;
using Qinqii.Models.Reaction;
using Qinqii.Service;
using Qinqii.Utilities;

namespace Qinqii.Controllers;

[Authorize]
[ApiController]
public class PostController : ControllerBase
{
    private readonly PostService _postService;
    private readonly ILogger<PostController> _logger;
    private readonly IWebHostEnvironment _env;

    public PostController(PostService postService,
        ILogger<PostController> logger, IWebHostEnvironment env)
    {
        _postService = postService;
        _logger = logger;
        _env = env;
    }

    [HttpPost("comment/create")]
    public async Task<IActionResult> CreateComment(
        [FromForm] CreateCommentDTO comment)
    {
        var user_id = HttpContext.GetUserId();
        if (user_id != 0 && comment.attachments != null)
            comment.attachment_links.AddRange(
                await Server.UploadAsync(comment.attachments,
                    _env.WebRootPath));
        var c = await _postService.CreateComment(comment, user_id);
        return Ok(c);
    }

    [HttpPatch("comment/edit")]
    public async Task<IActionResult> EditComment([FromBody] EditCommentDTO
        comment)
    {
        // sửa [FromBody] sang [FromForm]
        // ở phần insert: cần lưu ảnh, tệp lên server trước khi lưu vào database
        var user_id = HttpContext.GetUserId();
        var c = await _postService.EditComment(comment, user_id);

        return Ok(c);
    }

    [HttpDelete("comment/delete")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var user_id = HttpContext.GetUserId();
        await _postService.DeleteComment(id, user_id);
        return Ok();
    }

    [HttpPatch("post/edit")]
    public async Task<IActionResult> EditPost([FromBody] EditPostDTO post)
    {
        // sửa [FromBody] sang [FromForm]
        // ở phần insert: cần lưu ảnh, tệp lên server trước khi lưu vào database
        var user_id = HttpContext.GetUserId();
        await _postService.EditPost(post, user_id);
        return Ok();
    }

    [HttpPost("post/create")]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostDTO post)
    {
        post.author = HttpContext.GetUserId();
        if (post.attachments != null && post.author != 0)
            post.attachment_links.AddRange(
                await Server.UploadAsync(post.attachments, _env.WebRootPath));
        await _postService.CreatePost(post);

        return Ok();
    }

    [HttpDelete("post/delete")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var user_id = HttpContext.GetUserId();
        await _postService.DeletePost(id, user_id);
        return Ok();
    }
}