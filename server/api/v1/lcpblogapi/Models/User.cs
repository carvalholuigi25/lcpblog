using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using lcpblogapi.Models.Enums;
using lcpblogapi.Models.UsersAuth;

namespace lcpblogapi.Models;

public class User
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int UserId { get; set; }
    public string Username { get; set; } = null!;
    [IgnoreDataMember]
    public string Password { get; set; } = null!;
    public string? Email { get; set; }
    public string? DisplayName { get; set; }
    public string? Avatar { get; set; } = "avatars/user.png";
    public string? Cover { get; set; } = "covers/user.png";
    public string? About { get; set; }
    public EUsersRoles? Role { get; set; } = EUsersRoles.user;
    public EUserPrivacy? Privacy { get; set; } = EUserPrivacy.locked;
    public int? UsersInfoId { get; set; } = 1;

    [JsonIgnore]
    public List<RefreshToken>? RefreshTokens { get; set; }

    [JsonIgnore]
    public ICollection<Post>? Posts { get; set; }
    
    [JsonIgnore]
    public ICollection<Comment>? Comments { get; set; }
}

public class UsersInfo {
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int? UsersInfoId { get; set; }
    public string? PhoneUser { get; set; }
    public string? AddressUser { get; set; }
    public string? CountryUser { get; set; }
    public string? CityUser { get; set; }
    public string? DistrictUser { get; set; }
    public string? DateBirthdayUser { get; set; }
}

public class UserAvatarSearch {
    public string? Email { get; set; }
}

public class UserAvatarSearchResp {
    public string? Avatar { get; set; }
}