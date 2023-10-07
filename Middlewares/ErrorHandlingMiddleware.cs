using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Models;

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
        catch (HttpStatusCodeException ex)
        {
            await HandleExceptionAsync(context, ex);
        }
        catch (Exception exceptionObj)
        {
            await HandleExceptionAsync(context, exceptionObj);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, HttpStatusCodeException exception)
    {
        string result = null;
        context.Response.ContentType = "application/json";
        if (exception is HttpStatusCodeException)
        {
            result = new ErrorResponse() 
            {
                Message = exception.Message,
                StatusCode = (int)exception.StatusCode 
            }.ToString();
            context.Response.StatusCode = (int)exception.StatusCode;
        }
        else
        {
            result = new ErrorResponse() 
            { 
                Message = "Runtime Error",
                StatusCode = (int)HttpStatusCode.BadRequest
            }.ToString();
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
        }
        return context.Response.WriteAsync(result);
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        string result = new ErrorResponse() 
        { 
            Message = exception.Message,
            StatusCode = (int)HttpStatusCode.InternalServerError 
        }.ToString();
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
        return context.Response.WriteAsync(result);
    }

    
}