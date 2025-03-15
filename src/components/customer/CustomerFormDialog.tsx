
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Customer } from '@/types/suggestions';

interface CustomerFormDialogProps {
  availableServices: string[];
  onAddCustomer: (customer: Customer) => void;
}

export default function CustomerFormDialog({ availableServices, onAddCustomer }: CustomerFormDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    brandName: '',
    contactEmail: '',
    contactPhone: '',
    acquiredServices: []
  });
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

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
      id: String(Date.now()),
      brandName: newCustomer.brandName || '',
      contactEmail: newCustomer.contactEmail || '',
      contactPhone: newCustomer.contactPhone || '',
      acquiredServices,
      createdAt: new Date().toISOString()
    };
    
    onAddCustomer(customer);
    
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
  );
}
