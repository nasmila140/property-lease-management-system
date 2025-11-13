/*
  # Property Lease Management System Database Schema

  ## Overview
  Creates a complete database structure for tracking property leases, payments, and user activity.

  ## New Tables

  ### 1. `users` Table
  Stores user accounts for the property management system
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique, not null) - User email for login
  - `username` (text, unique, not null) - Username for login
  - `full_name` (text) - User's full name
  - `role` (text) - User role (admin, manager, viewer)
  - `created_at` (timestamptz) - Account creation timestamp
  - `last_login` (timestamptz) - Last login timestamp

  ### 2. `login_activity` Table
  Tracks all login attempts and user access history
  - `id` (uuid, primary key) - Unique activity record identifier
  - `user_id` (uuid, foreign key) - References users table
  - `login_time` (timestamptz) - When the login occurred
  - `ip_address` (text) - IP address of login attempt
  - `user_agent` (text) - Browser/device information
  - `success` (boolean) - Whether login was successful
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `properties` Table
  Stores information about leased properties
  - `id` (uuid, primary key) - Unique property identifier
  - `property_id` (text, unique, not null) - Human-readable property ID for searching
  - `address` (text, not null) - Property address
  - `property_type` (text) - Type of property (residential, commercial, etc.)
  - `lease_start_date` (date) - When lease begins
  - `lease_end_date` (date) - When lease ends
  - `monthly_rent` (decimal) - Monthly rental amount
  - `tenant_name` (text) - Name of tenant
  - `tenant_contact` (text) - Tenant contact information
  - `status` (text) - Property status (active, vacant, maintenance)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `payments` Table
  Tracks all payments related to properties
  - `id` (uuid, primary key) - Unique payment identifier
  - `property_id` (uuid, foreign key) - References properties table
  - `payment_type` (text, not null) - Type: rent, water, sewer, maintenance, other
  - `amount` (decimal, not null) - Payment amount
  - `due_date` (date, not null) - When payment is due
  - `paid_date` (date) - When payment was actually made
  - `status` (text, not null) - Status: paid, pending, overdue
  - `payment_method` (text) - How payment was made (cash, check, transfer)
  - `notes` (text) - Additional payment notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Users can only view their own login activity
  - Authenticated users can view all properties and payments
  - Only authenticated users can insert/update payment records
  - Login activity can only be inserted by authenticated users

  ## Important Notes
  1. All tables use RLS for security
  2. Foreign key constraints ensure data integrity
  3. Indexes added for frequently queried columns (property_id, user_id)
  4. Default values set for timestamps and status fields
  5. Decimal type used for accurate financial calculations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'viewer',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create login_activity table
CREATE TABLE IF NOT EXISTS login_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  login_time timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id text UNIQUE NOT NULL,
  address text NOT NULL,
  property_type text DEFAULT 'residential',
  lease_start_date date,
  lease_end_date date,
  monthly_rent decimal(10,2) DEFAULT 0,
  tenant_name text,
  tenant_contact text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  payment_type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  status text DEFAULT 'pending' NOT NULL,
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_login_activity_user_id ON login_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_property_id ON properties(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all user profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for login_activity table
CREATE POLICY "Users can view own login activity"
  ON login_activity FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth.uid() = id));

CREATE POLICY "System can insert login activity"
  ON login_activity FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for properties table
CREATE POLICY "Authenticated users can view all properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for payments table
CREATE POLICY "Authenticated users can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (true);