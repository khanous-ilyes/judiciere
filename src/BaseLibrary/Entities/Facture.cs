using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class Facture : BaseEntity
    {
        public string InvoiceNumber { get; set; } = string.Empty; // FAC-2026-0001
        public DateTime IssueDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(30);
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public Guid ClientId { get; set; }
        public ClientTiers? Client { get; set; }

        public Guid? DossierId { get; set; }
        public Dossier? Dossier { get; set; }

        public decimal SubTotal { get; set; }
        public decimal TaxRate { get; set; } = 19.00m; // TVA Algérie
        public decimal TaxAmount => SubTotal * (TaxRate / 100m);
        public decimal TotalAmount => SubTotal + TaxAmount;
        public decimal PaidAmount { get; set; }
        public decimal BalanceDue => TotalAmount - PaidAmount;

        public string Notes { get; set; } = string.Empty;

        public ICollection<FactureLigne> Lignes { get; set; } = new List<FactureLigne>();
        public ICollection<Paiement> Paiements { get; set; } = new List<Paiement>();
    }

    public class FactureLigne : BaseEntity
    {
        public Guid FactureId { get; set; }
        public Facture? Facture { get; set; }

        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice => Quantity * UnitPrice;
    }

    public class Paiement : BaseEntity
    {
        public Guid FactureId { get; set; }
        public Facture? Facture { get; set; }

        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string PaymentMethod { get; set; } = "Espèces"; // Espèces, Chèque, Virement, Carte
        public string TransactionReference { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
