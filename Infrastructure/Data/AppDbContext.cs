
using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SurveyApp.Domain.Entities;

namespace SurveyApp.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Survey> Surveys { get; set; }
        public DbSet<Question> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Survey entity
            modelBuilder.Entity<Survey>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).IsRequired();

                entity.HasMany(e => e.Questions)
                      .WithOne()
                      .HasForeignKey("SurveyId")
                      .OnDelete(DeleteBehavior.Cascade);

                // Configure complex properties
                entity.OwnsOne(e => e.DeliveryConfig, config =>
                {
                    config.Property(c => c.Type).HasConversion<string>();
                    config.Property(c => c.EmailAddresses).HasConversion(
                        v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                        v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions())
                    );

                    config.OwnsOne(c => c.Schedule);
                    config.OwnsOne(c => c.Trigger);
                });
            });

            // Configure Question entity
            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Type).HasConversion<string>();

                // Configure complex properties
                entity.Property(e => e.Options).HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions())
                );
            });
        }
    }
}
