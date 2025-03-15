
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SurveyApp.Application.DTOs;
using SurveyApp.Application.Ports;
using SurveyApp.Domain.Entities;

namespace SurveyApp.Application.Services
{
    public class KnowledgeBaseService : IKnowledgeBaseService
    {
        private readonly IKnowledgeBaseRepository _knowledgeBaseRepository;

        public KnowledgeBaseService(IKnowledgeBaseRepository knowledgeBaseRepository)
        {
            _knowledgeBaseRepository = knowledgeBaseRepository;
        }

        public async Task<List<KnowledgeBaseItemDto>> GetAllItemsAsync()
        {
            var items = await _knowledgeBaseRepository.GetAllAsync();
            return items.Select(MapToDto).ToList();
        }

        public async Task<KnowledgeBaseItemDto> GetItemByIdAsync(Guid id)
        {
            var item = await _knowledgeBaseRepository.GetByIdAsync(id);
            return item != null ? MapToDto(item) : null;
        }

        public async Task<List<KnowledgeBaseItemDto>> GetItemsByCategoryAsync(string category)
        {
            var items = await _knowledgeBaseRepository.GetByCategoryAsync(category);
            return items.Select(MapToDto).ToList();
        }

        public async Task<List<KnowledgeBaseItemDto>> SearchItemsAsync(string searchTerm)
        {
            var items = await _knowledgeBaseRepository.SearchAsync(searchTerm);
            return items.Select(MapToDto).ToList();
        }

        public async Task<KnowledgeBaseItemDto> CreateItemAsync(CreateKnowledgeBaseItemDto itemDto)
        {
            var item = new KnowledgeBaseItem
            {
                Id = Guid.NewGuid(),
                Title = itemDto.Title,
                Content = itemDto.Content,
                Category = itemDto.Category,
                Tags = itemDto.Tags ?? new List<string>(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _knowledgeBaseRepository.CreateAsync(item);
            return MapToDto(item);
        }

        public async Task UpdateItemAsync(Guid id, UpdateKnowledgeBaseItemDto itemDto)
        {
            var item = await _knowledgeBaseRepository.GetByIdAsync(id);
            if (item != null)
            {
                item.Title = itemDto.Title ?? item.Title;
                item.Content = itemDto.Content ?? item.Content;
                item.Category = itemDto.Category ?? item.Category;
                item.Tags = itemDto.Tags ?? item.Tags;
                item.UpdatedAt = DateTime.UtcNow;

                await _knowledgeBaseRepository.UpdateAsync(item);
            }
        }

        public async Task DeleteItemAsync(Guid id)
        {
            await _knowledgeBaseRepository.DeleteAsync(id);
        }

        private KnowledgeBaseItemDto MapToDto(KnowledgeBaseItem item)
        {
            return new KnowledgeBaseItemDto
            {
                Id = item.Id,
                Title = item.Title,
                Content = item.Content,
                Category = item.Category,
                Tags = item.Tags,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt
            };
        }
    }
}
