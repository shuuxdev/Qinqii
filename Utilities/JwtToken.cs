using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Qinqii.Ultilities
{
    public static class JwtToken
    {

        //GENERIC HERE
        public static string Generate(IConfiguration config, UserProfile user)
        {
            var key = Encoding.UTF8.GetBytes(config["Jwt:Key"]);
            string issuer = config["Jwt:Issuer"];
            string audience = config["Jwt:Audience"];
            try
            {
                var tokenDescriptor = new SecurityTokenDescriptor()
                {
                    Audience = audience,
                    Issuer = issuer,
                    Subject = new ClaimsIdentity(new[]{
                        new Claim(JwtRegisteredClaimNames.Sub, user.user_id),
                        new Claim(AdditionalClaimTypes.Name, user.name),
                        new Claim(AdditionalClaimTypes.Background, user.background),
                        new Claim(AdditionalClaimTypes.Avatar, user.avatar)
                    }),
                    //HmacSha256Signature do have a definition about which algorithm it uses to encode the token in the header
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        public static string Generate(IConfiguration config, int user_id)
        {
            var key = Encoding.UTF8.GetBytes(config["Jwt:Key"]);
            string issuer = config["Jwt:Issuer"];
            string audience = config["Jwt:Audience"];
            try
            {
                var tokenDescriptor = new SecurityTokenDescriptor()
                {
                    Audience = audience,
                    Issuer = issuer,
                    Subject = new ClaimsIdentity(new[]{
                        new Claim(JwtRegisteredClaimNames.Sub, user_id.ToString()),
                    }),
                    Expires = DateTime.Now.AddMonths(1),
                    //HmacSha256Signature do have a definition about which algorithm it uses to encode the token in the header
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
