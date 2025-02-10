using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class Post
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int PostId { get; set; }
    public string? Title { get; set; } = "";
    public string? Content { get; set; } = "";
    public string? Image { get; set; } = "blog.jpg";
    public string? Slug { get; set; } = "/";
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    public EPostStatus? Status { get; set; } = EPostStatus.all;
    public int? UserId { get; set; } = 1;
    
    [JsonIgnore]
    public User? User { get; set; }

    [JsonIgnore]
    public ICollection<Comment>? Comments { get; set; }
    
    [JsonIgnore]
    public ICollection<PostCategory>? PostCategories { get; set; }
    
    [JsonIgnore]
    public ICollection<PostTag>? PostTags { get; set; }
}

public class PostCategory {
    public int PostId { get; set; }
    public int? CategoryId { get; set; }

    [JsonIgnore]
    public Post? Post { get; set; }

    [JsonIgnore]
    public Category? Category { get; set; }
}

public class PostTag {
    public int PostId { get; set; }
    public int? TagId { get; set; }

    [JsonIgnore]
    public Post? Post { get; set; }

    [JsonIgnore]
    public Tag? Tag { get; set; }
}