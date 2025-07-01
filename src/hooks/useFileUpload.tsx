
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string, path?: string) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        path: filePath,
        error: null
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
      return {
        url: null,
        path: null,
        error
      };
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file: File, path?: string) => {
    return uploadFile(file, 'game-assets', path ? `images/${path}` : 'images');
  };

  const uploadAudio = async (file: File, path?: string) => {
    return uploadFile(file, 'game-assets', path ? `audio/${path}` : 'audio');
  };

  const deleteFile = async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer le fichier",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    uploadFile,
    uploadImage,
    uploadAudio,
    deleteFile,
    uploading
  };
};
