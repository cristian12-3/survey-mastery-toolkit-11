
import { SurveyResponse } from "../../domain/entities/SurveyResponse";
import { SurveyResponseRepository } from "../ports/SurveyResponseRepository";

export class SurveyResponseService {
  constructor(private surveyResponseRepository: SurveyResponseRepository) {}

  async getAllResponses(): Promise<SurveyResponse[]> {
    return this.surveyResponseRepository.getAll();
  }

  async getResponsesBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    return this.surveyResponseRepository.getBySurveyId(surveyId);
  }

  async submitResponse(response: Omit<SurveyResponse, "id" | "submittedAt">): Promise<SurveyResponse> {
    return this.surveyResponseRepository.create(response);
  }
}
