
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
    public class SuggestionRepository : ISuggestionRepository
    {
        private readonly AppDbContext _dbContext;

        public SuggestionRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Suggestion>> GetAllAsync()
        {
            return await _dbContext.Suggestions
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Suggestion> GetByIdAsync(Guid id)
        {
            return await _dbContext.Suggestions
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Suggestion>> GetByStatusAsync(SuggestionStatus status)
        {
            return await _dbContext.Suggestions
                .Where(s => s.Status == status)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Suggestion>> GetByCategoryAsync(string category)
        {
            return await _dbContext.Suggestions
                .Where(s => s.Category == category)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Suggestion>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return new List<Suggestion>();

            searchTerm = searchTerm.ToLower();
            
            return await _dbContext.Suggestions
                .Where(s => s.Content.ToLower().Contains(searchTerm) ||
                           s.CustomerName.ToLower().Contains(searchTerm) ||
                           s.Category.ToLower().Contains(searchTerm))
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Suggestion> CreateAsync(Suggestion suggestion)
        {
            await _dbContext.Suggestions.AddAsync(suggestion);
            await _dbContext.SaveChangesAsync();
            return suggestion;
        }

        public async Task UpdateAsync(Suggestion suggestion)
        {
            _dbContext.Suggestions.Update(suggestion);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var suggestion = await _dbContext.Suggestions.FindAsync(id);
            if (suggestion != null)
            {
                _dbContext.Suggestions.Remove(suggestion);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
