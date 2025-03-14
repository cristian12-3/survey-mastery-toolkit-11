
using System;
using System.Collections.Generic;

namespace SurveyApp.Domain.Entities
{
    public class Question
    {
        public Guid Id { get; private set; }
        public QuestionType Type { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public bool Required { get; private set; }
        public List<string> Options { get; private set; }

        public Question(string title, QuestionType type, bool required)
        {
            Id = Guid.NewGuid();
            Title = title;
            Type = type;
            Required = required;
            Options = new List<string>();
        }

        public void UpdateTitle(string title)
        {
            Title = title;
        }

        public void UpdateDescription(string description)
        {
            Description = description;
        }

        public void SetOptions(List<string> options)
        {
            Options = options;
        }

        public void AddOption(string option)
        {
            Options.Add(option);
        }

        public void RemoveOption(string option)
        {
            Options.Remove(option);
        }

        public void SetRequired(bool required)
        {
            Required = required;
        }
    }

    public enum QuestionType
    {
        SingleChoice,
        MultipleChoice,
        Text,
        Rating
    }
}
