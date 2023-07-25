using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Qinqii.Service;
namespace Qinqii.Models
{
    // [Authorize]

    public class ChatHub : Hub
    {
        private readonly SignalRService _user;
        public ChatHub(SignalRService user)
        {
            _user = user;
        }
        public async Task SendMessage(int recipient_id, string message)
        {
            string recipient_connectionId = await _user.GetConnection(recipient_id);
            int sender_id = Context.GetHttpContext().GetUserId();
            await Clients.Caller.SendAsync("RecieveMessage", message, sender_id);
            await Clients.Client(recipient_connectionId).SendAsync("RecieveMessage", message, sender_id);
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public override async Task OnConnectedAsync()
        {
            string connection_id = Context.ConnectionId;
            string device = Context.GetHttpContext().Request.Headers.UserAgent;
            string ip_address = Context.GetHttpContext().Connection.RemoteIpAddress.ToString();
            string user_id = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userConnectionInfo = new UserConnectionInfo(
               Int32.Parse(user_id), device, ip_address, connection_id
            );
            int row_inserted = await _user.MapConnectionIdToUser(userConnectionInfo);
            await base.OnConnectedAsync();

        }
        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await base.OnDisconnectedAsync(ex);
        }
    }
}