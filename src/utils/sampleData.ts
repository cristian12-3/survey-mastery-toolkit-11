
import { v4 as uuidv4 } from 'uuid';

export type QuestionType = 
  | 'text' 
  | 'single-choice' 
  | 'multiple-choice' 
  | 'dropdown' 
  | 'rating' 
  | 'nps' 
  | 'matrix' 
  | 'ranking' 
  | 'date';

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  settings?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  responses?: Response[];
  completionRate?: number;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface Response {
  id: string;
  surveyId: string;
  answers: Answer[];
  submittedAt: string;
  completionTime?: number;
}

// Sample surveys data
export const surveys: Survey[] = [
  {
    id: '1',
    title: 'Customer Satisfaction Survey',
    description: 'Please help us improve our product by answering a few questions.',
    questions: [
      {
        id: '101',
        title: 'How would you rate your overall experience with our product?',
        type: 'rating',
        required: true,
        settings: {
          min: 1,
          max: 5
        }
      },
      {
        id: '102',
        title: 'What features do you use most often?',
        type: 'multiple-choice',
        required: false,
        options: ['Dashboard', 'Reports', 'Analytics', 'User Management', 'Settings']
      },
      {
        id: '103',
        title: 'How likely are you to recommend our product to a friend or colleague?',
        type: 'nps',
        required: true
      },
      {
        id: '104',
        title: 'What improvements would you like to see in future updates?',
        type: 'text',
        required: false
      }
    ],
    createdAt: '2023-04-15T08:30:00Z',
    updatedAt: '2023-04-15T10:45:00Z',
    responses: [
      {
        id: 'r1',
        surveyId: '1',
        answers: [
          { questionId: '101', value: 4 },
          { questionId: '102', value: ['Dashboard', 'Analytics'] },
          { questionId: '103', value: 8 },
          { questionId: '104', value: 'Better mobile support would be great!' }
        ],
        submittedAt: '2023-04-16T14:20:00Z',
        completionTime: 210
      },
      {
        id: 'r2',
        surveyId: '1',
        answers: [
          { questionId: '101', value: 5 },
          { questionId: '102', value: ['Reports', 'User Management'] },
          { questionId: '103', value: 9 },
          { questionId: '104', value: 'Dark mode and more customization options.' }
        ],
        submittedAt: '2023-04-16T16:40:00Z',
        completionTime: 180
      },
    ],
    completionRate: 85
  },
  {
    id: '2',
    title: 'Employee Engagement Survey',
    description: 'Help us build a better workplace by sharing your feedback.',
    questions: [
      {
        id: '201',
        title: 'How satisfied are you with your role at the company?',
        type: 'rating',
        required: true,
        settings: {
          min: 1,
          max: 5
        }
      },
      {
        id: '202',
        title: 'Which benefits do you value most?',
        type: 'multiple-choice',
        required: false,
        options: ['Health Insurance', 'Flexible Hours', 'Remote Work', 'Professional Development', 'Gym Membership']
      },
      {
        id: '203',
        title: 'What would make our company a better place to work?',
        type: 'text',
        required: false
      }
    ],
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T11:20:00Z',
    responses: [
      {
        id: 'r3',
        surveyId: '2',
        answers: [
          { questionId: '201', value: 4 },
          { questionId: '202', value: ['Flexible Hours', 'Remote Work'] },
          { questionId: '203', value: 'More team building activities and clearer career path.' }
        ],
        submittedAt: '2023-03-12T10:15:00Z',
        completionTime: 195
      },
      {
        id: 'r4',
        surveyId: '2',
        answers: [
          { questionId: '201', value: 3 },
          { questionId: '202', value: ['Health Insurance', 'Professional Development'] },
          { questionId: '203', value: 'Better communication between departments.' }
        ],
        submittedAt: '2023-03-12T14:30:00Z',
        completionTime: 165
      },
      {
        id: 'r5',
        surveyId: '2',
        answers: [
          { questionId: '201', value: 5 },
          { questionId: '202', value: ['Remote Work', 'Gym Membership'] },
          { questionId: '203', value: 'More focus on work-life balance.' }
        ],
        submittedAt: '2023-03-13T09:45:00Z',
        completionTime: 150
      }
    ],
    completionRate: 92
  }
];

