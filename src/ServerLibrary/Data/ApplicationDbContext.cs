using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BaseLibrary.Entities;
using Microsoft.EntityFrameworkCore;
using ServerLibrary.Services;

namespace ServerLibrary.Data
{
    public class ApplicationDbContext : DbContext
    {
        private readonly ITenantService? _tenantService;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ITenantService? tenantService = null)
            : base(options)
        {
            _tenantService = tenantService;
        }

        // Core
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<TenantModule> TenantModules { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ClientTiers> ClientsTiers { get; set; }
        public DbSet<Dossier> Dossiers { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentVersion> DocumentVersions { get; set; }
        public DbSet<DocumentTemplate> DocumentTemplates { get; set; }
        public DbSet<Evenement> Evenements { get; set; }
        public DbSet<Facture> Factures { get; set; }
        public DbSet<FactureLigne> FactureLignes { get; set; }
        public DbSet<Paiement> Paiements { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }

        // Module Avocat
        public DbSet<DossierAvocat> DossiersAvocat { get; set; }
        public DbSet<Audience> Audiences { get; set; }
        public DbSet<ConsultationJuridique> ConsultationsJuridiques { get; set; }

        // Module Notaire
        public DbSet<ActeNotarie> ActesNotaries { get; set; }
        public DbSet<RepertoireNotarial> RepertoiresNotariaux { get; set; }
        public DbSet<FormaliteEnregistrement> FormalitesEnregistrement { get; set; }

        // Module Huissier
        public DbSet<ActeHuissier> ActesHuissier { get; set; }
        public DbSet<BaremeHonoraire> BaremesHonoraires { get; set; }

        // Module Écrivain Public
        public DbSet<PrestationEcrivain> PrestationsEcrivain { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure entity relationships and indexes
            modelBuilder.Entity<Tenant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            modelBuilder.Entity<ClientTiers>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.NIN);
            });

            modelBuilder.Entity<Dossier>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Code);
            });

            modelBuilder.Entity<ActeNotarie>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.TenantId, e.NumeroRepertoire });
            });

            modelBuilder.Entity<ActeHuissier>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.TenantId, e.NumeroPV });
            });

            // Global Query Filters for BaseEntity types (IsDeleted filter + Multi-tenancy filter when TenantId != Guid.Empty)
            Guid currentTenantId = _tenantService?.GetCurrentTenantId() ?? Guid.Empty;

            modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<ClientTiers>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<Dossier>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<Document>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<Evenement>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<Facture>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<DossierAvocat>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<Audience>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<ConsultationJuridique>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<ActeNotarie>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<ActeHuissier>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
            modelBuilder.Entity<PrestationEcrivain>().HasQueryFilter(e => !e.IsDeleted && (currentTenantId == Guid.Empty || e.TenantId == currentTenantId));
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            Guid currentTenantId = _tenantService?.GetCurrentTenantId() ?? Guid.Empty;

            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity.TenantId == Guid.Empty && currentTenantId != Guid.Empty)
                    {
                        entry.Entity.TenantId = currentTenantId;
                    }
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
