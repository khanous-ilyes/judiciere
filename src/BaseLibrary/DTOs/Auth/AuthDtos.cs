using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.DTOs.Auth
{
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string CabinetName { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public ModuleType PrimaryModule { get; set; } = ModuleType.Avocat;
    }

    public class TokenDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public Guid UserId { get; set; }
        public Guid TenantId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserType Role { get; set; }
        public string CabinetName { get; set; } = string.Empty;
        public string[] ActiveModules { get; set; } = Array.Empty<string>();
    }

    public class RefreshTokenDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
