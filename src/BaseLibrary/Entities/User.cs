using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class User : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string Phone { get; set; } = string.Empty;
        public UserType Role { get; set; } = UserType.Collaborateur;
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginAt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public Tenant? Tenant { get; set; }
    }
}
