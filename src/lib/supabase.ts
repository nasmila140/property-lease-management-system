import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  role: string;
  created_at: string;
  last_login?: string;
}

export interface Property {
  id: string;
  property_id: string;
  address: string;
  property_type: string;
  lease_start_date?: string;
  lease_end_date?: string;
  monthly_rent: number;
  tenant_name?: string;
  tenant_contact?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  property_id: string;
  payment_type: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginActivity {
  id: string;
  user_id: string;
  login_time: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  created_at: string;
}
