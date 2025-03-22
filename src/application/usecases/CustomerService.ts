
import { Customer } from "../../domain/entities/Customer";
import { CustomerRepository } from "../ports/CustomerRepository";

export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.getAll();
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.customerRepository.getById(id);
  }

  async createCustomer(customer: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
    return this.customerRepository.create(customer);
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    return this.customerRepository.update(customer);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.customerRepository.delete(id);
  }
}
