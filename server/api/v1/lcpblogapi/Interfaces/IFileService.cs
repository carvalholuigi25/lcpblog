using lcpblogapi.Models;

namespace lcpblogapi.Interfaces;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task<List<string>> UploadMultipleFilesAsync(List<IFormFile> files);
    Task<FileMetadata> UploadFileAndSaveMetadataAsync(IFormFile file);
    List<FileMetadata> GetListFiles();
}