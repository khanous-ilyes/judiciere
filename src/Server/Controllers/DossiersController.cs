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
using ServerLibrary.Handlers;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DossiersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ISequentialNumberHandler _seqHandler;

        public DossiersController(ApplicationDbContext context, ISequentialNumberHandler seqHandler)
        {
            _context = context;
            _seqHandler = seqHandler;
        }

        [HttpGet]
        public async Task<IActionResult> GetDossiers([FromQuery] ModuleType? module, [FromQuery] PageRequestDto request)
        {
            IQueryable<Dossier> query = _context.Dossiers.Include(d => d.Client);

            if (module.HasValue)
            {
                query = query.Where(d => d.ModuleType == module.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                string term = request.SearchTerm.ToLower();
                query = query.Where(d => d.Code.ToLower().Contains(term) ||
                                         d.Title.ToLower().Contains(term) ||
                                         d.TitleArabic.Contains(term) ||
                                         (d.Client != null && (d.Client.FirstName.ToLower().Contains(term) || d.Client.LastName.ToLower().Contains(term) || d.Client.CompanyName.ToLower().Contains(term))));
            }

            int count = await query.CountAsync();
            int pageNumber = request.PageNumber > 0 ? request.PageNumber : 1;
            int pageSize = request.PageSize > 0 ? request.PageSize : 10;

            var items = await query.OrderByDescending(d => d.CreatedAt)
                                   .Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();

            var dtos = new List<DossierResponseDto>();
            foreach (var item in items)
            {
                var dto = MapToDto(item);
                if (item.ModuleType == ModuleType.Avocat)
                {
                    var avocat = await _context.DossiersAvocat.Include(a => a.Audiences).FirstOrDefaultAsync(a => a.DossierId == item.Id);
                    if (avocat != null)
                    {
                        dto.AvocatDetails = new DossierAvocatResponseDto
                        {
                            Id = avocat.Id,
                            TypeAffaire = avocat.TypeAffaire,
                            Juridiction = avocat.Juridiction,
                            Chambre = avocat.Chambre,
                            NumeroRole = avocat.NumeroRole,
                            Adversaire = avocat.Adversaire,
                            AvocatAdversaire = avocat.AvocatAdversaire,
                            DemandeurDefendeur = avocat.DemandeurDefendeur,
                            Audiences = avocat.Audiences.Select(a => new AudienceResponseDto
                            {
                                Id = a.Id,
                                DateAudience = a.DateAudience,
                                Juridiction = a.Juridiction,
                                Salle = a.Salle,
                                Objectif = a.Objectif,
                                Decision = a.Decision,
                                VoieRecours = a.VoieRecours
                            }).ToList()
                        };
                    }
                }
                else if (item.ModuleType == ModuleType.Notaire)
                {
                    var notaire = await _context.ActesNotaries.FirstOrDefaultAsync(a => a.DossierId == item.Id);
                    if (notaire != null)
                    {
                        dto.NotaireDetails = new ActeNotarieResponseDto
                        {
                            Id = notaire.Id,
                            TypeActe = notaire.TypeActe,
                            NumeroRepertoire = notaire.NumeroRepertoire,
                            CodeRepertoireInviolable = notaire.CodeRepertoireInviolable,
                            DateActe = notaire.DateActe,
                            FormeActe = notaire.FormeActe,
                            ObjetActe = notaire.ObjetActe,
                            ObjetActeArabe = notaire.ObjetActeArabe,
                            ValeurDeclaree = notaire.ValeurDeclaree,
                            DroitsEnregistrement = notaire.DroitsEnregistrement
                        };
                    }
                }
                else if (item.ModuleType == ModuleType.Huissier)
                {
                    var huissier = await _context.ActesHuissier.FirstOrDefaultAsync(h => h.DossierId == item.Id);
                    if (huissier != null)
                    {
                        dto.HuissierDetails = new ActeHuissierResponseDto
                        {
                            Id = huissier.Id,
                            TypeActe = huissier.TypeActe,
                            NumeroPV = huissier.NumeroPV,
                            DateSignification = huissier.DateSignification,
                            HeureSignification = huissier.HeureSignification,
                            LangueObligatoire = huissier.LangueObligatoire,
                            PartieRequérante = huissier.PartieRequérante,
                            PartieSignifiée = huissier.PartieSignifiée,
                            AdresseSignification = huissier.AdresseSignification,
                            QualiteRecepteur = huissier.QualiteRecepteur,
                            ContingencePV = huissier.ContingencePV,
                            HonoraireReglementaire = huissier.HonoraireReglementaire,
                            DroitDEnregistrement = huissier.DroitDEnregistrement,
                            FraisDeDeplacement = huissier.FraisDeDeplacement,
                            TotalDZD = huissier.TotalDZD,
                            EstVenteAuxEncheres = huissier.EstVenteAuxEncheres
                        };
                    }
                }
                else if (item.ModuleType == ModuleType.EcrivainPublic)
                {
                    var ecrivain = await _context.PrestationsEcrivain.FirstOrDefaultAsync(e => e.DossierId == item.Id);
                    if (ecrivain != null)
                    {
                        dto.EcrivainDetails = new PrestationEcrivainResponseDto
                        {
                            Id = ecrivain.Id,
                            TypePrestation = ecrivain.TypePrestation,
                            IntitulePrestation = ecrivain.IntitulePrestation,
                            DestinataireAdministration = ecrivain.DestinataireAdministration,
                            DocumentTemplateUtilise = ecrivain.DocumentTemplateUtilise,
                            TarifPrestation = ecrivain.TarifPrestation,
                            EstLivre = ecrivain.EstLivre,
                            DateLivraison = ecrivain.DateLivraison
                        };
                    }
                }
                dtos.Add(dto);
            }

            return Ok(ApiResponse<PaginatedResponseDto<DossierResponseDto>>.Ok(
                new PaginatedResponseDto<DossierResponseDto>(dtos, count, pageNumber, pageSize)));
        }

        [HttpPost]
        public async Task<IActionResult> CreateDossier([FromBody] CreateDossierDto dto)
        {
            string prefix = dto.ModuleType switch
            {
                ModuleType.Avocat => "AV",
                ModuleType.Notaire => "NOT",
                ModuleType.Huissier => "HUI",
                ModuleType.EcrivainPublic => "ECR",
                _ => "DOS"
            };

            int currentYear = DateTime.UtcNow.Year;
            int nextNumber = await _context.Dossiers.CountAsync(d => d.ModuleType == dto.ModuleType) + 1;
            string code = $"{prefix}-{currentYear}-{nextNumber:D4}";

            var dossier = new Dossier
            {
                Code = code,
                Title = dto.Title,
                TitleArabic = dto.TitleArabic,
                Description = dto.Description,
                ModuleType = dto.ModuleType,
                Status = DossierStatus.Ouvert,
                ClientId = dto.ClientId,
                AssignedUserId = dto.AssignedUserId
            };

            await _context.Dossiers.AddAsync(dossier);
            await _context.SaveChangesAsync();

            // Create Sub-module Specific Entities
            if (dto.ModuleType == ModuleType.Avocat && dto.AvocatDetails != null)
            {
                var avocat = new DossierAvocat
                {
                    DossierId = dossier.Id,
                    TypeAffaire = dto.AvocatDetails.TypeAffaire,
                    Juridiction = dto.AvocatDetails.Juridiction,
                    Chambre = dto.AvocatDetails.Chambre,
                    NumeroRole = dto.AvocatDetails.NumeroRole,
                    Adversaire = dto.AvocatDetails.Adversaire,
                    AvocatAdversaire = dto.AvocatDetails.AvocatAdversaire,
                    DemandeurDefendeur = dto.AvocatDetails.DemandeurDefendeur
                };
                await _context.DossiersAvocat.AddAsync(avocat);
            }
            else if (dto.ModuleType == ModuleType.Notaire && dto.NotaireDetails != null)
            {
                var (seqNumber, hash) = await _seqHandler.GetNextNotaryRegisterNumberAsync(dossier.TenantId);
                var notaire = new ActeNotarie
                {
                    DossierId = dossier.Id,
                    TypeActe = dto.NotaireDetails.TypeActe,
                    NumeroRepertoire = seqNumber,
                    CodeRepertoireInviolable = hash,
                    DateActe = dto.NotaireDetails.DateActe,
                    FormeActe = dto.NotaireDetails.FormeActe,
                    ObjetActe = dto.NotaireDetails.ObjetActe,
                    ObjetActeArabe = dto.NotaireDetails.ObjetActeArabe,
                    ValeurDeclaree = dto.NotaireDetails.ValeurDeclaree,
                    DroitsEnregistrement = dto.NotaireDetails.DroitsEnregistrement,
                    AutresPartiesNIN = dto.NotaireDetails.AutresPartiesNIN
                };
                await _context.ActesNotaries.AddAsync(notaire);
            }
            else if (dto.ModuleType == ModuleType.Huissier && dto.HuissierDetails != null)
            {
                long seqPV = await _seqHandler.GetNextHuissierPVNumberAsync(dossier.TenantId);
                var huissier = new ActeHuissier
                {
                    DossierId = dossier.Id,
                    TypeActe = dto.HuissierDetails.TypeActe,
                    NumeroPV = seqPV,
                    DateSignification = dto.HuissierDetails.DateSignification,
                    HeureSignification = dto.HuissierDetails.HeureSignification,
                    LangueObligatoire = "Arabe",
                    PartieRequérante = dto.HuissierDetails.PartieRequérante,
                    PartieSignifiée = dto.HuissierDetails.PartieSignifiée,
                    AdresseSignification = dto.HuissierDetails.AdresseSignification,
                    QualiteRecepteur = dto.HuissierDetails.QualiteRecepteur,
                    ContingencePV = dto.HuissierDetails.ContingencePV,
                    HonoraireReglementaire = dto.HuissierDetails.HonoraireReglementaire,
                    DroitDEnregistrement = dto.HuissierDetails.DroitDEnregistrement,
                    FraisDeDeplacement = dto.HuissierDetails.FraisDeDeplacement,
                    EstVenteAuxEncheres = dto.HuissierDetails.EstVenteAuxEncheres,
                    InventaireBiensJSON = dto.HuissierDetails.InventaireBiensJSON
                };
                await _context.ActesHuissier.AddAsync(huissier);
            }
            else if (dto.ModuleType == ModuleType.EcrivainPublic && dto.EcrivainDetails != null)
            {
                var ecrivain = new PrestationEcrivain
                {
                    DossierId = dossier.Id,
                    TypePrestation = dto.EcrivainDetails.TypePrestation,
                    IntitulePrestation = dto.EcrivainDetails.IntitulePrestation,
                    DestinataireAdministration = dto.EcrivainDetails.DestinataireAdministration,
                    DocumentTemplateUtilise = dto.EcrivainDetails.DocumentTemplateUtilise,
                    TarifPrestation = dto.EcrivainDetails.TarifPrestation,
                    NumeroAutorisationWali = dto.EcrivainDetails.NumeroAutorisationWali
                };
                await _context.PrestationsEcrivain.AddAsync(ecrivain);
            }

            await _context.SaveChangesAsync();
            return Ok(ApiResponse<DossierResponseDto>.Ok(MapToDto(dossier), "Dossier créé avec succès"));
        }

        private static DossierResponseDto MapToDto(Dossier d)
        {
            return new DossierResponseDto
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
                ClosingDate = d.ClosingDate,
                ClientId = d.ClientId,
                ClientName = d.Client != null ? d.Client.FullName : string.Empty,
                AssignedUserId = d.AssignedUserId,
                CreatedAt = d.CreatedAt
            };
        }
    }
}
