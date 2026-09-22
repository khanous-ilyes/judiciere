namespace BaseLibrary.Helpers
{
    public class JwtSettings
    {
        public string Key { get; set; } = "JudiciereSecretKeyAlgorithmicProtectionAlgDz2026SuperSecureKey!";
        public string Issuer { get; set; } = "JudiciereAPI";
        public string Audience { get; set; } = "JudiciereClients";
        public int ExpirationMinutes { get; set; } = 120;
        public int RefreshExpirationDays { get; set; } = 7;
    }
}
