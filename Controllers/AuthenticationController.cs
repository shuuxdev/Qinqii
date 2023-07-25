using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Service;
using Qinqii.Ultilities;

namespace Qinqii.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserService userService;
        private readonly AuthService authService;
        private readonly IConfiguration config;

        public AuthenticationController(AuthService _authService, UserService _userService, IConfiguration _config)
        {
            this.authService = _authService;
            this.userService = _userService;
            this.config = _config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin u)
        {
            int user_id = await authService.Login(u.username, u.password);
            if (user_id == 0) return Unauthorized();
            List<Claim> claim = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user_id.ToString())
            };
            ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claim, CookieAuthenticationDefaults.AuthenticationScheme);
            try
            {
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest("Sign-in failed" + ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest("Sign-in failed" + ex.Message);
            }

            return Ok();
        }

        [HttpPost("login_jwt")]
        public async Task<IActionResult> LoginJwt([FromBody] UserLogin u)
        {
            try
            {
                int user_id = await authService.Login(u.username, u.password);
                if (user_id == 0) return Unauthorized();
                var token = JwtToken.Generate(config, user_id);
                Response.Cookies.Append(AdditionalClaimTypes.Token, token);
                return Ok();
            }
            catch (InvalidOperationException e)
            {
                var message = e.Message == "Sequence contains no elements" ? "Đăng nhập không thành công" : "Error";
                return Unauthorized(message);
            }
        }
    }
}