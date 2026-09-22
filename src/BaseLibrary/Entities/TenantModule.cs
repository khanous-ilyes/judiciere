using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class TenantModule
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public ModuleType ModuleType { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime ActivatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeactivatedAt { get; set; }

        public Tenant? Tenant { get; set; }
    }
}
