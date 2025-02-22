using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class Tag
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int? TagId { get; set; } = 0;

    [DefaultValue("")]
    public string? Name { get; set; }
    
    public DateTimeOffset? CreatedAt { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? UpdatedAt { get; set; } = DateTimeOffset.Now;
    
    [DefaultValue(ETagStatus.all)]
    public ETagStatus? Status { get; set; } = ETagStatus.all;

    [JsonIgnore]
    public ICollection<PostTag>? PostTags { get; set; }
}