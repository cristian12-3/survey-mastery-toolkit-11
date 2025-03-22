import { Survey, Question, QuestionType } from '../domain/entities/Survey';
import { Suggestion } from '../domain/entities/Suggestion';
import { Customer } from '../domain/entities/Customer';

export const getQuestionTypeInfo = (type: QuestionType) => {
  const types = {
    'multiple-choice': {
      name: 'Multiple Choice',
      description: 'Allow respondents to select multiple options'
    },
    'single-choice': {
      name: 'Single Choice',
      description: 'Allow respondents to select only one option'
    },
    'text': {
      name: 'Text Input',
      description: 'Collect open-ended responses'
    },
    'rating': {
      name: 'Rating Scale',
      description: 'Collect feedback on a numeric scale'
    },
    'dropdown': {
      name: 'Dropdown',
      description: 'Allow selection from a dropdown menu'
    },
    'matrix': {
      name: 'Matrix / Likert Scale',
      description: 'Collect responses across multiple criteria'
    },
    'ranking': {
      name: 'Ranking',
      description: 'Allow respondents to rank options in order'
    },
    'nps': {
      name: 'Net Promoter Score',
      description: 'Measure customer satisfaction on a 0-10 scale'
    },
    'date': {
      name: 'Date',
      description: 'Collect date information'
    },
    'file-upload': {
      name: 'File Upload',
      description: 'Allow respondents to upload files'
    }
  };
  
  return types[type];
};

export const sampleSurveys: Survey[] = [
  {
    id: "1",
    title: "Customer Satisfaction Survey",
    description: "Help us improve our products and services by sharing your experience.",
    questions: [
      {
        id: "q1",
        type: "single-choice",
        title: "How satisfied are you with our product?",
        required: true,
        options: ["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"]
      },
      {
        id: "q2",
        type: "text",
        title: "What do you like most about our product?",
        required: false
      },
      {
        id: "q3",
        type: "rating",
        title: "How likely are you to recommend our product to others?",
        required: true,
        settings: {
          min: 0,
          max: 10,
          step: 1
        }
      }
    ],
    createdAt: "2023-06-15T10:30:00Z",
    responses: 243,
    completionRate: 78
  },
  {
    id: "2",
    title: "Product Feedback Survey",
    description: "We value your feedback on our latest product release.",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        title: "Which features do you use most frequently?",
        required: true,
        options: ["Dashboard", "Reports", "Analytics", "User management", "Settings", "API"]
      },
      {
        id: "q2",
        type: "text",
        title: "What features would you like to see in future updates?",
        required: false
      },
      {
        id: "q3",
        type: "nps",
        title: "How likely are you to recommend our product to a colleague?",
        required: true
      }
    ],
    createdAt: "2023-08-22T14:15:00Z",
    responses: 186,
    completionRate: 64
  },
  {
    id: "3",
    title: "Website Usability Survey",
    description: "Help us understand how we can improve your experience on our website.",
    questions: [
      {
        id: "q1",
        type: "single-choice",
        title: "How easy was it to find what you were looking for?",
        required: true,
        options: ["Very easy", "Easy", "Neutral", "Difficult", "Very difficult"]
      },
      {
        id: "q2",
        type: "rating",
        title: "Rate the overall design of our website",
        required: true,
        settings: {
          min: 1,
          max: 5,
          step: 1
        }
      },
      {
        id: "q3",
        type: "text",
        title: "What would make your experience on our website better?",
        required: false
      }
    ],
    createdAt: "2023-09-10T09:45:00Z",
    responses: 152,
    completionRate: 82
  }
];

export const sampleResponses: Response[] = [
  {
    id: "r1",
    surveyId: "1",
    answers: [
      { questionId: "q1", value: "Satisfied" },
      { questionId: "q2", value: "The intuitive interface and quick loading times." },
      { questionId: "q3", value: 8 }
    ],
    submittedAt: "2023-06-16T11:20:00Z",
    completionTime: 156
  },
  {
    id: "r2",
    surveyId: "1",
    answers: [
      { questionId: "q1", value: "Very satisfied" },
      { questionId: "q2", value: "Customer support and product reliability." },
      { questionId: "q3", value: 9 }
    ],
    submittedAt: "2023-06-17T15:45:00Z",
    completionTime: 132
  },
  {
    id: "r3",
    surveyId: "1",
    answers: [
      { questionId: "q1", value: "Neutral" },
      { questionId: "q2", value: "The range of features available." },
      { questionId: "q3", value: 6 }
    ],
    submittedAt: "2023-06-18T09:30:00Z",
    completionTime: 178
  },
  {
    id: "r4",
    surveyId: "2",
    answers: [
      { questionId: "q1", value: ["Dashboard", "Analytics", "API"] },
      { questionId: "q2", value: "Better integration with third-party tools." },
      { questionId: "q3", value: 7 }
    ],
    submittedAt: "2023-08-23T10:15:00Z",
    completionTime: 245
  },
  {
    id: "r5",
    surveyId: "2",
    answers: [
      { questionId: "q1", value: ["Reports", "User management"] },
      { questionId: "q2", value: "Mobile app and offline capabilities." },
      { questionId: "q3", value: 8 }
    ],
    submittedAt: "2023-08-24T16:40:00Z",
    completionTime: 198
  }
];

