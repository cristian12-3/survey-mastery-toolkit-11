
using Microsoft.EntityFrameworkCore;
using SurveyApp.Domain.Entities;

namespace SurveyApp.Infrastructure.Data
{
    public static class AppDbContextExtensions
    {
        public static void ConfigureCustomerEntity(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.BrandName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ContactEmail).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ContactPhone).HasMaxLength(20);
                entity.Property(e => e.CreatedAt);
                
                // Configure AcquiredServices collection as a converted JSON string
                entity.Property(e => e.AcquiredServices)
                    .HasConversion(
                        v => string.Join(",", v),
                        v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                    );
                
                // Configure one-to-many relationship with GrowthMetric
                entity.HasMany(e => e.GrowthMetrics)
                    .WithOne()
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
        
        public static void ConfigureGrowthMetricEntity(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GrowthMetric>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Period).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Revenue).HasColumnType("decimal(18,2)");
                entity.Property(e => e.UserCount);
            });
        }
        
        public static void ConfigureAnalyticsDataEntity(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AnalyticsData>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalSurveys);
                entity.Property(e => e.TotalResponses);
                entity.Property(e => e.AverageCompletionRate);
                
                // Configure QuestionTypeDistribution as a converted JSON string
                entity.Property(e => e.QuestionTypeDistribution)
                    .HasConversion(
                        v => System.Text.Json.JsonSerializer.Serialize(v, new System.Text.Json.JsonSerializerOptions()),
                        v => System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, int>>(v, new System.Text.Json.JsonSerializerOptions()) ?? new Dictionary<string, int>()
                    );
                
                // Configure one-to-many relationship with SurveyResponseTrend
                entity.HasMany(e => e.ResponseTrends)
                    .WithOne()
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            modelBuilder.Entity<SurveyResponseTrend>(entity =>
            {
                entity.HasKey(e => new { e.Date });
                entity.Property(e => e.Date).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Responses);
            });
        }
    }
}
