
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SurveyApp.WebMvc.Models
{
    public class CreateSurveyViewModel
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot be longer than 200 characters")]
        public string Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot be longer than 1000 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "At least one question is required")]
        public List<QuestionViewModel> Questions { get; set; } = new List<QuestionViewModel>();

        public DeliveryConfigViewModel DeliveryConfig { get; set; } = new DeliveryConfigViewModel();
    }

    public class QuestionViewModel
    {
        [Required(ErrorMessage = "Question title is required")]
        [StringLength(500, ErrorMessage = "Title cannot be longer than 500 characters")]
        public string Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot be longer than 1000 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Question type is required")]
        public string Type { get; set; }

        public bool Required { get; set; }

        public List<string> Options { get; set; } = new List<string>();
    }

    public class DeliveryConfigViewModel
    {
        [Required(ErrorMessage = "Delivery type is required")]
        public string Type { get; set; } = "Manual";

        public List<string> EmailAddresses { get; set; } = new List<string>();

        public ScheduleViewModel Schedule { get; set; } = new ScheduleViewModel();

        public TriggerViewModel Trigger { get; set; } = new TriggerViewModel();
    }

    public class ScheduleViewModel
    {
        public string Frequency { get; set; } = "monthly";
        public int DayOfMonth { get; set; } = 1;
        public int? DayOfWeek { get; set; }
        public string Time { get; set; } = "09:00";
        public DateTime? StartDate { get; set; }
    }

    public class TriggerViewModel
    {
        public string Type { get; set; } = "ticket-closed";
        public int DelayHours { get; set; } = 24;
        public bool SendAutomatically { get; set; } = false;
    }
}
