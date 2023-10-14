namespace Qinqii.DTOs.Request.Notification;

public class GetNotificationsRequest
{
        public int user_id { get; set; }
        private const int MaxPageSize = 10;
        private const int DefaultPageSize = 5;
        private const int DefaultPage = 1;
        private int _pageSize = DefaultPageSize;
        public int page_size
        {
                get => _pageSize;
                set => _pageSize = Math.Min(value, MaxPageSize);
        }
        public int page { get; set; } = DefaultPage;



}