using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
using Qinqii.Models.Paging;
using Qinqii.Utilities;

//using Qinqii.Models;

namespace Qinqii.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository user;
        private readonly SignalRService signalr;
        private IWebHostEnvironment _env;
        
        
        
        public UserController(UserRepository userRepository, SignalRService signalr, IWebHostEnvironment env)
        {
            _env = env;
            this.signalr = signalr;
            user = userRepository;
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

        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileRequest request)
        {
            string avatarPath = null;
             string backgroundPath = null;
            if(request.avatar != null)          
                avatarPath =await Server.UploadAsync(request.avatar, _env.WebRootPath);
            if(request.background != null)
                 backgroundPath = await Server.UploadAsync(request.background, _env.WebRootPath);

              var result =  await user.UpdateProfile(new UserProfile()
            {
                user_id = request.user_id,
                avatar = avatarPath,
                background = backgroundPath,
                name = request.name
            });
              if (result.isSucceed)
                  throw new HttpStatusCodeException(HttpStatusCode.BadRequest, "Cập nhật profile thất bại");
              return Ok();
        }

       
        [HttpGet("images")]
        public async Task<IActionResult> GetUserPostImages(int user_id, int page, int pageSize)
        {
            var u = await user.GetUserPostImages(user_id, page, pageSize);
            return Ok(u);
        }
        [HttpGet("posts")]
        public async Task<IActionResult> GetUserPosts(int user_id,int page, int pageSize)
        {
            
            var u = await user.GetUserPosts(user_id, new Page()
            {
                PageNumber = page,
                PageSize = pageSize
            });
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
            var u = await user.GetRelationship(HttpContext.GetUserId(), id);
            return Ok(u);
        }
        
    }
}