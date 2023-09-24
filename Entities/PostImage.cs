using System.Text.Json.Serialization;

namespace Qinqii.Models;

public class PostImage
{
        public int post_id { get; set; }
        public int attachment_id { get; set; }
        public string attachment_link { get; set; }
        public int reactions { get; set; }
        public int comments { get; set; }
}