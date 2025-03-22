
import { Customer } from "../../domain/entities/Customer";
import { CustomerRepository } from "../../application/ports/CustomerRepository";
import { sampleCustomers } from "../../utils/sampleData";

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Customer[] = [...sampleCustomers];

  async getAll(): Promise<Customer[]> {
    return Promise.resolve([...this.customers]);
  }

  async getById(id: string): Promise<Customer | null> {
    const customer = this.customers.find(c => c.id === id);
    return Promise.resolve(customer || null);
  }

  async create(customerData: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
    const newCustomer: Customer = {
      ...customerData,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    this.customers.push(newCustomer);
    return Promise.resolve(newCustomer);
  }

  async update(customer: Customer): Promise<Customer> {
    const index = this.customers.findIndex(c => c.id === customer.id);
    if (index === -1) {
      throw new Error(`Customer with id ${customer.id} not found`);
    }
    this.customers[index] = customer;
    return Promise.resolve(customer);
  }

  async delete(id: string): Promise<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
    return Promise.resolve();
  }
}
