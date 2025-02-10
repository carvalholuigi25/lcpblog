using System.ComponentModel;
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

    [DefaultValue("")]
    public string Username { get; set; } = null!;
    
    [IgnoreDataMember]
    [DefaultValue("")]
    public string Password { get; set; } = null!;
    
    [DefaultValue("")]
    public string? Email { get; set; } = "";
    
    [DefaultValue("")]
    public string? DisplayName { get; set; } = "";
    
    [DefaultValue("avatars/user.png")]
    public string? Avatar { get; set; } = "avatars/user.png";
    
    [DefaultValue("covers/user.png")]
    public string? Cover { get; set; } = "covers/user.png";
    
    [DefaultValue("")]
    public string? About { get; set; } = "";
    
    [DefaultValue(EUsersRoles.user)]
    public EUsersRoles? Role { get; set; } = EUsersRoles.user;
    
    [DefaultValue(EUserPrivacy.locked)]
    public EUserPrivacy? Privacy { get; set; } = EUserPrivacy.locked;
    
    [DefaultValue(1)]
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

    [DefaultValue("")]
    public string? PhoneUser { get; set; }
    
    [DefaultValue("")]
    public string? AddressUser { get; set; }
    
    [DefaultValue("")]
    public string? CountryUser { get; set; }
    
    [DefaultValue("")]
    public string? CityUser { get; set; }
    
    [DefaultValue("")]
    public string? DistrictUser { get; set; }
    
    [DefaultValue("")]
    public string? DateBirthdayUser { get; set; }
}

public class UserAvatarSearch {
    [DefaultValue("")]
    public string? Email { get; set; }
}

public class UserAvatarSearchResp {
    [DefaultValue("avatars/user.png")]
    public string? Avatar { get; set; }
}