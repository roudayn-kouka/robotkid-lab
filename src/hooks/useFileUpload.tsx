
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string = 'game-assets') => {
    setUploading(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour uploader des images");
        return { url: null, error: new Error('User not authenticated') };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Veuillez uploader une image (JPG, PNG, GIF, ou WebP)");
        return { url: null, error: new Error('Invalid file type') };
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La taille maximale autorisée est de 10MB");
        return { url: null, error: new Error('File too large') };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        toast.error(uploadError.message || "Une erreur est survenue lors de l'upload");
        throw uploadError;
      }

      // Get public URL with cache busting
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const urlWithCacheBust = `${data.publicUrl}?t=${Date.now()}`;
      
      toast.success("Image uploadée avec succès");

      return { url: urlWithCacheBust, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de l'upload: ${errorMessage}`);
      return { url: null, error };
    } finally {
      setUploading(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setUploading(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour uploader de l'audio");
        return { url: null, error: new Error('User not authenticated') };
      }

      // Create audio file with webm format (better supported)
      const fileName = `audio_${Date.now()}.webm`;
      const filePath = `audio/${fileName}`;

      // Convert blob to webm if needed
      const audioFile = new File([audioBlob], fileName, { type: 'audio/webm' });

      const { error: uploadError } = await supabase.storage
        .from('game-assets')
        .upload(filePath, audioFile);

      if (uploadError) {
        console.error('Audio upload error:', uploadError);
        toast.error(uploadError.message || "Erreur lors de l'upload audio");
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('game-assets')
        .getPublicUrl(filePath);

      toast.success("Audio uploadé avec succès");

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de l'upload audio: ${errorMessage}`);
      return { url: null, error };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploadAudio,
    uploading
  };
};
