
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Eye } from 'lucide-react';
import GridDesigner from '@/components/GridDesigner';
import { Cell, Game, GridDimensions } from '@/types/game';
import { toast } from '@/hooks/use-toast';

const CreateGame = () => {
  const [gameData, setGameData] = useState({
    name: '',
    maxMoves: 20,
    totalCircuitCells: 9,
    totalInfoCells: 3,
  });

  const [dimensions, setDimensions] = useState<GridDimensions>({
    rows: 3,
    columns: 3,
  });

  const [cells, setCells] = useState<Cell[]>([]);

  const handleCellUpdate = (x: number, y: number, updates: Partial<Cell>) => {
    setCells(prevCells => {
      const existingIndex = prevCells.findIndex(cell => cell.x === x && cell.y === y);
      const baseCell: Cell = {
        x,
        y,
        color: '#f8f9fa',
        isInformative: false,
        content: '',
        imageUrl: ''
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

  const handleSave = () => {
    if (!gameData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a game name",
        variant: "destructive",
      });
      return;
    }

    const game: Omit<Game, 'id' | 'createdAt'> = {
      ...gameData,
      gridConfig: cells,
    };

    console.log('Saving game:', game);
    toast({
      title: "Game Saved",
      description: `"${gameData.name}" has been saved successfully!`,
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Game preview functionality coming soon!",
    });
  };

  const informativeCellCount = cells.filter(cell => cell.isInformative).length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Game</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Game
          </Button>
        </div>
      </div>

      {/* Game Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Game Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="gameName">Game Name</Label>
              <Input
                id="gameName"
                placeholder="Enter game name"
                value={gameData.name}
                onChange={(e) => setGameData({ ...gameData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="maxMoves">Max Moves</Label>
              <Input
                id="maxMoves"
                type="number"
                min="1"
                value={gameData.maxMoves}
                onChange={(e) => setGameData({ ...gameData, maxMoves: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label>Total Circuit Cells</Label>
              <div className="text-lg font-semibold text-primary">
                {dimensions.rows * dimensions.columns}
              </div>
            </div>
            <div>
              <Label>Informative Cells</Label>
              <div className="text-lg font-semibold text-primary">
                {informativeCellCount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Circuit Designer */}
      <Card>
        <CardHeader>
          <CardTitle>Circuit Designer</CardTitle>
        </CardHeader>
        <CardContent>
          <GridDesigner
            dimensions={dimensions}
            cells={cells}
            onCellUpdate={handleCellUpdate}
            onDimensionsChange={setDimensions}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGame;
