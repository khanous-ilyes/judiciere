using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.DTOs.Request
{
    public class CreateTenantDto
    {
        public string Name { get; set; } = string.Empty;
        public string LegalName { get; set; } = string.Empty;
        public string ProfessionalRegistrationNumber { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<ModuleType> InitialModules { get; set; } = new List<ModuleType>();
        public Guid SubscriptionPlanId { get; set; }
        public string AdminEmail { get; set; } = string.Empty;
        public string AdminPassword { get; set; } = string.Empty;
        public string AdminFirstName { get; set; } = string.Empty;
        public string AdminLastName { get; set; } = string.Empty;
    }

    public class UpdateTenantDto
    {
        public string Name { get; set; } = string.Empty;
        public string LegalName { get; set; } = string.Empty;
        public string ProfessionalRegistrationNumber { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? HeaderInfo { get; set; }
        public string? LogoUrl { get; set; }
    }

    public class ToggleModuleDto
    {
        public ModuleType ModuleType { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public UserType Role { get; set; } = UserType.Collaborateur;
    }

    public class CreateClientTiersDto
    {
        public PersonType PersonType { get; set; } = PersonType.Physique;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? NIN { get; set; }
        public string? DateOfBirth { get; set; }
        public string? PlaceOfBirth { get; set; }
        public string? Nationality { get; set; } = "Algérienne";
        public string CompanyName { get; set; } = string.Empty;
        public string? RegisterCommerceNumber { get; set; }
        public string? NIF { get; set; }
        public string? NIS { get; set; }
        public string? LegalRepresentativeName { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public string Commune { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class CreateDossierDto
    {
        public string Title { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ModuleType ModuleType { get; set; }
        public Guid ClientId { get; set; }
        public Guid? AssignedUserId { get; set; }

        // Specific sub-types
        public CreateDossierAvocatDto? AvocatDetails { get; set; }
        public CreateActeNotarieDto? NotaireDetails { get; set; }
        public CreateActeHuissierDto? HuissierDetails { get; set; }
        public CreatePrestationEcrivainDto? EcrivainDetails { get; set; }
    }

    public class CreateDossierAvocatDto
    {
        public TypeAffaireAvocat TypeAffaire { get; set; }
        public string Juridiction { get; set; } = string.Empty;
        public string Chambre { get; set; } = string.Empty;
        public string NumeroRole { get; set; } = string.Empty;
        public string Adversaire { get; set; } = string.Empty;
        public string AvocatAdversaire { get; set; } = string.Empty;
        public string DemandeurDefendeur { get; set; } = string.Empty;
    }

    public class CreateActeNotarieDto
    {
        public TypeActeNotarie TypeActe { get; set; }
        public DateTime DateActe { get; set; } = DateTime.UtcNow;
        public DocumentType FormeActe { get; set; } = DocumentType.Minute;
        public string ObjetActe { get; set; } = string.Empty;
        public string ObjetActeArabe { get; set; } = string.Empty;
        public decimal ValeurDeclaree { get; set; }
        public decimal DroitsEnregistrement { get; set; }
        public string AutresPartiesNIN { get; set; } = string.Empty;
    }

    public class CreateActeHuissierDto
    {
        public TypeActeHuissier TypeActe { get; set; }
        public DateTime DateSignification { get; set; } = DateTime.UtcNow;
        public string HeureSignification { get; set; } = "10:00";
        public string PartieRequérante { get; set; } = string.Empty;
        public string PartieSignifiée { get; set; } = string.Empty;
        public string AdresseSignification { get; set; } = string.Empty;
        public string QualiteRecepteur { get; set; } = string.Empty;
        public string ContingencePV { get; set; } = string.Empty;
        public decimal HonoraireReglementaire { get; set; }
        public decimal DroitDEnregistrement { get; set; }
        public decimal FraisDeDeplacement { get; set; }
        public bool EstVenteAuxEncheres { get; set; }
        public string? InventaireBiensJSON { get; set; }
    }

    public class CreatePrestationEcrivainDto
    {
        public TypePrestationEcrivain TypePrestation { get; set; }
        public string IntitulePrestation { get; set; } = string.Empty;
        public string DestinataireAdministration { get; set; } = string.Empty;
        public string DocumentTemplateUtilise { get; set; } = string.Empty;
        public decimal TarifPrestation { get; set; }
        public string? NumeroAutorisationWali { get; set; }
    }

    public class CreateFactureDto
    {
        public Guid ClientId { get; set; }
        public Guid? DossierId { get; set; }
        public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(30);
        public decimal TaxRate { get; set; } = 19.00m;
        public string Notes { get; set; } = string.Empty;
        public List<CreateFactureLigneDto> Lignes { get; set; } = new List<CreateFactureLigneDto>();
    }

    public class CreateFactureLigneDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
    }

    public class CreatePaiementDto
    {
        public Guid FactureId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Espèces";
        public string TransactionReference { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class CreateEvenementDto
    {
        public string Title { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsAllDay { get; set; }
        public string Location { get; set; } = string.Empty;
        public string EventType { get; set; } = "Audience";
        public Guid? DossierId { get; set; }
        public Guid? UserId { get; set; }
    }
}
