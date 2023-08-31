using System.Data;
using System.Net.Mail;
using Dapper;
using Qinqii.Models;
using Qinqii.Models.Attachment;
using Qinqii.Models.Post;

namespace Qinqii.Service;

public class UploadService
{
    private readonly DapperContext _ctx;

    public UploadService(DapperContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IEnumerable<AttachmentDTO>> UploadAttachment
        (List<AttachmentTVP> attachments)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        using var dt = new DataTable();
        dt.Columns.Add("url");
        dt.Columns.Add("type");
        attachments.ForEach((att) => { dt.Rows.Add(att.url, att.type); });
        param.Add("@tvp", dt.AsTableValuedParameter());

        var list = await connection.QueryAsync<AttachmentDTO>(
            "[dbo].[INSERT_Attachments]",
            commandType: CommandType.StoredProcedure, param: param);
        return list;
    }
    
    
}