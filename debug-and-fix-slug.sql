-- ============================================
-- DEBUG AND FIX SLUG GENERATION
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check current state of tailor profiles
SELECT 
    id,
    user_id,
    business_name,
    slug,
    location,
    created_at
FROM tailor_profiles
ORDER BY created_at DESC;

-- Step 2: Check if the trigger function exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'tailor_profiles';

-- Step 3: Manually set slug for profiles with business_name but no slug
-- This will trigger the slug generation
UPDATE tailor_profiles 
SET business_name = business_name 
WHERE business_name IS NOT NULL 
  AND business_name != '' 
  AND (slug IS NULL OR slug = '');

-- Step 4: Verify slugs were created
SELECT 
    id,
    business_name,
    slug,
    CASE 
        WHEN slug IS NOT NULL AND slug != '' THEN '✅ Has slug'
        WHEN business_name IS NOT NULL AND business_name != '' THEN '⚠️  Has business_name but NO slug - trigger not working!'
        ELSE '❌ Missing business_name'
    END as status
FROM tailor_profiles;
