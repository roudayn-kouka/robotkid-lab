-- Configure storage bucket and policies for game assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('game-assets', 'game-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public viewing of game assets
CREATE POLICY "Anyone can view game assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'game-assets');

-- Create policy for authenticated users to upload game assets
CREATE POLICY "Authenticated users can upload game assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'game-assets' AND auth.role() = 'authenticated');

-- Create policy for authenticated users to update their uploads
CREATE POLICY "Authenticated users can update game assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'game-assets' AND auth.role() = 'authenticated');

-- Create policy for authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete game assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'game-assets' AND auth.role() = 'authenticated');