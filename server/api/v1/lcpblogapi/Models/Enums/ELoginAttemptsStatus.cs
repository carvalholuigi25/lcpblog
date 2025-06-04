using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace lcpblogapi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum ELoginAttemptsStatus {
    [EnumMember(Value = "locked")]
    locked = 0,
    [EnumMember(Value = "unlocked")]
    unlocked = 1
}