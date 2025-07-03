
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string = 'game-assets') => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
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
