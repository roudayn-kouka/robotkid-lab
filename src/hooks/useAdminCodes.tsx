
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCodes = () => {
  const [loading, setLoading] = useState(false);

  const validateAdminCode = async (code: string) => {
    setLoading(true);
    console.log('Validating admin code:', code);
    
    try {
      const { data, error } = await supabase
        .from('admin_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      console.log('Admin code validation result:', { data, error });

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

  const listAdminCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_codes')
        .select('*');

      console.log('Available admin codes:', data);
      return data;
    } catch (error) {
      console.error('Error listing admin codes:', error);
      return [];
    }
  };

  return {
    validateAdminCode,
    listAdminCodes,
    loading
  };
};
