using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace lcpblogapi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum ECategoryStatus {
    [EnumMember(Value = "all")]
    all = 0,
    [EnumMember(Value = "locked")]
    locked = 1,
    [EnumMember(Value = "deleted")]
    deleted = 2
}