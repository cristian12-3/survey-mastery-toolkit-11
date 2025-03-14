
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SurveyApp.Domain.Entities;

namespace SurveyApp.Application.Ports
{
    public interface ISurveyRepository
    {
        Task<Survey> GetByIdAsync(Guid id);
        Task<List<Survey>> GetAllAsync();
        Task<Survey> CreateAsync(Survey survey);
        Task UpdateAsync(Survey survey);
        Task DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
    }
}
