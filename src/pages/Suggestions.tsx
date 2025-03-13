
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
import { Suggestion, SuggestionFormData } from '@/types/suggestions';
import { MessageSquare } from 'lucide-react';

// Mock data for initial development
const initialSuggestions: Suggestion[] = [
  {
    id: '1',
    content: 'Add dark mode to the survey interface',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    createdAt: '2023-08-15T10:30:00Z',
    status: 'implemented',
    category: 'UI/UX',
    priority: 'medium'
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
  const [activeTab, setActiveTab] = useState('submit');
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SuggestionFormData>();

  const onSubmit = (data: SuggestionFormData) => {
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
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
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive">{errors.content.message}</p>
                    )}
                  </div>
                  
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
      </main>
      
      <Footer />
    </div>
  );
}
