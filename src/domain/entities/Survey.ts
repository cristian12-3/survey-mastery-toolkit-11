
export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
}

export type QuestionType = 
  | 'multiple-choice'
  | 'single-choice'
  | 'text'
  | 'rating'
  | 'dropdown'
  | 'matrix'
  | 'ranking'
  | 'nps'
  | 'date'
  | 'file-upload';
