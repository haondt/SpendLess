namespace SpendLess.Settings
{
    public class AuthenticationSettings
    {
        public string RefreshTokenCookieName { get; set; }
        public int RefreshTokenExpirationSeconds { get; set; }
        public int AccessTokenExpirationSeconds { get; set; }
    }
}
