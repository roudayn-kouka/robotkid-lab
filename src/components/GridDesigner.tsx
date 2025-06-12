
import React, { useState } from 'react';
import { Cell, GridDimensions } from '@/types/game';
import { cn } from '@/lib/utils';
import { RotateCcw, Move, Square, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [draggedTile, setDraggedTile] = useState<{ type: 'path' | 'info'; number: number } | null>(null);

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

  const handleTileDragStart = (type: 'path' | 'info', tileNumber: number) => {
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
      const existingTileCell = cells.find(cell => 
        draggedTile.type === 'path' 
          ? cell.pathOrder === draggedTile.number - 1 && !cell.isInformative
          : cell.pathOrder === draggedTile.number - 1 && cell.isInformative
      );
      if (existingTileCell) {
        onCellUpdate(existingTileCell.x, existingTileCell.y, { 
          isPath: false, 
          pathOrder: -1,
          isInformative: false,
          color: '#f8f9fa' 
        });
      }
      
      // Place the tile at the new position
      onCellUpdate(x, y, { 
        isPath: true, 
        pathOrder: draggedTile.number - 1,
        isInformative: draggedTile.type === 'info',
        color: draggedTile.type === 'info' ? '#ef4444' : selectedColor 
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
      if (cellData.isPath && !cellData.isInformative) {
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
  const regularPathCells = pathCells.filter(cell => !cell.isInformative);
  const informativeCells = pathCells.filter(cell => cell.isInformative);
  
  const availablePathTiles = Array.from({ length: targetPathCells }, (_, i) => i + 1)
    .filter(tileNum => !regularPathCells.find(cell => cell.pathOrder === tileNum - 1));
  
  const availableInfoTiles = Array.from({ length: targetInfoCells }, (_, i) => i + 1)
    .filter(tileNum => !informativeCells.find(cell => cell.pathOrder === tileNum - 1));

  return (
    <div className="space-y-6">
      {/* Grid Dimensions Controls */}
      <div className="flex space-x-4 items-end">
        <div>
          <Label htmlFor="rows">Rows</Label>
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
          <Label htmlFor="columns">Columns</Label>
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
          Clear Path
        </Button>
      </div>

      {/* Path Status */}
      <div className="bg-muted p-3 rounded-lg">
        <p className="text-sm">
          <strong>Circuit Status:</strong> {regularPathCells.length} / {targetPathCells} path tiles placed, {informativeCells.length} / {targetInfoCells} informative tiles placed
        </p>
      </div>

      <div className="flex gap-6">
        {/* Available Tiles */}
        <div className="w-64 space-y-4">
          <h3 className="text-lg font-semibold">Available Circuit Tiles</h3>
          
          {/* Regular Path Tiles */}
          <div>
            <h4 className="text-md font-medium mb-2">Path Tiles</h4>
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
                All path tiles placed
              </p>
            )}
          </div>

          {/* Informative Tiles */}
          <div>
            <h4 className="text-md font-medium mb-2">Informative Tiles</h4>
            <div className="grid grid-cols-3 gap-2 p-4 bg-muted rounded-lg">
              {availableInfoTiles.map((tileNumber) => (
                <div
                  key={`info-${tileNumber}`}
                  className="aspect-square bg-red-500 text-white rounded-md border-2 border-red-600 cursor-grab active:cursor-grabbing flex items-center justify-center font-bold transition-transform hover:scale-105 relative"
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
                All informative tiles placed
              </p>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Circuit Grid</h3>
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
                        ? cellData.isInformative
                          ? 'border-red-500'
                          : 'border-green-500'
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
                        cellData.isInformative ? "bg-red-600" : "bg-green-600"
                      )}>
                        {cellData.isInformative && <Info className="h-2 w-2" />}
                        {cellData.pathOrder + 1}
                      </div>
                    )}
                    
                    {cellData.imageUrl && (
                      <img
                        src={cellData.imageUrl}
                        alt="Cell content"
                        className="w-full h-full object-cover opacity-80"
                      />
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
          <h3 className="text-lg font-semibold">Cell Editor</h3>
          
          {selectedCell ? (
            <div className="space-y-4">
              <div>
                <Label>Position: ({selectedCell.x}, {selectedCell.y})</Label>
                {selectedCellData?.isPath && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCellData.isInformative ? 'Informative' : 'Path'} Tile #{selectedCellData.pathOrder + 1}
                  </p>
                )}
              </div>

              {/* Color Palette - only for regular path cells */}
              {selectedCellData?.isPath && !selectedCellData.isInformative && (
                <div>
                  <Label>Tile Color</Label>
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

              {/* Path Cell Info */}
              {selectedCellData?.isPath && !selectedCellData.isInformative && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <Square className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Path Tile #{selectedCellData.pathOrder + 1}
                    </span>
                  </div>
                </div>
              )}

              {/* Informative Cell Info */}
              {selectedCellData?.isPath && selectedCellData.isInformative && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Informative Tile #{selectedCellData.pathOrder + 1}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Move className="h-8 w-8 mx-auto mb-2" />
              <p>Drag tiles from the left to create your circuit path</p>
              <p className="text-xs mt-1">Click on a cell to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridDesigner;
