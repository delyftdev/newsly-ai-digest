
-- Create referrals table to track referral codes and credits
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT UNIQUE NOT NULL,
  referrer_email TEXT NOT NULL,
  total_credits INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add referral tracking columns to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN referral_code TEXT DEFAULT NULL,
ADD COLUMN referred_by TEXT DEFAULT NULL;

-- Create indexes for efficient querying
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_email ON public.referrals(referrer_email);
CREATE INDEX idx_subscribers_referral ON public.subscribers(referral_code);
CREATE INDEX idx_subscribers_referred_by ON public.subscribers(referred_by);

-- Enable RLS on referrals table
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create policy for referrals (allow read access for all, insert/update for authenticated users)
CREATE POLICY "Allow read access to referrals" 
  ON public.referrals 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow insert/update referrals" 
  ON public.referrals 
  FOR ALL 
  USING (true);
