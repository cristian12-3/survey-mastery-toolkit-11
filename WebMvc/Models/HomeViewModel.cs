
namespace SurveyApp.WebMvc.Models
{
    public class HomeViewModel
    {
        public List<FeatureViewModel> Features { get; set; } = new List<FeatureViewModel>();
    }

    public class FeatureViewModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
    }

    public class ErrorViewModel
    {
        public string RequestId { get; set; }
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}
