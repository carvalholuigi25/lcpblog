namespace lcpblogapi.Models.UsersAuth;

using System.Text.Json.Serialization;
using lcpblogapi.Models;

public class AuthenticateResponse
{
    public int? Id { get; set; }
    public string DisplayName { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Avatar { get; set; }
    public string? Role { get; set; }
    public string JwtToken { get; set; }

    [JsonIgnore] // refresh token is returned in http only cookie
    public string RefreshToken { get; set; }

    public AuthenticateResponse(User user, string jwtToken, string refreshToken)
    {
        Id = user.UserId;
        DisplayName = user.DisplayName!;
        Username = user.Username!;
        Email = user.Email!;
        Avatar = user.Avatar!;
        Role = user.Role.ToString()!;
        JwtToken = jwtToken;
        RefreshToken = refreshToken;
    }
}