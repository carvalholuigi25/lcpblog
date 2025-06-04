using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using lcpblogapi.Models.Enums;

namespace lcpblogapi.Models;

public class LoginAttempts
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int LoginAttemptId { get; set; }

    [DefaultValue(0)]
    public int Attempts { get; set; } = 0;

    [DefaultValue(ELoginAttemptsStatus.unlocked)]
    public ELoginAttemptsStatus? Status { get; set; } = ELoginAttemptsStatus.unlocked;

    public DateTime? DateLock { get; set; } = DateTime.UtcNow.AddHours(1);

    public long? DateLockTimestamp { get; set; } = new DateTimeOffset(DateTime.UtcNow.AddHours(1)).ToUnixTimeSeconds();

    [DefaultValue(1)]
    public int? UserId { get; set; } = 1;
}