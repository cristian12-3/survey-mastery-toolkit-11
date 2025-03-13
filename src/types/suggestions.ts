
export interface Suggestion {
  id: string;
  content: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'implemented' | 'rejected';
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isAnonymous?: boolean;
}

export interface SuggestionFormData {
  content: string;
  customerName: string;
  customerEmail: string;
  category?: string;
  isAnonymous: boolean;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalSuggestions: number;
  implementedSuggestions: number;
  topCategories: {
    category: string;
    count: number;
  }[];
  suggestions: Suggestion[];
}
