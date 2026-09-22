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
    public class FacturesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FacturesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetFactures()
        {
            var factures = await _context.Factures
                .Include(f => f.Client)
                .Include(f => f.Lignes)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            var dtos = factures.Select(f => new FactureResponseDto
            {
                Id = f.Id,
                InvoiceNumber = f.InvoiceNumber,
                IssueDate = f.IssueDate,
                DueDate = f.DueDate,
                Status = f.Status,
                ClientId = f.ClientId,
                ClientName = f.Client != null ? f.Client.FullName : string.Empty,
                SubTotal = f.SubTotal,
                TaxRate = f.TaxRate,
                TaxAmount = f.TaxAmount,
                TotalAmount = f.TotalAmount,
                PaidAmount = f.PaidAmount,
                BalanceDue = f.BalanceDue,
                Lignes = f.Lignes.Select(l => new FactureLigneResponseDto
                {
                    Id = l.Id,
                    Description = l.Description,
                    Quantity = l.Quantity,
                    UnitPrice = l.UnitPrice,
                    TotalPrice = l.TotalPrice
                }).ToList()
            }).ToList();

            return Ok(ApiResponse<List<FactureResponseDto>>.Ok(dtos));
        }

        [HttpPost]
        public async Task<IActionResult> CreateFacture([FromBody] CreateFactureDto dto)
        {
            int currentYear = DateTime.UtcNow.Year;
            int nextNumber = await _context.Factures.CountAsync() + 1;
            string invNum = $"FAC-{currentYear}-{nextNumber:D4}";

            decimal subTotal = dto.Lignes.Sum(l => l.Quantity * l.UnitPrice);

            var facture = new Facture
            {
                InvoiceNumber = invNum,
                IssueDate = DateTime.UtcNow,
                DueDate = dto.DueDate,
                Status = PaymentStatus.Pending,
                ClientId = dto.ClientId,
                DossierId = dto.DossierId,
                SubTotal = subTotal,
                TaxRate = dto.TaxRate,
                Notes = dto.Notes,
                Lignes = dto.Lignes.Select(l => new FactureLigne
                {
                    Description = l.Description,
                    Quantity = l.Quantity,
                    UnitPrice = l.UnitPrice
                }).ToList()
            };

            await _context.Factures.AddAsync(facture);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.Ok($"Facture {invNum} créée avec succès. Total: {facture.TotalAmount} DZD"));
        }

        [HttpPost("{id}/pay")]
        public async Task<IActionResult> RecordPayment(Guid id, [FromBody] CreatePaiementDto dto)
        {
            var facture = await _context.Factures.FindAsync(id);
            if (facture == null) return NotFound(ApiResponse<string>.Fail("Facture introuvable", 404));

            var paiement = new Paiement
            {
                FactureId = id,
                Amount = dto.Amount,
                PaymentDate = DateTime.UtcNow,
                PaymentMethod = dto.PaymentMethod,
                TransactionReference = dto.TransactionReference,
                Notes = dto.Notes
            };

            await _context.Paiements.AddAsync(paiement);
            facture.PaidAmount += dto.Amount;

            if (facture.PaidAmount >= facture.TotalAmount)
            {
                facture.Status = PaymentStatus.Completed;
            }

            await _context.SaveChangesAsync();
            return Ok(ApiResponse<string>.Ok($"Paiement de {dto.Amount} DZD enregistré pour la facture {facture.InvoiceNumber}"));
        }
    }
}
