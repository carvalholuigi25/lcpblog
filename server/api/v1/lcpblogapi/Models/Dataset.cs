using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lcpblogapi.Models;

public class Dataset
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int? DatasetId { get; set; }
    public int? Year { get; set; } = 2025;    
    public List<string>? Label { get; set; } = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
    public List<int>? Data { get; set; } = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];    
}