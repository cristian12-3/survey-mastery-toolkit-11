
import React, { createContext, useContext } from 'react';
import { SurveyService } from '../../application/usecases/SurveyService';
import { SuggestionService } from '../../application/usecases/SuggestionService';
import { CustomerService } from '../../application/usecases/CustomerService';
import { InMemorySurveyRepository } from '../repositories/InMemorySurveyRepository';
import { InMemorySuggestionRepository } from '../repositories/InMemorySuggestionRepository';
import { InMemoryCustomerRepository } from '../repositories/InMemoryCustomerRepository';

// Initialize repositories
const surveyRepository = new InMemorySurveyRepository();
const suggestionRepository = new InMemorySuggestionRepository();
const customerRepository = new InMemoryCustomerRepository();

// Initialize services
const surveyService = new SurveyService(surveyRepository);
const suggestionService = new SuggestionService(suggestionRepository);
const customerService = new CustomerService(customerRepository);

interface ServiceContextType {
  surveyService: SurveyService;
  suggestionService: SuggestionService;
  customerService: CustomerService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ServiceContext.Provider
      value={{
        surveyService,
        suggestionService,
        customerService
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
