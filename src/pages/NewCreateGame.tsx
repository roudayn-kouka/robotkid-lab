import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewGridDesigner } from '@/components/NewGridDesigner';
import { NewInformativeCellsEditor } from '@/components/NewInformativeCellsEditor';
import { Cell, InformativeCell, GridDimensions, CellType } from '@/types/game';
import { useSavedGames } from '@/hooks/useSavedGames';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function NewCreateGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveGame } = useSavedGames();
  
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    maxMoves: 10,
    health: 3,
    totalInfoCells: 0
  });
  
  const [dimensions, setDimensions] = useState<GridDimensions>({
    rows: 5,
    columns: 5
  });
  
  const [cells, setCells] = useState<Cell[]>([]);
  const [informativeCells, setInformativeCells] = useState<InformativeCell[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Mettre à jour les cellules informatives basées sur les cellules audio_interaction
  useEffect(() => {
    const audioCells = cells.filter(cell => cell.cellType === 'audio_interaction');
    const newInformativeCells: InformativeCell[] = audioCells.map((cell, index) => {
      const existingCell = informativeCells.find(ic => ic.id === `${cell.x}-${cell.y}`);
      return existingCell || {
        id: `${cell.x}-${cell.y}`,
        content: '',
        imageUrl: '',
        audioUrl: ''
      };
    });
    
    setInformativeCells(newInformativeCells);
    setGameData(prev => ({ ...prev, totalInfoCells: newInformativeCells.length }));
  }, [cells]);

  const handleCellUpdate = (x: number, y: number, updates: Partial<Cell>) => {
    setCells(prevCells => {
      const existingCellIndex = prevCells.findIndex(cell => cell.x === x && cell.y === y);
      const updatedCell: Cell = {
        x,
        y,
        color: '#ffffff',
        cellType: 'interaction' as CellType,
        content: '',
        imageUrl: '',
        audioUrl: '',
        pathOrder: 0,
        connections: [],
        ...(existingCellIndex >= 0 ? prevCells[existingCellIndex] : {}),
        ...updates
      };

      if (existingCellIndex >= 0) {
        const newCells = [...prevCells];
        newCells[existingCellIndex] = updatedCell;
        return newCells;
      } else {
        return [...prevCells, updatedCell];
      }
    });
  };

  const handleInformativeCellUpdate = (id: string, updates: Partial<InformativeCell>) => {
    setInformativeCells(prevCells =>
      prevCells.map(cell =>
        cell.id === id ? { ...cell, ...updates } : cell
      )
    );
  };

  const validateGame = (): { valid: boolean, message: string } => {
    if (!gameData.name.trim()) {
      return { valid: false, message: 'Le nom du jeu est requis' };
    }

    const startCells = cells.filter(cell => cell.cellType === 'start');
    const endCells = cells.filter(cell => cell.cellType === 'end');

    if (startCells.length !== 1) {
      return { valid: false, message: 'Le jeu doit avoir exactement une cellule de départ' };
    }

    if (endCells.length !== 1) {
      return { valid: false, message: 'Le jeu doit avoir exactement une cellule de fin' };
    }

    const interactionCells = cells.filter(cell => 
      ['interaction', 'audio_interaction'].includes(cell.cellType)
    );

    if (interactionCells.length === 0) {
      return { valid: false, message: 'Le jeu doit avoir au moins une cellule d\'interaction' };
    }

    // Valider que les cellules interaction/obstacle ont des images
    const cellsNeedingImages = cells.filter(cell => 
      ['interaction', 'obstacle'].includes(cell.cellType) && !cell.imageUrl
    );
    
    if (cellsNeedingImages.length > 0) {
      return { valid: false, message: 'Toutes les cellules d\'interaction et obstacles doivent avoir une image' };
    }

    // Valider que les cellules audio_interaction ont de l'audio
    const audioCellsWithoutAudio = informativeCells.filter(cell => !cell.audioUrl);
    if (audioCellsWithoutAudio.length > 0) {
      return { valid: false, message: 'Toutes les cellules audio doivent avoir un fichier audio' };
    }

    return { valid: true, message: '' };
  };

  const handleSave = async () => {
    const validation = validateGame();
    if (!validation.valid) {
      toast({
        title: "Erreur de validation",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const gameDataToSave = {
        name: gameData.name,
        description: gameData.description,
        max_moves: gameData.maxMoves,
        grid_rows: dimensions.rows,
        grid_cols: dimensions.columns,
        grid_cells: cells.map(cell => ({
          x: cell.x,
          y: cell.y,
          cellType: cell.cellType,
          content: cell.content || '',
          imageUrl: cell.imageUrl || '',
          audioUrl: cell.audioUrl || '',
          pathOrder: cell.pathOrder
        })),
        info_cells: informativeCells
      };

      const result = await saveGame(gameDataToSave);
      
      if (result.success) {
        toast({
          title: "Jeu sauvegardé",
          description: "Le jeu a été créé avec succès!"
        });
        navigate('/');
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le jeu",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const pathCells = cells.filter(cell => 
    ['start', 'end', 'interaction'].includes(cell.cellType)
  ).length;
  const audioCells = cells.filter(cell => cell.cellType === 'audio_interaction').length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Créer un nouveau jeu</h1>
        <Button onClick={() => navigate('/')} variant="outline">
          Retour
        </Button>
      </div>

      {/* Configuration du jeu */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration du jeu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gameName">Nom du jeu *</Label>
              <Input
                id="gameName"
                value={gameData.name}
                onChange={(e) => setGameData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mon super jeu"
              />
            </div>
            <div>
              <Label htmlFor="maxMoves">Mouvements maximum</Label>
              <Input
                id="maxMoves"
                type="number"
                min="1"
                max="50"
                value={gameData.maxMoves}
                onChange={(e) => setGameData(prev => ({ ...prev, maxMoves: parseInt(e.target.value) || 10 }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="health">Vies (Health)</Label>
              <Input
                id="health"
                type="number"
                min="1"
                max="10"
                value={gameData.health}
                onChange={(e) => setGameData(prev => ({ ...prev, health: parseInt(e.target.value) || 3 }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={gameData.description}
              onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du jeu..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{pathCells}</div>
              <div className="text-sm text-muted-foreground">Cellules parcours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{audioCells}</div>
              <div className="text-sm text-muted-foreground">Cellules audio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {cells.some(cell => cell.cellType === 'start') ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Départ placé</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {cells.some(cell => cell.cellType === 'end') ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Fin placée</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Designer de grille */}
      <NewGridDesigner
        dimensions={dimensions}
        cells={cells}
        onCellUpdate={handleCellUpdate}
        onDimensionsChange={setDimensions}
      />

      {/* Éditeur de cellules audio */}
      {informativeCells.length > 0 && (
        <NewInformativeCellsEditor
          informativeCells={informativeCells}
          onUpdate={handleInformativeCellUpdate}
        />
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          Annuler
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="min-w-32"
        >
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
}