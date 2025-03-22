
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../infrastructure/context/ServiceContext';
import { Survey } from '../../domain/entities/Survey';

export const useSurveys = () => {
  const { surveyService } = useServices();
  const queryClient = useQueryClient();

  const { data: surveys = [], isLoading, error } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => surveyService.getAllSurveys(),
  });

  const createSurveyMutation = useMutation({
    mutationFn: (newSurvey: Omit<Survey, "id" | "createdAt" | "updatedAt">) => 
      surveyService.createSurvey(newSurvey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const updateSurveyMutation = useMutation({
    mutationFn: (survey: Survey) => surveyService.updateSurvey(survey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const deleteSurveyMutation = useMutation({
    mutationFn: (id: string) => surveyService.deleteSurvey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  return {
    surveys,
    isLoading,
    error,
    createSurvey: createSurveyMutation.mutate,
    updateSurvey: updateSurveyMutation.mutate,
    deleteSurvey: deleteSurveyMutation.mutate,
  };
};
