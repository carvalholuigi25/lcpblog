using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace lcpblogapi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter))]
public enum EMediaTypeUrl
{
    [EnumMember(Value = "local")]
    local = 0,
    [EnumMember(Value = "external")]
    external = 1
}