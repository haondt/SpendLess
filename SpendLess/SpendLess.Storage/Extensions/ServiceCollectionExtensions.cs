using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddJsonFileStorageWithStringKey<TEntity>(this IServiceCollection services, string fileName)
        {
            services.AddSingleton<INestableStorage<string, TEntity>, JsonFileStorage<string, TEntity>>(sp => new JsonFileStorage<string, TEntity>(fileName, () => Guid.NewGuid().ToString()));
            services.AddSingleton<IStorage<string, TEntity>, CachedFileStorage<string, TEntity>>();
            return services;

        }
        public static IServiceCollection AddJsonFileStorageWithGuidKey<TEntity>(this IServiceCollection services, string fileName)
        {
            services.AddSingleton<INestableStorage<Guid, TEntity>, JsonFileStorage<Guid, TEntity>>(sp => new JsonFileStorage<Guid, TEntity>(fileName, Guid.NewGuid));
            services.AddSingleton<IStorage<Guid, TEntity>, CachedFileStorage<Guid, TEntity>>();
            return services;
        }

        public static IServiceCollection AddPersistentStorageWithStringKey<TEntity>(this IServiceCollection services) =>
            services.AddSingleton<IStorage<string, TEntity>, PersistentStorage<string, TEntity>>(sp => new PersistentStorage<string, TEntity>(() => Guid.NewGuid().ToString()));

        public static IServiceCollection AddPersistentStorageWithGuidKey<TKey, TEntity>(this IServiceCollection services) =>
            services.AddSingleton<IStorage<Guid, TEntity>, PersistentStorage<Guid, TEntity>>(sp => new PersistentStorage<Guid, TEntity>(Guid.NewGuid));
    }
}
