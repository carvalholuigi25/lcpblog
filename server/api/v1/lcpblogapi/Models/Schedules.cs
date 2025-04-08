using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lcpblogapi.Models;

public class Schedules {
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int? ScheduleId { get; set; }

    [DefaultValue("Event1")]
    public string Title { get; set; } = null!;

    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }

    [DefaultValue(false)]
    public bool? AllDay { get; set; }
}