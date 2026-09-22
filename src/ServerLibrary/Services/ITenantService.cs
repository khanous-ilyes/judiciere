using System;

namespace ServerLibrary.Services
{
    public interface ITenantService
    {
        Guid GetCurrentTenantId();
        void SetCurrentTenantId(Guid tenantId);
    }

    public class TenantService : ITenantService
    {
        private Guid _currentTenantId = Guid.Empty;

        public Guid GetCurrentTenantId() => _currentTenantId;

        public void SetCurrentTenantId(Guid tenantId)
        {
            _currentTenantId = tenantId;
        }
    }
}
