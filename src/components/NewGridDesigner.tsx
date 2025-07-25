import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cell, CellType, GridDimensions } from '@/types/game';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from "sonner";

interface NewGridDesignerProps {
  dimensions: GridDimensions;
  cells: Cell[];
  onCellUpdate: (x: number, y: number, updates: Partial<Cell>) => void;
  onDimensionsChange: (dimensions: GridDimensions) => void;
}

export const NewGridDesigner: React.FC<NewGridDesignerProps> = ({
  dimensions,
  cells,
  onCellUpdate,
  onDimensionsChange
}) => {
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [draggedTileType, setDraggedTileType] = useState<CellType | null>(null);
  const { uploadFile } = useFileUpload();

  const getCellData = (x: number, y: number): Cell => {
    const existingCell = cells.find(cell => cell.x === x && cell.y === y);
    return existingCell || {
      x,
      y,
      color: '#ffffff',
      cellType: 'interaction',
      content: '',
      imageUrl: '',
      audioUrl: '',
      pathOrder: 0,
      connections: []
    };
  };

  const getCellColor = (cellType: CellType): string => {
    switch (cellType) {
      case 'start': return '#22c55e';
      case 'end': return '#ef4444';
      case 'interaction': return '#3b82f6';
      case 'audio_interaction': return '#f59e0b';
      case 'obstacle': return '#6b7280';
      default: return '#ffffff';
    }
  };

  const handleTileDragStart = (type: CellType) => {
    setDraggedTileType(type);
  };

  const handleCellDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCellDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    if (!draggedTileType) return;

    // Vérifier les contraintes selon le type
    if ((draggedTileType === 'start' || draggedTileType === 'end')) {
      // Supprimer les autres cellules start/end du même type
      cells.forEach(cell => {
        if (cell.cellType === draggedTileType) {
          onCellUpdate(cell.x, cell.y, { cellType: 'interaction' });
        }
      });
    }

    onCellUpdate(x, y, {
      cellType: draggedTileType,
      color: getCellColor(draggedTileType),
      imageUrl: (draggedTileType === 'start' || draggedTileType === 'end') ? '' : undefined,
      audioUrl: (draggedTileType === 'start' || draggedTileType === 'end') ? '' : undefined
    });

    setDraggedTileType(null);
  };

  const handleCellClick = (x: number, y: number) => {
    setSelectedCell({ x, y });
  };

  const handleImageUpload = async (file: File) => {
    if (!selectedCell) return;
    
    try {
      const result = await uploadFile(file, 'game-assets');
      if (result.url) {
        onCellUpdate(selectedCell.x, selectedCell.y, { imageUrl: result.url });
        toast.success('Image uploadée avec succès');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
    }
  };

  const clearGrid = () => {
    cells.forEach(cell => {
      onCellUpdate(cell.x, cell.y, { cellType: 'interaction', color: getCellColor('interaction') });
    });
  };

  const getAvailableTiles = () => {
    const startExists = cells.some(cell => cell.cellType === 'start');
    const endExists = cells.some(cell => cell.cellType === 'end');
    
    return {
      start: !startExists,
      end: !endExists,
      interaction: true,
      audio_interaction: true,
      obstacle: true
    };
  };

  const availableTiles = getAvailableTiles();
  const selectedCellData = selectedCell ? getCellData(selectedCell.x, selectedCell.y) : null;

  return (
    <div className="space-y-6">
      {/* Configuration des dimensions */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration de la grille</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">Lignes</Label>
              <Input
                id="rows"
                type="number"
                min="3"
                max="10"
                value={dimensions.rows}
                onChange={(e) => onDimensionsChange({ ...dimensions, rows: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="columns">Colonnes</Label>
              <Input
                id="columns"
                type="number"
                min="3"
                max="10"
                value={dimensions.columns}
                onChange={(e) => onDimensionsChange({ ...dimensions, columns: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <Button onClick={clearGrid} variant="outline" className="w-full">
            Vider la grille
          </Button>
        </CardContent>
      </Card>

      {/* Types de cellules disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Types de cellules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {availableTiles.start && (
              <div
                draggable
                onDragStart={() => handleTileDragStart('start')}
                className="p-3 border-2 border-dashed border-green-300 bg-green-100 rounded cursor-move text-center"
              >
                <div className="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div>
                <span className="text-xs">Départ</span>
              </div>
            )}
            {availableTiles.end && (
              <div
                draggable
                onDragStart={() => handleTileDragStart('end')}
                className="p-3 border-2 border-dashed border-red-300 bg-red-100 rounded cursor-move text-center"
              >
                <div className="w-6 h-6 bg-red-500 rounded mx-auto mb-1"></div>
                <span className="text-xs">Fin</span>
              </div>
            )}
            <div
              draggable
              onDragStart={() => handleTileDragStart('interaction')}
              className="p-3 border-2 border-dashed border-blue-300 bg-blue-100 rounded cursor-move text-center"
            >
              <div className="w-6 h-6 bg-blue-500 rounded mx-auto mb-1"></div>
              <span className="text-xs">Interaction</span>
            </div>
            <div
              draggable
              onDragStart={() => handleTileDragStart('audio_interaction')}
              className="p-3 border-2 border-dashed border-yellow-300 bg-yellow-100 rounded cursor-move text-center"
            >
              <div className="w-6 h-6 bg-yellow-500 rounded mx-auto mb-1"></div>
              <span className="text-xs">Audio</span>
            </div>
            <div
              draggable
              onDragStart={() => handleTileDragStart('obstacle')}
              className="p-3 border-2 border-dashed border-gray-300 bg-gray-100 rounded cursor-move text-center"
            >
              <div className="w-6 h-6 bg-gray-500 rounded mx-auto mb-1"></div>
              <span className="text-xs">Obstacle</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille de jeu */}
      <Card>
        <CardHeader>
          <CardTitle>Grille de jeu</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="grid gap-1 p-4 bg-secondary rounded-lg"
            style={{ 
              gridTemplateColumns: `repeat(${dimensions.columns}, 1fr)`,
              gridTemplateRows: `repeat(${dimensions.rows}, 1fr)`
            }}
          >
            {Array.from({ length: dimensions.rows }, (_, row) =>
              Array.from({ length: dimensions.columns }, (_, col) => {
                const cellData = getCellData(col, row);
                const isSelected = selectedCell?.x === col && selectedCell?.y === row;
                
                return (
                  <div
                    key={`${col}-${row}`}
                    className={`
                      w-12 h-12 border-2 rounded cursor-pointer transition-all
                      ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}
                      hover:border-primary/50
                    `}
                    style={{ backgroundColor: cellData.color }}
                    onClick={() => handleCellClick(col, row)}
                    onDragOver={handleCellDragOver}
                    onDrop={(e) => handleCellDrop(e, col, row)}
                  >
                    {cellData.imageUrl && (
                      <img 
                        src={cellData.imageUrl} 
                        alt="Cell content" 
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                    {cellData.cellType === 'start' && (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">S</div>
                    )}
                    {cellData.cellType === 'end' && (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">E</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Éditeur de cellule sélectionnée */}
      {selectedCellData && (
        <Card>
          <CardHeader>
            <CardTitle>Éditer la cellule ({selectedCell?.x}, {selectedCell?.y})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Type de cellule</Label>
              <Select
                value={selectedCellData.cellType}
                onValueChange={(value: CellType) => 
                  onCellUpdate(selectedCell!.x, selectedCell!.y, { 
                    cellType: value,
                    color: getCellColor(value)
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Départ</SelectItem>
                  <SelectItem value="end">Fin</SelectItem>
                  <SelectItem value="interaction">Interaction</SelectItem>
                  <SelectItem value="audio_interaction">Audio Interaction</SelectItem>
                  <SelectItem value="obstacle">Obstacle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCellData.cellType !== 'start' && selectedCellData.cellType !== 'end' && (
              <div>
                <Label>Contenu</Label>
                <Input
                  value={selectedCellData.content || ''}
                  onChange={(e) => onCellUpdate(selectedCell!.x, selectedCell!.y, { content: e.target.value })}
                  placeholder="Texte de la cellule"
                />
              </div>
            )}

            {selectedCellData.cellType !== 'start' && selectedCellData.cellType !== 'end' && (
              <div>
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {selectedCellData.imageUrl && (
                  <img 
                    src={selectedCellData.imageUrl} 
                    alt="Preview" 
                    className="mt-2 w-20 h-20 object-cover rounded border"
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};