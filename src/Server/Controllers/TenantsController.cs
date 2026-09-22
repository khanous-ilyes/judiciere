using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BaseLibrary.DTOs.Request;
using BaseLibrary.DTOs.Response;
using BaseLibrary.Entities;
using BaseLibrary.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerLibrary.Data;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TenantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TenantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTenants()
        {
            var tenants = await _context.Tenants
                .Include(t => t.TenantModules)
                .Include(t => t.Users)
                .ToListAsync();

            var dtos = tenants.Select(t => new TenantResponseDto
            {
                Id = t.Id,
                Name = t.Name,
                LegalName = t.LegalName,
                ProfessionalRegistrationNumber = t.ProfessionalRegistrationNumber,
                Wilaya = t.Wilaya,
                Address = t.Address,
                Phone = t.Phone,
                Email = t.Email,
                HeaderInfo = t.HeaderInfo,
                IsActive = t.IsActive,
                CreatedAt = t.CreatedAt,
                MaxUsers = t.MaxUsers,
                MaxDossiers = t.MaxDossiers,
                MaxStorageBytes = t.MaxStorageBytes,
                ActiveModules = t.TenantModules.Where(m => m.IsActive).Select(m => m.ModuleType.ToString()).ToList()
            }).ToList();

            return Ok(ApiResponse<List<TenantResponseDto>>.Ok(dtos));
        }

        [HttpPost("{id}/toggle-module")]
        public async Task<IActionResult> ToggleModule(Guid id, [FromBody] ToggleModuleDto dto)
        {
            var tenant = await _context.Tenants
                .Include(t => t.TenantModules)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tenant == null)
            {
                return NotFound(ApiResponse<string>.Fail("Cabinet introuvable", 404));
            }

            var existingModule = tenant.TenantModules.FirstOrDefault(m => m.ModuleType == dto.ModuleType);
            if (existingModule != null)
            {
                existingModule.IsActive = dto.IsActive;
                existingModule.DeactivatedAt = dto.IsActive ? null : DateTime.UtcNow;
            }
            else if (dto.IsActive)
            {
                tenant.TenantModules.Add(new TenantModule
                {
                    TenantId = tenant.Id,
                    ModuleType = dto.ModuleType,
                    IsActive = true,
                    ActivatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return Ok(ApiResponse<string>.Ok($"Module {dto.ModuleType} updated successfully to IsActive={dto.IsActive}"));
        }

        [HttpPost("{id}/toggle-status")]
        public async Task<IActionResult> ToggleTenantStatus(Guid id)
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant == null) return NotFound(ApiResponse<string>.Fail("Cabinet introuvable", 404));

            tenant.IsActive = !tenant.IsActive;
            tenant.SuspendedAt = tenant.IsActive ? null : DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(ApiResponse<string>.Ok($"Statut du cabinet mis à jour: {(tenant.IsActive ? "Actif" : "Suspendu")}"));
        }
    }
}
