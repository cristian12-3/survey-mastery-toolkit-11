import { useState, useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Suggestion, MonthlyReport } from '@/types/suggestions';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BarChart as BarChartIcon } from 'lucide-react';

interface SuggestionReportsProps {
  suggestions: Suggestion[];
}

export default function SuggestionReports({ suggestions }: SuggestionReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    
    suggestions.forEach(suggestion => {
      const date = parseISO(suggestion.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    
    return Array.from(months).sort().reverse();
  }, [suggestions]);
  
  const monthlyReport = useMemo(() => {
    if (!selectedMonth) return null;
    
    const [year, month] = selectedMonth.split('-').map(Number);
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));
    
    const monthlySuggestions = suggestions.filter(suggestion => {
      const date = parseISO(suggestion.createdAt);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
    
    const categoryCounts: Record<string, number> = {};
    monthlySuggestions.forEach(suggestion => {
      const category = suggestion.category || 'Other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    
    const statusCounts: Record<string, number> = {};
    monthlySuggestions.forEach(suggestion => {
      statusCounts[suggestion.status] = (statusCounts[suggestion.status] || 0) + 1;
    });
    
    return {
      month: format(startDate, 'MMMM'),
      year,
      totalSuggestions: monthlySuggestions.length,
      implementedSuggestions: statusCounts['implemented'] || 0,
      topCategories,
      suggestions: monthlySuggestions,
      statusData: Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      }))
    };
  }, [selectedMonth, suggestions]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  if (availableMonths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reports</CardTitle>
          <CardDescription>
            No suggestion data is available for reporting yet
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          Once customers submit suggestions, you'll see monthly reports and analytics here
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Monthly Suggestion Reports</CardTitle>
            <CardDescription>
              Analytics and insights from customer suggestions
            </CardDescription>
          </div>
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map(monthKey => {
                const [year, month] = monthKey.split('-').map(Number);
                const date = new Date(year, month - 1);
                return (
                  <SelectItem key={monthKey} value={monthKey}>
                    {format(date, 'MMMM yyyy')}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {!monthlyReport ? (
          <div className="text-center py-8 text-muted-foreground">
            No data available for the selected month
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthlyReport.totalSuggestions}</div>
                  <p className="text-sm text-muted-foreground">
                    Received in {monthlyReport.month} {monthlyReport.year}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Implementation Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {monthlyReport.totalSuggestions === 0 
                      ? '0%' 
                      : `${Math.round((monthlyReport.implementedSuggestions / monthlyReport.totalSuggestions) * 100)}%`}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {monthlyReport.implementedSuggestions} implemented out of {monthlyReport.totalSuggestions}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyReport.topCategories.length > 0 ? (
                    <>
                      <div className="text-2xl font-bold">{monthlyReport.topCategories[0].category}</div>
                      <p className="text-sm text-muted-foreground">
                        {monthlyReport.topCategories[0].count} suggestions
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No categories found</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={monthlyReport.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {monthlyReport.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {monthlyReport.topCategories.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No category data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyReport.topCategories}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="Suggestions" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Top Suggestions This Month</h3>
              <div className="space-y-4">
                {monthlyReport.suggestions.slice(0, 5).map((suggestion) => (
                  <Card key={suggestion.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{suggestion.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <span>{suggestion.isAnonymous ? 'Anonymous' : suggestion.customerName}</span>
                            <span>•</span>
                            <span>{format(parseISO(suggestion.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {suggestion.category && (
                            <Badge variant="outline">{suggestion.category}</Badge>
                          )}
                          <Badge 
                            className={
                              suggestion.status === 'new' ? 'bg-blue-500 text-white' :
                              suggestion.status === 'reviewed' ? 'bg-yellow-500 text-white' :
                              suggestion.status === 'implemented' ? 'bg-green-500 text-white' :
                              'bg-red-500 text-white'
                            }
                          >
                            {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {monthlyReport.suggestions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No suggestions found for this month
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
