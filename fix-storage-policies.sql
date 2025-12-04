-- ============================================
-- FIX STORAGE RLS POLICIES
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Try-On" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload try-on" ON storage.objects;

-- Step 2: PORTFOLIOS BUCKET POLICIES

-- Allow anyone to read/view portfolio images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolios' );

-- Allow authenticated users to upload portfolio images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolios'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolios'
  AND auth.uid() = owner
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolios'
  AND auth.uid() = owner
);

-- Step 3: TRY-ON-IMAGES BUCKET POLICIES

-- Allow anyone to read/view try-on images
CREATE POLICY "Public Access Try-On"
ON storage.objects FOR SELECT
USING ( bucket_id = 'try-on-images' );

-- Allow authenticated users to upload try-on images
CREATE POLICY "Authenticated users can upload try-on"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'try-on-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own try-on files
CREATE POLICY "Users can update own try-on files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'try-on-images'
  AND auth.uid() = owner
);

-- Allow users to delete their own try-on files
CREATE POLICY "Users can delete own try-on files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'try-on-images'
  AND auth.uid() = owner
);

-- Done! Policies created successfully.
