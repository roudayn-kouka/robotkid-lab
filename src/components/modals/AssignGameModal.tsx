
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BookOpen, Users, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AssignGameModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  const games = [
    { id: '1', name: 'Circuit Logique 1', difficulty: 'Facile' },
    { id: '2', name: 'Parcours Robot', difficulty: 'Moyen' },
    { id: '3', name: 'Défi Créatif', difficulty: 'Difficile' },
  ];

  const classes = [
    { id: '1', name: 'CE1 A' },
    { id: '2', name: 'CE2 B' },
  ];

  const handleAssign = async () => {
    if (!selectedGame || !selectedClass) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un jeu et une classe",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Succès",
        description: "Jeu assigné avec succès à la classe",
      });
      setIsOpen(false);
      setSelectedGame('');
      setSelectedClass('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'assignation du jeu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet hover:bg-violet/90 h-12">
          <BookOpen className="h-4 w-4 mr-2" />
          Assigner un Jeu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Assigner un jeu</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sélectionner un jeu</Label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un jeu" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game.id} value={game.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{game.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({game.difficulty})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Sélectionner une classe</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classe) => (
                  <SelectItem key={classe.id} value={classe.id}>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{classe.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAssign} disabled={loading}>
              {loading ? 'Assignation...' : 'Assigner'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignGameModal;
