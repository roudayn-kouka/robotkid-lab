
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Trophy, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  full_name: string;
  student_code: string;
  progress?: number;
  lastActivity?: string;
  status?: 'active' | 'inactive';
}

interface StudentListModalProps {
  className: string;
  classId?: string;
}

const StudentListModal: React.FC<StudentListModalProps> = ({ className, classId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);

  useEffect(() => {
    if (isOpen && classId) {
      fetchStudents();
    }
  }, [isOpen, classId]);

  const fetchStudents = async () => {
    if (!classId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .order('full_name');

      if (error) throw error;

      // Add mock progress data for now
      const studentsWithMockData = data?.map(student => ({
        ...student,
        progress: Math.floor(Math.random() * 40) + 60, // Random progress between 60-100
        lastActivity: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: Math.random() > 0.2 ? 'active' as const : 'inactive' as const
      })) || [];

      setStudents(studentsWithMockData);
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

  const addStudent = async () => {
    if (!newStudentName.trim() || !classId) {
      toast({
        title: "Erreur",
        description: "Le nom de l'élève est requis",
        variant: "destructive",
      });
      return;
    }

    setAddingStudent(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          full_name: newStudentName,
          class_id: classId
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Élève ajouté avec succès",
      });
      
      setNewStudentName('');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'élève",
        variant: "destructive",
      });
    } finally {
      setAddingStudent(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Voir Élèves
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Élèves de {className}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Add Student Section */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="student-name" className="sr-only">Nom de l'élève</Label>
              <Input
                id="student-name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Nom complet de l'élève"
              />
            </div>
            <Button 
              onClick={addStudent} 
              disabled={addingStudent}
              size="sm" 
              className="bg-violet hover:bg-violet/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {addingStudent ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{students.length} élèves</p>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-lg">Chargement des élèves...</div>
              </div>
            ) : students.length > 0 ? (
              students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{student.full_name}</h4>
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Code: {student.student_code}</p>
                    {student.lastActivity && (
                      <p className="text-sm text-gray-600">Dernière activité: {student.lastActivity}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {student.progress && (
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{student.progress}%</span>
                        </div>
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun élève dans cette classe
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentListModal;
