-- Create try-on-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('try-on-images', 'try-on-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public access to try-on-images
CREATE POLICY "Public Access Try-On"
ON storage.objects FOR SELECT
USING ( bucket_id = 'try-on-images' );

-- Policy: Allow authenticated users to upload to try-on-images
CREATE POLICY "Authenticated users can upload try-on"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'try-on-images'
  AND auth.role() = 'authenticated'
);

-- Policy: Allow users to delete their own files
CREATE POLICY "Users can delete own try-on files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'try-on-images'
  AND auth.uid() = owner
);
