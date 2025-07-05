
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Class {
  id: string;
  name: string;
  class_code: string;
  establishment_id: string;
  teacher_id: string | null;
  created_at: string;
  students_count?: number;
}

export const useClasses = (establishmentId?: string) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async (estId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('classes')
        .select(`
          *,
          students(count)
        `)
        .order('name');

      if (estId || establishmentId) {
        query = query.eq('establishment_id', estId || establishmentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const classesWithCount = data?.map(cls => ({
        ...cls,
        students_count: cls.students?.[0]?.count || 0
      })) || [];
      
      setClasses(classesWithCount);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des classes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (classData: { name: string; establishment_id: string; teacher_id?: string }) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([classData])
        .select()
        .single();

      if (error) throw error;

      setClasses(prev => [...prev, { ...data, students_count: 0 }]);
      toast({
        title: "Succès",
        description: "Classe créée avec succès",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la classe",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateClass = async (id: string, updates: Partial<Class>) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClasses(prev => 
        prev.map(cls => cls.id === id ? { ...cls, ...data } : cls)
      );

      toast({
        title: "Succès",
        description: "Classe modifiée avec succès",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating class:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de la classe",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClasses(prev => prev.filter(cls => cls.id !== id));
      toast({
        title: "Succès",
        description: "Classe supprimée avec succès",
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la classe",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    if (establishmentId) {
      fetchClasses();
    }
  }, [establishmentId]);

  return {
    classes,
    loading,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass
  };
};
