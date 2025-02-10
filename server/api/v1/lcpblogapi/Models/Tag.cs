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
    public int TagId { get; set; }

    [DefaultValue("")]
    public string? Name { get; set; }
    
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    
    [DefaultValue(ETagStatus.all)]
    public ETagStatus? Status { get; set; } = ETagStatus.all;

    [JsonIgnore]
    public ICollection<PostTag>? PostTags { get; set; }
}