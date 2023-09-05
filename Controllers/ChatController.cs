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

namespace Qinqii.Controllers;
[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly MessageService _messageService;
    private readonly IHubContext<QinqiiHub> hubContext;
    private readonly SignalRService signalr;

    public ChatController(MessageService messageService, IHubContext<QinqiiHub> _hubContext, SignalRService _signalr)
    {
        _messageService = messageService;
        hubContext = _hubContext;
        signalr = _signalr;
    }
    
    [Authorize]
    [HttpPost("message")]
    public async Task<IActionResult> CreateMessage([FromBody] 
    CreateMessageRequest message)
    {
        var msg = await _messageService.CreateMessage(message);
        await hubContext.Clients.User(message.sender_id.ToString()).SendAsync
        ("RecieveMessage", 
        message);
        await hubContext.Clients.User(message.recipient_id.ToString()).SendAsync
        ("RecieveMessage", 
        message);
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
        var conversations = await _messageService.GetContacts(request);
        return Ok(conversations);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> LoadConversation(GetMessagesRequest 
    request)
    {
        var messages = await _messageService.GetMessages(request);
        return new JsonResult(messages);
    }

}