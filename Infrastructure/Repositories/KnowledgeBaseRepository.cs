
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SurveyApp.Application.Ports;
using SurveyApp.Domain.Entities;
using SurveyApp.Infrastructure.Data;

namespace SurveyApp.Infrastructure.Repositories
{
    public class KnowledgeBaseRepository : IKnowledgeBaseRepository
    {
        private readonly AppDbContext _dbContext;

        public KnowledgeBaseRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<KnowledgeBaseItem>> GetAllAsync()
        {
            return await _dbContext.KnowledgeBaseItems
                .OrderByDescending(k => k.UpdatedAt)
                .ToListAsync();
        }

        public async Task<KnowledgeBaseItem> GetByIdAsync(Guid id)
        {
            return await _dbContext.KnowledgeBaseItems
                .FirstOrDefaultAsync(k => k.Id == id);
        }

        public async Task<List<KnowledgeBaseItem>> GetByCategoryAsync(string category)
        {
            return await _dbContext.KnowledgeBaseItems
                .Where(k => k.Category == category)
                .OrderByDescending(k => k.UpdatedAt)
                .ToListAsync();
        }

        public async Task<List<KnowledgeBaseItem>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return new List<KnowledgeBaseItem>();

            searchTerm = searchTerm.ToLower();
            
            return await _dbContext.KnowledgeBaseItems
                .Where(k => k.Title.ToLower().Contains(searchTerm) ||
                           k.Content.ToLower().Contains(searchTerm) ||
                           k.Category.ToLower().Contains(searchTerm) ||
                           k.Tags.Any(t => t.ToLower().Contains(searchTerm)))
                .OrderByDescending(k => k.UpdatedAt)
                .ToListAsync();
        }

        public async Task<KnowledgeBaseItem> CreateAsync(KnowledgeBaseItem item)
        {
            await _dbContext.KnowledgeBaseItems.AddAsync(item);
            await _dbContext.SaveChangesAsync();
            return item;
        }

        public async Task UpdateAsync(KnowledgeBaseItem item)
        {
            _dbContext.KnowledgeBaseItems.Update(item);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var item = await _dbContext.KnowledgeBaseItems.FindAsync(id);
            if (item != null)
            {
                _dbContext.KnowledgeBaseItems.Remove(item);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
