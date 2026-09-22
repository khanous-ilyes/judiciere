using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BaseLibrary.Entities;
using BaseLibrary.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ServerLibrary.Data.Seeders
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            await context.Database.EnsureCreatedAsync();

            // 1. Subscription Plans
            if (!await context.SubscriptionPlans.AnyAsync())
            {
                var plans = new List<SubscriptionPlan>
                {
                    new SubscriptionPlan
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        Name = "Pack Starter (Mono-Module)",
                        Description = "Pour cabinet individuel avec 1 seul module métier",
                        PriceDZD = 45000,
                        BillingCycleDays = 365,
                        AllowedModulesJSON = "[\"Avocat\"]",
                        MaxUsers = 3,
                        MaxDossiers = 1000,
                        MaxStorageBytes = 5368709120
                    },
                    new SubscriptionPlan
                    {
                        Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        Name = "Pack Multi-Professions (Complet)",
                        Description = "Accès illimité à tous les modules métiers (Avocat, Notaire, Huissier, Écrivain)",
                        PriceDZD = 120000,
                        BillingCycleDays = 365,
                        AllowedModulesJSON = "[\"Avocat\",\"Notaire\",\"Huissier\",\"EcrivainPublic\"]",
                        MaxUsers = 15,
                        MaxDossiers = 10000,
                        MaxStorageBytes = 53687091200
                    }
                };
                await context.SubscriptionPlans.AddRangeAsync(plans);
                await context.SaveChangesAsync();
            }

            // 2. Barème Honoraires Huissier (Décret algérien)
            if (!await context.BaremesHonoraires.AnyAsync())
            {
                var baremes = new List<BaremeHonoraire>
                {
                    new BaremeHonoraire
                    {
                        TypeActe = TypeActeHuissier.Signification,
                        LibelleActeFR = "Signification d'acte / exploit judiciaire",
                        LibelleActeAR = "تبليغ رسمي لحكم أو عقد قضائي",
                        TarifFixeDZD = 2500,
                        DecretReference = "Décret exécutif portant tarification des actes d'huissier de justice"
                    },
                    new BaremeHonoraire
                    {
                        TypeActe = TypeActeHuissier.SommationInterpellative,
                        LibelleActeFR = "Sommation interpellative avec PV",
                        LibelleActeAR = "إعذار استجوابي مع محضر",
                        TarifFixeDZD = 4000,
                        DecretReference = "Décret exécutif portant tarification des actes d'huissier de justice"
                    },
                    new BaremeHonoraire
                    {
                        TypeActe = TypeActeHuissier.PVCarence,
                        LibelleActeFR = "Procès-verbal de carence ou de constatation",
                        LibelleActeAR = "محضر عدم وجود أو محضر معاينة",
                        TarifFixeDZD = 5000,
                        DecretReference = "Décret exécutif portant tarification des actes d'huissier de justice"
                    },
                    new BaremeHonoraire
                    {
                        TypeActe = TypeActeHuissier.PVSaisieExecution,
                        LibelleActeFR = "Saisie-exécution sur biens meubles",
                        LibelleActeAR = "حجز تنفيذي على المنقولات",
                        TarifFixeDZD = 8000,
                        PourcentageVariable = 2.5m,
                        DecretReference = "Décret exécutif portant tarification des actes d'huissier de justice"
                    }
                };
                await context.BaremesHonoraires.AddRangeAsync(baremes);
                await context.SaveChangesAsync();
            }

            var systemTenantId = Guid.Parse("00000000-0000-0000-0000-000000000001");

            // 3. System Tenant (for SuperAdmin)
            if (!await context.Tenants.AnyAsync(t => t.Id == systemTenantId))
            {
                var systemTenant = new Tenant
                {
                    Id = systemTenantId,
                    Name = "System (SuperAdmin)",
                    LegalName = "System",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                await context.Tenants.AddAsync(systemTenant);
                await context.SaveChangesAsync();
            }

            // 4. SuperAdmin User
            if (!await context.Users.AnyAsync(u => u.Role == UserType.SuperAdmin))
            {
                var superAdmin = new User
                {
                    Id = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    TenantId = systemTenantId,
                    Email = "superadmin@judiciere.dz",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("SuperAdmin123!"),
                    FirstName = "Super",
                    LastName = "Admin",
                    Phone = "0550000000",
                    Role = UserType.SuperAdmin,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                await context.Users.AddAsync(superAdmin);
                await context.SaveChangesAsync();
            }

            // 4. Demo Tenant Cabinet ("Office Al-Inssaf") with all modules enabled (Cumul)
            if (!await context.Tenants.AnyAsync())
            {
                var tenantId = Guid.Parse("a1111111-1111-1111-1111-111111111111");
                var demoTenant = new Tenant
                {
                    Id = tenantId,
                    Name = "Cabinet Al-Inssaf & Associés",
                    LegalName = "Office Juridique Al-Inssaf Multi-Disciplinaire",
                    ProfessionalRegistrationNumber = "ORD-DZ-16-2024",
                    Wilaya = "Alger",
                    Address = "12 Boulevard Zirout Youcef, Alger Centre",
                    Phone = "021730000",
                    Email = "contact@alinssaf-juridique.dz",
                    HeaderInfo = "مكتب الإنصاف للمحاماة والتوثيق والتحصيل - الجزائر العاصمة",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    MaxUsers = 15,
                    MaxDossiers = 10000
                };
                await context.Tenants.AddAsync(demoTenant);

                // Enable all 4 modules (Cumul enabled!)
                var modules = new List<TenantModule>
                {
                    new TenantModule { TenantId = tenantId, ModuleType = ModuleType.Avocat, IsActive = true },
                    new TenantModule { TenantId = tenantId, ModuleType = ModuleType.Notaire, IsActive = true },
                    new TenantModule { TenantId = tenantId, ModuleType = ModuleType.Huissier, IsActive = true },
                    new TenantModule { TenantId = tenantId, ModuleType = ModuleType.EcrivainPublic, IsActive = true }
                };
                await context.TenantModules.AddRangeAsync(modules);

                // Demo Cabinet Admin User
                var adminCabinetUser = new User
                {
                    Id = Guid.Parse("b2222222-2222-2222-2222-222222222222"),
                    TenantId = tenantId,
                    Email = "maitre.benali@alinssaf-juridique.dz",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Cabinet123!"),
                    FirstName = "Karim",
                    LastName = "Benali",
                    Phone = "0661234567",
                    Role = UserType.AdminCabinet,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                await context.Users.AddAsync(adminCabinetUser);

                // Demo Clients
                var clientPhysique = new ClientTiers
                {
                    Id = Guid.Parse("c3333333-3333-3333-3333-333333333333"),
                    TenantId = tenantId,
                    PersonType = PersonType.Physique,
                    FirstName = "Aghiles",
                    LastName = "Mansouri",
                    NIN = "198516010023456789",
                    DateOfBirth = "15/04/1985",
                    PlaceOfBirth = "Alger",
                    Phone = "0555123456",
                    Email = "a.mansouri@gmail.com",
                    Address = "Rue Didouche Mourad",
                    Wilaya = "Alger",
                    Commune = "Alger Centre"
                };
                var clientMorale = new ClientTiers
                {
                    Id = Guid.Parse("c4444444-4444-4444-4444-444444444444"),
                    TenantId = tenantId,
                    PersonType = PersonType.Morale,
                    CompanyName = "SARL EURL BATIMEX ALGERIE",
                    RegisterCommerceNumber = "16/00-12345B24",
                    NIF = "002416001234567",
                    NIS = "0024160012345",
                    LegalRepresentativeName = "Omar Hamidi",
                    Phone = "023456789",
                    Email = "contact@batimex.dz",
                    Address = "Zone Industrielle Oued Smar",
                    Wilaya = "Alger",
                    Commune = "Oued Smar"
                };
                await context.ClientsTiers.AddRangeAsync(clientPhysique, clientMorale);

                // Demo Dossier Avocat
                var dossierAvocat = new Dossier
                {
                    Id = Guid.Parse("d5555555-5555-5555-5555-555555555555"),
                    TenantId = tenantId,
                    Code = "AV-2026-0001",
                    Title = "Litige Commercial BATIMEX vs SONATRAM",
                    TitleArabic = "نزاع تجاري شركة باتيمكس ضد سوناترام",
                    Description = "Recouvrement de créance commerciale de 12.500.000 DZD",
                    ModuleType = ModuleType.Avocat,
                    Status = DossierStatus.EnCours,
                    ClientId = clientMorale.Id,
                    AssignedUserId = adminCabinetUser.Id
                };
                await context.Dossiers.AddAsync(dossierAvocat);

                var dossierAvocatDetails = new DossierAvocat
                {
                    TenantId = tenantId,
                    DossierId = dossierAvocat.Id,
                    TypeAffaire = TypeAffaireAvocat.Commercial,
                    Juridiction = "Cour d'Alger - Chambre Commerciale",
                    Chambre = "2ème Chambre Commerciale",
                    NumeroRole = "00452/2026",
                    Adversaire = "Société SONATRAM Spa",
                    AvocatAdversaire = "Me Brahimi Lakhdar",
                    DemandeurDefendeur = "Demandeur"
                };
                await context.DossiersAvocat.AddAsync(dossierAvocatDetails);

                var audience = new Audience
                {
                    TenantId = tenantId,
                    DossierAvocatId = dossierAvocatDetails.Id,
                    DateAudience = DateTime.UtcNow.AddDays(7),
                    Juridiction = "Cour d'Alger",
                    Salle = "Salle 4",
                    Objectif = "Plaidoirie sur le fond et présentation des pièces comptables",
                    Decision = "En attente d'audience",
                    VoieRecours = "Appel"
                };
                await context.Audiences.AddAsync(audience);

                // Demo Acte Notarié
                var dossierNotaire = new Dossier
                {
                    Id = Guid.Parse("d6666666-6666-6666-6666-666666666666"),
                    TenantId = tenantId,
                    Code = "NOT-2026-0001",
                    Title = "Vente Immobilière Appartement Hydra",
                    TitleArabic = "عقد بيع عقاري شقة حيدرة",
                    Description = "Vente d'un appartement F4 à Hydra au profit de M. Mansouri",
                    ModuleType = ModuleType.Notaire,
                    Status = DossierStatus.EnCours,
                    ClientId = clientPhysique.Id,
                    AssignedUserId = adminCabinetUser.Id
                };
                await context.Dossiers.AddAsync(dossierNotaire);

                var acteNotarie = new ActeNotarie
                {
                    TenantId = tenantId,
                    DossierId = dossierNotaire.Id,
                    TypeActe = TypeActeNotarie.VenteImmobiliere,
                    NumeroRepertoire = 1001,
                    CodeRepertoireInviolable = "SHA256-INVIOLABLE-HASH-0001",
                    DateActe = DateTime.UtcNow,
                    FormeActe = DocumentType.Minute,
                    ObjetActe = "Vente d'un bien immobilier urbain à Hydra",
                    ObjetActeArabe = "بيع عقار حضري كائن بحيدرة",
                    ValeurDeclaree = 28000000,
                    DroitsEnregistrement = 1400000,
                    AutresPartiesNIN = "197216010098765432"
                };
                await context.ActesNotaries.AddAsync(acteNotarie);

                // Demo Acte Huissier
                var dossierHuissier = new Dossier
                {
                    Id = Guid.Parse("d7777777-7777-7777-7777-777777777777"),
                    TenantId = tenantId,
                    Code = "HUI-2026-0001",
                    Title = "Signification de Jugement Commercial",
                    TitleArabic = "محضر تبليغ حكم تجاري",
                    Description = "Signification du jugement n° 124/2026 avec sommation de payer sous 15 jours",
                    ModuleType = ModuleType.Huissier,
                    Status = DossierStatus.Ouvert,
                    ClientId = clientMorale.Id,
                    AssignedUserId = adminCabinetUser.Id
                };
                await context.Dossiers.AddAsync(dossierHuissier);

                var acteHuissier = new ActeHuissier
                {
                    TenantId = tenantId,
                    DossierId = dossierHuissier.Id,
                    TypeActe = TypeActeHuissier.Signification,
                    NumeroPV = 501,
                    DateSignification = DateTime.UtcNow,
                    HeureSignification = "09:30",
                    LangueObligatoire = "Arabe",
                    PartieRequérante = "SARL BATIMEX ALGERIE",
                    PartieSignifiée = "Société SONATRAM Spa",
                    AdresseSignification = "Zone Industrielle Rouiba, Alger",
                    QualiteRecepteur = "Au siège social, remis au Directeur Juridique M. Khelifi",
                    ContingencePV = "بناءً على طلب شركة باتيمكس، قمنا نحن الأستاذ بن علي كريم، محضر قضائي لدى اختصاص محكمة الرويبة، بتبليغ نسخة التنفيذية للحكم التجاري رقم 124/2026 ومعذريكم بالوفاء بمبلغ 12.500.000 دج خلال مهلة 15 يوماً تحت طائلة التنفيذ الجبري.",
                    HonoraireReglementaire = 2500,
                    DroitDEnregistrement = 500,
                    FraisDeDeplacement = 1000
                };
                await context.ActesHuissier.AddAsync(acteHuissier);

                await context.SaveChangesAsync();
            }
        }
    }
}
