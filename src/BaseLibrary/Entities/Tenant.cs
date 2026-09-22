using System;
using System.Collections.Generic;

namespace BaseLibrary.Entities
{
    public class Tenant
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;           // Cabinet name
        public string LegalName { get; set; } = string.Empty;      // Raison sociale / Nom de l'office
        public string ProfessionalRegistrationNumber { get; set; } = string.Empty; // N° Agrément / Matricule Barreau / Conseil
        public string Wilaya { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? HeaderInfo { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SuspendedAt { get; set; }

        // Quotas
        public int MaxUsers { get; set; } = 5;
        public int MaxDossiers { get; set; } = 1000;
        public long MaxStorageBytes { get; set; } = 5368709120; // 5 GB default

        // Navigation
        public ICollection<TenantModule> TenantModules { get; set; } = new List<TenantModule>();
        public ICollection<User> Users { get; set; } = new List<User>();
        public Subscription? Subscription { get; set; }
    }
}
