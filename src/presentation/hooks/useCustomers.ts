
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../infrastructure/context/ServiceContext';
import { Customer } from '../../domain/entities/Customer';

export const useCustomers = () => {
  const { customerService } = useServices();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAllCustomers(),
  });

  const createCustomerMutation = useMutation({
    mutationFn: (newCustomer: Omit<Customer, "id" | "createdAt">) => 
      customerService.createCustomer(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: (customer: Customer) => customerService.updateCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    customers,
    isLoading,
    error,
    createCustomer: createCustomerMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    deleteCustomer: deleteCustomerMutation.mutate,
  };
};
