
import { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Customer } from '@/types/suggestions';
import { User, Plus, ChevronRight, BarChart2 } from 'lucide-react';
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

const availableServices = [
  'Basic Survey',
  'Premium Survey',
  'Analytics Dashboard',
  'API Access',
  'Custom Branding',
  'Advanced Reports',
  'Email Marketing',
  'Data Export'
];

export default function CustomerGrowth() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    brandName: '',
    contactEmail: '',
    contactPhone: '',
    acquiredServices: []
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Calculate service usage for bar chart
  const serviceUsageData = availableServices.map(service => {
    const count = customers.filter(customer => 
      customer.acquiredServices.includes(service)
    ).length;
    
    return {
      name: service,
      count
    };
  }).sort((a, b) => b.count - a.count);

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const acquiredServices = Object.entries(selectedServices)
      .filter(([_, isSelected]) => isSelected)
      .map(([service]) => service);
      
    const customer: Customer = {
      id: String(customers.length + 1),
      brandName: newCustomer.brandName || '',
      contactEmail: newCustomer.contactEmail || '',
      contactPhone: newCustomer.contactPhone || '',
      acquiredServices,
      createdAt: new Date().toISOString()
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({
      brandName: '',
      contactEmail: '',
      contactPhone: '',
      acquiredServices: []
    });
    setSelectedServices({});
    setIsDialogOpen(false);
    
    toast({
      title: "Customer created",
      description: `${customer.brandName} has been added successfully.`
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex justify-center">
        <div className="w-[900px] max-w-[900px] h-full bg-white p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Customer Growth Tracking</h1>
              <p className="text-muted-foreground">
                Track and manage your customers and their growth metrics
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new customer below.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="brandName" className="text-right">
                        Brand Name
                      </Label>
                      <Input
                        id="brandName"
                        value={newCustomer.brandName}
                        onChange={(e) => setNewCustomer({...newCustomer, brandName: e.target.value})}
                        className="col-span-3"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contactEmail" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={newCustomer.contactEmail}
                        onChange={(e) => setNewCustomer({...newCustomer, contactEmail: e.target.value})}
                        className="col-span-3"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contactPhone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        id="contactPhone"
                        value={newCustomer.contactPhone}
                        onChange={(e) => setNewCustomer({...newCustomer, contactPhone: e.target.value})}
                        className="col-span-3"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">
                        Services
                      </Label>
                      <div className="col-span-3 flex flex-wrap gap-2">
                        {availableServices.map(service => (
                          <Button
                            key={service}
                            type="button"
                            variant={selectedServices[service] ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleServiceToggle(service)}
                            className="mb-2"
                          >
                            {service}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Add Customer</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Service Usage Analytics
                </CardTitle>
                <CardDescription>
                  Breakdown of services used by customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={serviceUsageData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Number of Customers" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Directory
                </CardTitle>
                <CardDescription>
                  List of all customers and their information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Brand Name</th>
                        <th className="text-left py-3 px-4">Contact</th>
                        <th className="text-left py-3 px-4">Services</th>
                        <th className="text-left py-3 px-4">Since</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(customer => (
                        <tr key={customer.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{customer.brandName}</td>
                          <td className="py-3 px-4">
                            <div>{customer.contactEmail}</div>
                            <div className="text-muted-foreground text-sm">{customer.contactPhone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {customer.acquiredServices.map(service => (
                                <span key={service} className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">{format(new Date(customer.createdAt), 'MMM yyyy')}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
