using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.DTOs.Response
{
    public class TenantResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LegalName { get; set; } = string.Empty;
        public string ProfessionalRegistrationNumber { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? HeaderInfo { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int MaxUsers { get; set; }
        public int MaxDossiers { get; set; }
        public long MaxStorageBytes { get; set; }
        public List<string> ActiveModules { get; set; } = new List<string>();
        public SubscriptionResponseDto? Subscription { get; set; }
    }

    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public string Phone { get; set; } = string.Empty;
        public UserType Role { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }

    public class ClientTiersResponseDto
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public PersonType PersonType { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? NIN { get; set; }
        public string? DateOfBirth { get; set; }
        public string? PlaceOfBirth { get; set; }
        public string? Nationality { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? RegisterCommerceNumber { get; set; }
        public string? NIF { get; set; }
        public string? NIS { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public string Commune { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class DossierResponseDto
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ModuleType ModuleType { get; set; }
        public DossierStatus Status { get; set; }
        public DateTime OpeningDate { get; set; }
        public DateTime? ClosingDate { get; set; }
        public Guid ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public Guid? AssignedUserId { get; set; }
        public string? AssignedUserName { get; set; }
        public DateTime CreatedAt { get; set; }

        public DossierAvocatResponseDto? AvocatDetails { get; set; }
        public ActeNotarieResponseDto? NotaireDetails { get; set; }
        public ActeHuissierResponseDto? HuissierDetails { get; set; }
        public PrestationEcrivainResponseDto? EcrivainDetails { get; set; }
    }

    public class DossierAvocatResponseDto
    {
        public Guid Id { get; set; }
        public TypeAffaireAvocat TypeAffaire { get; set; }
        public string Juridiction { get; set; } = string.Empty;
        public string Chambre { get; set; } = string.Empty;
        public string NumeroRole { get; set; } = string.Empty;
        public string Adversaire { get; set; } = string.Empty;
        public string AvocatAdversaire { get; set; } = string.Empty;
        public string DemandeurDefendeur { get; set; } = string.Empty;
        public List<AudienceResponseDto> Audiences { get; set; } = new List<AudienceResponseDto>();
    }

    public class AudienceResponseDto
    {
        public Guid Id { get; set; }
        public DateTime DateAudience { get; set; }
        public string Juridiction { get; set; } = string.Empty;
        public string Salle { get; set; } = string.Empty;
        public string Objectif { get; set; } = string.Empty;
        public string Decision { get; set; } = string.Empty;
        public DateTime? ProchaineAudienceDate { get; set; }
        public string VoieRecours { get; set; } = string.Empty;
        public DateTime? DelaiLeguelRecours { get; set; }
    }

    public class ActeNotarieResponseDto
    {
        public Guid Id { get; set; }
        public TypeActeNotarie TypeActe { get; set; }
        public long NumeroRepertoire { get; set; }
        public string CodeRepertoireInviolable { get; set; } = string.Empty;
        public DateTime DateActe { get; set; }
        public DocumentType FormeActe { get; set; }
        public string ObjetActe { get; set; } = string.Empty;
        public string ObjetActeArabe { get; set; } = string.Empty;
        public decimal ValeurDeclaree { get; set; }
        public decimal DroitsEnregistrement { get; set; }
        public string AutresPartiesNIN { get; set; } = string.Empty;
    }

    public class ActeHuissierResponseDto
    {
        public Guid Id { get; set; }
        public TypeActeHuissier TypeActe { get; set; }
        public long NumeroPV { get; set; }
        public DateTime DateSignification { get; set; }
        public string HeureSignification { get; set; } = string.Empty;
        public string LangueObligatoire { get; set; } = "Arabe";
        public string PartieRequérante { get; set; } = string.Empty;
        public string PartieSignifiée { get; set; } = string.Empty;
        public string AdresseSignification { get; set; } = string.Empty;
        public string QualiteRecepteur { get; set; } = string.Empty;
        public string ContingencePV { get; set; } = string.Empty;
        public decimal HonoraireReglementaire { get; set; }
        public decimal DroitDEnregistrement { get; set; }
        public decimal FraisDeDeplacement { get; set; }
        public decimal TotalDZD { get; set; }
        public bool EstVenteAuxEncheres { get; set; }
    }

    public class PrestationEcrivainResponseDto
    {
        public Guid Id { get; set; }
        public TypePrestationEcrivain TypePrestation { get; set; }
        public string IntitulePrestation { get; set; } = string.Empty;
        public string DestinataireAdministration { get; set; } = string.Empty;
        public string DocumentTemplateUtilise { get; set; } = string.Empty;
        public decimal TarifPrestation { get; set; }
        public bool EstLivre { get; set; }
        public DateTime? DateLivraison { get; set; }
        public string? NumeroAutorisationWali { get; set; }
    }

    public class FactureResponseDto
    {
        public Guid Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public PaymentStatus Status { get; set; }
        public Guid ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public decimal SubTotal { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceDue { get; set; }
        public List<FactureLigneResponseDto> Lignes { get; set; } = new List<FactureLigneResponseDto>();
    }

    public class FactureLigneResponseDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class DocumentResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public DocumentType Type { get; set; }
        public ModuleType ModuleType { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public int CurrentVersion { get; set; }
        public Guid? DossierId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class DashboardDto
    {
        public int TotalClients { get; set; }
        public int TotalDossiers { get; set; }
        public int DossiersOuverts { get; set; }
        public int AudiencesAVenir { get; set; }
        public int ActesNotariesMois { get; set; }
        public int ActesHuissierMois { get; set; }
        public decimal ChiffreAffairesMoisDZD { get; set; }
        public decimal FacturesEnAttenteDZD { get; set; }
        public List<DossierResponseDto> RecentDossiers { get; set; } = new List<DossierResponseDto>();
    }

    public class AuditLogResponseDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public Guid? EntityId { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }

    public class SubscriptionResponseDto
    {
        public Guid Id { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public SubscriptionStatus Status { get; set; }
        public decimal AmountPaidDZD { get; set; }
    }
}
