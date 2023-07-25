
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
public static class HttpContextExtensions {
    public static int GetUserId(this HttpContext httpContext) 
    {
        string user_id  = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        return Int32.Parse(user_id);
    }
}