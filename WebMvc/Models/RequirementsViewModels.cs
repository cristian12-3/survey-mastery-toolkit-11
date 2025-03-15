
using System.Collections.Generic;
using SurveyApp.Application.DTOs;

namespace SurveyApp.WebMvc.Models
{
    public class RequirementsViewModel
    {
        public List<SuggestionDto> Requirements { get; set; }
        public List<KnowledgeBaseItemDto> KnowledgeBase { get; set; }
        public string[] Categories { get; set; }
        public string ActiveTab { get; set; } = "new";
    }

    public class RequirementsListViewModel
    {
        public List<SuggestionDto> Requirements { get; set; }
        public string[] Categories { get; set; }
        public string CategoryFilter { get; set; }
        public string SearchTerm { get; set; }
    }

    public class KnowledgeBaseViewModel
    {
        public List<KnowledgeBaseItemDto> KnowledgeBaseItems { get; set; }
        public string SearchTerm { get; set; }
    }
}
