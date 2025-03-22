
import { SurveyResponse } from "../../domain/entities/SurveyResponse";

export interface SurveyResponseRepository {
  getAll(): Promise<SurveyResponse[]>;
  getBySurveyId(surveyId: string): Promise<SurveyResponse[]>;
  create(response: Omit<SurveyResponse, "id" | "submittedAt">): Promise<SurveyResponse>;
}