export const sampleSuggestions: Suggestion[] = [
  {
    id: '1',
    content: 'Add dark mode to the dashboard',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    createdAt: '2023-12-05T14:23:45Z',
    status: 'implemented',
    category: 'UI/UX',
    priority: 'medium',
    isAnonymous: false,
    response: 'We have implemented dark mode in our latest release.',
    responseDate: '2023-12-15T09:15:00Z',
  },
  {
    id: '2',
    content: 'Allow export of survey results in CSV format',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    createdAt: '2023-12-10T10:15:30Z',
    status: 'reviewed',
    category: 'Functionality',
    priority: 'high',
    isAnonymous: false,
  },
  {
    id: '3',
    content: 'Add more question types like ranking and slider',
    customerName: 'Anonymous',
    customerEmail: 'anonymous@example.com',
    createdAt: '2023-12-12T16:20:00Z',
    status: 'new',
    category: 'Features',
    isAnonymous: true,
  },
  {
    id: '4',
    content: 'Improve mobile responsiveness',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    createdAt: '2023-12-15T09:45:20Z',
    status: 'rejected',
    category: 'UI/UX',
    priority: 'low',
    isAnonymous: false,
    response: 'This is already in our roadmap and will be addressed in a future update.',
    responseDate: '2023-12-18T11:30:00Z',
  },
  {
    id: '5',
    content: 'Add ability to clone surveys',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    createdAt: '2023-12-18T14:10:15Z',
    status: 'implemented',
    category: 'Functionality',
    priority: 'medium',
    isAnonymous: false,
    response: 'This feature has been added in our latest release.',
    responseDate: '2023-12-28T10:20:00Z',
  }
];

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    brandName: 'Tech Solutions Inc.',
    contactEmail: 'contact@techsolutions.com',
    contactPhone: '(555) 123-4567',
    acquiredServices: ['Survey Pro', 'Analytics', 'API Access'],
    createdAt: '2023-01-15T10:30:00Z',
    growthMetrics: [
      { period: '2023-Q1', revenue: 5000, userCount: 120 },
      { period: '2023-Q2', revenue: 6200, userCount: 150 },
      { period: '2023-Q3', revenue: 7500, userCount: 185 }
    ]
  },
  {
    id: '2',
    brandName: 'Global Marketing Ltd',
    contactEmail: 'info@globalmarketing.co',
    contactPhone: '(555) 987-6543',
    acquiredServices: ['Survey Basic', 'Custom Branding'],
    createdAt: '2023-03-22T14:45:00Z',
    growthMetrics: [
      { period: '2023-Q2', revenue: 3200, userCount: 80 },
      { period: '2023-Q3', revenue: 3800, userCount: 95 }
    ]
  },
  {
    id: '3',
    brandName: 'Data Insights Group',
    contactEmail: 'support@datainsights.org',
    contactPhone: '(555) 456-7890',
    acquiredServices: ['Survey Pro', 'Analytics', 'Custom Branding', 'API Access'],
    createdAt: '2022-11-05T09:15:00Z',
    growthMetrics: [
      { period: '2022-Q4', revenue: 4500, userCount: 110 },
      { period: '2023-Q1', revenue: 5200, userCount: 130 },
      { period: '2023-Q2', revenue: 6000, userCount: 155 },
      { period: '2023-Q3', revenue: 7200, userCount: 190 }
    ]
  },
  {
    id: '4',
    brandName: 'Startup Ventures',
    contactEmail: 'hello@startupventures.co',
    contactPhone: '(555) 234-5678',
    acquiredServices: ['Survey Basic'],
    createdAt: '2023-06-10T16:30:00Z',
    growthMetrics: [
      { period: '2023-Q3', revenue: 1800, userCount: 45 }
    ]
  },
  {
    id: '5',
    brandName: 'Enterprise Solutions',
    contactEmail: 'contact@enterprise-solutions.com',
    contactPhone: '(555) 789-0123',
    acquiredServices: ['Survey Pro', 'Analytics', 'Custom Branding', 'API Access'],
    createdAt: '2022-08-15T11:45:00Z',
    growthMetrics: [
      { period: '2022-Q3', revenue: 7800, userCount: 200 },
      { period: '2022-Q4', revenue: 8500, userCount: 230 },
      { period: '2023-Q1', revenue: 9200, userCount: 255 },
      { period: '2023-Q2', revenue: 10000, userCount: 280 },
      { period: '2023-Q3', revenue: 11500, userCount: 320 }
    ]
  }
];
