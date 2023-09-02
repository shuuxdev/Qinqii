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

namespace Qinqii.Controllers;
[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly MessageService msg;
    private readonly IHubContext<QinqiiHub> hubContext;
    private readonly SignalRService signalr;

    public ChatController(MessageService _msg, IHubContext<QinqiiHub> _hubContext, SignalRService _signalr)
    {
        msg = _msg;
        hubContext = _hubContext;
        signalr = _signalr;
    }

    [Authorize]
    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] Message message)
    {
        var msg_id = await msg.SendMessage(message);
        message.message_id = msg_id;
        message.sent_at = DateTime.Now;
        string recipient_connection_id = await signalr.GetConnection(message.recipient_id);
        string sender_connection_id = await signalr.GetConnection(message.sender_id);
        await hubContext.Clients.Client(sender_connection_id).SendAsync("RecieveMessage", message);
        await hubContext.Clients.Client(recipient_connection_id).SendAsync("RecieveMessage", message);
        return Ok();
    }

    [Authorize]
    [HttpGet("all")]
    public async Task<IActionResult> LoadAllConversations()
    {
        int user_id = HttpContext.GetUserId();
        var conversations = await msg.GetContacts(user_id);
        return new JsonResult(conversations);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> LoadConversation(int id)
    {
        var messages = await msg.GetMessages(id);
        return new JsonResult(messages);
    }

}