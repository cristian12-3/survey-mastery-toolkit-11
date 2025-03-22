
import { format } from 'date-fns';
import { User, ChevronRight } from 'lucide-react';
import { Customer } from '../../../domain/entities/Customer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  return (
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Since</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.brandName}</TableCell>
                  <TableCell>
                    <div>{customer.contactEmail}</div>
                    <div className="text-muted-foreground text-sm">{customer.contactPhone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.acquiredServices.map(service => (
                        <span key={service} className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(customer.createdAt), 'MMM yyyy')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
