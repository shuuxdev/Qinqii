using Qinqii.Models;
using Qinqii.Models.Exceptions;

namespace Qinqii.Utilities;

public static class Server
{
    public static async Task<List<AttachmentInsertTVP>> UploadAsync(IFormFileCollection formCollection, string webRootPath)
    {
        List<AttachmentInsertTVP> tvp = new List<AttachmentInsertTVP>(); 
        foreach (IFormFile att in formCollection)
        {
            var suffix = Path.GetExtension(att.FileName);
            var name = Guid.NewGuid().ToString();
            var fileType = att.ContentType.ToLower(); 
            if(fileType.StartsWith("image"))
                tvp.Add(new AttachmentInsertTVP { url = name + suffix, type = "IMAGE" });
            if(fileType.StartsWith("video"))
                tvp.Add(new AttachmentInsertTVP { url = name + suffix, type = "VIDEO" });
            await using var fileStream =
                new FileStream(Path.Combine(webRootPath, $"assets/{name}{suffix}"), FileMode.CreateNew);
            await att.CopyToAsync(fileStream);
        }

        if (tvp.Count == 0)
            throw new NoAttachmentUploadedException();
        return tvp;
    }
    public static async Task<string> UploadAsync(IFormFile file, string webRootPath)
    {
        var name = Guid.NewGuid().ToString();
        var suffix = file.ContentType.Split("/")[1] ;
        await using var fileStream =
            new FileStream(Path.Combine(webRootPath, $"assets/{name}.{suffix}"), FileMode.CreateNew);
        await file.CopyToAsync(fileStream);
        return name + "." + suffix;
    }
    public static async Task<List<string>> UploadAsync(List<IFormFile> files, string webRootPath)
    {
        var pathList = await Task.WhenAll(files.Select(async (file) =>
        {
            var name = Guid.NewGuid().ToString();
            var suffix = file.ContentType.Split("/")[1] ;
            await using var fileStream =
                new FileStream(Path.Combine(webRootPath, $"assets/{name}.{suffix}"), FileMode.CreateNew);
            await file.CopyToAsync(fileStream);
            return name + "." + suffix;
        }));
       return pathList.ToList();
    }
}