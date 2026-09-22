using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BaseLibrary.DTOs.Auth;
using BaseLibrary.Entities;
using BaseLibrary.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ServerLibrary.Data;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
            _jwtSettings = new JwtSettings();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower() && !u.IsDeleted);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return BadRequest(ApiResponse<TokenDto>.Fail("Identifiants invalides ou compte inactif", 400));
            }

            if (!user.IsActive)
            {
                return BadRequest(ApiResponse<TokenDto>.Fail("Votre compte est désactivé. Veuillez contacter l'administrateur.", 403));
            }

            // Retrieve Tenant & Active Modules
            string cabinetName = "SuperAdmin Platform";
            string[] activeModules = new string[0];

            if (user.TenantId != Guid.Empty)
            {
                var tenant = await _context.Tenants
                    .Include(t => t.TenantModules)
                    .FirstOrDefaultAsync(t => t.Id == user.TenantId);

                if (tenant != null)
                {
                    if (!tenant.IsActive)
                    {
                        return BadRequest(ApiResponse<TokenDto>.Fail("Le cabinet est temporairement suspendu.", 403));
                    }
                    cabinetName = tenant.Name;
                    activeModules = tenant.TenantModules
                        .Where(m => m.IsActive)
                        .Select(m => m.ModuleType.ToString())
                        .ToArray();
                }
            }
            else if (user.Role == UserType.SuperAdmin)
            {
                activeModules = new[] { "Avocat", "Notaire", "Huissier", "EcrivainPublic" };
            }

            user.LastLoginAt = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user, cabinetName, activeModules);
            token.ActiveModules = activeModules;
            token.CabinetName = cabinetName;

            return Ok(ApiResponse<TokenDto>.Ok(token, "Connexion réussie"));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.IgnoreQueryFilters().AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(ApiResponse<TokenDto>.Fail("Cet email est déjà utilisé."));
            }

            // Create Tenant Cabinet
            var tenant = new Tenant
            {
                Name = dto.CabinetName,
                LegalName = dto.CabinetName,
                Wilaya = dto.Wilaya,
                Email = dto.Email,
                Phone = dto.Phone,
                IsActive = true
            };
            await _context.Tenants.AddAsync(tenant);

            // Add selected primary module
            var tenantModule = new TenantModule
            {
                TenantId = tenant.Id,
                ModuleType = dto.PrimaryModule,
                IsActive = true
            };
            await _context.TenantModules.AddAsync(tenantModule);

            // Create Admin Cabinet User
            var user = new User
            {
                TenantId = tenant.Id,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Role = UserType.AdminCabinet,
                IsActive = true
            };
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var activeModules = new[] { dto.PrimaryModule.ToString() };
            var token = GenerateJwtToken(user, tenant.Name, activeModules);
            token.ActiveModules = activeModules;
            token.CabinetName = tenant.Name;

            return Ok(ApiResponse<TokenDto>.Ok(token, "Compte cabinet créé avec succès"));
        }

        private TokenDto GenerateJwtToken(User user, string cabinetName, string[] activeModules)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(Constants.ClaimTypes.FullName, user.FullName),
                new Claim(Constants.ClaimTypes.TenantId, user.TenantId.ToString()),
                new Claim(Constants.ClaimTypes.UserType, user.Role.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(Constants.ClaimTypes.ActiveModules, string.Join(",", activeModules))
            };

            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new TokenDto
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = Guid.NewGuid().ToString("N"),
                ExpiresAt = expires,
                UserId = user.Id,
                TenantId = user.TenantId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
