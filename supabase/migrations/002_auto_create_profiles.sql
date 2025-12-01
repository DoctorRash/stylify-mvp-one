-- Additional Migration: Auto-create profiles on signup
-- Run this AFTER running 001_initial_schema.sql

-- This function automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
  );
  
  -- Create role-specific profile
  IF (NEW.raw_user_meta_data->>'role' = 'tailor') THEN
    INSERT INTO public.tailor_profiles (user_id)
    VALUES (NEW.id);
  ELSIF (NEW.raw_user_meta_data->>'role' = 'customer') THEN
    INSERT INTO public.customer_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
