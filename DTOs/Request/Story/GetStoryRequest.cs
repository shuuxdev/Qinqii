using Microsoft.AspNetCore.Mvc;

namespace Qinqii.DTOs.Request.Story;

public class GetStoryRequest
{
    [BindProperty(Name = "id")]
    public int story_id { get; set; }
}