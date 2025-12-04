-- Ensure buckets exist (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('try-on-images', 'try-on-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Re-apply policies to be safe (drop first to avoid conflicts if they exist differently)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolios' );

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolios'
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolios'
  AND auth.uid() = owner
);

DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolios'
  AND auth.uid() = owner
);

-- Try-on policies
DROP POLICY IF EXISTS "Public Access Try-On" ON storage.objects;
CREATE POLICY "Public Access Try-On"
ON storage.objects FOR SELECT
USING ( bucket_id = 'try-on-images' );

DROP POLICY IF EXISTS "Authenticated users can upload try-on" ON storage.objects;
CREATE POLICY "Authenticated users can upload try-on"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'try-on-images'
  AND auth.role() = 'authenticated'
);
