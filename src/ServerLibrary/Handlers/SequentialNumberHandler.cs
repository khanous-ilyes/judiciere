using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ServerLibrary.Data;

namespace ServerLibrary.Handlers
{
    public interface ISequentialNumberHandler
    {
        Task<(long Number, string InviolableHash)> GetNextNotaryRegisterNumberAsync(Guid tenantId);
        Task<long> GetNextHuissierPVNumberAsync(Guid tenantId);
    }

    public class SequentialNumberHandler : ISequentialNumberHandler
    {
        private readonly ApplicationDbContext _context;

        public SequentialNumberHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(long Number, string InviolableHash)> GetNextNotaryRegisterNumberAsync(Guid tenantId)
        {
            int currentYear = DateTime.UtcNow.Year;
            var register = await _context.RepertoiresNotariaux
                .FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Annee == currentYear);

            if (register == null)
            {
                register = new BaseLibrary.Entities.RepertoireNotarial
                {
                    TenantId = tenantId,
                    Annee = currentYear,
                    DernierNumeroSequence = 1,
                    DernierHashInviolable = ComputeHash(tenantId, currentYear, 1, "INITIAL")
                };
                await _context.RepertoiresNotariaux.AddAsync(register);
            }
            else
            {
                register.DernierNumeroSequence += 1;
                register.DernierHashInviolable = ComputeHash(tenantId, currentYear, register.DernierNumeroSequence, register.DernierHashInviolable);
                _context.RepertoiresNotariaux.Update(register);
            }

            await _context.SaveChangesAsync();
            return (register.DernierNumeroSequence, register.DernierHashInviolable);
        }

        public async Task<long> GetNextHuissierPVNumberAsync(Guid tenantId)
        {
            var maxPV = await _context.ActesHuissier
                .IgnoreQueryFilters()
                .Where(a => a.TenantId == tenantId)
                .MaxAsync(a => (long?)a.NumeroPV) ?? 0;

            return maxPV + 1;
        }

        private static string ComputeHash(Guid tenantId, int year, long seqNumber, string previousHash)
        {
            string raw = $"{tenantId}:{year}:{seqNumber}:{previousHash}:{DateTime.UtcNow.Ticks}";
            using var sha256 = SHA256.Create();
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(raw));
            return Convert.ToHexString(bytes);
        }
    }
}
