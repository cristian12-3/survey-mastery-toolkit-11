
import { Suggestion, SuggestionFormData } from "../../domain/entities/Suggestion";

export interface SuggestionRepository {
  getAll(): Promise<Suggestion[]>;
  getById(id: string): Promise<Suggestion | null>;
  create(suggestion: SuggestionFormData): Promise<Suggestion>;
  update(suggestion: Suggestion): Promise<Suggestion>;
  delete(id: string): Promise<void>;
}
