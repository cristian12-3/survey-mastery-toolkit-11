
import { Survey } from "../../domain/entities/Survey";
import { SurveyRepository } from "../../application/ports/SurveyRepository";
import { sampleSurveys } from "../../utils/sampleData";

export class InMemorySurveyRepository implements SurveyRepository {
  private surveys: Survey[] = sampleSurveys.map(survey => ({
    id: survey.id,
    title: survey.title,
    description: survey.description,
    questions: survey.questions,
    createdAt: survey.createdAt,
    updatedAt: survey.updatedAt,
    isPublished: survey.isPublished
  }));

  async getAll(): Promise<Survey[]> {
    return Promise.resolve([...this.surveys]);
  }

  async getById(id: string): Promise<Survey | null> {
    const survey = this.surveys.find(s => s.id === id);
    return Promise.resolve(survey || null);
  }

  async create(surveyData: Omit<Survey, "id" | "createdAt" | "updatedAt">): Promise<Survey> {
    const newSurvey: Survey = {
      ...surveyData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.surveys.push(newSurvey);
    return Promise.resolve(newSurvey);
  }

  async update(survey: Survey): Promise<Survey> {
    const index = this.surveys.findIndex(s => s.id === survey.id);
    if (index === -1) {
      throw new Error(`Survey with id ${survey.id} not found`);
    }
    const updatedSurvey = {
      ...survey,
      updatedAt: new Date().toISOString()
    };
    this.surveys[index] = updatedSurvey;
    return Promise.resolve(updatedSurvey);
  }

  async delete(id: string): Promise<void> {
    const index = this.surveys.findIndex(s => s.id === id);
    if (index !== -1) {
      this.surveys.splice(index, 1);
    }
    return Promise.resolve();
  }
}
