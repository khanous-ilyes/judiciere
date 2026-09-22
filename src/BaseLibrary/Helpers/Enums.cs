namespace BaseLibrary.Helpers
{
    public enum ModuleType
    {
        Avocat,
        Notaire,
        Huissier,
        EcrivainPublic
    }

    public enum UserType
    {
        SuperAdmin,
        AdminCabinet,
        Collaborateur,
        Secretaire,
        Comptable
    }

    public enum DossierStatus
    {
        Ouvert,
        EnCours,
        Suspendu,
        Cloture,
        Archive
    }

    public enum TypeAffaireAvocat
    {
        Civil,
        Penal,
        Commercial,
        Social,
        Administratif,
        Famille,
        Autre
    }

    public enum TypeActeNotarie
    {
        VenteImmobiliere,
        Donation,
        Testament,
        ContratMariage,
        ProcurationAuthentique,
        ActeNotoriete,
        ConstitutionSociete,
        CessionFondsCommerce,
        BailCommercial,
        Autre
    }

    public enum TypeActeHuissier
    {
        Signification,
        SommationInterpellative,
        PVCarence,
        PVSaisieConservatoire,
        PVSaisieArret,
        PVSaisieRevendication,
        PVSaisieExecution,
        ServiceAudiencier,
        VenteAuxEncheres,
        Autre
    }

    public enum TypePrestationEcrivain
    {
        RedactionCourrier,
        FormulaireAdministratif,
        DemandeVisa,
        EnvoiPostal,
        PhotocopieSaisie,
        Autre
    }

    public enum SubscriptionStatus
    {
        Active,
        Suspended,
        Expired,
        Cancelled
    }

    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed,
        Refunded
    }

    public enum NotificationType
    {
        InApp,
        Email,
        SMS
    }

    public enum Language
    {
        Arabe,
        Francais,
        Anglais
    }

    public enum PersonType
    {
        Physique,
        Morale
    }

    public enum DocumentType
    {
        Minute,
        Brevet,
        Grosse,
        Expedition,
        PV,
        Conclusions,
        Consultation,
        FacturePDF,
        PieceJointe,
        Autre
    }
}
