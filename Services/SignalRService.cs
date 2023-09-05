using System.Data;
using Dapper;
using Qinqii.Models;
namespace Qinqii.Service
{
    public class SignalRService
    {
        private readonly DapperContext _ctx;
        public SignalRService(DapperContext ctx)
        {
            _ctx = ctx;
        }
       
    }
}