using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class Category
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int CategoryId { get; set; }

    [DefaultValue("")]
    public string? Name { get; set; } = "";
    
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;

    [DefaultValue(ECategoryStatus.all)]
    public ECategoryStatus? Status { get; set; } = ECategoryStatus.all;

    [JsonIgnore]
    public ICollection<PostCategory>? PostCategories { get; set; }
}