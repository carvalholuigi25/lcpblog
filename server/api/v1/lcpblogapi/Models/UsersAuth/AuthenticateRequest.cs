using System.ComponentModel.DataAnnotations;

namespace lcpblogapi.Models.UsersAuth;

public class AuthenticateRequest
{
    public string? Username { get; set; }
    public string? Email { get; set; }

    [Required]
    public string Password { get; set; } = null!;
}