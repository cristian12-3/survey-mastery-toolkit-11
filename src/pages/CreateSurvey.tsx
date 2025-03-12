
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionBuilder from "@/components/survey/QuestionBuilder";
import { Plus, Send } from "lucide-react";
import { Question } from "@/utils/sampleData";
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CreateSurvey() {
  const { toast } = useToast();
  
  const [surveyTitle, setSurveyTitle] = useState<string>('');
  const [surveyDescription, setSurveyDescription] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uuidv4(),
      type: 'single-choice',
      title: '',
      required: true,
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  ]);
  const [activeTab, setActiveTab] = useState<string>('design');

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'single-choice',
      title: '',
      required: true,
      options: ['Option 1', 'Option 2', 'Option 3']
    };
    
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "Your survey must have at least one question",
        variant: "destructive"
      });
      return;
    }
    
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    const newQuestions = [...questions];
    [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
    setQuestions(newQuestions);
  };

  const moveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return;
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const saveSurvey = () => {
    if (!surveyTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your survey",
        variant: "destructive"
      });
      return;
    }
    
    const hasEmptyQuestionTitles = questions.some(q => !q.title.trim());
    if (hasEmptyQuestionTitles) {
      toast({
        title: "Incomplete questions",
        description: "Please provide a title for all questions",
        variant: "destructive"
      });
      return;
    }
    
    // Here we'd normally save the survey to a database
    toast({
      title: "Survey saved!",
      description: "Your survey has been created successfully"
    });
    
    console.log({
      title: surveyTitle,
      description: surveyDescription,
      questions,
      createdAt: new Date().toISOString()
    });
  };

  const previewSurvey = () => {
    setActiveTab('preview');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto pt-24 px-6 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create a New Survey</h1>
          <p className="text-muted-foreground">
            Design your survey, add questions, and customize settings
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="design">Design Survey</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="animate-fade-in">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Survey Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="survey-title" className="block text-sm font-medium mb-1">
                      Survey Title
                    </label>
                    <Input
                      id="survey-title"
                      value={surveyTitle}
                      onChange={(e) => setSurveyTitle(e.target.value)}
                      placeholder="Enter survey title"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="survey-description" className="block text-sm font-medium mb-1">
                      Description (optional)
                    </label>
                    <Textarea
                      id="survey-description"
                      value={surveyDescription}
                      onChange={(e) => setSurveyDescription(e.target.value)}
                      placeholder="Enter a description for your survey"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Questions</h2>
                  <Button onClick={addQuestion}>
                    <Plus className="mr-2 h-4 w-4" /> Add Question
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <QuestionBuilder
                      key={question.id}
                      question={question}
                      onChange={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                      onDelete={() => deleteQuestion(index)}
                      onMoveUp={() => moveQuestionUp(index)}
                      onMoveDown={() => moveQuestionDown(index)}
                      isFirst={index === 0}
                      isLast={index === questions.length - 1}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <Button variant="outline" onClick={previewSurvey}>
                  Preview
                </Button>
                <Button onClick={saveSurvey}>
                  <Send className="mr-2 h-4 w-4" /> Save Survey
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Survey Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Data Collection</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow anonymous responses</h4>
                        <p className="text-sm text-muted-foreground">Respondents can submit without identifying themselves</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="anonymous" className="mr-2" defaultChecked />
                        <label htmlFor="anonymous">Enable</label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Multiple submissions</h4>
                        <p className="text-sm text-muted-foreground">Allow respondents to submit multiple times</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="multiple" className="mr-2" />
                        <label htmlFor="multiple">Enable</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Display Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show progress bar</h4>
                        <p className="text-sm text-muted-foreground">Display completion progress to respondents</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="progress" className="mr-2" defaultChecked />
                        <label htmlFor="progress">Enable</label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Show question numbers</h4>
                        <p className="text-sm text-muted-foreground">Display question numbers to respondents</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input type="checkbox" id="numbers" className="mr-2" defaultChecked />
                        <label htmlFor="numbers">Enable</label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Preview Your Survey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-3xl mx-auto border rounded-lg p-6 bg-white shadow-sm">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">{surveyTitle || "Untitled Survey"}</h2>
                    {surveyDescription && <p className="text-muted-foreground">{surveyDescription}</p>}
                  </div>
                  
                  <div className="space-y-8">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border-b pb-6 last:border-0">
                        <div className="mb-3">
                          <h3 className="text-lg font-medium">
                            {index + 1}. {question.title || "Untitled Question"}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          {question.description && (
                            <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          {question.type === 'single-choice' && question.options && (
                            <div className="space-y-2">
                              {question.options.map((option, i) => (
                                <div key={i} className="flex items-center">
                                  <input 
                                    type="radio" 
                                    id={`q${index}-o${i}`} 
                                    name={`question-${question.id}`} 
                                    className="mr-2"
                                  />
                                  <label htmlFor={`q${index}-o${i}`}>{option}</label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-2">
                              {question.options.map((option, i) => (
                                <div key={i} className="flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id={`q${index}-o${i}`} 
                                    name={`question-${question.id}`} 
                                    className="mr-2"
                                  />
                                  <label htmlFor={`q${index}-o${i}`}>{option}</label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.type === 'text' && (
                            <textarea 
                              className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]" 
                              placeholder="Your answer"
                            />
                          )}
                          
                          {question.type === 'rating' && (
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-accent transition-colors"
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button>Submit Responses</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setActiveTab('design')}>
                Return to Editing
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
