export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'staff';
  avatar?: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
}