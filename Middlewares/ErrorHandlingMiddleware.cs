using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Qinqii.Middlewares;

public class ErrorHandlingMiddleware : IMiddleware
{
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware( ILogger<ErrorHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch(Exception e)
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            ProblemDetails details = new ProblemDetails()
            {
                Status = (int)HttpStatusCode.Forbidden,
                Title = e.Message
            };
            _logger.LogError(e.Message);
            string json =  JsonSerializer.Serialize(details);
            context.Response.WriteAsync(json);
        }
    }
}