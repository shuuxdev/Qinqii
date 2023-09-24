namespace Qinqii.Models;

//this one is used for getting user videos
//only display out the thumbnail
public class PostVideoThumbnail
{
    public int post_id { get; set; }
    public int attachment_id { get; set; }
    public string attachment_link { get; set; }
    public string thumbnail { get; set; }
    public int reactions { get; set; }
    public int comments { get; set; }
}