using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class SubscriptionPlan
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty; // Standard, Pro, Multi-Cabinet
        public string Description { get; set; } = string.Empty;
        public decimal PriceDZD { get; set; }
        public int BillingCycleDays { get; set; } = 365; // Annuel par défaut
        public string AllowedModulesJSON { get; set; } = "[\"Avocat\",\"Notaire\",\"Huissier\",\"EcrivainPublic\"]";
        public int MaxUsers { get; set; } = 10;
        public int MaxDossiers { get; set; } = 5000;
        public long MaxStorageBytes { get; set; } = 10737418240; // 10 GB
        public bool IsActive { get; set; } = true;
    }

    public class Subscription
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public Guid SubscriptionPlanId { get; set; }
        public SubscriptionPlan? SubscriptionPlan { get; set; }

        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime EndDate { get; set; } = DateTime.UtcNow.AddYears(1);
        public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
        public decimal AmountPaidDZD { get; set; }
        public string PaymentMethod { get; set; } = "Virement";
        public DateTime? AutoRenewDate { get; set; }
    }
}
