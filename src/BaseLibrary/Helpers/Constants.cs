namespace BaseLibrary.Helpers
{
    public static class Constants
    {
        public static class ClaimTypes
        {
            public const string TenantId = "tenant_id";
            public const string UserType = "user_type";
            public const string ActiveModules = "active_modules";
            public const string FullName = "full_name";
        }

        public static class Roles
        {
            public const string SuperAdmin = "SuperAdmin";
            public const string AdminCabinet = "AdminCabinet";
            public const string Collaborateur = "Collaborateur";
            public const string Secretaire = "Secretaire";
            public const string Comptable = "Comptable";
        }

        public static class Modules
        {
            public const string Avocat = "Avocat";
            public const string Notaire = "Notaire";
            public const string Huissier = "Huissier";
            public const string EcrivainPublic = "EcrivainPublic";
        }
    }
}
