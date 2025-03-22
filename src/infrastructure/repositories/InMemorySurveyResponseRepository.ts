
import { SurveyResponse } from "../../domain/entities/SurveyResponse";
import { SurveyResponseRepository } from "../../application/ports/SurveyResponseRepository";
import { v4 as uuidv4 } from 'uuid';

export class InMemorySurveyResponseRepository implements SurveyResponseRepository {
  private readonly STORAGE_KEY = 'surveyResponses';

  async getAll(): Promise<SurveyResponse[]> {
    try {
      const storedResponses = localStorage.getItem(this.STORAGE_KEY);
      return storedResponses ? JSON.parse(storedResponses) : [];
    } catch (error) {
      console.error("Error retrieving survey responses:", error);
      return [];
    }
  }

  async getBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    const responses = await this.getAll();
    return responses.filter(response => response.surveyId === surveyId);
  }

  async create(responseData: Omit<SurveyResponse, "id" | "submittedAt">): Promise<SurveyResponse> {
    try {
      const responses = await this.getAll();
      
      const newResponse: SurveyResponse = {
        ...responseData,
        id: uuidv4(),
        submittedAt: new Date().toISOString()
      };
      
      const updatedResponses = [...responses, newResponse];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedResponses));
      
      return newResponse;
    } catch (error) {
      console.error("Error saving survey response:", error);
      throw new Error("Failed to save survey response");
    }
  }
}
