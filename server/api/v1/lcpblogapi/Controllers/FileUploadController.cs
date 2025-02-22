using lcpblogapi.Interfaces;
using lcpblogapi.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/files")]
[ApiController]
public class FileUploadController : ControllerBase
{
    private readonly IFileService _fileService;

    public FileUploadController(IFileService fileService)
    {
        _fileService = fileService;
    }

    /// <summary>
    /// Single File Upload
    /// </summary>
    /// <param name="file"></param>
    /// <returns></returns>
    [HttpPost("upload/single")]
    public async Task<IActionResult> UploadSingleFile(IFormFile file)
    {
        try
        {
            var path = await _fileService.UploadFileAsync(file);
            return Ok(new { FilePath = path });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Multi File Upload
    /// </summary>
    /// <param name="files"></param>
    /// <returns></returns>
    [HttpPost("upload/multiple")]
    public async Task<IActionResult> UploadMultipleFiles(List<IFormFile> files)
    {
        try
        {
            var paths = await _fileService.UploadMultipleFilesAsync(files);
            return Ok(new { FilePaths = paths });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Lists of uploaded files
    /// </summary>
    /// <returns></returns>
    [HttpGet("list")]
    public IActionResult ListFiles()
    {
        try
        {
            return Ok(_fileService.GetListFiles());
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Download the current file
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    [HttpGet("download/{fileName}")]
    public async Task<IActionResult> DownloadFileAsync(string fileName)
    {
        var filePath = Path.Combine("uploads", fileName);

        if (!System.IO.File.Exists(filePath))
            return NotFound(new { Error = "File not found" });

        var memory = new MemoryStream();
        using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
        {
            await stream.CopyToAsync(memory);
        }
        memory.Position = 0; // Reset stream position

        var contentType = GetContentType(filePath);
        return File(memory, contentType, fileName);
    }

    /// <summary>
    /// Deletes the current file
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    [HttpDelete("delete/{fileName}")]
    public IActionResult DeleteFile(string fileName)
    {
        var filePath = Path.Combine("uploads", fileName);
        
        if (!System.IO.File.Exists(filePath))
            return NotFound(new { Error = "File not found" });

        System.IO.File.Delete(filePath);
        return Ok(new { Message = "File deleted successfully" });
    }

    private string GetContentType(string filePath)
    {
        var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(filePath, out var contentType))
            contentType = "application/octet-stream"; // Default for unknown types

        return contentType;
    }
}
