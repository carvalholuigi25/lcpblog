using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace lcpblogapi.Models;

public class FileMetadata
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonIgnore]
    public int Id { get; set; } = 0;
    public Guid gId { get; set; } = Guid.NewGuid();
    public string FileName { get; set; } = null!;
    public string FilePath { get; set; } = null!;
    public string? ContentType { get; set; }
    public DateTimeOffset? UploadedAt { get; set; } = DateTimeOffset.Now;
}
