using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class Comment
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int CommentId { get; set; }
    public string? Content { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    public ECommentStatus? Status { get; set; } = ECommentStatus.all;
    public int? UserId { get; set; }
    public int? PostId { get; set; }

    [JsonIgnore]
    public Post? Post { get; set; }

    [JsonIgnore]
    public User? User { get; set; }
}