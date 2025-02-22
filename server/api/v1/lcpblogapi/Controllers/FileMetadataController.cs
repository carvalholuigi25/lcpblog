using lcpblogapi.Authorization;
using lcpblogapi.Interfaces;
using lcpblogapi.Models;
using lcpblogapi.Models.QParams;
using Microsoft.AspNetCore.Mvc;

[Route("api/filemetadata")]
[ApiController]
public class FileMetadataController : ControllerBase
{
    private readonly IFileMetadataRepo _filemetadataRepo;

    public FileMetadataController(IFileMetadataRepo filemetadataRepo)
    {
        _filemetadataRepo = filemetadataRepo;
    }

    /// <summary>
    /// Gets all files metadatas.
    /// </summary>
    /// <param name="queryParams"></param>
    /// <returns>Gets all file metadatas</returns>
    /// <response code="201">Returns the all file metadatas</response>
    /// <response code="400">If the file metadatas are empty</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<FileMetadata>>> GetFileMetadatas([FromQuery] QueryParams queryParams)
    {
        return await _filemetadataRepo.GetFileMetadatas(queryParams);
    }

    /// <summary>
    /// Gets all file metadata by id.
    /// </summary>
    /// <param name="id"></param>
    /// <returns>Gets all file metadata by id</returns>
    /// <response code="201">Returns the all file metadata by id</response>
    /// <response code="400">If the file metadata is empty</response>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<FileMetadata>> GetFileMetadata(int id)
    {
        return await _filemetadataRepo.GetFileMetadata(id);
    }

    /// <summary>
    /// Updates the file metadata by id and body.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="FileMetadata"></param>
    /// <returns>Updates the file metadata by id and body</returns>
    /// <response code="201">Returns the all updated file metadatas by id</response>
    /// <response code="400">If the updated file metadata is empty</response>
    [HttpPut("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> PutFileMetadata(int id, FileMetadata FileMetadata)
    {
        return await _filemetadataRepo.PutFileMetadata(id, FileMetadata);
    }

    /// <summary>
    /// Creates the file metadata by body.
    /// </summary>
    /// <param name="FileMetadata"></param>
    /// <returns>Creates the file metadata by body</returns>
    /// <response code="201">Returns the new created file metadata</response>
    /// <response code="400">If the new created file metadata is empty</response>
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<FileMetadata>> CreateFileMetadata(FileMetadata FileMetadata)
    {
        return await _filemetadataRepo.CreateFileMetadata(FileMetadata);
    }

    /// <summary>
    /// Deletes the file metadata by id.
    /// </summary>
    /// <param name="id"></param>
    /// <returns>Deletes the file metadata by id</returns>
    /// <response code="201">Returns the deleted file metadata</response>
    /// <response code="400">If the deleted file metadata is empty</response>
    [HttpDelete("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteFileMetadata(int id)
    {
        return await _filemetadataRepo.DeleteFileMetadata(id);
    }
}
