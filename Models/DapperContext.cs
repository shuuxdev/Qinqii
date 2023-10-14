
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Qinqii.Enums;

namespace Qinqii.Models {
    public class DapperContext {
        public ILogger<DapperContext> Logger { get; }
        private readonly IConfiguration Configuration;
        private readonly IWebHostEnvironment _env;

        private string cs { get; }
        private string azure_cs { get; }

        public DapperContext(IConfiguration configuration,IWebHostEnvironment env, ILogger<DapperContext> logger)
        {
            Logger = logger;
            Configuration = configuration;
            _env = env;
            cs = configuration.GetConnectionString("Qinqii");
            azure_cs = configuration.GetConnectionString("QinqiiAzure");
            if (_env.IsProduction())
            {
                cs =
                    "Data Source=localhost;Initial Catalog=TestQinqii;User Id=shuu;Password=4zkl.cmvn2k20.sv;Encrypt=True;TrustServerCertificate=True;Pooling=false;MultipleActiveResultSets=True";
            }
            Logger.LogInformation("DapperContext.Local:  {cs}", cs);
            Logger.LogInformation("DapperContext.Azure:  {azure}", azure_cs);
        }
        public IDbConnection CreateConnection()
        {
            var connection = new SqlConnection(cs);
            connection.Open();
            return connection;
        }
        
        
    } 
}