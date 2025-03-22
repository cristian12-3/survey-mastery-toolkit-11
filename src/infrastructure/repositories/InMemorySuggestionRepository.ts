
import { Suggestion, SuggestionFormData } from "../../domain/entities/Suggestion";
import { SuggestionRepository } from "../../application/ports/SuggestionRepository";
import { sampleSuggestions } from "../../utils/sampleData";

export class InMemorySuggestionRepository implements SuggestionRepository {
  private suggestions: Suggestion[] = sampleSuggestions.map(suggestion => ({
    id: suggestion.id,
    content: suggestion.content,
    customerName: suggestion.customerName,
    customerEmail: suggestion.customerEmail,
    createdAt: suggestion.createdAt,
    status: suggestion.status as 'new' | 'reviewed' | 'implemented' | 'rejected',
    category: suggestion.category,
    isAnonymous: suggestion.isAnonymous || false
  }));

  async getAll(): Promise<Suggestion[]> {
    return Promise.resolve([...this.suggestions]);
  }

  async getById(id: string): Promise<Suggestion | null> {
    const suggestion = this.suggestions.find(s => s.id === id);
    return Promise.resolve(suggestion || null);
  }

  async create(suggestionData: SuggestionFormData): Promise<Suggestion> {
    const newSuggestion: Suggestion = {
      ...suggestionData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.suggestions.push(newSuggestion);
    return Promise.resolve(newSuggestion);
  }

  async update(suggestion: Suggestion): Promise<Suggestion> {
    const index = this.suggestions.findIndex(s => s.id === suggestion.id);
    if (index === -1) {
      throw new Error(`Suggestion with id ${suggestion.id} not found`);
    }
    this.suggestions[index] = suggestion;
    return Promise.resolve(suggestion);
  }

  async delete(id: string): Promise<void> {
    const index = this.suggestions.findIndex(s => s.id === id);
    if (index !== -1) {
      this.suggestions.splice(index, 1);
    }
    return Promise.resolve();
  }
}
