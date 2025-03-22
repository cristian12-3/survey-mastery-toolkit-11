
import React, { createContext, useContext } from 'react';
import { SurveyService } from '../../application/usecases/SurveyService';
import { SuggestionService } from '../../application/usecases/SuggestionService';
import { CustomerService } from '../../application/usecases/CustomerService';
import { SurveyResponseService } from '../../application/usecases/SurveyResponseService';
import { InMemorySurveyRepository } from '../repositories/InMemorySurveyRepository';
import { InMemorySuggestionRepository } from '../repositories/InMemorySuggestionRepository';
import { InMemoryCustomerRepository } from '../repositories/InMemoryCustomerRepository';
import { InMemorySurveyResponseRepository } from '../repositories/InMemorySurveyResponseRepository';

// Initialize repositories
const surveyRepository = new InMemorySurveyRepository();
const suggestionRepository = new InMemorySuggestionRepository();
const customerRepository = new InMemoryCustomerRepository();
const surveyResponseRepository = new InMemorySurveyResponseRepository();

// Initialize services
const surveyService = new SurveyService(surveyRepository);
const suggestionService = new SuggestionService(suggestionRepository);
const customerService = new CustomerService(customerRepository);
const surveyResponseService = new SurveyResponseService(surveyResponseRepository);

interface ServiceContextType {
  surveyService: SurveyService;
  suggestionService: SuggestionService;
  customerService: CustomerService;
  surveyResponseService: SurveyResponseService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ServiceContext.Provider
      value={{
        surveyService,
        suggestionService,
        customerService,
        surveyResponseService
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
