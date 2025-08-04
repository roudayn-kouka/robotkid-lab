
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string = 'game-assets') => {
    setUploading(true);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour uploader des images",
          variant: "destructive",
        });
        return { url: null, error: new Error('User not authenticated') };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez uploader une image (JPG, PNG, GIF, ou WebP)",
          variant: "destructive",
        });
        return { url: null, error: new Error('Invalid file type') };
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 5MB",
          variant: "destructive",
        });
        return { url: null, error: new Error('File too large') };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        toast({
          title: "Erreur lors de l'upload",
          description: uploadError.message || "Une erreur est survenue lors de l'upload",
          variant: "destructive",
        });
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast({
        title: "Image uploadée avec succès",
        description: "L'image a été ajoutée à la cellule",
      });

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur lors de l'upload",
        description: errorMessage,
        variant: "destructive",
      });
      return { url: null, error };
    } finally {
      setUploading(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setUploading(true);
    try {
      const fileName = `audio_${Date.now()}.wav`;
      const filePath = `audio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('game-assets')
        .upload(filePath, audioBlob);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('game-assets')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading audio:', error);
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
