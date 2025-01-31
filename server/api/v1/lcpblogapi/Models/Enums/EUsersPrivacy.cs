using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace lcpblogapi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum EUserPrivacy {
    [EnumMember(Value = "all")]
    all = 0,
    [EnumMember(Value = "locked")]
    locked = 1
}