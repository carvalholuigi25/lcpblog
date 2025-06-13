using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class Media
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int? MediaId { get; set; }

    [DefaultValue(EMediaTypeUrl.local)]
    public EMediaTypeUrl? TypeUrl { get; set; } = EMediaTypeUrl.local;

    [DefaultValue("")]
    public string Src { get; set; } = "";

    [DefaultValue("video/mp4")]
    public string TypeMime { get; set; } = "video/mp4";

    [DefaultValue("default.jpg")]
    public string? Thumbnail { get; set; } = "default.jpg";

    [DefaultValue("")]
    public string? Title { get; set; } = "";

    [DefaultValue("")]
    public string? Description { get; set; } = "";

    [DefaultValue("public")]
    public string? Privacy { get; set; } = "public";

    [DefaultValue(false)]
    public bool? IsFeatured { get; set; } = false;

    public DateTimeOffset? CreatedAt { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? UpdatedAt { get; set; } = DateTimeOffset.Now;

    [DefaultValue(1)]
    public int? CategoryId { get; set; } = 1;

    [DefaultValue(1)]
    public int? UserId { get; set; } = 1;
}