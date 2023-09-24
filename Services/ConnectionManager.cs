using System.Collections.Concurrent;
using System.Security.Authentication;

public class ConnectionManager
{

    public readonly static ConcurrentDictionary<int, string>
        Connections = new ConcurrentDictionary<int, string>();
}