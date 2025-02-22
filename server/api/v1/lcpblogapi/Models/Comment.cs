using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class Comment
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int? CommentId { get; set; }
    
    [DefaultValue("")]
    public string? Content { get; set; } = "";
    
    public DateTimeOffset? CreatedAt { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? UpdatedAt { get; set; } = DateTimeOffset.Now;

    [DefaultValue(ECommentStatus.all)]
    public ECommentStatus? Status { get; set; } = ECommentStatus.all;

    [DefaultValue(1)]
    public int? UserId { get; set; } = 1;

    [DefaultValue(1)]
    public int? PostId { get; set; } = 1;

    [JsonIgnore]
    public Post? Post { get; set; }

    [JsonIgnore]
    public User? User { get; set; }
}