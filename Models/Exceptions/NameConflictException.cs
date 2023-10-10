using System.Net;
using Newtonsoft.Json.Linq;
using Qinqii.Models;

namespace Qinqii.Service;

public class NameConflictException : HttpStatusCodeException
{
    public NameConflictException() : base(HttpStatusCode.Conflict, "Tên hiển thị đã tồn tại")
    {
    }
    public NameConflictException(HttpStatusCode statusCode) : base(statusCode)
    {
    }

    public NameConflictException(HttpStatusCode statusCode, string message) : base(statusCode, message)
    {
    }

    public NameConflictException(HttpStatusCode statusCode, Exception inner) : base(statusCode, inner)
    {
    }

    public NameConflictException(HttpStatusCode statusCode, JObject errorObject) : base(statusCode, errorObject)
    {
    }
}