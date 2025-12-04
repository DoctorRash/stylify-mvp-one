-- ============================================
-- COMPLETE DIAGNOSTIC & FIX FOR TAILOR PROFILE
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- ========== STEP 1: CHECK CURRENT STATE ==========
SELECT '========== CURRENT TAILOR PROFILES ==========';
SELECT 
    id,
    user_id,
    business_name,
    slug,
    location,
    CASE 
        WHEN slug IS NOT NULL AND slug != '' THEN '✅ Has valid slug'
        WHEN business_name IS NOT NULL THEN '❌ NO SLUG - needs fix!'
        ELSE '❌ NO BUSINESS NAME - complete profile first!'
    END as status
FROM tailor_profiles;


-- ========== STEP 2: CHECK IF SLUG FUNCTION EXISTS ==========
SELECT '========== CHECKING SLUG GENERATION FUNCTION ==========';
SELECT EXISTS (
    SELECT 1 
    FROM pg_proc 
    WHERE proname = 'generate_slug'
) as function_exists;


-- ========== STEP 3: CREATE SLUG FUNCTION IF MISSING ==========
-- Create the function if it doesn't exist
CREATE OR REPLACE FUNCTION generate_slug(name text) RETURNS text AS $$
DECLARE
  new_slug text;
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  new_slug := lower(
    regexp_replace(
      regexp_replace(
        name, 
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
  
  -- Remove leading/trailing hyphens and multiple consecutive hyphens
  new_slug := regexp_replace(trim(both '-' from new_slug), '-+', '-', 'g');
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;


-- ========== STEP 4: GENERATE SLUGS FOR ALL PROFILES ==========
-- Manually generate slugs for profiles that have business_name but no slug
UPDATE tailor_profiles
SET slug = (
    SELECT generate_slug(business_name) || 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM tailor_profiles t2 
            WHERE t2.slug = generate_slug(tailor_profiles.business_name) 
            AND t2.id != tailor_profiles.id
        ) THEN '-' || substring(tailor_profiles.id::text from 1 for 8)
        ELSE ''
    END
)
WHERE business_name IS NOT NULL 
  AND business_name != ''
  AND (slug IS NULL OR slug = '');


-- ========== STEP 5: VERIFY RESULTS ==========
SELECT '========== FINAL RESULTS ==========';
SELECT 
    id,
    business_name,
    slug,
    '/tailors/' || slug as profile_url,
    CASE 
        WHEN slug IS NOT NULL AND slug != '' THEN '✅ READY!'
        ELSE '❌ STILL BROKEN'
    END as final_status
FROM tailor_profiles
WHERE business_name IS NOT NULL;


-- ========== STEP 6: SHOW WHAT TO DO NEXT ==========
SELECT '========== INSTRUCTIONS ==========';
SELECT 
    '1. Check the "profile_url" column above' as step_1,
    '2. Copy your profile URL (e.g., /tailors/johns-tailoring)' as step_2,
    '3. Paste it into your browser after http://localhost:3000' as step_3,
    '4. OR refresh your tailor dashboard - the link should work now!' as step_4;
