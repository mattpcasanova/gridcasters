-- Enable storage for profile avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-avatars', 'profile-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload their own profile avatars
CREATE POLICY "Users can upload their own profile avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow public access to profile avatars
CREATE POLICY "Profile avatars are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-avatars');

-- Policy to allow users to update their own profile avatars
CREATE POLICY "Users can update their own profile avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to delete their own profile avatars
CREATE POLICY "Users can delete their own profile avatars"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 