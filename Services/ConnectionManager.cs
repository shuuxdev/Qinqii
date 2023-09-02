using System.Collections.Concurrent;
using System.Security.Authentication;

public class ConnectionManager
{

    public readonly static ConcurrentDictionary<int, string>
        Connections = new ConcurrentDictionary<int, string>();


    public bool TryAddUserConnection(ConnectionDTO connection)
    {
        var ok = Connections.TryAdd(connection.user_id,
            connection.connection_id);

        if (!ok) throw new AuthenticationException();
        return ok;
    }
    public bool TryRemoveUserConnection(int user_id)
    {
        var ok = Connections.TryRemove(user_id,
            out _);
        return ok;
    }
    public void TryUpdateUserConnection(ConnectionDTO connection)
    {
        Connections[connection.user_id] = connection.connection_id;
    }

    public bool TryGetConnection(int user_id, out string connection_id)
    {
        return Connections.TryGetValue(user_id, out connection_id);
    }

}