using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class Evenement : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsAllDay { get; set; } = false;
        public string Location { get; set; } = string.Empty;
        public string EventType { get; set; } = "Audience"; // Audience, RDV, EchéanceLégale, Signature
        public bool ReminderSent { get; set; } = false;

        public Guid? DossierId { get; set; }
        public Dossier? Dossier { get; set; }

        public Guid? UserId { get; set; }
        public User? User { get; set; }
    }
}
