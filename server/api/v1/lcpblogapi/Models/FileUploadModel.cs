
namespace lcpblogapi.Models;
public class FileUploadModel
{
    public IFormFile FileDetails { get; set; } = null!;
    public string? FileType { get; set; }
}