


public class EditPostRequest
{
    public string? content { get; set; }
    public List<AttachmentUpdateTVP> attachments { get; set; }
    public int post_id { get; set; }
    
    public int user_id { get; set; }
}