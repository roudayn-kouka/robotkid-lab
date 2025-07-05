
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CreateClassModalProps {
  onClassCreated?: (className: string) => void;
}

interface Establishment {
  id: string;
  name: string;
  city: string;
  region: string;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ onClassCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [establishmentId, setEstablishmentId] = useState('');
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchEstablishments();
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la classe est requis",
        variant: "destructive",
      });
      return;
    }

    if (!establishmentId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un établissement",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          name: className,
          establishment_id: establishmentId,
          teacher_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Classe créée avec succès",
      });
      
      onClassCreated?.(className);
      setClassName('');
      setEstablishmentId('');
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-violet hover:bg-violet/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Classe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle classe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="establishment">Établissement</Label>
            <Select value={establishmentId} onValueChange={setEstablishmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un établissement" />
              </SelectTrigger>
              <SelectContent>
                {establishments.map((establishment) => (
                  <SelectItem key={establishment.id} value={establishment.id}>
                    {establishment.name} - {establishment.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="className">Nom de la classe</Label>
            <Input
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Ex: CE1 A"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassModal;
