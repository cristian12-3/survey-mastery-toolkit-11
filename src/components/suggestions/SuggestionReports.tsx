
import { useState } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart } from 'lucide-react';
import { 
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';
import { Suggestion, MonthlyReport } from '@/types/suggestions';

interface SuggestionReportsProps {
  suggestions: Suggestion[];
}

export default function SuggestionReports({ suggestions }: SuggestionReportsProps) {
  const [timeRange, setTimeRange] = useState<string>('3');
  
  // Generate monthly reports
  const generateMonthlyReports = (): MonthlyReport[] => {
    const now = new Date();
    const months = parseInt(timeRange);
    const startDate = subMonths(now, months);
    
    // Get all months in the range
    const monthsRange = eachMonthOfInterval({
      start: startDate,
      end: now
    });
    
    // Create reports for each month
    return monthsRange.map(date => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      // Filter suggestions for this month
      const monthlySuggestions = suggestions.filter(suggestion => {
        const suggestionDate = new Date(suggestion.createdAt);
        return suggestionDate >= monthStart && suggestionDate <= monthEnd;
      });
      
      // Count implementations
      const implementedCount = monthlySuggestions.filter(s => s.status === 'implemented').length;
      
      // Get top categories
      const categoryCounts: Record<string, number> = {};
      monthlySuggestions.forEach(suggestion => {
        if (suggestion.category) {
          categoryCounts[suggestion.category] = (categoryCounts[suggestion.category] || 0) + 1;
        }
      });
      
      // Sort categories by count and take top 3
      const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category, count]) => ({ category, count }));
      
      return {
        month: format(date, 'MMMM'),
        year: date.getFullYear(),
        totalSuggestions: monthlySuggestions.length,
        implementedSuggestions: implementedCount,
        topCategories,
        suggestions: monthlySuggestions
      };
    }).reverse(); // Most recent month first
  };
  
  const monthlyReports = generateMonthlyReports();
  
  // Prepare chart data
  const chartData = monthlyReports.map(report => ({
    name: `${report.month} ${report.year}`,
    total: report.totalSuggestions,
    implemented: report.implementedSuggestions
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Suggestion Reports
        </CardTitle>
        <CardDescription>
          View monthly reports and trends of customer suggestions
        </CardDescription>
        
        <div className="flex justify-end mt-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Last 3 months</SelectItem>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Total Suggestions" />
                  <Bar dataKey="implemented" fill="#82ca9d" name="Implemented" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="space-y-6">
              {monthlyReports.map((report, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {report.month} {report.year}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-sm text-muted-foreground">Total Suggestions</p>
                      <p className="text-2xl font-bold">{report.totalSuggestions}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-sm text-muted-foreground">Implementation Rate</p>
                      <p className="text-2xl font-bold">
                        {report.totalSuggestions > 0 
                          ? Math.round((report.implementedSuggestions / report.totalSuggestions) * 100)
                          : 0}%
                      </p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-sm text-muted-foreground">Top Categories</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.topCategories.map((cat, idx) => (
                          <Badge key={idx} variant="outline">
                            {cat.category} ({cat.count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
