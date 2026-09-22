using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class ActeHuissier : BaseEntity
    {
        public Guid DossierId { get; set; }
        public Dossier? Dossier { get; set; }

        public TypeActeHuissier TypeActe { get; set; } = TypeActeHuissier.Signification;
        public long NumeroPV { get; set; } // Numéro PV chronologique
        public DateTime DateSignification { get; set; } = DateTime.UtcNow;
        public string HeureSignification { get; set; } = "10:00";
        public string LangueObligatoire { get; set; } = "Arabe"; // Exigé par la loi algérienne

        // Informations de la signification / exploit
        public string PartieRequérante { get; set; } = string.Empty; // Demandeur / Requérant
        public string PartieSignifiée { get; set; } = string.Empty; // Destinataire de l'acte
        public string AdresseSignification { get; set; } = string.Empty;
        public string QualiteRecepteur { get; set; } = string.Empty; // En personne, à domicile, au siège...
        public string ContingencePV { get; set; } = string.Empty; // Texte intégral du PV en arabe

        // Tarification réglementée
        public decimal HonoraireReglementaire { get; set; } // Selon barème légal
        public decimal DroitDEnregistrement { get; set; }
        public decimal FraisDeDeplacement { get; set; }
        public decimal TotalDZD => HonoraireReglementaire + DroitDEnregistrement + FraisDeDeplacement;

        // Ventes aux enchères (Loi 23-13)
        public bool EstVenteAuxEncheres { get; set; } = false;
        public string? InventaireBiensJSON { get; set; }
        public decimal? PrixAdjudication { get; set; }
        public string? NomAdjudicataire { get; set; }
    }

    public class BaremeHonoraire : BaseEntity
    {
        public TypeActeHuissier TypeActe { get; set; }
        public string LibelleActeFR { get; set; } = string.Empty;
        public string LibelleActeAR { get; set; } = string.Empty;
        public decimal TarifFixeDZD { get; set; }
        public decimal PourcentageVariable { get; set; } = 0;
        public string DecretReference { get; set; } = "Décret exécutif portant tarif des actes d'huissier";
        public bool EstActif { get; set; } = true;
    }
}
