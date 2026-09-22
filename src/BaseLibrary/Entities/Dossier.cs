using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class Dossier : BaseEntity
    {
        public string Code { get; set; } = string.Empty; // Ex: DOS-2026-0001
        public string Title { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ModuleType ModuleType { get; set; }
        public DossierStatus Status { get; set; } = DossierStatus.Ouvert;
        public DateTime OpeningDate { get; set; } = DateTime.UtcNow;
        public DateTime? ClosingDate { get; set; }

        public Guid ClientId { get; set; }
        public ClientTiers? Client { get; set; }

        public Guid? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }

        public Tenant? Tenant { get; set; }

        public ICollection<Document> Documents { get; set; } = new List<Document>();
        public ICollection<Evenement> Evenements { get; set; } = new List<Evenement>();
        public ICollection<Facture> Factures { get; set; } = new List<Facture>();
    }
}
