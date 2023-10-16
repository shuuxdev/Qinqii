
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Story;
using Qinqii.Models;
using Qinqii.Models.Attachments;
using Qinqii.Service;
using Qinqii.Utilities;

namespace Qinqii.Controllers;
[Route("story")]
[Authorize]
public class StoryController : ControllerBase
{
    private readonly IHubContext<QinqiiHub> _hubContext;
    private readonly StoryRepository _storyRepository;
    private readonly IWebHostEnvironment _env;
    private readonly MediaService _mediaService;

    public StoryController(IHubContext<QinqiiHub> hubContext, StoryRepository storyRepository, IWebHostEnvironment env, MediaService mediaService)
    {
        _hubContext = hubContext;
        this._storyRepository = storyRepository;
        _env = env;
        _mediaService = mediaService;
    }
    [HttpGet]
    public async Task<IActionResult> GetStory(GetStoryRequest request)
    {
        var story = await _storyRepository.GetStory(request);
        return Ok(story);
    }
    [HttpPost("update-viewer")]
    public async Task<IActionResult> UpdateViewer(int id)
    {
        var user_id = HttpContext.GetUserId();
        await _storyRepository.UpdateStoryViewerCount(new UpdateStoryViewerCountRequest
        {
            user_id = user_id,
            story_id = id
        });
        return Ok();
    }
    [HttpPost("create")]
    public async Task<IActionResult> CreateStory([FromForm]CreateStoryRequest request, [FromForm] List<ImageAttachment> images, [FromForm] List<VideoAttachment> videos)
    {

        if (images.Count == 0 && videos.Count == 0)
            throw new HttpStatusCodeException(HttpStatusCode.BadRequest, "Phải có thêm ít nhất 1 ảnh hoặc video đính kèm");
        
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

        if (videoAndThumbnailPathList.Length == 0 && imagePathList.Length == 0)
            throw new HttpStatusCodeException(HttpStatusCode.InternalServerError, "Đăng ảnh hoặc video lên server thất bại, liên hệ admin để fix");
        
        var listVideoAttIds =  await _mediaService.UploadVideoAndThumbnail(videoAndThumbnailPathList.ToList());
        var listImageAttIds =  await _mediaService.UploadImages(imagePathList.ToList());
        
        if(listVideoAttIds.Count() == 0 && listImageAttIds.Count() == 0)
            throw new HttpStatusCodeException(HttpStatusCode.InternalServerError, "Đăng ảnh hoặc video lên server thất bại, liên hệ admin để fix");
        
        var attachment_ids = listVideoAttIds.Concat(listImageAttIds).Select((id) => new AttachmentIdsTVP(){attachment_id = id});
        var firstVideo = videoAndThumbnailPathList.FirstOrDefault()?.thumbnail_url;
        var firstImage = imagePathList.FirstOrDefault()?.image_url;
        request.thumbnail = firstVideo ?? firstImage;
        var result = await _storyRepository.CreateStory(request, attachment_ids);
        if (result.isSucceed)
        {
            int story_id = result.data;
            var story = await _storyRepository.GetStory(new GetStoryRequest(){story_id = story_id});
            _hubContext.Clients.All.SendAsync("ReceiveStory",story);
            return Ok();
        }
        throw new HttpStatusCodeException(HttpStatusCode.InternalServerError, "Update story không thành công");
    }
}
