
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SurveyApp.WebMvc.Models;

namespace SurveyApp.WebMvc.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var featuresViewModel = new HomeViewModel
            {
                Features = new List<FeatureViewModel>
                {
                    new FeatureViewModel
                    {
                        Title = "Intuitive Survey Builder",
                        Description = "Create beautiful surveys with our drag-and-drop interface. No coding required.",
                        Icon = "FileText"
                    },
                    new FeatureViewModel
                    {
                        Title = "Powerful Analytics",
                        Description = "Get real-time insights with customizable reports and advanced visualizations.",
                        Icon = "BarChart3"
                    },
                    new FeatureViewModel
                    {
                        Title = "Multiple Question Types",
                        Description = "Choose from a variety of question types to gather the precise data you need.",
                        Icon = "CheckSquare"
                    },
                    new FeatureViewModel
                    {
                        Title = "Rating Scales",
                        Description = "Measure sentiment and satisfaction with customizable rating scales.",
                        Icon = "Star"
                    },
                    new FeatureViewModel
                    {
                        Title = "Ranking Questions",
                        Description = "Allow respondents to rank items in order of preference or importance.",
                        Icon = "MoveVertical"
                    },
                    new FeatureViewModel
                    {
                        Title = "Logic Branching",
                        Description = "Create dynamic surveys that adapt based on previous answers.",
                        Icon = "PlusCircle"
                    }
                }
            };

            return View(featuresViewModel);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
