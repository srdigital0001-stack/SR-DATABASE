export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  services: string[];
  total_amount: number;
  advance_paid: number;
  remaining_balance: number;
  pending_tasks: number;
  managed_by: 'JYOTI SONI' | 'SHUBHAM RAI';
  notes?: string;
  created_at: string;
}

export interface Task {
  id: number;
  client_id: number;
  client_name?: string;
  title: string;
  assigned_to: string;
  due_date: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export type ServiceType = 
  | 'Meta Ads' 
  | 'Google Ads' 
  | 'Website Development' 
  | 'Social Media Management' 
  | 'SEO' 
  | 'Google My Business';

export const SERVICE_TYPES: ServiceType[] = [
  'Meta Ads',
  'Google Ads',
  'Website Development',
  'Social Media Management',
  'SEO',
  'Google My Business'
];
