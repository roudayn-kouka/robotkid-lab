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
  const [imageKey, setImageKey] = useState(0);
  const { uploadFile, uploading } = useFileUpload();

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
    
    const result = await uploadFile(file, 'game-assets');
    if (result.url) {
      // Force image refresh with timestamp
      onCellUpdate(selectedCell.x, selectedCell.y, { imageUrl: result.url });
      setImageKey(prev => prev + 1);
      
      // Force re-render after a short delay to ensure image loads
      setTimeout(() => {
        setImageKey(prev => prev + 1);
      }, 100);
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
            className="grid gap-0 bg-secondary rounded-lg p-1"
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
                    key={`${col}-${row}-${imageKey}`}
                    className={`
                      w-16 h-16 cursor-pointer transition-all relative
                      ${isSelected ? 'ring-4 ring-primary ring-inset z-10' : ''}
                      hover:ring-2 hover:ring-primary/50
                    `}
                    style={{ backgroundColor: cellData.imageUrl ? 'transparent' : cellData.color }}
                    onClick={() => handleCellClick(col, row)}
                    onDragOver={handleCellDragOver}
                    onDrop={(e) => handleCellDrop(e, col, row)}
                  >
                    {cellData.imageUrl && cellData.cellType !== 'start' && cellData.cellType !== 'end' && (
                      <img 
                        src={cellData.imageUrl} 
                        alt="Cell content" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {cellData.cellType === 'start' && (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg bg-green-500">
                        DÉPART
                      </div>
                    )}
                    {cellData.cellType === 'end' && (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg bg-red-500">
                        FIN
                      </div>
                    )}
                    {!cellData.imageUrl && cellData.cellType !== 'start' && cellData.cellType !== 'end' && (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                        {cellData.cellType === 'interaction' && 'INT'}
                        {cellData.cellType === 'audio_interaction' && 'AUDIO'}
                        {cellData.cellType === 'obstacle' && 'OBST'}
                      </div>
                    )}
                    {cellData.content && !cellData.imageUrl && cellData.cellType !== 'start' && cellData.cellType !== 'end' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                        {cellData.content}
                      </div>
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
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {uploading && (
                  <div className="mt-2 text-sm text-blue-600">
                    Upload en cours...
                  </div>
                )}
                    {selectedCellData.imageUrl && !uploading && (
                      <div className="mt-2">
                        <img 
                          src={`${selectedCellData.imageUrl}?t=${Date.now()}`} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <p className="text-xs text-green-600 mt-1">Image ajoutée avec succès</p>
                      </div>
                    )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};