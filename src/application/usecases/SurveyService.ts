
import { Survey } from "../../domain/entities/Survey";
import { SurveyRepository } from "../ports/SurveyRepository";

export class SurveyService {
  constructor(private surveyRepository: SurveyRepository) {}

  async getAllSurveys(): Promise<Survey[]> {
    return this.surveyRepository.getAll();
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    return this.surveyRepository.getById(id);
  }

  async createSurvey(survey: Omit<Survey, "id" | "createdAt" | "updatedAt">): Promise<Survey> {
    return this.surveyRepository.create(survey);
  }

  async updateSurvey(survey: Survey): Promise<Survey> {
    return this.surveyRepository.update(survey);
  }

  async deleteSurvey(id: string): Promise<void> {
    return this.surveyRepository.delete(id);
  }
}
