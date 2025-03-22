
import { Suggestion, SuggestionFormData } from "../../domain/entities/Suggestion";
import { SuggestionRepository } from "../ports/SuggestionRepository";

export class SuggestionService {
  constructor(private suggestionRepository: SuggestionRepository) {}

  async getAllSuggestions(): Promise<Suggestion[]> {
    return this.suggestionRepository.getAll();
  }

  async getSuggestionById(id: string): Promise<Suggestion | null> {
    return this.suggestionRepository.getById(id);
  }

  async createSuggestion(suggestion: SuggestionFormData): Promise<Suggestion> {
    return this.suggestionRepository.create(suggestion);
  }

  async updateSuggestion(suggestion: Suggestion): Promise<Suggestion> {
    return this.suggestionRepository.update(suggestion);
  }

  async deleteSuggestion(id: string): Promise<void> {
    return this.suggestionRepository.delete(id);
  }
}
