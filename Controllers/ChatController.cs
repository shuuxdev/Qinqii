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
using Microsoft.VisualBasic;
using Qinqii.DTOs.Request.Contact;
using Qinqii.DTOs.Request.Message;
using Qinqii.DTOs.Response.Message;
using Qinqii.Models.Attachments;
using Qinqii.Models.Validators;
using Qinqii.Utilities;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Qinqii.Controllers;
[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly MessageRepository _messageRepository;
    private readonly MediaService _mediaService;
    private readonly IHubContext<QinqiiHub> hubContext;
    private readonly SignalRService signalr;
    private readonly UserRepository _userRepository;
    private readonly NotificationService _notificationService;
    private readonly IWebHostEnvironment _env;

    public ChatController(MessageRepository messageRepository,  MediaService _mediaService, IHubContext<QinqiiHub> _hubContext, SignalRService _signalr, UserRepository userRepository, NotificationService notificationService, IWebHostEnvironment env)
    {
        _messageRepository = messageRepository;
        this._mediaService = _mediaService;
        hubContext = _hubContext;
        signalr = _signalr;
        _notificationService = notificationService;
        _env = env;
        _notificationService = notificationService;
        _userRepository = userRepository;
    }
    [ApiExplorerSettings]
    [Authorize]
    [HttpPost("message")]
    public async Task<IActionResult> CreateMessage([FromForm] CreateMessageRequest message, [FromForm] List<VideoAttachment> videos,[FromForm]  List<ImageAttachment> images)
    {
        var validator = new CreateMessageValidator(videos, images);
        var result = await validator.ValidateAsync(message);
        if (!result.IsValid)
            throw new HttpStatusCodeException(HttpStatusCode.BadRequest, result.Errors.First().ErrorMessage);
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
        var _ = await _messageRepository.CreateMessage(message, attachment_ids);
        
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
        var contacts = await _userRepository.GetContacts(request);
        contacts.ToList().ForEach( contact =>
        {
            contact.online_status = ConnectionManager.Connections.TryGetValue(contact.recipient_id, out _)
                ? "ONLINE"
                : "OFFLINE";
        }); 
        string json = JsonConvert.SerializeObject(contacts);
        return new ContentResult()
        {
            Content = json,
            ContentType = "application/json",
            StatusCode = (int)HttpStatusCode.OK
        };
    }

    [Authorize]
    [HttpGet("load-by-conversation-id")]
    public async Task<IActionResult> LoadConversationByConversationId([FromQuery] GetMessagesRequest 
    request)
    {
        var messages = await _messageRepository.GetMessages(request);
        var json = JsonConvert.SerializeObject(messages);
        return new ContentResult()
        {
            Content = json,
            ContentType = "application/json",
            StatusCode = (int)HttpStatusCode.OK
        };
    }
    
    [Authorize]
    [HttpGet("load-by-user-id")]
    public async Task<IActionResult> LoadConversationByUserId(int recipient_id)
    {
        int user_id = HttpContext.GetUserId();
        var conversation_id = await _messageRepository.GetConversationIdWithUser(user_id, recipient_id);
        var conversation = await _userRepository.GetContact(user_id, conversation_id);
        var messages = await _messageRepository.GetMessages(new GetMessagesRequest(){id = conversation_id});
        conversation.messages = messages;
        var json = JsonConvert.SerializeObject(conversation);
        return new ContentResult()
        {
            Content = json,
            ContentType = "application/json",
            StatusCode = (int)HttpStatusCode.OK
        };
    }
    
    [HttpDelete("message")]
    public async Task<IActionResult> DeleteMessage(int message_id)
    {
        int user_id = HttpContext.GetUserId();
        await _messageRepository.DeleteMessage(user_id, message_id);
        return Ok();
    }
    [HttpPost("mark-as-read")]
    public async Task<IActionResult> MarkMessageAsRead([FromBody] MarkMessagesAsReadRequest request)
    {
        await _messageRepository.MarkMessageAsRead(request);
        return Ok();
    }
    
}