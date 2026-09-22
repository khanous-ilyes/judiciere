using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class ActeNotarie : BaseEntity
    {
        public Guid DossierId { get; set; }
        public Dossier? Dossier { get; set; }

        public TypeActeNotarie TypeActe { get; set; } = TypeActeNotarie.VenteImmobiliere;
        public long NumeroRepertoire { get; set; } // Numéro séquentiel légal unique dans le répertoire du tenant
        public string CodeRepertoireInviolable { get; set; } = string.Empty; // SHA256 chain validation code
        public DateTime DateActe { get; set; } = DateTime.UtcNow;

        // Statut Minute / Brevet
        public DocumentType FormeActe { get; set; } = DocumentType.Minute; // Minute (conservée) ou Brevet (délivré)
        public string ObjetActe { get; set; } = string.Empty;
        public string ObjetActeArabe { get; set; } = string.Empty;
        public decimal ValeurDeclaree { get; set; } = 0; // Valeur du contrat (DZD)
        public decimal DroitsEnregistrement { get; set; } = 0; // Droits dus au trésor/enregistrement

        // Secondes parties
        public string AutresPartiesNIN { get; set; } = string.Empty; // Liste/JSON des NIN des parties

        public Guid? RepertoireNotarialId { get; set; }
        public RepertoireNotarial? RepertoireNotarial { get; set; }

        public ICollection<FormaliteEnregistrement> Formalites { get; set; } = new List<FormaliteEnregistrement>();
    }

    public class RepertoireNotarial : BaseEntity
    {
        public int Annee { get; set; }
        public long DernierNumeroSequence { get; set; } = 0;
        public string DernierHashInviolable { get; set; } = string.Empty;
        public bool EstParapheEtCote { get; set; } = true;
        public DateTime DateParaphe { get; set; } = DateTime.UtcNow;
    }

    public class FormaliteEnregistrement : BaseEntity
    {
        public Guid ActeNotarieId { get; set; }
        public ActeNotarie? ActeNotarie { get; set; }

        public string BureauEnregistrement { get; set; } = string.Empty; // Conservation foncière / Enregistrement
        public string NumeroBordereau { get; set; } = string.Empty;
        public DateTime DateDepot { get; set; } = DateTime.UtcNow;
        public DateTime? DateValidation { get; set; }
        public string StatutFormalite { get; set; } = "EnCours"; // EnCours, Validé, Rejeté
        public string? Observations { get; set; }
    }
}
