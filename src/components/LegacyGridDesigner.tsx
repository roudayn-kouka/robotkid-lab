
import React, { useState } from 'react';
import { Cell, GridDimensions } from '@/types/game';
import { cn } from '@/lib/utils';
import { RotateCcw, Move, Square, Info, Play, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GridDesignerProps {
  dimensions: GridDimensions;
  cells: Cell[];
  onCellUpdate: (x: number, y: number, updates: Partial<Cell>) => void;
  onDimensionsChange: (dimensions: GridDimensions) => void;
  targetPathCells: number;
  targetInfoCells: number;
}

const GridDesigner: React.FC<GridDesignerProps> = ({
  dimensions,
  cells,
  onCellUpdate,
  onDimensionsChange,
  targetPathCells,
  targetInfoCells,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [draggedTile, setDraggedTile] = useState<{ type: 'path' | 'info' | 'start' | 'end'; number?: number } | null>(null);

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'
  ];

  const getCellData = (x: number, y: number): Cell => {
    return cells.find(cell => cell.x === x && cell.y === y) || {
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
  };

  const handleTileDragStart = (type: 'path' | 'info' | 'start' | 'end', tileNumber?: number) => {
    setDraggedTile({ type, number: tileNumber });
  };

  const handleCellDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCellDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    if (draggedTile !== null) {
      const cellData = getCellData(x, y);
      
      // Remove any existing tile at this position
      if (cellData.isPath) {
        onCellUpdate(x, y, { 
          isPath: false, 
          pathOrder: -1,
          isInformative: false,
          color: '#f8f9fa' 
        });
      }
      
      // Remove the dragged tile from its current position
      if (draggedTile.type === 'start' || draggedTile.type === 'end') {
        const existingSpecialCell = cells.find(cell => 
          (draggedTile.type === 'start' && cell.pathOrder === -2) ||
          (draggedTile.type === 'end' && cell.pathOrder === -3)
        );
        if (existingSpecialCell) {
          onCellUpdate(existingSpecialCell.x, existingSpecialCell.y, { 
            isPath: false, 
            pathOrder: -1,
            isInformative: false,
            color: '#f8f9fa' 
          });
        }
      } else if (draggedTile.number !== undefined) {
        const existingTileCell = cells.find(cell => 
          draggedTile.type === 'path' 
            ? cell.pathOrder === draggedTile.number! - 1 && !cell.isInformative
            : cell.pathOrder === draggedTile.number! - 1 && cell.isInformative
        );
        if (existingTileCell) {
          onCellUpdate(existingTileCell.x, existingTileCell.y, { 
            isPath: false, 
            pathOrder: -1,
            isInformative: false,
            color: '#f8f9fa' 
          });
        }
      }
      
      // Place the tile at the new position
      let pathOrder = -1;
      let color = '#f8f9fa';
      
      if (draggedTile.type === 'start') {
        pathOrder = -2;
        color = '#22c55e';
      } else if (draggedTile.type === 'end') {
        pathOrder = -3;
        color = '#ef4444';
      } else if (draggedTile.number !== undefined) {
        pathOrder = draggedTile.number - 1;
        color = draggedTile.type === 'info' ? '#f59e0b' : selectedColor;
      }
      
      onCellUpdate(x, y, { 
        isPath: true, 
        pathOrder,
        isInformative: draggedTile.type === 'info',
        color
      });
      
      setDraggedTile(null);
    }
  };

  const handleCellClick = (x: number, y: number) => {
    setSelectedCell({ x, y });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (selectedCell) {
      const cellData = getCellData(selectedCell.x, selectedCell.y);
      if (cellData.isPath && !cellData.isInformative && cellData.pathOrder >= 0) {
        onCellUpdate(selectedCell.x, selectedCell.y, { color });
      }
    }
  };

  const clearPath = () => {
    cells.filter(cell => cell.isPath).forEach(cell => {
      onCellUpdate(cell.x, cell.y, { 
        isPath: false, 
        pathOrder: -1,
        isInformative: false,
        color: '#f8f9fa' 
      });
    });
  };

  const selectedCellData = selectedCell ? getCellData(selectedCell.x, selectedCell.y) : null;
  const pathCells = cells.filter(cell => cell.isPath).sort((a, b) => a.pathOrder - b.pathOrder);
  const regularPathCells = pathCells.filter(cell => !cell.isInformative && cell.pathOrder >= 0);
  const informativeCells = pathCells.filter(cell => cell.isInformative);
  const startCell = pathCells.find(cell => cell.pathOrder === -2);
  const endCell = pathCells.find(cell => cell.pathOrder === -3);
  
  const availablePathTiles = Array.from({ length: targetPathCells }, (_, i) => i + 1)
    .filter(tileNum => !regularPathCells.find(cell => cell.pathOrder === tileNum - 1));
  
  const availableInfoTiles = Array.from({ length: targetInfoCells }, (_, i) => i + 1)
    .filter(tileNum => !informativeCells.find(cell => cell.pathOrder === tileNum - 1));

  // Validation
  const totalPlacedCells = regularPathCells.length + informativeCells.length;
  const hasStart = !!startCell;
  const hasEnd = !!endCell;
  const isValidCircuit = hasStart && hasEnd && totalPlacedCells === (targetPathCells + targetInfoCells);

  return (
    <div className="space-y-6">
      {/* Grid Dimensions Controls */}
      <div className="flex space-x-4 items-end">
        <div>
          <Label htmlFor="rows">Lignes</Label>
          <Input
            id="rows"
            type="number"
            min="3"
            max="10"
            value={dimensions.rows}
            onChange={(e) => onDimensionsChange({ ...dimensions, rows: parseInt(e.target.value) || 3 })}
            className="w-20"
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
            onChange={(e) => onDimensionsChange({ ...dimensions, columns: parseInt(e.target.value) || 3 })}
            className="w-20"
          />
        </div>
        <Button variant="outline" onClick={clearPath}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Effacer le Circuit
        </Button>
      </div>

      {/* Validation Status */}
      <div className="space-y-2">
        <Alert className={cn(isValidCircuit ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50")}>
          <AlertDescription>
            <div className="space-y-1">
              <p><strong>État du Circuit:</strong> {totalPlacedCells} / {targetPathCells + targetInfoCells} cellules placées</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className={cn("flex items-center", hasStart ? "text-green-600" : "text-red-600")}>
                  {hasStart ? "✓" : "✗"} Départ
                </span>
                <span className={cn("flex items-center", hasEnd ? "text-green-600" : "text-red-600")}>
                  {hasEnd ? "✓" : "✗"} Arrivée
                </span>
                <span>Chemin: {regularPathCells.length}/{targetPathCells}</span>
                <span>Informatif: {informativeCells.length}/{targetInfoCells}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex gap-6">
        {/* Available Tiles */}
        <div className="w-64 space-y-4">
          <h3 className="text-lg font-semibold">Tuiles Disponibles</h3>
          
          {/* Special Tiles */}
          <div>
            <h4 className="text-md font-medium mb-2">Tuiles Spéciales</h4>
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
              {!startCell && (
                <div
                  className="aspect-square bg-green-500 text-white rounded-md border-2 border-green-600 cursor-grab active:cursor-grabbing flex items-center justify-center font-bold transition-transform hover:scale-105"
                  draggable
                  onDragStart={() => handleTileDragStart('start')}
                >
                  <Play className="h-4 w-4" />
                </div>
              )}
              {!endCell && (
                <div
                  className="aspect-square bg-red-500 text-white rounded-md border-2 border-red-600 cursor-grab active:cursor-grabbing flex items-center justify-center font-bold transition-transform hover:scale-105"
                  draggable
                  onDragStart={() => handleTileDragStart('end')}
                >
                  <Flag className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          
          {/* Regular Path Tiles */}
          <div>
            <h4 className="text-md font-medium mb-2">Tuiles de Chemin</h4>
            <div className="grid grid-cols-3 gap-2 p-4 bg-muted rounded-lg">
              {availablePathTiles.map((tileNumber) => (
                <div
                  key={`path-${tileNumber}`}
                  className="aspect-square bg-primary text-primary-foreground rounded-md border-2 border-primary cursor-grab active:cursor-grabbing flex items-center justify-center font-bold transition-transform hover:scale-105"
                  draggable
                  onDragStart={() => handleTileDragStart('path', tileNumber)}
                >
                  {tileNumber}
                </div>
              ))}
            </div>
            {availablePathTiles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Toutes les tuiles de chemin placées
              </p>
            )}
          </div>

          {/* Informative Tiles */}
          <div>
            <h4 className="text-md font-medium mb-2">Tuiles Informatives</h4>
            <div className="grid grid-cols-3 gap-2 p-4 bg-muted rounded-lg">
              {availableInfoTiles.map((tileNumber) => (
                <div
                  key={`info-${tileNumber}`}
                  className="aspect-square bg-orange-500 text-white rounded-md border-2 border-orange-600 cursor-grab active:cursor-grabbing flex items-center justify-center font-bold transition-transform hover:scale-105 relative"
                  draggable
                  onDragStart={() => handleTileDragStart('info', tileNumber)}
                >
                  <Info className="h-3 w-3 absolute top-1 left-1" />
                  {tileNumber}
                </div>
              ))}
            </div>
            {availableInfoTiles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Toutes les tuiles informatives placées
              </p>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Grille de Circuit</h3>
          <div
            className="grid gap-2 bg-muted p-4 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${dimensions.columns}, 1fr)`,
              gridTemplateRows: `repeat(${dimensions.rows}, 1fr)`,
            }}
          >
            {Array.from({ length: dimensions.rows }).map((_, row) =>
              Array.from({ length: dimensions.columns }).map((_, col) => {
                const cellData = getCellData(col, row);
                const isSelected = selectedCell?.x === col && selectedCell?.y === row;
                
                return (
                  <div
                    key={`${col}-${row}`}
                    className={cn(
                      'aspect-square rounded-md border-2 cursor-pointer transition-all duration-200 relative overflow-hidden',
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : cellData.isPath
                        ? cellData.pathOrder === -2
                          ? 'border-green-500'
                          : cellData.pathOrder === -3
                          ? 'border-red-500'
                          : cellData.isInformative
                          ? 'border-orange-500'
                          : 'border-blue-500'
                        : 'border-border hover:border-primary/50',
                      'hover:ring-2 hover:ring-primary/30'
                    )}
                    style={{ backgroundColor: cellData.color }}
                    onClick={() => handleCellClick(col, row)}
                    onDragOver={handleCellDragOver}
                    onDrop={(e) => handleCellDrop(e, col, row)}
                  >
                    {cellData.isPath && (
                      <div className={cn(
                        "absolute top-1 left-1 text-white text-xs px-1 rounded z-10 flex items-center gap-1",
                        cellData.pathOrder === -2 ? "bg-green-600" :
                        cellData.pathOrder === -3 ? "bg-red-600" :
                        cellData.isInformative ? "bg-orange-600" : "bg-blue-600"
                      )}>
                        {cellData.pathOrder === -2 && <Play className="h-2 w-2" />}
                        {cellData.pathOrder === -3 && <Flag className="h-2 w-2" />}
                        {cellData.isInformative && cellData.pathOrder >= 0 && <Info className="h-2 w-2" />}
                        {cellData.pathOrder === -2 ? 'S' : 
                         cellData.pathOrder === -3 ? 'E' : 
                         cellData.pathOrder >= 0 ? cellData.pathOrder + 1 : ''}
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      {col},{row}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cell Editor */}
        <div className="w-80 space-y-4">
          <h3 className="text-lg font-semibold">Éditeur de Cellule</h3>
          
          {selectedCell ? (
            <div className="space-y-4">
              <div>
                <Label>Position: ({selectedCell.x}, {selectedCell.y})</Label>
                {selectedCellData?.isPath && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCellData.pathOrder === -2 ? 'Tuile de Départ' :
                     selectedCellData.pathOrder === -3 ? 'Tuile d\'Arrivée' :
                     selectedCellData.isInformative ? `Tuile Informative #${selectedCellData.pathOrder + 1}` : 
                     `Tuile de Chemin #${selectedCellData.pathOrder + 1}`}
                  </p>
                )}
              </div>

              {/* Color Palette - only for regular path cells */}
              {selectedCellData?.isPath && !selectedCellData.isInformative && selectedCellData.pathOrder >= 0 && (
                <div>
                  <Label>Couleur de la Tuile</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          'w-8 h-8 rounded border-2 transition-all',
                          selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Cell Type Info */}
              {selectedCellData?.isPath && (
                <div className={cn(
                  "p-3 rounded-lg border",
                  selectedCellData.pathOrder === -2 ? "bg-green-50 border-green-200" :
                  selectedCellData.pathOrder === -3 ? "bg-red-50 border-red-200" :
                  selectedCellData.isInformative ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200"
                )}>
                  <div className="flex items-center space-x-2">
                    {selectedCellData.pathOrder === -2 ? <Play className="h-4 w-4 text-green-600" /> :
                     selectedCellData.pathOrder === -3 ? <Flag className="h-4 w-4 text-red-600" /> :
                     selectedCellData.isInformative ? <Info className="h-4 w-4 text-orange-600" /> :
                     <Square className="h-4 w-4 text-blue-600" />}
                    <span className={cn(
                      "text-sm font-medium",
                      selectedCellData.pathOrder === -2 ? "text-green-800" :
                      selectedCellData.pathOrder === -3 ? "text-red-800" :
                      selectedCellData.isInformative ? "text-orange-800" : "text-blue-800"
                    )}>
                      {selectedCellData.pathOrder === -2 ? 'Tuile de Départ' :
                       selectedCellData.pathOrder === -3 ? 'Tuile d\'Arrivée' :
                       selectedCellData.isInformative ? `Tuile Informative #${selectedCellData.pathOrder + 1}` : 
                       `Tuile de Chemin #${selectedCellData.pathOrder + 1}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Move className="h-8 w-8 mx-auto mb-2" />
              <p>Glissez les tuiles depuis la gauche pour créer votre circuit</p>
              <p className="text-xs mt-1">Cliquez sur une cellule pour modifier ses propriétés</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridDesigner;
