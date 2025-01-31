using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace lcpblogapi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum EUsersRoles {
    [EnumMember(Value = "user")]
    user = 0,
    [EnumMember(Value = "guest")]
    guest = 1,
    [EnumMember(Value = "member")]
    member = 2,
    [EnumMember(Value = "editor")]
    editor = 3,
    [EnumMember(Value = "vip")]
    vip = 4,
    [EnumMember(Value = "moderator")]
    moderator = 5,
    [EnumMember(Value = "admin")]
    admin = 6,
    [EnumMember(Value = "banned")]
    banned = 7
}