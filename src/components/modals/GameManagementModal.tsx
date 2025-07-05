
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Game {
  id: string;
  name: string;
  description: string | null;
  max_moves: number;
  rows: number;
  columns: number;
  is_published: boolean;
  created_at: string;
}

interface GameManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: string;
  mode: 'edit' | 'delete' | 'view';
}

const GameManagementModal: React.FC<GameManagementModalProps> = ({
  isOpen,
  onClose,
  gameId,
  mode
}) => {
  const [game, setGame] = useState<Game | null>(null);
  const [editedGame, setEditedGame] = useState<Partial<Game>>({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && gameId) {
      fetchGame();
    }
  }, [isOpen, gameId]);

  useEffect(() => {
    if (mode === 'edit') {
      setIsEditing(true);
    }
  }, [mode]);

  const fetchGame = async () => {
    if (!gameId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      
      setGame(data);
      setEditedGame(data);
    } catch (error) {
      console.error('Error fetching game:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du jeu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGame = async () => {
    if (!gameId || !editedGame) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('saved_games')
        .update({
          name: editedGame.name,
          description: editedGame.description,
          max_moves: editedGame.max_moves,
          is_published: editedGame.is_published
        })
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Jeu modifié avec succès",
      });
      
      setGame({ ...game, ...editedGame } as Game);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du jeu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async () => {
    if (!gameId) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu ? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);
    try {
      // Delete related cells first
      await supabase
        .from('saved_game_cells')
        .delete()
        .eq('game_id', gameId);

      await supabase
        .from('saved_informative_cells')
        .delete()
        .eq('game_id', gameId);

      // Then delete the game
      const { error } = await supabase
        .from('saved_games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Jeu supprimé avec succès",
      });
      
      onClose();
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du jeu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'edit': return 'Modifier le Jeu';
      case 'delete': return 'Supprimer le Jeu';
      case 'view': return 'Détails du Jeu';
      default: return 'Gestion du Jeu';
    }
  };

  if (loading && !game) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center py-8">
            <div className="text-lg">Chargement...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>

        {game && (
          <div className="space-y-6">
            {mode === 'delete' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Êtes-vous sûr de vouloir supprimer ce jeu ?</p>
                  <p className="text-gray-600">Cette action est irréversible.</p>
                </div>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{game.name}</h3>
                    {game.description && (
                      <p className="text-gray-600 mt-2">{game.description}</p>
                    )}
                    <div className="flex space-x-4 mt-4">
                      <Badge variant={game.is_published ? 'default' : 'secondary'}>
                        {game.is_published ? 'Publié' : 'Brouillon'}
                      </Badge>
                      <Badge variant="outline">
                        {game.max_moves} mouvements max
                      </Badge>
                      <Badge variant="outline">
                        Grille {game.rows}x{game.columns}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={deleteGame}
                    disabled={loading}
                  >
                    {loading ? 'Suppression...' : 'Supprimer définitivement'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="game-name">Nom du jeu</Label>
                    <Input
                      id="game-name"
                      value={isEditing ? (editedGame.name || '') : game.name}
                      onChange={(e) => setEditedGame({...editedGame, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-moves">Mouvements maximum</Label>
                    <Input
                      id="max-moves"
                      type="number"
                      value={isEditing ? (editedGame.max_moves || '') : game.max_moves}
                      onChange={(e) => setEditedGame({...editedGame, max_moves: parseInt(e.target.value)})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="game-description">Description</Label>
                  <Textarea
                    id="game-description"
                    value={isEditing ? (editedGame.description || '') : (game.description || '')}
                    onChange={(e) => setEditedGame({...editedGame, description: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="is-published">Publié</Label>
                  <input
                    id="is-published"
                    type="checkbox"
                    checked={isEditing ? (editedGame.is_published || false) : game.is_published}
                    onChange={(e) => setEditedGame({...editedGame, is_published: e.target.checked})}
                    disabled={!isEditing}
                    className="h-4 w-4"
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Informations de la grille</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Lignes</Label>
                        <div className="font-semibold">{game.rows}</div>
                      </div>
                      <div>
                        <Label>Colonnes</Label>
                        <div className="font-semibold">{game.columns}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    {isEditing ? 'Annuler' : 'Fermer'}
                  </Button>
                  
                  {mode === 'view' && (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                  
                  {isEditing && (
                    <Button onClick={saveGame} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameManagementModal;
