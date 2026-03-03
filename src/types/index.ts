export interface Company {
  id: string;
  name: string;
  logo?: string;
  createdAt: string;
}

export interface PMActivity {
  id: string;
  title: string;
  name?: string;
  description: string;
  category?: string;
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue' | 'in-progress';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  week?: number;
  completedAt?: string;
  notes?: string;
  evidence?: string[];
}

export interface WeeklyStats {
  week: number;
  completed: number;
  total: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface MonthlyStats {
  month: number;
  year: number;
  completed: number;
  total: number;
  completionRate: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'manager';
  companyId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
