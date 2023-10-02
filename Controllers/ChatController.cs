using System.Diagnostics;
using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Qinqii.Models;
using Qinqii.Service;
using Qinqii.Ultilities;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Contact;
using Qinqii.DTOs.Request.Message;
using Qinqii.DTOs.Response.Message;
using Qinqii.Models.Attachments;
using Qinqii.Utilities;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Qinqii.Controllers;
[ApiExplorerSettings(GroupName = "v2")]
[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly MessageService _messageService;
    private readonly MediaService _mediaService;
    private readonly IHubContext<QinqiiHub> hubContext;
    private readonly SignalRService signalr;
    private readonly UserService _userService;
    private readonly NotificationService _notificationService;
    private readonly IWebHostEnvironment _env;

    public ChatController(MessageService messageService,  MediaService _mediaService, IHubContext<QinqiiHub> _hubContext, SignalRService _signalr, UserService userService, NotificationService notificationService, IWebHostEnvironment env)
    {
        _messageService = messageService;
        this._mediaService = _mediaService;
        hubContext = _hubContext;
        signalr = _signalr;
        _notificationService = notificationService;
        _env = env;
        _notificationService = notificationService;
        _userService = userService;
    }
    [ApiExplorerSettings]
    [Authorize]
    [HttpPost("message")]
    public async Task<IActionResult> CreateMessage([FromForm] CreateMessageRequest message, [FromForm] List<VideoAttachment> videos,[FromForm]  List<ImageAttachment> images)
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
        var _ = await _messageService.CreateMessage(message, attachment_ids);
        
        CreateMessageResponse  responseMessage = new CreateMessageResponse()
        {
            message_text = _.message_text,
            sender_id = _.sender_id,
            conversation_id = _.conversation_id,
            sent_at = _.sent_at,
            recipient_id = _.recipient_id,
            message_id = _.message_id,
            reactions = _.reactions,
            attachments = _.attachments
        };
        //workaround, because system.text.json cannot serialize derived class
        //client must parse json to object 
        var json = JsonConvert.SerializeObject(responseMessage);
        await hubContext.Clients.User(message.sender_id.ToString()).SendAsync
        ("RecieveMessage", 
            json);
        await hubContext.Clients.User(message.recipient_id.ToString()).SendAsync
        ("RecieveMessage", 
            json);
        
        
        return Ok();
    }

    [Authorize]
    [HttpGet("all")]
    public async Task<IActionResult> LoadAllConversations()
    {
        var request = new GetContactsRequest()
        {
            user_id = HttpContext.GetUserId()
        };
        var contacts = await _userService.GetContacts(request);
        contacts.ToList().ForEach( contact =>
        {
            contact.online_status = ConnectionManager.Connections.TryGetValue(contact.recipient_id, out _)
                ? OnlineStatus.ONLINE
                : OnlineStatus.OFFLINE;
        });
        return Ok(contacts);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> LoadConversation([FromQuery] GetMessagesRequest 
    request)
    {
        var messages = await _messageService.GetMessages(request);
        var json = JsonConvert.SerializeObject(messages);
        return new ContentResult()
        {
            Content = json,
            ContentType = "application/json",
            StatusCode = (int)HttpStatusCode.OK
        };
    }
    
    [HttpDelete]
    public async Task<IActionResult> DeleteMessage(int message_id)
    {
        await _userService.DeleteMessage(message_id);
        return Ok();
    }
    [HttpPost("mark-as-read")]
    public async Task<IActionResult> MarkMessageAsRead([FromBody] MarkMessagesAsReadRequest request)
    {
        await _messageService.MarkMessageAsRead(request);
        return Ok();
    }
}