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
using Qinqii.DTOs.Request.User;
using Qinqii.Utilities;

//using Qinqii.Models;

namespace Qinqii.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly UserService user;
        private readonly SignalRService signalr;
        private IWebHostEnvironment _env;
        
        
        
        public UserController(UserService userService, SignalRService signalr, IWebHostEnvironment env)
        {
            _env = env;
            this.signalr = signalr;
            user = userService;
        }
        [HttpGet]
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
        
        [HttpGet("videos-v1")]
        public async Task<IActionResult> GetUserVideos(int id)
        {
            var u = await user.GetUserVideos(id);
            return new JsonResult(u);
        }
        [HttpGet("videos")]
        public async Task<IActionResult> GetUserVideoThumbnails(int id, int page, int pageSize)
        {
            var u = await user.GetUserPostVideoThumbnails(id, page, pageSize);
            return new JsonResult(u);
        }
        [HttpGet("images-v1")]
        public async Task<IActionResult> GetUserImages(int id)
        {
            
            var u = await user.GetUserImages(id);
            return new JsonResult(u);
        }

        [HttpPost("change-avatar")]
        public async Task<IActionResult> ChangeAvatar([FromForm] ChangeAvatarRequest request)
        {
            if (request.avatar == null)
                return BadRequest();
            
            var path =await Server.UploadAsync(request.avatar, _env.WebRootPath);

            await user.ChangeAvatar(request.user_id, path);
            return Ok();
        }
        [HttpPost("change-background")]

        public async Task<IActionResult> ChangeBackground([FromForm] ChangeBackgroundRequest request)
        {
            if (request.background == null)
                return BadRequest();
            
            var path =await Server.UploadAsync(request.background, _env.WebRootPath);

            await user.ChangeBackground(request.user_id, path);
            return Ok();
        }
        [HttpGet("images")]
        public async Task<IActionResult> GetUserPostImages(int id, int page, int pageSize)
        {
            
            var u = await user.GetUserPostImages(id, page, pageSize);
            return Ok(u);
        }
        [HttpGet("posts")]
        public async Task<IActionResult> GetUserPosts(int id, int page, int pageSize)
        {
            
            var u = await user.GetUserPosts(id, page, pageSize);
            var serializedData = JsonConvert.SerializeObject(u);
            return new ContentResult()
            {
                Content = serializedData,
                ContentType = "application/json",
                StatusCode = 200
            };
        }
        [HttpGet("relationship-with-user")]
        public async Task<IActionResult> GetRelationshipOfUser(int id)
        {
            var u = await user.GetRelationship(HttpContext.GetUserId(), friend_id:id);
            return Ok(u);
        }
        
    }
}