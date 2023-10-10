using System.Net;
using Newtonsoft.Json.Linq;
using Qinqii.Models;

namespace Qinqii.Service;

public class EmailConflictException : HttpStatusCodeException
{
    public EmailConflictException() : base(HttpStatusCode.Conflict, "Email đã tồn tại")
    {
    }
    public EmailConflictException(HttpStatusCode statusCode) : base(statusCode)
    {
    }

    public EmailConflictException(HttpStatusCode statusCode, string message) : base(statusCode, message)
    {
    }

    public EmailConflictException(HttpStatusCode statusCode, Exception inner) : base(statusCode, inner)
    {
    }

    public EmailConflictException(HttpStatusCode statusCode, JObject errorObject) : base(statusCode, errorObject)
    {
    }
}