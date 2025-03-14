
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suggestion, KnowledgeBaseItem } from '@/types/suggestions';
import { MessageSquare, Search, Filter, Book, FileText } from 'lucide-react';

interface RequirementFormData {
  content: string;
  customerName: string;
  customerEmail: string;
  category?: string;
}

const initialRequirements: Suggestion[] = [
  {
    id: '101',
    content: 'Need to integrate with our CRM system',
    customerName: 'Robert Johnson',
    customerEmail: 'robert@company.com',
    createdAt: '2023-09-10T14:20:00Z',
    status: 'new',
    category: 'Integration',
    priority: 'high'
  },
  {
    id: '102',
    content: 'Mobile app crashes when exporting large surveys',
    customerName: 'Maria Garcia',
    customerEmail: 'maria@company.com',
    createdAt: '2023-09-15T11:30:00Z',
    status: 'reviewed',
    category: 'Bug Fix',
    priority: 'high'
  }
];

const initialKnowledgeBase: KnowledgeBaseItem[] = [
  {
    id: '201',
    title: 'CRM Integration Guide',
    content: 'Step-by-step instructions for integrating our API with popular CRM systems including Salesforce, HubSpot, and Zoho.',
    category: 'Integration',
    tags: ['crm', 'api', 'integration', 'salesforce', 'hubspot'],
    createdAt: '2023-07-10T10:30:00Z',
    updatedAt: '2023-08-15T14:20:00Z'
  },
  {
    id: '202',
    title: 'Mobile App Troubleshooting',
    content: 'Common issues with the mobile app and their solutions, including export limitations, authentication problems, and connectivity issues.',
    category: 'Troubleshooting',
    tags: ['mobile', 'app', 'export', 'crash', 'troubleshooting'],
    createdAt: '2023-06-22T09:15:00Z',
    updatedAt: '2023-09-01T16:45:00Z'
  }
];

const categories = [
  'Feature Request', 
  'Bug Fix', 
  'Integration', 
  'Performance', 
  'Documentation', 
  'Security', 
  'Other'
];

export default function Requirements() {
  const [requirements, setRequirements] = useState<Suggestion[]>(initialRequirements);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>(initialKnowledgeBase);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ requirements: Suggestion[], knowledgeItems: KnowledgeBaseItem[] }>({ requirements: [], knowledgeItems: [] });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('new');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<RequirementFormData>();
  
  const requirementContent = watch('content');

  useEffect(() => {
    if (requirementContent && requirementContent.length > 10) {
      handleSearch(requirementContent);
    }
  }, [requirementContent]);

  const handleSearch = (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults({ requirements: [], knowledgeItems: [] });
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 3);
    
    if (searchTerms.length === 0) {
      setSearchResults({ requirements: [], knowledgeItems: [] });
      setIsSearching(false);
      return;
    }
    
    // Search in existing requirements
    const matchingRequirements = requirements.filter(req => {
      const text = `${req.content} ${req.category || ''}`.toLowerCase();
      return searchTerms.some(term => text.includes(term));
    });
    
    // Search in knowledge base
    const matchingKnowledgeItems = knowledgeBase.filter(item => {
      const text = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
      return searchTerms.some(term => text.includes(term));
    });
    
    setSearchResults({
      requirements: matchingRequirements,
      knowledgeItems: matchingKnowledgeItems
    });
  };

  const onSubmit = (data: RequirementFormData) => {
    const newRequirement: Suggestion = {
      id: uuidv4(),
      content: data.content,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      createdAt: new Date().toISOString(),
      status: 'new',
      category: data.category || 'Other'
    };

    setRequirements([newRequirement, ...requirements]);
    toast({
      title: "Requirement submitted",
      description: "Your requirement has been successfully registered.",
    });
    reset();
    setSearchResults({ requirements: [], knowledgeItems: [] });
    setIsSearching(false);
  };

  const filteredRequirements = requirements.filter(req => 
    categoryFilter === '' || req.category === categoryFilter
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex justify-center">
        <div className="w-[900px] max-w-[900px] h-full bg-white p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Requirements Management</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit new requirements or search for existing solutions
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="new">Submit New Requirement</TabsTrigger>
              <TabsTrigger value="existing">View Requirements</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    New Requirement
                  </CardTitle>
                  <CardDescription>
                    Submit a new requirement or issue
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="content">Requirement Description</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Describe your requirement in detail..." 
                        className="min-h-[120px]"
                        {...register('content', { required: "Please provide a description" })}
                      />
                      {errors.content && (
                        <p className="text-sm text-destructive">{errors.content.message}</p>
                      )}
                    </div>
                    
                    {isSearching && (searchResults.requirements.length > 0 || searchResults.knowledgeItems.length > 0) && (
                      <div className="bg-muted p-4 rounded-md border border-border">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Search className="h-4 w-4" />
                          Similar items found
                        </h4>
                        
                        {searchResults.requirements.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Similar requirements:</p>
                            <ul className="text-sm space-y-1">
                              {searchResults.requirements.slice(0, 3).map(req => (
                                <li key={req.id} className="p-2 bg-background rounded-md">
                                  {req.content}
                                  <span className="block text-xs text-muted-foreground mt-1">
                                    Status: {req.status} • Category: {req.category}
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
                          {...register('customerName', { required: "Name is required" })}
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
                  </CardContent>
                  
                  <CardFooter className="flex justify-end">
                    <Button type="submit">Submit Requirement</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="existing">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Existing Requirements
                  </CardTitle>
                  <CardDescription>
                    Browse and search through submitted requirements
                  </CardDescription>
                  
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requirements..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                      />
                    </div>
                    
                    <div className="w-full md:w-auto">
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {searchQuery && searchResults.requirements.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.requirements.map(req => (
                        <div key={req.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{req.content}</h3>
                            <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                              {req.status}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            <p>Submitted by: {req.customerName} ({req.customerEmail})</p>
                            <p>Category: {req.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredRequirements.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRequirements.map(req => (
                        <div key={req.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{req.content}</h3>
                            <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                              {req.status}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            <p>Submitted by: {req.customerName} ({req.customerEmail})</p>
                            <p>Category: {req.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No requirements found matching your criteria
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="knowledge">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Knowledge Base
                  </CardTitle>
                  <CardDescription>
                    Browse and search through documentation and solutions
                  </CardDescription>
                  
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search knowledge base..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                      }}
                    />
                  </div>
                </CardHeader>
                
                <CardContent>
                  {searchQuery && searchResults.knowledgeItems.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.knowledgeItems.map(item => (
                        <div key={item.id} className="p-4 border rounded-lg">
                          <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                          <p className="text-muted-foreground mb-2">{item.content}</p>
                          <div className="flex justify-between items-end">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => (
                                <span key={tag} className="inline-block px-2 py-1 text-xs bg-muted rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {knowledgeBase.map(item => (
                        <div key={item.id} className="p-4 border rounded-lg">
                          <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                          <p className="text-muted-foreground mb-2">{item.content}</p>
                          <div className="flex justify-between items-end">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => (
                                <span key={tag} className="inline-block px-2 py-1 text-xs bg-muted rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
