
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SurveyApp.Application.DTOs;

namespace SurveyApp.Application.Services
{
    public interface IKnowledgeBaseService
    {
        Task<List<KnowledgeBaseItemDto>> GetAllItemsAsync();
        Task<KnowledgeBaseItemDto> GetItemByIdAsync(Guid id);
        Task<List<KnowledgeBaseItemDto>> GetItemsByCategoryAsync(string category);
        Task<List<KnowledgeBaseItemDto>> SearchItemsAsync(string searchTerm);
        Task<KnowledgeBaseItemDto> CreateItemAsync(CreateKnowledgeBaseItemDto itemDto);
        Task UpdateItemAsync(Guid id, UpdateKnowledgeBaseItemDto itemDto);
        Task DeleteItemAsync(Guid id);
    }
}