// Export a reference to surveys for components that need it
export const sampleSurveys = surveys;

// Export sample responses for use in Results page
export const sampleResponses: Response[] = surveys.flatMap(survey => survey.responses || []);

// Helper function to generate a new empty question
export const createNewQuestion = (type: QuestionType = 'text'): Question => {
  return {
    id: uuidv4(),
    title: '',
    description: '',
    type,
    required: false,
    options: ['multiple-choice', 'single-choice', 'dropdown', 'matrix', 'ranking'].includes(type) 
      ? ['Option 1', 'Option 2'] 
      : undefined
  };
};

// Helper function to create a new empty survey
export const createNewSurvey = (): Survey => {
  return {
    id: uuidv4(),
    title: 'Untitled Survey',
    description: '',
    questions: [createNewQuestion('text')],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Sample customers data
export const sampleCustomers = [
  {
    id: "c1",
    brandName: "TechSolutions Inc.",
    contactEmail: "contact@techsolutions.example",
    contactPhone: "+1-555-123-4567",
    acquiredServices: ["Surveys Pro", "Analytics", "API Access"],
    createdAt: "2023-01-15T10:30:00Z",
    growthMetrics: [
      {
        period: "2023-Q1",
        revenue: 12500,
        userCount: 45
      },
      {
        period: "2023-Q2",
        revenue: 15700,
        userCount: 58
      }
    ]
  },
  {
    id: "c2",
    brandName: "Marketing Masters",
    contactEmail: "info@marketingmasters.example",
    contactPhone: "+1-555-987-6543",
    acquiredServices: ["Surveys Basic", "Email Campaigns"],
    createdAt: "2023-02-22T14:45:00Z",
    growthMetrics: [
      {
        period: "2023-Q1",
        revenue: 5200,
        userCount: 12
      },
      {
        period: "2023-Q2",
        revenue: 7800,
        userCount: 21
      }
    ]
  }
];

// Sample suggestions data
export const sampleSuggestions = [
  {
    id: "s1",
    title: "Add dark mode to survey forms",
    content: "It would be great to have a dark mode option for surveys, especially for users who prefer this mode for eye comfort.",
    category: "UI/UX",
    tags: ["dark-mode", "accessibility", "ui-enhancement"],
    createdAt: "2023-04-10T09:15:00Z",
    updatedAt: "2023-04-10T09:15:00Z",
    status: "new"
  },
  {
    id: "s2",
    title: "Support for video questions",
    content: "Allow survey creators to add video questions where respondents can record video responses.",
    category: "Feature Request",
    tags: ["video", "multimedia", "survey-enhancement"],
    createdAt: "2023-03-22T15:30:00Z",
    updatedAt: "2023-03-25T11:20:00Z",
    status: "in-review"
  }
];

// Add getQuestionTypeInfo function
export const getQuestionTypeInfo = (type: QuestionType) => {
  const questionTypeInfo = {
    'text': {
      name: 'Text',
      description: 'Open-ended questions'
    },
    'single-choice': {
      name: 'Single Choice',
      description: 'Select one option'
    },
    'multiple-choice': {
      name: 'Multiple Choice',
      description: 'Select multiple options'
    },
    'dropdown': {
      name: 'Dropdown',
      description: 'Select from a dropdown menu'
    },
    'rating': {
      name: 'Rating',
      description: 'Rate on a numeric scale'
    },
    'nps': {
      name: 'Net Promoter Score',
      description: 'Likelihood to recommend'
    },
    'matrix': {
      name: 'Matrix',
      description: 'Grid of questions and options'
    },
    'ranking': {
      name: 'Ranking',
      description: 'Drag to order preferences'
    },
    'date': {
      name: 'Date',
      description: 'Select a date'
    }
  };
  
  return questionTypeInfo[type] || { name: 'Custom', description: 'Custom question type' };
};
