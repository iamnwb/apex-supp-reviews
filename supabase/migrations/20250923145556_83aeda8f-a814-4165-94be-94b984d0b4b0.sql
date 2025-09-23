-- Add new columns to reviews table for enhanced functionality
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS buy_now_url TEXT,
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_text TEXT;