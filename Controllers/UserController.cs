using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Models;
using Qinqii.Service;
using Newtonsoft.Json;
using System.Net.Http;
using Qinqii.Ultilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

//using Qinqii.Models;

namespace Qinqii.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly UserService user;
        private readonly SignalRService signalr;
        public UserController(UserService userService, SignalRService signalr)
        {
            this.signalr = signalr;
            user = userService;
        }

        public async Task<IActionResult> GetProfile(int id)
        {
            var user_profile = await user.GetProfile(id);
            return Ok(user_profile);
        }

        [HttpGet("profile")]
            public async Task<IActionResult> GetMyProfile()
        {
            var id = HttpContext.GetUserId();
            var user_profile = await user.GetProfile(id);
            return Ok(user_profile);
        }

        [HttpGet("connection")]
        public async Task<IActionResult> GetUserConnectionId()
        {
            var user_id = HttpContext.GetUserId();
            var u = await signalr.GetConnection((user_id));
            return new JsonResult(u);
        }
        [HttpGet("friends")]
        public async Task<IActionResult> GetUserFriends(int id)
        {
            var u = await user.GetFriends(id);
            return new JsonResult(u);
        }
        [HttpGet("videos")]
        public async Task<IActionResult> GetUserVideos(int id)
        {
            var u = await user.GetUserVideos(id);
            return new JsonResult(u);
        }
        [HttpGet("images")]
        public async Task<IActionResult> GetUserImages(int id)
        {
            
            var u = await user.GetUserImages(id);
            return new JsonResult(u);
        }
        [HttpGet("posts")]
        public async Task<IActionResult> GetUserPosts(int id)
        {
            
            var u = await user.GetUserPosts(id);
            return new JsonResult(u);
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("friend-requests")]
        public async Task<IActionResult> GetUserIncomingFriendRequests()
        {
            int user_id = HttpContext.GetUserId();
            var u = await user.GetFriendRequests(user_id);
            return Ok(u);
        }
        [HttpPatch("update-friend-status")]
        public async Task<IActionResult> UpdateFriendStatus(FriendStatusAction friendStatus)
        {
            int user_id = HttpContext.GetUserId();
            var u = await user.UpdateFriendStatus(friendStatus);
            return new JsonResult(u);
        }
    }
}