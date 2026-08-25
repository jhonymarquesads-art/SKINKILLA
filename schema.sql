-- Facial Skin Analysis SaaS Database Schema
-- Tables: profiles, evaluations, payments

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table: stores user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  age_group TEXT, -- e.g., '18-25', '26-35', '36-45', '46-55', '56+'
  skin_sensitivity TEXT, -- e.g., 'low', 'medium', 'high'
  sun_exposure TEXT, -- e.g., 'low', 'medium', 'high'
  main_concerns TEXT[], -- array of concerns: wrinkles, dark_spots, redness, texture, oiliness
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table: stores skin analysis results
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles ON DELETE CASCADE,
  -- Skin metrics (scores from 0 to 100)
  wrinkles_score INTEGER CHECK (wrinkles_score >= 0 AND wrinkles_score <= 100),
  dark_spots_score INTEGER CHECK (dark_spots_score >= 0 AND dark_spots_score <= 100),
  redness_score INTEGER CHECK (redness_score >= 0 AND redness_score <= 100),
  texture_score INTEGER CHECK (texture_score >= 0 AND texture_score <= 100),
  oiliness_score INTEGER CHECK (oiliness_score >= 0 AND oiliness_score <= 100),
  -- Generated routine (JSONB)
  routine JSONB,
  -- Report summary (optional)
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure one evaluation per profile per day (optional constraint)
  UNIQUE (profile_id, DATE(created_at))
);

-- Payments table: stores transaction information
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles ON DELETE CASCADE,
  evaluation_id UUID REFERENCES evaluations ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  payment_method TEXT, -- 'pix', 'credit_card'
  transaction_id TEXT, -- ID from payment gateway (Mercado Pago or Asaas)
  status TEXT, -- 'pending', 'approved', 'refused', 'refunded'
  pix_qr_code TEXT, -- For Pix payments
  pix_copy_paste TEXT, -- For Pix payments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_evaluations_profile_id ON evaluations(profile_id);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at);
CREATE INDEX idx_payments_profile_id ON payments(profile_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Triggers for updating updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Evaluations: users can only see and create their own evaluations
CREATE POLICY "Users can view own evaluations" ON evaluations
FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can create own evaluations" ON evaluations
FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Payments: users can only see and create their own payments
CREATE POLICY "Users can view own payments" ON payments
FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can create own payments" ON payments
FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Note: For deletions, we might restrict or use soft deletes. Here we restrict deletion via RLS by not granting DELETE permissions.
-- Alternatively, we can add policies for DELETE if needed, but typically we don't delete data in a SaaS for audit reasons.
