
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.Enums;

namespace Qinqii.Models {
    public class DapperContext {
        public ILogger<DapperContext> Logger { get; }
        private readonly IConfiguration Configuration;

        private string cs { get; }
        private string azure_cs { get; }

        public DapperContext(IConfiguration configuration, ILogger<DapperContext> logger)
        {
            Logger = logger;
            
            Configuration = configuration;
            cs = configuration.GetConnectionString("Qinqii");
            azure_cs = configuration.GetConnectionString("QinqiiAzure");
            
            Logger.LogInformation("DapperContext.Local:  {cs}", cs);
            Logger.LogInformation("DapperContext.Azure:  {azure}", azure_cs);
        }
        public IDbConnection CreateConnection()
        {
            var connection = new SqlConnection(azure_cs);
            connection.Open();
            return connection;
        }
        
        
    } 
}