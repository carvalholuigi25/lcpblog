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
    [EnumMember(Value = "year")]
    year = 0,
    [EnumMember(Value = "month")]
    month = 1,
    [EnumMember(Value = "week")]
    week = 2,
    [EnumMember(Value = "day")]
    day = 3,
    [EnumMember(Value = "hour")]
    hour = 4,
    [EnumMember(Value = "custom")]
    custom = 5,
    [EnumMember(Value = "none")]
    none = 6
}