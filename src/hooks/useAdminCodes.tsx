
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCodes = () => {
  const [loading, setLoading] = useState(false);

  const validateAdminCode = async (code: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error validating admin code:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error validating admin code:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    validateAdminCode,
    loading
  };
};
