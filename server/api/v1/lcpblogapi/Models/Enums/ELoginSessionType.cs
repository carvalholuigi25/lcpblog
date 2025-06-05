using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace lcpblogapi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum ELoginSessionType
{
    [EnumMember(Value = "permanent")]
    permanent = 0,
    [EnumMember(Value = "temporary")]
    temporary = 1
}

[JsonConverter(typeof(StringEnumConverter))]
public enum ELoginSessionTimeType
{
    [EnumMember(Value = "week")]
    week = 0,
    [EnumMember(Value = "month")]
    month = 1,
    [EnumMember(Value = "custom")]
    custom = 2,
    [EnumMember(Value = "none")]
    none = 3
}