using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

namespace lcpblogapi.Interfaces;

public interface IFileMetadataRepo {
    Task<ActionResult<IEnumerable<FileMetadata>>> GetFileMetadatas(QueryParams queryParams);
    Task<ActionResult<FileMetadata>> GetFileMetadata(int? id);
    Task<ActionResult<FileMetadata>> CreateFileMetadata(FileMetadata filemetadata);
    Task<IActionResult> PutFileMetadata(int? id, FileMetadata filemetadata);
    Task<IActionResult> DeleteFileMetadata(int? id);
    Task<int> GetTotalCountAsync(QueryParams queryParams);
}