using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class PrestationEcrivain : BaseEntity
    {
        public Guid DossierId { get; set; }
        public Dossier? Dossier { get; set; }

        public TypePrestationEcrivain TypePrestation { get; set; } = TypePrestationEcrivain.RedactionCourrier;
        public string IntitulePrestation { get; set; } = string.Empty;
        public string DestinataireAdministration { get; set; } = string.Empty; // CNAS, CASNOS, Wilaya, Consulat...
        public string DocumentTemplateUtilise { get; set; } = string.Empty;
        public decimal TarifPrestation { get; set; } = 0;
        public bool EstLivre { get; set; } = false;
        public DateTime? DateLivraison { get; set; }
        public string? NumeroAutorisationWali { get; set; } // Numéro d'autorisation d'exercice du cabinet
    }
}
