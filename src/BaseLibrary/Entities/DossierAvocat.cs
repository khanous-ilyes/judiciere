using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class DossierAvocat : BaseEntity
    {
        public Guid DossierId { get; set; }
        public Dossier? Dossier { get; set; }

        public TypeAffaireAvocat TypeAffaire { get; set; } = TypeAffaireAvocat.Civil;
        public string Juridiction { get; set; } = string.Empty; // Tribunal, Cour, Conseil d'État, Cour Suprême
        public string Chambre { get; set; } = string.Empty;
        public string NumeroRole { get; set; } = string.Empty; // N° Rôle / N° Affaire
        public string Adversaire { get; set; } = string.Empty; // Partie adverse
        public string AvocatAdversaire { get; set; } = string.Empty;
        public string DemandeurDefendeur { get; set; } = string.Empty; // Qualité du client (Demandeur / Défendeur)

        public ICollection<Audience> Audiences { get; set; } = new List<Audience>();
        public ICollection<ConsultationJuridique> Consultations { get; set; } = new List<ConsultationJuridique>();
    }

    public class Audience : BaseEntity
    {
        public Guid DossierAvocatId { get; set; }
        public DossierAvocat? DossierAvocat { get; set; }

        public DateTime DateAudience { get; set; }
        public string Juridiction { get; set; } = string.Empty;
        public string Salle { get; set; } = string.Empty;
        public string Objectif { get; set; } = string.Empty; // Plaidoirie, Mise en état, Prononcé...
        public string Decision { get; set; } = string.Empty; // Rapport / Décision rendue
        public DateTime? ProchaineAudienceDate { get; set; }
        public string VoieRecours { get; set; } = string.Empty; // Appel, Pourvoi en cassation
        public DateTime? DelaiLeguelRecours { get; set; }
    }

    public class ConsultationJuridique : BaseEntity
    {
        public Guid DossierAvocatId { get; set; }
        public DossierAvocat? DossierAvocat { get; set; }

        public string Objet { get; set; } = string.Empty;
        public string AnalyseFactuelle { get; set; } = string.Empty;
        public string FoundationLegale { get; set; } = string.Empty; // Textes de loi algériens appliqués
        public string Recommandation { get; set; } = string.Empty;
        public DateTime DateConsultation { get; set; } = DateTime.UtcNow;
    }
}
