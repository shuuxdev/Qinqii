public class Connection {
    public Connection(int user_id, string device, string ip_address, string connection_id)
    {
        this.connection_id = connection_id;
        this.user_id = user_id;
        this.device = device;
        this.ip_address = ip_address;
    }
    public int user_id {get;set;}
    public string device {get;set;}
    public string ip_address {get;set;}
    public string connection_id {get;set;}
}