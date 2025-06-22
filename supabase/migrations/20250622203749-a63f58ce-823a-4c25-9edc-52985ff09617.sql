
-- Add metadata column to subscribers table to store role information
ALTER TABLE public.subscribers 
ADD COLUMN metadata JSONB DEFAULT NULL;
