using System;
using System.Linq;
using System.Threading.Tasks;
using BaseLibrary.DTOs.Response;
using BaseLibrary.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerLibrary.Data;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardStats()
        {
            int totalClients = await _context.ClientsTiers.CountAsync();
            int totalDossiers = await _context.Dossiers.CountAsync();
            int dossiersOuverts = await _context.Dossiers.CountAsync(d => d.Status == DossierStatus.Ouvert || d.Status == DossierStatus.EnCours);

            int audiencesAVenir = await _context.Audiences.CountAsync(a => a.DateAudience >= DateTime.UtcNow);

            var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            int actesNotariesMois = await _context.ActesNotaries.CountAsync(a => a.CreatedAt >= firstDayOfMonth);
            int actesHuissierMois = await _context.ActesHuissier.CountAsync(a => a.CreatedAt >= firstDayOfMonth);

            decimal caMois = await _context.Factures
                .Where(f => f.IssueDate >= firstDayOfMonth && f.Status == PaymentStatus.Completed)
                .SumAsync(f => (decimal?)f.PaidAmount) ?? 0;

            decimal facturesEnAttente = await _context.Factures
                .Where(f => f.Status == PaymentStatus.Pending)
                .SumAsync(f => (decimal?)(f.SubTotal * (1 + f.TaxRate / 100m) - f.PaidAmount)) ?? 0;

            var recentDossiers = await _context.Dossiers
                .Include(d => d.Client)
                .OrderByDescending(d => d.CreatedAt)
                .Take(5)
                .Select(d => new DossierResponseDto
                {
                    Id = d.Id,
                    TenantId = d.TenantId,
                    Code = d.Code,
                    Title = d.Title,
                    TitleArabic = d.TitleArabic,
                    Description = d.Description,
                    ModuleType = d.ModuleType,
                    Status = d.Status,
                    OpeningDate = d.OpeningDate,
                    ClientId = d.ClientId,
                    ClientName = d.Client != null ? d.Client.FullName : string.Empty,
                    CreatedAt = d.CreatedAt
                })
                .ToListAsync();

            var dto = new DashboardDto
            {
                TotalClients = totalClients,
                TotalDossiers = totalDossiers,
                DossiersOuverts = dossiersOuverts,
                AudiencesAVenir = audiencesAVenir,
                ActesNotariesMois = actesNotariesMois,
                ActesHuissierMois = actesHuissierMois,
                ChiffreAffairesMoisDZD = caMois,
                FacturesEnAttenteDZD = facturesEnAttente,
                RecentDossiers = recentDossiers
            };

            return Ok(ApiResponse<DashboardDto>.Ok(dto));
        }
    }
}
