import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SuggestionsList from '@/components/suggestions/SuggestionsList';
import SuggestionReports from '@/components/suggestions/SuggestionReports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suggestion, SuggestionFormData, KnowledgeBaseItem } from '@/types/suggestions';
import { MessageSquare, Search, Book } from 'lucide-react';

const initialSuggestions: Suggestion[] = [
  {
    id: '1',
    content: 'Add dark mode to the survey interface',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    createdAt: '2023-08-15T10:30:00Z',
    status: 'implemented',
    category: 'UI/UX',
    priority: 'medium',
    response: 'We have implemented dark mode in the latest release.',
    responseDate: '2023-08-20T14:30:00Z'
  },
  {
    id: '2',
    content: 'Allow exporting survey results to CSV',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    createdAt: '2023-08-10T14:20:00Z',
    status: 'new',
    category: 'Reporting',
    priority: 'high'
  },
  {
    id: '3',
    content: 'Add integration with CRM systems',
    customerName: 'Anonymous',
    customerEmail: 'anonymous@example.com',
    createdAt: '2023-07-28T09:15:00Z',
    status: 'reviewed',
    category: 'Integrations',
    priority: 'high',
    isAnonymous: true
  }
];

const knowledgeBase: KnowledgeBaseItem[] = [
  {
    id: '1',
    title: 'How to implement dark mode',
    content: 'Dark mode can be implemented using Tailwind CSS dark mode utilities.',
    category: 'UI/UX',
    tags: ['dark mode', 'theme', 'UI'],
    createdAt: '2023-07-10T10:30:00Z',
    updatedAt: '2023-07-10T10:30:00Z'
  },
  {
    id: '2',
    title: 'Exporting survey results',
    content: 'You can export survey results to CSV or Excel formats using the export button.',
    category: 'Reporting',
    tags: ['export', 'csv', 'excel', 'reports'],
    createdAt: '2023-07-12T14:30:00Z',
    updatedAt: '2023-07-15T09:20:00Z'
  }
];

const initialCustomers: Customer[] = [
  {
    id: '1',
    brandName: 'Acme Corp',
    contactEmail: 'info@acmecorp.com',
    contactPhone: '+1-555-123-4567',
    acquiredServices: ['Basic Survey', 'Analytics Dashboard'],
    createdAt: '2023-05-15T10:30:00Z',
    growthMetrics: [
      { period: '2023-Q1', revenue: 5000, userCount: 120 },
      { period: '2023-Q2', revenue: 6200, userCount: 150 }
    ]
  },
  {
    id: '2',
    brandName: 'Globex Industries',
    contactEmail: 'contact@globex.com',
    contactPhone: '+1-555-987-6543',
    acquiredServices: ['Premium Survey', 'Analytics Dashboard', 'API Access'],
    createdAt: '2023-04-10T09:15:00Z',
    growthMetrics: [
      { period: '2023-Q1', revenue: 8500, userCount: 220 },
      { period: '2023-Q2', revenue: 9800, userCount: 275 }
    ]
  }
];

