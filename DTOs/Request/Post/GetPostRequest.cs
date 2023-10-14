using Microsoft.AspNetCore.Mvc;

public class GetPostRequest
{
    [BindProperty(Name = "id")]
    public int post_id { get; set; }
}