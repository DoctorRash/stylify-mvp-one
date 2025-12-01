-- Create portfolios bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public access to portfolios
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolios' );

-- Policy: Allow authenticated users to upload to portfolios
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolios'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolios'
  AND auth.uid() = owner
);

-- Policy: Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolios'
  AND auth.uid() = owner
);
