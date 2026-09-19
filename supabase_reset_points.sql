-- Reset all points to 0 for every user
UPDATE public.profiles
SET total_points = 0;

-- Delete all transactions (this will remove all earned badges and point history)
TRUNCate TABLE public.transactions;
