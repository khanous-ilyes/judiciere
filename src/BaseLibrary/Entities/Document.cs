using System;
using System.Collections.Generic;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class Document : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string TitleArabic { get; set; } = string.Empty;
        public DocumentType Type { get; set; } = DocumentType.Autre;
        public ModuleType ModuleType { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = "application/pdf";
        public long FileSizeBytes { get; set; }
        public string FileHash { get; set; } = string.Empty; // SHA256 intégrité
        public int CurrentVersion { get; set; } = 1;

        public Guid? DossierId { get; set; }
        public Dossier? Dossier { get; set; }

        public ICollection<DocumentVersion> Versions { get; set; } = new List<DocumentVersion>();
    }

    public class DocumentVersion : BaseEntity
    {
        public Guid DocumentId { get; set; }
        public Document? Document { get; set; }

        public int VersionNumber { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string ChangesDescription { get; set; } = string.Empty;
        public string UploadedByUserName { get; set; } = string.Empty;
    }

    public class DocumentTemplate : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ModuleType ModuleType { get; set; }
        public Language Language { get; set; } = Language.Arabe;
        public string FilePath { get; set; } = string.Empty; // Template DOCX ou HTML avec placeholders {{ClientName}}, {{NIN}}, etc.
        public string Category { get; set; } = string.Empty;
        public bool IsOfficial { get; set; } = true;
    }
}
