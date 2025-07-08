-- Enable storage for group avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('group-avatars', 'group-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload group avatars
CREATE POLICY "Users can upload group avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'group-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow public access to group avatars
CREATE POLICY "Group avatars are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'group-avatars');

-- Policy to allow users to update their own group avatars
CREATE POLICY "Users can update their own group avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'group-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'group-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to delete their own group avatars
CREATE POLICY "Users can delete their own group avatars"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'group-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 