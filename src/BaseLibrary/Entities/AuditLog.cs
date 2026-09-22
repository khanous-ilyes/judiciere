using System;
using BaseLibrary.Helpers;

namespace BaseLibrary.Entities
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty; // CREATE, UPDATE, DELETE, VIEW, EXPORT
        public string EntityType { get; set; } = string.Empty;
        public Guid? EntityId { get; set; }
        public string OldValues { get; set; } = string.Empty; // JSON snapshot
        public string NewValues { get; set; } = string.Empty; // JSON snapshot
        public string IpAddress { get; set; } = "127.0.0.1";
        public string UserAgent { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class Notification : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; } = NotificationType.InApp;
        public bool IsRead { get; set; } = false;
        public DateTime? ReadAt { get; set; }
        public string? TargetUrl { get; set; }
    }
}
