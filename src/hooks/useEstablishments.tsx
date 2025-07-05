
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Establishment {
  id: string;
  name: string;
  city: string;
  region: string;
  user_count: number;
  created_at: string;
}

export const useEstablishments = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEstablishments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('name');

      if (error) throw error;
      setEstablishments(data || []);
    } catch (error) {
      console.error('Error fetching establishments:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des établissements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEstablishment = async (establishment: Omit<Establishment, 'id' | 'user_count' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .insert([establishment])
        .select()
        .single();

      if (error) throw error;

      setEstablishments(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "Établissement créé avec succès",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating establishment:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'établissement",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEstablishment = async (id: string, updates: Partial<Establishment>) => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEstablishments(prev => 
        prev.map(est => est.id === id ? { ...est, ...data } : est)
      );

      toast({
        title: "Succès",
        description: "Établissement modifié avec succès",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating establishment:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de l'établissement",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEstablishment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEstablishments(prev => prev.filter(est => est.id !== id));
      toast({
        title: "Succès",
        description: "Établissement supprimé avec succès",
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting establishment:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'établissement",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchEstablishments();
  }, []);

  return {
    establishments,
    loading,
    fetchEstablishments,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment
  };
};
