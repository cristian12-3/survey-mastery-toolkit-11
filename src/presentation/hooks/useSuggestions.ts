
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../infrastructure/context/ServiceContext';
import { Suggestion, SuggestionFormData } from '../../domain/entities/Suggestion';

export const useSuggestions = () => {
  const { suggestionService } = useServices();
  const queryClient = useQueryClient();

  const { data: suggestions = [], isLoading, error } = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => suggestionService.getAllSuggestions(),
  });

  const createSuggestionMutation = useMutation({
    mutationFn: (newSuggestion: SuggestionFormData) => 
      suggestionService.createSuggestion(newSuggestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  const updateSuggestionMutation = useMutation({
    mutationFn: (suggestion: Suggestion) => suggestionService.updateSuggestion(suggestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  const deleteSuggestionMutation = useMutation({
    mutationFn: (id: string) => suggestionService.deleteSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  return {
    suggestions,
    isLoading,
    error,
    createSuggestion: createSuggestionMutation.mutate,
    updateSuggestion: updateSuggestionMutation.mutate,
    deleteSuggestion: deleteSuggestionMutation.mutate,
  };
};
