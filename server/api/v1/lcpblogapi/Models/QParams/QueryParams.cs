using System.Runtime.Serialization;

namespace lcpblogapi.Models.QParams;

public class QueryParams
{
    private const int MaxPageSize = 50;
    private int _pageSize = 10;

    public int Page { get; set; } = 1;
    public int PageSize
    {
        get { return _pageSize; }
        set { _pageSize = value > MaxPageSize ? MaxPageSize : value; }
    }

    public string? SortBy { get; set; } = "id";
    public SortOrderEnum? SortOrder { get; set; } = SortOrderEnum.asc;
    public OpEnum? Op { get; set; } = OpEnum.equal;
    public string? FieldName { get; set; } = "id";
    public string? Search { get; set; }
}

public enum SortOrderEnum
{
    [EnumMember(Value = "asc")]
    asc,
    [EnumMember(Value = "desc")]
    desc
}

public enum OpEnum
{
    [EnumMember(Value = "equal")]
    equal,
    [EnumMember(Value = "notequal")]
    notequal,
    [EnumMember(Value = "aboveorequal")]
    aboveorequal,
    [EnumMember(Value = "beloworequal")]
    beloworequal,
    [EnumMember(Value = "above")]
    above,
    [EnumMember(Value = "below")]
    below,
    [EnumMember(Value = "contains")]
    contains,
    [EnumMember(Value = "notcontains")]
    notcontains
}