using System.Collections.Concurrent;
using System.Security.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Qinqii.Service;

class ConnectionDTO
{
    public int user_id { get; set; }
    public string connection_id { get; set; }
}
namespace Qinqii.Models
{
    // [Authorize]

    public class ChatHub : Hub
    {
        private readonly SignalRService _user;
        private  readonly static ConcurrentDictionary<int, string> 
        Connections = new ConcurrentDictionary<int, string>();


        private bool TryAddUserConnection(ConnectionDTO connection)
        {
                var ok = Connections.TryAdd(connection.user_id,
                    connection.connection_id);

                if (!ok) throw new AuthenticationException();
            return ok;
        } 
        private bool TryRemoveUserConnection(int user_id)
        {
            var ok = Connections.TryRemove(user_id,
                out _); 
            return ok;
        }  
        private void  TryUpdateUserConnection(ConnectionDTO connection)
        {
            Connections[connection.user_id] = connection.connection_id;
        }  
        
        public ChatHub(SignalRService user)
        {
            _user = user;
        }

        public async Task SendSDP(string SDP, int target_id, string 
        offer_type, UserDisplayDTO user)
        {
            string connectionId;
            bool exist = Connections.TryGetValue(target_id, out connectionId);
            string result = SDP;
            bool err = false;
            if (!exist)
            {
                err = true;
                result = "User hiện không hoạt động";
            }
            await Clients.Client(connectionId).SendAsync("ReceiveSDP", 
            result, err, offer_type, user.name, user.avatar);
            
            
        }

        public async Task SendCandidates(string candidates, int target_id)
        {
            string connectionId;
            bool exist = Connections.TryGetValue(target_id, out connectionId);
            if (!exist)
            {
                throw new ConnectionNotFoundException();
            }
            await Clients.Client(connectionId).SendAsync("candidates", 
                candidates);
            
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

            
            TryAddUserConnection(new ConnectionDTO()
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

            TryRemoveUserConnection(Int32.Parse(user_id));
            Clients.Others.SendAsync("updateOnlineStatus", user_id, "OFFLINE");

            await base.OnDisconnectedAsync(ex);
        }
    }
}