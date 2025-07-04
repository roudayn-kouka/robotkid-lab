
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Trophy } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  progress: number;
  lastActivity: string;
  status: 'active' | 'inactive';
}

interface StudentListModalProps {
  className: string;
}

const StudentListModal: React.FC<StudentListModalProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock data
  const students: Student[] = [
    { id: '1', name: 'Emma Martin', progress: 85, lastActivity: '2024-01-15', status: 'active' },
    { id: '2', name: 'Lucas Dubois', progress: 92, lastActivity: '2024-01-15', status: 'active' },
    { id: '3', name: 'Léa Petit', progress: 78, lastActivity: '2024-01-14', status: 'active' },
    { id: '4', name: 'Hugo Bernard', progress: 65, lastActivity: '2024-01-13', status: 'inactive' },
  ];

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
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{students.length} élèves</p>
            <Button size="sm" className="bg-violet hover:bg-violet/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un élève
            </Button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium">{student.name}</h4>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Dernière activité: {student.lastActivity}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{student.progress}%</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentListModal;
