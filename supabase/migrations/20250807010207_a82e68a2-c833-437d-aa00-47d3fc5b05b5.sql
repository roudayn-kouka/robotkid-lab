-- Update bucket to allow more image types and audio files
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm'
] 
WHERE name = 'game-assets';

-- Increase file size limit to 10MB for better audio support
UPDATE storage.buckets 
SET file_size_limit = 10485760 
WHERE name = 'game-assets';