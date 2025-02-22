namespace lcpblogapi.Models.UsersAuth;

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

[Owned]
public class RefreshToken
{
    [Key]
    [JsonIgnore]
    public int? Id { get; set; } = 0;
    public string Token { get; set; } = null!;
    public DateTimeOffset Expires { get; set; }
    public DateTimeOffset Created { get; set; }
    public string CreatedByIp { get; set; } = "";
    public DateTimeOffset? Revoked { get; set; }
    public string RevokedByIp { get; set; } = "";
    public string ReplacedByToken { get; set; } = "";
    public string ReasonRevoked { get; set; } = "";
    public bool IsExpired => DateTimeOffset.Now >= Expires;
    public bool IsRevoked => Revoked != null;
    public bool IsActive => !IsRevoked && !IsExpired;
}