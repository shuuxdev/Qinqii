using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Comment;
using Qinqii.DTOs.Request.Notification;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.Attachments;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Parameters;
using Qinqii.Service;
using Qinqii.Utilities;

namespace Qinqii.Controllers;

[Authorize]
public class PostController : ControllerBase
{
    private readonly MediaService _mediaService;
    private readonly PostRepository _postRepository;
    private readonly ILogger<PostController> _logger;
    private readonly IWebHostEnvironment _env;
    private readonly NotificationService _notificationService;
    private readonly IHubContext<QinqiiHub> _hubContext;
    public PostController(PostRepository postRepository,
        ILogger<PostController> logger, IWebHostEnvironment env,
        NotificationService notificationService,
        IHubContext<QinqiiHub> hubContext,
        MediaService mediaService)

    {
        _postRepository = postRepository;
        _mediaService = mediaService;
        _logger = logger;
        _env = env;
        _notificationService = notificationService;
        _hubContext = hubContext;
    }

    [HttpGet("post")]
    public async Task<IActionResult> GetPost(GetPostRequest post)
    {
        try
        {
            var result = await _postRepository.GetPost(post);
            return Ok(result);
        }
        catch (InvalidOperationException e)
        {
            _logger.LogError(e.StackTrace);
            throw new HttpStatusCodeException(HttpStatusCode.NotFound, "Bài viết không tồn tại");
        }
    }

    [HttpPatch("post/edit")]
    public async Task<IActionResult> EditPost([FromBody] EditPostRequest post)
    {
        // sửa [FromBody] sang [FromForm]
        // ở phần insert: cần lưu ảnh, tệp lên server trước khi lưu vào database
        
        await _postRepository.EditPost(post);
        return Ok();
    }
    
    [HttpPost("post/create")]
    public async Task<IActionResult> CreatePost([FromForm] List<VideoAttachment> videos, [FromForm] List<ImageAttachment> images, CreatePostRequest request, CreatePostRequest post,CancellationToken token)
    {
        var videoAndThumbnailPathList =  await Task.WhenAll<VideoTVP>(videos.Select(async (video) =>
        {
            var videoPath = await Server.UploadAsync(video.video, _env.WebRootPath);
            var thumbnailPath = await Server.UploadAsync(video.thumbnail.image, _env.WebRootPath);
            return new VideoTVP(){video_url = videoPath, thumbnail_url = thumbnailPath};
        }));
        var imagePathList =  await Task.WhenAll<PhotoTVP>(images.Select(async (image) =>
        {
            var imagePath = await Server.UploadAsync(image.image, _env.WebRootPath);
            return new PhotoTVP(){image_url = imagePath};
        }));
        var listVideoAttIds =  await _mediaService.UploadVideoAndThumbnail(videoAndThumbnailPathList.ToList());
        var listImageAttIds =  await _mediaService.UploadImages(imagePathList.ToList());
        var attachment_ids = listVideoAttIds.Concat(listImageAttIds).Select((id) => new AttachmentIdsTVP(){attachment_id = id});
         await _postRepository.CreatePost(post, attachment_ids, token);
        
        return Ok();
    }
    [HttpPost("post/upload-attachments")]
    public async Task<IActionResult> UploadAttachments([FromForm] IFormFileCollection attachments)
    {
        var uploadedAttachments = await Server.UploadAsync(attachments, _env.WebRootPath);
        return Ok(uploadedAttachments);
    }
   
    
    [HttpDelete("post/delete")]
    public async Task<IActionResult> DeletePost(DeletePostRequest post)
    {
        var postAuthor = await _postRepository.GetPostAuthorId(post.id);
        if (postAuthor != post.user_id) throw new HttpStatusCodeException(HttpStatusCode.Forbidden, "Bạn không có quyền xóa bài viết này");
        var result = await _postRepository.DeletePost(post);
        if (result.isSucceed)
        {
            return Ok();
        }
        throw new HttpStatusCodeException(HttpStatusCode.BadRequest, "Xóa bài viết thất bại");
    }
    
    
}