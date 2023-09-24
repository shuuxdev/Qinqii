using Microsoft.AspNetCore.Mvc;
using Qinqii.Models.Attributes;

namespace Qinqii.DTOs.Request.Message;

public class GetMessagesRequest
{
    [ParameterName("conversation_id")]
    
    public int id { get; set; }
}