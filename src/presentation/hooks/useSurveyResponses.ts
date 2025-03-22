
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../infrastructure/context/ServiceContext';
import { SurveyResponse } from '../../domain/entities/SurveyResponse';

export const useSurveyResponses = (surveyId?: string) => {
  const { surveyResponseService } = useServices();
  const queryClient = useQueryClient();

  const { data: responses = [], isLoading, error } = useQuery({
    queryKey: surveyId ? ['surveyResponses', surveyId] : ['surveyResponses'],
    queryFn: () => surveyId 
      ? surveyResponseService.getResponsesBySurveyId(surveyId)
      : surveyResponseService.getAllResponses(),
  });

  const submitResponseMutation = useMutation({
    mutationFn: (responseData: Omit<SurveyResponse, "id" | "submittedAt">) => 
      surveyResponseService.submitResponse(responseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveyResponses'] });
      if (surveyId) {
        queryClient.invalidateQueries({ queryKey: ['surveyResponses', surveyId] });
      }
    },
  });

  return {
    responses,
    isLoading,
    error,
    submitResponse: submitResponseMutation.mutate,
    isSubmitting: submitResponseMutation.isPending,
    submitError: submitResponseMutation.error,
  };
};
