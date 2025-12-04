-- ============================================
-- MANUAL SLUG FIX (if trigger doesn't work)
-- Run this in Supabase SQL Editor AFTER debug-and-fix-slug.sql
-- ============================================

-- First, let's see what we're working with
SELECT id, business_name, slug FROM tailor_profiles;

-- If the trigger didn't work, manually set the slug
-- REPLACE 'YOUR_BUSINESS_NAME' with your actual business name from the SELECT above
-- REPLACE 'your-tailor-id' with your actual tailor profile id from the SELECT above

-- Example: If your business is "John's Tailoring", slug will be "johns-tailoring"
UPDATE tailor_profiles
SET slug = lower(
    regexp_replace(
        regexp_replace(
            regexp_replace(business_name, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
    )
)
WHERE id = 'your-tailor-id'  -- REPLACE with your actual ID
  AND business_name IS NOT NULL;

-- Verify it worked
SELECT 
    id,
    business_name,
    slug,
    CONCAT('/tailors/', slug) as profile_url
FROM tailor_profiles
WHERE business_name IS NOT NULL;
