using lcpblogapi.Context;
using lcpblogapi.Interfaces;
using lcpblogapi.Models;

namespace lcpblogapi.Services;

public class FileService : IFileService
{
    private MyDBContext _context;
    private readonly long _maxSize;
    private readonly List<string> _allowedExtensions;
    private readonly string _uploadFolder = "wwwroot\\assets\\uploads";
    private readonly string _imgFolder = Directory.GetCurrentDirectory().Replace("\\server\\api\\v1\\lcpblogapi", "") + "\\public\\images\\uploads";
    private readonly string dirname = "";

    public FileService(MyDBContext context, IConfiguration configuration)
    {
        _context = context;
        _maxSize = configuration.GetValue<long>("FileUpload:MaxSize");
        _allowedExtensions = configuration.GetSection("FileUpload:AllowedExtensions").Get<List<string>>()!;
        dirname = configuration.GetValue<string>(WebHostDefaults.ContentRootKey)!;
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (!IsValidFile(file))
            throw new InvalidOperationException("Invalid file format or size.");

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        await CreateFile(file, _uploadFolder, fileName);
        await CreateFile(file, _imgFolder, fileName);

        return $"/api/files/download/{fileName}";
    }

    public async Task<List<string>> UploadMultipleFilesAsync(List<IFormFile> files)
    {
        List<string> uploadedPaths = [];
        foreach (var file in files)
        {
            var path = await UploadFileAsync(file);
            uploadedPaths.Add(path);
        }
        return uploadedPaths;
    }

    public async Task<FileMetadata> UploadFileAndSaveMetadataAsync(IFormFile file)
    {
        if (!IsValidFile(file))
            throw new InvalidOperationException("Invalid file format or size.");

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(_uploadFolder, fileName);

        await CreateFile(file, _uploadFolder, fileName);

        var metadata = new FileMetadata
        {
            FileName = fileName,
            FilePath = filePath,
            ContentType = file.ContentType,
            UploadedAt = DateTimeOffset.Now
        };

        _context.FilesMetadata.Add(metadata);
        await _context.SaveChangesAsync();

        return metadata;
    }

    public List<FileMetadata> GetListFiles() {
        DirectoryInfo info = new DirectoryInfo(dirname + "\\" + _uploadFolder);
        FileInfo[] S1 = info.GetFiles().OrderByDescending(p => p.CreationTime).ToArray();
        var recentUploadedFiles = S1.Select((file) => new FileMetadata {
            gId = Guid.NewGuid(),
            FileName = file.Name, 
            FilePath = file.FullName, 
            ContentType = file.Extension, 
            UploadedAt = file.CreationTime
        }).ToList();

        return recentUploadedFiles;
    }

    public async Task CreateFile(IFormFile file, string pth, string fileName) {
        var filePath = Path.Combine(pth, fileName);

        if(!Path.Exists(pth)) {
            Directory.CreateDirectory(pth);
        }

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);
    }

    private bool IsValidFile(IFormFile file)
    {
        if (file == null || file.Length == 0 || file.Length > _maxSize)
            return false;

        var extension = Path.GetExtension(file.FileName).ToLower();
        return _allowedExtensions.Contains(extension);
    }
}
