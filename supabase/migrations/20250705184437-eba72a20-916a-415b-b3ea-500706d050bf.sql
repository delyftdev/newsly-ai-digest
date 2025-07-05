-- Create storage bucket for changelog images
INSERT INTO storage.buckets (id, name, public) VALUES ('changelog-images', 'changelog-images', true);

-- Create policies for changelog images
CREATE POLICY "Anyone can view changelog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'changelog-images');

CREATE POLICY "Authenticated users can upload changelog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'changelog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their changelog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'changelog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their changelog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'changelog-images' AND auth.uid() IS NOT NULL);