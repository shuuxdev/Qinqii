using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Qinqii.Service;

namespace Qinqii.Models
{
    // [Authorize]
    public class QinqiiHub : Hub
    {
        private readonly SignalRService _user;

        private readonly ConnectionManager _connectionManager;


        public QinqiiHub(SignalRService user, ConnectionManager connectionManager)
        {
            _user = user;
            _connectionManager = connectionManager;
        }

        
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public override async Task OnConnectedAsync()
        {
            string connection_id = Context.ConnectionId;
            string device = Context.GetHttpContext().Request.Headers.UserAgent;
            string ip_address = Context.GetHttpContext().Connection.RemoteIpAddress.ToString();
            string user_id = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userConnectionInfo = new Connection(
                Int32.Parse(user_id), device, ip_address, connection_id
            );


            _connectionManager.TryAddUserConnection(new ConnectionDTO()
            {
                connection_id =
                    connection_id,
                user_id = Int32.Parse(user_id)
            });
            await Clients.Others.SendAsync("updateOnlineStatus", user_id,
                "ONLINE");

            //int row_inserted = await _user.MapConnectionIdToUser(userConnectionInfo);
            await base.OnConnectedAsync();

        }
        public override async Task OnDisconnectedAsync(Exception ex)
        {
            string user_id = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            _connectionManager.TryRemoveUserConnection(Int32.Parse(user_id));
            Clients.Others.SendAsync("updateOnlineStatus", user_id, "OFFLINE");

            await base.OnDisconnectedAsync(ex);
        }
    }
}