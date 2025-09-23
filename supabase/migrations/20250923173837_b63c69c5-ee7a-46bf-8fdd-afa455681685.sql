-- Change rating column from integer to numeric to support decimal ratings (e.g., 4.5, 3.7)
ALTER TABLE public.reviews 
ALTER COLUMN rating TYPE NUMERIC(2,1);