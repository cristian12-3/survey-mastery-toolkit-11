
export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Answer[];
  submittedAt: string;
  completionTime?: number;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}
