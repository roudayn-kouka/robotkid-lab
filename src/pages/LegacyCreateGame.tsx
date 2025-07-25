
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GridDesigner from '@/components/GridDesigner';
import InformativeCellsEditor from '@/components/InformativeCellsEditor';
import { Cell, GridDimensions, InformativeCell } from '@/types/game';
import { toast } from '@/hooks/use-toast';
import { useSavedGames } from '@/hooks/useSavedGames';
import { useAuth } from '@/hooks/useAuth';

const CreateGame = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveGame } = useSavedGames();
  
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    maxMoves: 20,
    totalCircuitCells: 9,
    totalInfoCells: 3,
  });

  const [dimensions, setDimensions] = useState<GridDimensions>({
    rows: 5,
    columns: 5,
  });

  const [cells, setCells] = useState<Cell[]>([]);
  const [informativeCells, setInformativeCells] = useState<InformativeCell[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize informative cells when count changes
  React.useEffect(() => {
    const currentCount = informativeCells.length;
    const targetCount = gameData.totalInfoCells;
    
    if (targetCount > currentCount) {
      const newCells = Array.from({ length: targetCount - currentCount }, (_, i) => ({
        id: `info-${currentCount + i + 1}`,
        content: '',
        imageUrl: '',
        audioUrl: ''
      }));
      setInformativeCells(prev => [...prev, ...newCells]);
    } else if (targetCount < currentCount) {
      setInformativeCells(prev => prev.slice(0, targetCount));
    }
  }, [gameData.totalInfoCells, informativeCells.length]);

  const handleCellUpdate = (x: number, y: number, updates: Partial<Cell>) => {
    setCells(prevCells => {
      const existingIndex = prevCells.findIndex(cell => cell.x === x && cell.y === y);
      const baseCell: Cell = {
        x,
        y,
        color: '#f8f9fa',
        isInformative: false,
        content: '',
        imageUrl: '',
        isPath: false,
        pathOrder: -1,
        connections: []
      };

      if (existingIndex >= 0) {
        const updatedCells = [...prevCells];
        updatedCells[existingIndex] = { ...updatedCells[existingIndex], ...updates };
        return updatedCells;
      } else {
        return [...prevCells, { ...baseCell, ...updates }];
      }
    });
  };

  const handleInformativeCellUpdate = (id: string, updates: Partial<InformativeCell>) => {
    setInformativeCells(prev => 
      prev.map(cell => cell.id === id ? { ...cell, ...updates } : cell)
    );
  };

  const validateCircuit = () => {
    const pathCells = cells.filter(cell => cell.isPath);
    const regularPathCells = pathCells.filter(cell => !cell.isInformative && cell.pathOrder >= 0);
    const informativePathCells = pathCells.filter(cell => cell.isInformative);
    const startCell = pathCells.find(cell => cell.pathOrder === -2);
    const endCell = pathCells.find(cell => cell.pathOrder === -3);

    if (!gameData.name.trim()) {
      return { valid: false, message: "Veuillez entrer un nom pour le jeu" };
    }

    if (!startCell) {
      return { valid: false, message: "Veuillez placer une tuile de départ" };
    }

    if (!endCell) {
      return { valid: false, message: "Veuillez placer une tuile d'arrivée" };
    }

    if (regularPathCells.length !== gameData.totalCircuitCells) {
      return { valid: false, message: `Le circuit doit contenir exactement ${gameData.totalCircuitCells} tuiles de chemin` };
    }

    if (informativePathCells.length !== gameData.totalInfoCells) {
      return { valid: false, message: `Le circuit doit contenir exactement ${gameData.totalInfoCells} tuiles informatives` };
    }

    return { valid: true, message: "" };
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder un jeu",
        variant: "destructive",
      });
      return;
    }

    const validation = validateCircuit();
    if (!validation.valid) {
      toast({
        title: "Erreur de Validation",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Préparer les données des cellules pour la base de données
      const gridCells = cells
        .filter(cell => cell.isPath)
        .map(cell => ({
          x: cell.x,
          y: cell.y,
          cellType: cell.pathOrder === -2 ? 'start' : 
                   cell.pathOrder === -3 ? 'end' : 
                   cell.isInformative ? 'informative' : 'path',
          content: cell.content || '',
          imageUrl: cell.imageUrl || '',
          audioUrl: '',
          pathOrder: cell.pathOrder
        }));

      // Préparer les données des cellules informatives
      const infoCells = informativeCells.map(cell => ({
        id: cell.id,
        content: cell.content || '',
        imageUrl: cell.imageUrl || '',
        audioUrl: cell.audioUrl || ''
      }));

      const result = await saveGame({
        name: gameData.name,
        description: gameData.description,
        max_moves: gameData.maxMoves,
        grid_rows: dimensions.rows,
        grid_cols: dimensions.columns,
        grid_cells: gridCells,
        info_cells: infoCells
      });

      if (result.success) {
        toast({
          title: "Jeu Sauvegardé",
          description: `"${gameData.name}" a été sauvegardé avec succès !`,
        });
        navigate('/admin');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du jeu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    toast({
      title: "Aperçu",
      description: "Fonctionnalité d'aperçu bientôt disponible !",
    });
  };

  const pathCells = cells.filter(cell => cell.isPath);
  const regularPathCount = pathCells.filter(cell => !cell.isInformative && cell.pathOrder >= 0).length;
  const infoPathCount = pathCells.filter(cell => cell.isInformative).length;
  const hasStart = pathCells.some(cell => cell.pathOrder === -2);
  const hasEnd = pathCells.some(cell => cell.pathOrder === -3);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Créer un Nouveau Jeu</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Game Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration du Jeu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="gameName">Nom du Jeu *</Label>
                <Input
                  id="gameName"
                  placeholder="Entrez le nom du jeu"
                  value={gameData.name}
                  onChange={(e) => setGameData({ ...gameData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gameDescription">Description</Label>
                <Textarea
                  id="gameDescription"
                  placeholder="Description du jeu (optionnel)"
                  value={gameData.description}
                  onChange={(e) => setGameData({ ...gameData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxMoves">Mouvements Max</Label>
                  <Input
                    id="maxMoves"
                    type="number"
                    min="1"
                    value={gameData.maxMoves}
                    onChange={(e) => setGameData({ ...gameData, maxMoves: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="circuitCells">Tuiles de Chemin</Label>
                  <Input
                    id="circuitCells"
                    type="number"
                    min="3"
                    max="20"
                    value={gameData.totalCircuitCells}
                    onChange={(e) => setGameData({ ...gameData, totalCircuitCells: parseInt(e.target.value) || 3 })}
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Placées: {regularPathCount}
                  </div>
                </div>
                <div>
                  <Label htmlFor="infoCells">Tuiles Informatives</Label>
                  <Input
                    id="infoCells"
                    type="number"
                    min="1"
                    max="10"
                    value={gameData.totalInfoCells}
                    onChange={(e) => setGameData({ ...gameData, totalInfoCells: parseInt(e.target.value) || 1 })}
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Placées: {infoPathCount}
                  </div>
                </div>
              </div>
              
              <div className="text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${hasStart ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Tuile de départ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${hasEnd ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span>Tuile d'arrivée</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Circuit Designer */}
      <Card>
        <CardHeader>
          <CardTitle>Concepteur de Circuit</CardTitle>
        </CardHeader>
        <CardContent>
          <GridDesigner
            dimensions={dimensions}
            cells={cells}
            onCellUpdate={handleCellUpdate}
            onDimensionsChange={setDimensions}
            targetPathCells={gameData.totalCircuitCells}
            targetInfoCells={gameData.totalInfoCells}
          />
        </CardContent>
      </Card>

      {/* Informative Cells Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Contenu des Cellules Informatives</CardTitle>
        </CardHeader>
        <CardContent>
          <InformativeCellsEditor
            informativeCells={informativeCells}
            onUpdate={handleInformativeCellUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGame;
