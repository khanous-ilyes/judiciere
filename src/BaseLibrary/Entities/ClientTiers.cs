using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class ClientTiers : BaseEntity
    {
        public PersonType PersonType { get; set; } = PersonType.Physique;

        // Personne Physique
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => PersonType == PersonType.Physique ? $"{FirstName} {LastName}" : CompanyName;
        public string? NIN { get; set; } // Numéro d'Identification National (Requis par loi algérienne/enregistrement)
        public string? DateOfBirth { get; set; }
        public string? PlaceOfBirth { get; set; }
        public string? Nationality { get; set; } = "Algérienne";

        // Personne Morale
        public string CompanyName { get; set; } = string.Empty;
        public string? RegisterCommerceNumber { get; set; } // RC
        public string? NIF { get; set; } // Numéro d'Identification Fiscale
        public string? NIS { get; set; } // Numéro d'Identification Statistique
        public string? LegalRepresentativeName { get; set; }

        // Coordonnées communes
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public string Commune { get; set; } = string.Empty;
        public string? Notes { get; set; }

        public Tenant? Tenant { get; set; }
    }
}
