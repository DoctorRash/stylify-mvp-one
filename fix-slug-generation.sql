-- ============================================
-- FIX MISSING SLUG FOR TAILOR PROFILE
-- Run this in Supabase SQL Editor
-- ============================================

-- This will trigger the slug generation for all profiles that have a business_name but no slug
UPDATE tailor_profiles 
SET business_name = business_name 
WHERE business_name IS NOT NULL AND (slug IS NULL OR slug = '');

-- Verify the slugs were created
SELECT id, business_name, slug, location 
FROM tailor_profiles 
WHERE business_name IS NOT NULL;
