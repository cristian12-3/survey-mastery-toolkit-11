
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Survey, Question, Response, Answer } from "@/utils/sampleData";
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line, 
  ResponsiveContainer, 
  XAxis, YAxis, 
  Tooltip, Legend, CartesianGrid
} from "recharts";

interface DataVisualizationsProps {
  survey: Survey;
  responses: Response[];
}

export default function DataVisualizations({ survey, responses }: DataVisualizationsProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    survey.questions.length > 0 ? survey.questions[0].id : ''
  );

  const getAnswersForQuestion = (questionId: string): Answer[] => {
    return responses
      .map(response => response.answers.find(answer => answer.questionId === questionId))
      .filter(answer => answer !== undefined) as Answer[];
  };

  const getSelectedQuestion = (): Question | undefined => {
    return survey.questions.find(q => q.id === selectedQuestionId);
  };

  const formatDataForVisualization = (question: Question, answers: Answer[]) => {
    if (question.type === 'text') {
      return answers.map(answer => ({
        response: answer.value as string,
      }));
    }

    if (question.type === 'multiple-choice' && question.options) {
      const counts: Record<string, number> = {};
      question.options.forEach(option => { counts[option] = 0 });
      
      answers.forEach(answer => {
        const selectedOptions = Array.isArray(answer.value) ? answer.value : [answer.value];
        selectedOptions.forEach(option => {
          if (counts[option as string] !== undefined) {
            counts[option as string]++;
          }
        });
      });

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (['single-choice', 'dropdown'].includes(question.type) && question.options) {
      const counts: Record<string, number> = {};
      question.options.forEach(option => { counts[option] = 0 });
      
      answers.forEach(answer => {
        const selected = answer.value as string;
        if (counts[selected] !== undefined) {
          counts[selected]++;
        }
      });

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (['rating', 'nps'].includes(question.type)) {
      const min = question.type === 'nps' ? 0 : (question.settings?.min || 1);
      const max = question.type === 'nps' ? 10 : (question.settings?.max || 5);
      const counts: Record<string, number> = {};
      
      for (let i = min; i <= max; i++) {
        counts[i.toString()] = 0;
      }
      
      answers.forEach(answer => {
        const rating = answer.value.toString();
        if (counts[rating] !== undefined) {
          counts[rating]++;
        }
      });

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    return [];
  };

  const selectedQuestion = getSelectedQuestion();
  const questionAnswers = selectedQuestion ? getAnswersForQuestion(selectedQuestion.id) : [];
  const visualizationData = selectedQuestion ? formatDataForVisualization(selectedQuestion, questionAnswers) : [];

  // Colors for charts
  const COLORS = ['#3b82f6', '#64748b', '#0ea5e9', '#84cc16', '#8b5cf6', '#f97316'];

  const renderTextResponses = () => {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {questionAnswers.length} text responses collected
        </p>
        <div className="max-h-[400px] overflow-y-auto border rounded-md">
          {questionAnswers.length === 0 ? (
            <p className="text-center p-4 text-muted-foreground">No responses yet</p>
          ) : (
            <div className="divide-y">
              {questionAnswers.map((answer, i) => (
                <div key={i} className="p-3 hover:bg-muted/40 transition-colors">
                  <p className="text-sm">{answer.value as string}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCharts = () => {
    if (!selectedQuestion || questionAnswers.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] border rounded-md">
          <p className="text-muted-foreground">No data available for visualization</p>
        </div>
      );
    }

    if (selectedQuestion.type === 'text') {
      return renderTextResponses();
    }

    return (
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="w-full animate-fade-in">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visualizationData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '6px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]}
                  background={{ fill: 'hsl(var(--muted))' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="pie" className="w-full animate-fade-in">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visualizationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {visualizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [`${value} responses`, name]}
                  contentStyle={{ 
                    borderRadius: '6px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="line" className="w-full animate-fade-in">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visualizationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '6px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Question Analysis</CardTitle>
        <CardDescription>Visualize responses for each question</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label htmlFor="question-selector" className="block text-sm font-medium mb-2">
              Select a question to analyze
            </label>
            <select
              id="question-selector"
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {survey.questions.map((question) => (
                <option key={question.id} value={question.id}>
                  {question.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            {renderCharts()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
