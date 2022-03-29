using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpendLess.Authentication.Abstractions;
using SpendLess.Domain.Models;
using SpendLess.Authentication.Services;
using SpendLess.Authentication.Settings;
using SpendLess.Storage.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Authentication.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSpendLessAuthenticationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IAuthenticationService, AuthenticationService>();
            services.AddTransient<ICryptoService, CryptoService>();
            services.AddTransient<IPrincipalService, PrincipalService>();
            services.Configure<AuthenticationSettings>(configuration.GetSection(nameof(AuthenticationSettings)));
            services.AddSingleton<IJwtService, JwtService>();

            services.AddPersistentStorageWithStringKey<RefreshTokenData>();
            return services;
        }
    }
}
