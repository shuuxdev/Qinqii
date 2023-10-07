using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Qinqii.Models;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}