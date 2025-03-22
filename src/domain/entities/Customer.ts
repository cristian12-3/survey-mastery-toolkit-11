
export interface Customer {
  id: string;
  brandName: string;
  contactEmail: string;
  contactPhone: string;
  acquiredServices: string[];
  createdAt: string;
  growthMetrics?: {
    period: string;
    revenue: number;
    userCount: number;
  }[];
}