const categories = [
  'UI/UX', 
  'Features', 
  'Performance', 
  'Integrations', 
  'Reporting', 
  'Mobile App', 
  'Other'
];

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBaseItem[]>(knowledgeBase);
  const [activeTab, setActiveTab] = useState('submit');
  const [searchResults, setSearchResults] = useState<{ suggestions: Suggestion[], knowledgeItems: KnowledgeBaseItem[] }>({ suggestions: [], knowledgeItems: [] });
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<SuggestionFormData>();
  
  const suggestionContent = watch('content');

  const findSimilarItems = (content: string) => {
    if (!content || content.length < 5) return;
    
    const searchTerms = content.toLowerCase().split(' ').filter(term => term.length > 3);
    
    if (searchTerms.length === 0) return;
    
    const similarSuggestions = suggestions.filter(suggestion => {
      const suggestionText = suggestion.content.toLowerCase();
      return searchTerms.some(term => suggestionText.includes(term));
    });
    
    const relevantKnowledgeItems = knowledgeItems.filter(item => {
      const itemText = `${item.title} ${item.content}`.toLowerCase();
      return searchTerms.some(term => itemText.includes(term));
    });
    
    setSearchResults({
      suggestions: similarSuggestions,
      knowledgeItems: relevantKnowledgeItems
    });
    
    setHasSearched(true);
  };

  const onSubmit = (data: SuggestionFormData) => {
    findSimilarItems(data.content);
    
    const newSuggestion: Suggestion = {
      id: uuidv4(),
      content: data.content,
      customerName: data.isAnonymous ? 'Anonymous' : data.customerName,
      customerEmail: data.customerEmail,
      createdAt: new Date().toISOString(),
      status: 'new',
      category: data.category || 'Other',
      isAnonymous: data.isAnonymous
    };

    setSuggestions([newSuggestion, ...suggestions]);
    toast({
      title: "Suggestion submitted",
      description: "Thank you for your feedback!",
    });
    reset();
    setHasSearched(false);
    setSearchResults({ suggestions: [], knowledgeItems: [] });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex justify-center">
        <div className="w-[900px] max-w-[900px] h-full bg-white p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Customer Suggestions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We value your feedback! Submit your ideas and check out what others have suggested.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="submit">Submit Suggestion</TabsTrigger>
              <TabsTrigger value="view">View Suggestions</TabsTrigger>
              <TabsTrigger value="reports">Monthly Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="submit">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    New Suggestion
                  </CardTitle>
                  <CardDescription>
                    Share your ideas on how we can improve our services
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="content">Your Suggestion</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Describe your suggestion here..." 
                        className="min-h-[120px]"
                        {...register('content', { required: "Please provide your suggestion" })}
                        onChange={(e) => {
                          if (e.target.value.length > 15) {
                            findSimilarItems(e.target.value);
                          }
                        }}
                      />
                      {errors.content && (
                        <p className="text-sm text-destructive">{errors.content.message}</p>
                      )}
                    </div>
                    
                    {hasSearched && (searchResults.suggestions.length > 0 || searchResults.knowledgeItems.length > 0) && (
                      <div className="bg-muted p-4 rounded-md border border-border">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Search className="h-4 w-4" />
                          Similar items found
                        </h4>
                        
                        {searchResults.suggestions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Similar suggestions:</p>
                            <ul className="text-sm space-y-1">
                              {searchResults.suggestions.slice(0, 3).map(suggestion => (
                                <li key={suggestion.id} className="p-2 bg-background rounded-md">
                                  {suggestion.content}
                                  <span className="block text-xs text-muted-foreground mt-1">
                                    Status: {suggestion.status}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {searchResults.knowledgeItems.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">From knowledge base:</p>
                            <ul className="text-sm space-y-1">
                              {searchResults.knowledgeItems.slice(0, 2).map(item => (
                                <li key={item.id} className="p-2 bg-background rounded-md">
                                  <strong>{item.title}</strong>
                                  <p className="text-muted-foreground text-xs mt-1">{item.content.substring(0, 100)}...</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Your Name</Label>
                        <Input 
                          id="customerName" 
                          placeholder="John Doe" 
                          {...register('customerName', { required: "Name is required unless anonymous" })}
                        />
                        {errors.customerName && (
                          <p className="text-sm text-destructive">{errors.customerName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email Address</Label>
                        <Input 
                          id="customerEmail" 
                          type="email" 
                          placeholder="john@example.com" 
                          {...register('customerEmail', { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })}
                        />
                        {errors.customerEmail && (
                          <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select 
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...register('category')}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isAnonymous" {...register('isAnonymous')} />
                      <Label htmlFor="isAnonymous">Submit anonymously</Label>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end">
                    <Button type="submit">Submit Suggestion</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="view">
              <SuggestionsList suggestions={suggestions} />
            </TabsContent>
            
            <TabsContent value="reports">
              <SuggestionReports suggestions={suggestions} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
