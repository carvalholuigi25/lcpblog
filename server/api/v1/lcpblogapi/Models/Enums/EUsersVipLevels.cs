using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace lcpblogapi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum EUsersVipLevels {
    [EnumMember(Value = "regular")]
    regular = 0,
    [EnumMember(Value = "basic")]
    basic = 1,
    [EnumMember(Value = "professional")]
    professional = 2, 
    [EnumMember(Value = "enterprise")]
    enterprise = 3,
    [EnumMember(Value = "ultimate")]
    ultimate = 4
}