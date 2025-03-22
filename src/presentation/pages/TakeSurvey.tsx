import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Question } from "@/domain/entities/Survey";
import { useSurveys } from '../hooks/useSurveys';
import { useSurveyResponses } from '../hooks/useSurveyResponses';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Answer } from '@/domain/entities/SurveyResponse';

export default function TakeSurvey() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { surveys, isLoading: surveysLoading } = useSurveys();
  const { submitResponse, isSubmitting } = useSurveyResponses(surveyId);
  
  const [survey, setSurvey] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (!surveysLoading && surveyId) {
      const foundSurvey = surveys.find(s => s.id === surveyId);
      
      if (foundSurvey) {
        setSurvey(foundSurvey);
        
        // Initialize responses
        const initialResponses: Record<string, any> = {};
        foundSurvey.questions.forEach((question: Question) => {
          if (question.type === 'multiple-choice') {
            initialResponses[question.id] = [];
          } else {
            initialResponses[question.id] = '';
          }
        });
        
        setResponses(initialResponses);
      } else {
        setError('Survey not found');
      }
      
      setLoading(false);
    }
  }, [surveyId, surveys, surveysLoading]);
  
  const handleTextChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSingleChoiceChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleMultipleChoiceChange = (questionId: string, value: string) => {
    setResponses(prev => {
      const currentValues = prev[questionId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((val: string) => val !== value)
        : [...currentValues, value];
        
      return {
        ...prev,
        [questionId]: newValues
      };
    });
  };
  
  const handleRatingChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const validateResponses = () => {
    const requiredQuestions = survey?.questions.filter((q: Question) => q.required) || [];
    const missingResponses = requiredQuestions.filter((question: Question) => {
      const response = responses[question.id];
      
      if (Array.isArray(response)) {
        return response.length === 0;
      }
      
      return !response;
    });
    
    return missingResponses.length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateResponses()) {
      toast({
        title: "Missing responses",
        description: "Please answer all required questions",
        variant: "destructive"
      });
      return;
    }
    
    // Format responses for submission
    const answers: Answer[] = Object.entries(responses).map(([questionId, value]) => ({
      questionId,
      value
    }));
    
    // Submit using the survey response service
    if (surveyId) {
      submitResponse({
        surveyId,
        answers,
        completionTime: Math.floor(Math.random() * 300) + 100 // Mock completion time between 100-400 seconds
      }, {
        onSuccess: () => {
          setSubmitted(true);
          toast({
            title: "Thank you!",
            description: "Your responses have been submitted successfully",
          });
        },
        onError: () => {
          toast({
            title: "Submission failed",
            description: "There was an error submitting your responses. Please try again.",
            variant: "destructive"
          });
        }
      });
    }
  };
  
  
  if (loading || surveysLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 w-full max-w-4xl mx-auto pt-24 px-6 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading survey...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !survey) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 w-full max-w-4xl mx-auto pt-24 px-6 pb-16 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                Survey Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>The survey you're looking for doesn't exist or has been removed.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 w-full max-w-4xl mx-auto pt-24 px-6 pb-16 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Thank You!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Your responses have been submitted successfully.</p>
              <p className="text-muted-foreground">Thank you for completing this survey.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto pt-24 px-6 pb-16">
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{survey.title}</CardTitle>
            {survey.description && (
              <p className="text-muted-foreground mt-2">{survey.description}</p>
            )}
          </CardHeader>
        </Card>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {survey.questions.map((question: Question, index: number) => (
              <Card key={question.id} className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-start">
                    <span className="mr-2">{index + 1}.</span>
                    <span>
                      {question.title}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </CardTitle>
                  {question.description && (
                    <p className="text-sm text-muted-foreground pl-6">{question.description}</p>
                  )}
                </CardHeader>
                
                <CardContent>
                  {question.type === 'text' && (
                    <Textarea
                      placeholder="Your answer"
                      value={responses[question.id] || ''}
                      onChange={(e) => handleTextChange(question.id, e.target.value)}
                      className="min-h-[100px]"
                    />
                  )}
                  
                  {question.type === 'single-choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option: string, i: number) => (
                        <div key={i} className="flex items-center">
                          <input
                            type="radio"
                            id={`q${index}-o${i}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={responses[question.id] === option}
                            onChange={() => handleSingleChoiceChange(question.id, option)}
                            className="mr-2"
                          />
                          <label htmlFor={`q${index}-o${i}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option: string, i: number) => (
                        <div key={i} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`q${index}-o${i}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={(responses[question.id] || []).includes(option)}
                            onChange={() => handleMultipleChoiceChange(question.id, option)}
                            className="mr-2"
                          />
                          <label htmlFor={`q${index}-o${i}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'rating' && (
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                            responses[question.id] === value 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-accent'
                          }`}
                          onClick={() => handleRatingChange(question.id, value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Responses'}
            </Button>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
}
