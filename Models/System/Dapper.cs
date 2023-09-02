
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
namespace Qinqii.Models {
    public class DapperContext {
        private readonly IConfiguration Configuration;

        private string cs { get; }

        public DapperContext(IConfiguration configuration)
        {
            Configuration = configuration;
            cs = configuration.GetConnectionString("Qinqii");
        }
        public IDbConnection CreateConnection()
        {
            var connection = new SqlConnection(cs);
            connection.Open();
            return connection;
        }
    } 
}