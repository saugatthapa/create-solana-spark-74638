-- Create table to track token creations
CREATE TABLE IF NOT EXISTS public.token_creations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_address TEXT NOT NULL,
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  token_image TEXT,
  creator_wallet TEXT NOT NULL,
  network TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.token_creations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read token creations
CREATE POLICY "Anyone can view token creations"
  ON public.token_creations
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert token creations
CREATE POLICY "Anyone can insert token creations"
  ON public.token_creations
  FOR INSERT
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_creations;

-- Create index for faster queries
CREATE INDEX idx_token_creations_created_at ON public.token_creations(created_at DESC);