public class NotificationDTO
{
    public int user_id { get; set; }
    public int actor_id { get; set; }
    
    public string notification_type { get; set; }

    public List<NotificationParamDTO> paramDTOs { get; set; } = new();


}