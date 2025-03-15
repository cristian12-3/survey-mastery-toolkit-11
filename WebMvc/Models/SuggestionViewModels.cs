
using System.Collections.Generic;
using SurveyApp.Application.DTOs;

namespace SurveyApp.WebMvc.Models
{
    public class SuggestionViewModel
    {
        public List<SuggestionDto> Suggestions { get; set; }
        public List<KnowledgeBaseItemDto> KnowledgeBaseItems { get; set; }
        public string[] Categories { get; set; }
        public string ActiveTab { get; set; } = "submit";
    }

    public class SuggestionListViewModel
    {
        public List<SuggestionDto> Suggestions { get; set; }
        public string[] Categories { get; set; }
        public string StatusFilter { get; set; }
        public string CategoryFilter { get; set; }
        public string SearchTerm { get; set; }
    }

    public class SuggestionReportViewModel
    {
        public MonthlyReportDto Report { get; set; }
        public int MonthsRange { get; set; }
    }
}
