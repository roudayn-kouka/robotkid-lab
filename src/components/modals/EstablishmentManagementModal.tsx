
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Building2, Users, GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Establishment {
  id: string;
  name: string;
  city: string;
  region: string;
  user_count: number;
}

interface Class {
  id: string;
  name: string;
  class_code: string;
  establishment_id: string;
  teacher_id: string | null;
  students_count: number;
}

interface Student {
  id: string;
  full_name: string;
  student_code: string;
  class_id: string;
}

const EstablishmentManagementModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newEstablishment, setNewEstablishment] = useState({ name: '', city: '', region: '' });
  const [newClass, setNewClass] = useState({ name: '' });
  const [newStudent, setNewStudent] = useState({ full_name: '' });

  useEffect(() => {
    if (isOpen) {
      fetchEstablishments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedEstablishment) {
      fetchClasses(selectedEstablishment);
    }
  }, [selectedEstablishment]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchEstablishments = async () => {
    try {
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
    }
  };

  const fetchClasses = async (establishmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students(count)
        `)
        .eq('establishment_id', establishmentId)
        .order('name');

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
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des élèves",
        variant: "destructive",
      });
    }
  };

  const createEstablishment = async () => {
    if (!newEstablishment.name || !newEstablishment.city || !newEstablishment.region) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('establishments')
        .insert([{
          name: newEstablishment.name,
          city: newEstablishment.city,
          region: newEstablishment.region
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Établissement créé avec succès",
      });
      
      setNewEstablishment({ name: '', city: '', region: '' });
      fetchEstablishments();
    } catch (error) {
      console.error('Error creating establishment:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'établissement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createClass = async () => {
    if (!newClass.name || !selectedEstablishment) {
      toast({
        title: "Erreur",
        description: "Le nom de la classe est requis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('classes')
        .insert([{
          name: newClass.name,
          establishment_id: selectedEstablishment
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Classe créée avec succès",
      });
      
      setNewClass({ name: '' });
      fetchClasses(selectedEstablishment);
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la classe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async () => {
    if (!newStudent.full_name || !selectedClass) {
      toast({
        title: "Erreur",
        description: "Le nom de l'élève est requis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .insert([{
          full_name: newStudent.full_name,
          class_id: selectedClass
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Élève ajouté avec succès",
      });
      
      setNewStudent({ full_name: '' });
      fetchStudents(selectedClass);
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'élève",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEstablishment = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) return;

    try {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Établissement supprimé avec succès",
      });
      
      fetchEstablishments();
      if (selectedEstablishment === id) {
        setSelectedEstablishment(null);
        setClasses([]);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error deleting establishment:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const deleteClass = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Classe supprimée avec succès",
      });
      
      if (selectedEstablishment) {
        fetchClasses(selectedEstablishment);
      }
      if (selectedClass === id) {
        setSelectedClass(null);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Élève supprimé avec succès",
      });
      
      if (selectedClass) {
        fetchStudents(selectedClass);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-rouge hover:bg-rouge/90 text-white border-rouge">
          <Settings className="h-4 w-4 mr-2" />
          Gestion Utilisateurs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Gestion des Utilisateurs et Contenus</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="establishments" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="establishments">Établissements</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="students">Élèves</TabsTrigger>
          </TabsList>
          
          <TabsContent value="establishments" className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Nouvel Établissement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="establishment-name">Nom</Label>
                    <Input
                      id="establishment-name"
                      value={newEstablishment.name}
                      onChange={(e) => setNewEstablishment({...newEstablishment, name: e.target.value})}
                      placeholder="Nom de l'établissement"
                    />
                  </div>
                  <div>
                    <Label htmlFor="establishment-city">Ville</Label>
                    <Input
                      id="establishment-city"
                      value={newEstablishment.city}
                      onChange={(e) => setNewEstablishment({...newEstablishment, city: e.target.value})}
                      placeholder="Ville"
                    />
                  </div>
                  <div>
                    <Label htmlFor="establishment-region">Région</Label>
                    <Input
                      id="establishment-region"
                      value={newEstablishment.region}
                      onChange={(e) => setNewEstablishment({...newEstablishment, region: e.target.value})}
                      placeholder="Région"
                    />
                  </div>
                </div>
                <Button onClick={createEstablishment} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer Établissement
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {establishments.map((establishment) => (
                <Card key={establishment.id} className={`cursor-pointer transition-colors ${
                  selectedEstablishment === establishment.id ? 'ring-2 ring-violet' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1"
                        onClick={() => setSelectedEstablishment(establishment.id)}
                      >
                        <h4 className="font-semibold">{establishment.name}</h4>
                        <p className="text-sm text-gray-600">{establishment.city}, {establishment.region}</p>
                        <Badge variant="secondary">{establishment.user_count || 0} utilisateurs</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteEstablishment(establishment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
            {selectedEstablishment ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Nouvelle Classe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="class-name">Nom de la classe</Label>
                      <Input
                        id="class-name"
                        value={newClass.name}
                        onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                        placeholder="Ex: CE1 A"
                      />
                    </div>
                    <Button onClick={createClass} disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer Classe
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {classes.map((classe) => (
                    <Card key={classe.id} className={`cursor-pointer transition-colors ${
                      selectedClass === classe.id ? 'ring-2 ring-violet' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex-1"
                            onClick={() => setSelectedClass(classe.id)}
                          >
                            <h4 className="font-semibold">{classe.name}</h4>
                            <p className="text-sm text-gray-600">Code: {classe.class_code}</p>
                            <Badge variant="secondary">{classe.students_count} élèves</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteClass(classe.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                Sélectionnez d'abord un établissement
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
            {selectedClass ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Nouvel Élève</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="student-name">Nom complet</Label>
                      <Input
                        id="student-name"
                        value={newStudent.full_name}
                        onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})}
                        placeholder="Nom et prénom de l'élève"
                      />
                    </div>
                    <Button onClick={createStudent} disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter Élève
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {students.map((student) => (
                    <Card key={student.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{student.full_name}</h4>
                            <p className="text-sm text-gray-600">Code: {student.student_code}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteStudent(student.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                Sélectionnez d'abord une classe
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EstablishmentManagementModal;
