using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class LoginStatus
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int LoginStatusId { get; set; }

    [DefaultValue(0)]
    public int Attempts { get; set; } = 0;

    [DefaultValue(ELoginStatusStatus.unlocked)]
    public ELoginStatusStatus? Status { get; set; } = ELoginStatusStatus.unlocked;

    public DateTime? DateLock { get; set; } = DateTime.UtcNow.AddHours(DateTime.UtcNow.Hour + 1);

    public long? DateLockTimestamp { get; set; } = new DateTimeOffset(DateTime.UtcNow.AddHours(DateTime.UtcNow.Hour + 1)).ToUnixTimeSeconds();

    [DefaultValue(ELoginSessionType.permanent)]
    public ELoginSessionType? Type { get; set; } = ELoginSessionType.permanent;

    [DefaultValue(ELoginSessionTimeType.week)]
    public ELoginSessionTimeType? ModeTimer { get; set; } = ELoginSessionTimeType.week;

    public string? ValueTimer { get; set; } = DateTime.UtcNow.ToString();

    [DefaultValue(1)]
    public int? UserId { get; set; } = 1;
}