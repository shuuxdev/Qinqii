using System.Data;
using System.Net.Mail;
using Dapper;
using Qinqii.DTOs.Request.Attachment;
using Qinqii.Models;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class UploadService
{
    private readonly DapperContext _ctx;

    public UploadService(DapperContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IEnumerable<Attachment>> UploadAttachment
        (CreateAttachmentRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@tvp", request.attachments.ToTableValuedParameters());

        var list = await connection.QueryAsync<Attachment>(
            "[dbo].[INSERT_Attachments]",
            commandType: CommandType.StoredProcedure, param: param);
        return list;
    }
    
    
}