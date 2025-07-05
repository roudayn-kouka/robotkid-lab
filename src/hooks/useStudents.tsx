
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Student {
  id: string;
  full_name: string;
  student_code: string;
  class_id: string;
  created_at: string;
}

export const useStudents = (classId?: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async (clsId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('students')
        .select('*')
        .order('full_name');

      if (clsId || classId) {
        query = query.eq('class_id', clsId || classId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des élèves",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: { full_name: string; class_id: string }) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "Élève ajouté avec succès",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'élève",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => 
        prev.map(student => student.id === id ? { ...student, ...data } : student)
      );

      toast({
        title: "Succès",
        description: "Élève modifié avec succès",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de l'élève",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: "Succès",
        description: "Élève supprimé avec succès",
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'élève",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    if (classId) {
      fetchStudents();
    }
  }, [classId]);

  return {
    students,
    loading,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent
  };
};
