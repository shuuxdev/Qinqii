using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Qinqii.DTOs.Request.Contact;
using Qinqii.Service;

namespace Qinqii.Models
{
     [Authorize]
    public class QinqiiHub : Hub
    {

        private readonly ConnectionManager _connectionManager;
        private readonly UserRepository _userRepository;

        
        
        public QinqiiHub( ConnectionManager connectionManager, UserRepository userRepository)
        {
            _connectionManager = connectionManager;
            _userRepository = userRepository;
        }
        
        public async Task SendIceCandidate(string candidate, int caller_id, int callee_id)
        {
            if(Context.GetHttpContext().GetUserId() == caller_id)
                await Clients.User(callee_id.ToString()).SendAsync("ReceiveIceCandidate",  candidate);
            else
                await Clients.User(caller_id.ToString()).SendAsync("ReceiveIceCandidate",  candidate);
        }
        public async Task SendOffer(string sdp, int user_id)
        {
            var profile = await _userRepository.GetProfile(user_id);
            await Clients.User(user_id.ToString()).SendAsync("ReceiveOffer", sdp,
                new {caller_id = Context.GetHttpContext().GetUserId(), callee_id = user_id ,profile.name, profile.avatar});
        }
        public async Task SendAnswer(string sdp, int user_id) 
        {
             await Clients.User(user_id.ToString()).SendAsync("ReceiveAnswer",  sdp);
        }
        public async Task EndCall(int user1, int user2)
        {
            if(Context.GetHttpContext().GetUserId() == user1)
                await Clients.User(user2.ToString()).SendAsync("ReceiveEndCall");
            else
                await Clients.User(user1.ToString()).SendAsync("ReceiveEndCall");

        }
        
      //  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public override async Task OnConnectedAsync()
        {
            var user_id = Context.GetHttpContext().GetUserId();
            var contacts = await _userRepository.GetContacts(new GetContactsRequest(){user_id = user_id});
            
            bool ok  = ConnectionManager.Connections.TryAdd(user_id, Context.ConnectionId);
            if (!ok) throw new ConnectionAbortedException("Connection already exists");
            
            contacts.ToList().ForEach(async contact =>
            {
                await Clients.User(contact.recipient_id.ToString()).SendAsync("updateOnlineStatus", user_id,
                    "ONLINE");
            });
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var user_id = Context.GetHttpContext().GetUserId();
            
            var contacts = await _userRepository.GetContacts(new GetContactsRequest(){user_id = user_id});
            contacts.ToList().ForEach(async contact =>
            {
                await Clients.User(contact.recipient_id.ToString()).SendAsync("updateOnlineStatus", user_id,
                    "OFFLINE");
            });
            bool ok = ConnectionManager.Connections.TryRemove(user_id, out _);
            if(!ok) throw new ConnectionAbortedException("Connection does not exist");
            await base.OnDisconnectedAsync(ex);
        }
    }
}