using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BaseLibrary.DTOs.Request;
using BaseLibrary.DTOs.Response;
using BaseLibrary.Entities;
using BaseLibrary.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerLibrary.Data;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsTiersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsTiersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetClients([FromQuery] PageRequestDto request)
        {
            IQueryable<ClientTiers> query = _context.ClientsTiers;

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                string term = request.SearchTerm.ToLower();
                query = query.Where(c => c.FirstName.ToLower().Contains(term) ||
                                         c.LastName.ToLower().Contains(term) ||
                                         c.CompanyName.ToLower().Contains(term) ||
                                         (c.NIN != null && c.NIN.Contains(term)) ||
                                         (c.RegisterCommerceNumber != null && c.RegisterCommerceNumber.Contains(term)));
            }

            int count = await query.CountAsync();
            int pageNumber = request.PageNumber > 0 ? request.PageNumber : 1;
            int pageSize = request.PageSize > 0 ? request.PageSize : 10;

            var items = await query.OrderByDescending(c => c.CreatedAt)
                                   .Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();

            var dtos = items.Select(MapToDto).ToList();
            return Ok(ApiResponse<PaginatedResponseDto<ClientTiersResponseDto>>.Ok(
                new PaginatedResponseDto<ClientTiersResponseDto>(dtos, count, pageNumber, pageSize)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientById(Guid id)
        {
            var client = await _context.ClientsTiers.FindAsync(id);
            if (client == null) return NotFound(ApiResponse<string>.Fail("Client introuvable", 404));
            return Ok(ApiResponse<ClientTiersResponseDto>.Ok(MapToDto(client)));
        }

        [HttpPost]
        public async Task<IActionResult> CreateClient([FromBody] CreateClientTiersDto dto)
        {
            var client = new ClientTiers
            {
                PersonType = dto.PersonType,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                NIN = dto.NIN,
                DateOfBirth = dto.DateOfBirth,
                PlaceOfBirth = dto.PlaceOfBirth,
                Nationality = dto.Nationality,
                CompanyName = dto.CompanyName,
                RegisterCommerceNumber = dto.RegisterCommerceNumber,
                NIF = dto.NIF,
                NIS = dto.NIS,
                LegalRepresentativeName = dto.LegalRepresentativeName,
                Phone = dto.Phone,
                Email = dto.Email,
                Address = dto.Address,
                Wilaya = dto.Wilaya,
                Commune = dto.Commune,
                Notes = dto.Notes
            };

            await _context.ClientsTiers.AddAsync(client);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<ClientTiersResponseDto>.Ok(MapToDto(client), "Client créé avec succès"));
        }

        private static ClientTiersResponseDto MapToDto(ClientTiers c)
        {
            return new ClientTiersResponseDto
            {
                Id = c.Id,
                TenantId = c.TenantId,
                PersonType = c.PersonType,
                FirstName = c.FirstName,
                LastName = c.LastName,
                FullName = c.FullName,
                NIN = c.NIN,
                DateOfBirth = c.DateOfBirth,
                PlaceOfBirth = c.PlaceOfBirth,
                Nationality = c.Nationality,
                CompanyName = c.CompanyName,
                RegisterCommerceNumber = c.RegisterCommerceNumber,
                NIF = c.NIF,
                NIS = c.NIS,
                Phone = c.Phone,
                Email = c.Email,
                Address = c.Address,
                Wilaya = c.Wilaya,
                Commune = c.Commune,
                CreatedAt = c.CreatedAt
            };
        }
    }
}
