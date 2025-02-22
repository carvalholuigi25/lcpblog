using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class Post
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int? PostId { get; set; } = 0;

    [DefaultValue("")]
    public string? Title { get; set; } = "";

    [DefaultValue("")]
    public string? Content { get; set; } = "";

    [DefaultValue("blog.jpg")]
    public string? Image { get; set; } = "blog.jpg";

    [DefaultValue("/")]
    public string? Slug { get; set; } = "/";

    public DateTimeOffset? CreatedAt { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? UpdatedAt { get; set; } = DateTimeOffset.Now;

    [DefaultValue(EPostStatus.all)]
    public EPostStatus? Status { get; set; } = EPostStatus.all;

    [DefaultValue(1)]
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
    [DefaultValue(1)]
    public int PostId { get; set; } = 1;

    [DefaultValue(1)]
    public int? CategoryId { get; set; } = 1;

    [JsonIgnore]
    public Post? Post { get; set; }

    [JsonIgnore]
    public Category? Category { get; set; }
}

public class PostTag {
    [DefaultValue(1)]
    public int PostId { get; set; } = 1;

    [DefaultValue(1)]
    public int? TagId { get; set; } = 1;

    [JsonIgnore]
    public Post? Post { get; set; }

    [JsonIgnore]
    public Tag? Tag { get; set; }
}