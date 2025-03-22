
import { useState, useMemo } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../../domain/entities/Customer';
import CustomerTable from '../components/customer/CustomerTable';
import ServiceUsageChart from '../components/customer/ServiceUsageChart';
import CustomerFormDialog from '../components/customer/CustomerFormDialog';

export default function CustomerGrowth() {
  const { customers, isLoading, createCustomer } = useCustomers();
  const [availableServices] = useState([
    'Survey Basic', 
    'Survey Pro', 
    'Analytics', 
    'API Access', 
    'Custom Branding'
  ]);

  const serviceUsageData = useMemo(() => {
    if (!customers.length) return [];
    
    const serviceCounts: Record<string, number> = {};
    
    customers.forEach(customer => {
      customer.acquiredServices.forEach(service => {
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      });
    });
    
    return Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [customers]);

  const handleAddCustomer = (customer: Customer) => {
    createCustomer(customer);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading customer data...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Growth</h1>
          <p className="text-muted-foreground">
            Manage customers and monitor service adoption
          </p>
        </div>
        <CustomerFormDialog 
          availableServices={availableServices} 
          onAddCustomer={handleAddCustomer} 
        />
      </header>

      <div className="grid grid-cols-1 gap-6">
        <ServiceUsageChart serviceUsageData={serviceUsageData} />
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
