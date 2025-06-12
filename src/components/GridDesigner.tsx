
import React, { useState } from 'react';
import { Cell, GridDimensions } from '@/types/game';
import { cn } from '@/lib/utils';
import { RotateCcw, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GridDesignerProps {
  dimensions: GridDimensions;
  cells: Cell[];
  onCellUpdate: (x: number, y: number, updates: Partial<Cell>) => void;
  onDimensionsChange: (dimensions: GridDimensions) => void;
  targetPathCells: number;
}

const GridDesigner: React.FC<GridDesignerProps> = ({
  dimensions,
  cells,
  onCellUpdate,
  onDimensionsChange,
  targetPathCells,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [isCreatingPath, setIsCreatingPath] = useState(false);

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

  const handleCellClick = (x: number, y: number) => {
    if (isCreatingPath) {
      const cellData = getCellData(x, y);
      const pathCells = cells.filter(cell => cell.isPath);
      
      if (!cellData.isPath && pathCells.length < targetPathCells) {
        // Add to path
        const pathOrder = pathCells.length;
        onCellUpdate(x, y, { 
          isPath: true, 
          pathOrder,
          color: selectedColor 
        });
      } else if (cellData.isPath) {
        // Remove from path
        onCellUpdate(x, y, { 
          isPath: false, 
          pathOrder: -1,
          color: '#f8f9fa' 
        });
        
        // Reorder remaining path cells
        const remainingCells = cells.filter(cell => 
          cell.isPath && !(cell.x === x && cell.y === y)
        ).sort((a, b) => a.pathOrder - b.pathOrder);
        
        remainingCells.forEach((cell, index) => {
          onCellUpdate(cell.x, cell.y, { pathOrder: index });
        });
      }
    } else {
      setSelectedCell({ x, y });
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (selectedCell) {
      onCellUpdate(selectedCell.x, selectedCell.y, { color });
    }
  };

  const clearPath = () => {
    cells.filter(cell => cell.isPath).forEach(cell => {
      onCellUpdate(cell.x, cell.y, { 
        isPath: false, 
        pathOrder: -1,
        color: '#f8f9fa' 
      });
    });
  };

  const selectedCellData = selectedCell ? getCellData(selectedCell.x, selectedCell.y) : null;
  const pathCells = cells.filter(cell => cell.isPath);

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
        <div className="flex space-x-2">
          <Button
            variant={isCreatingPath ? "default" : "outline"}
            onClick={() => setIsCreatingPath(!isCreatingPath)}
          >
            <Play className="h-4 w-4 mr-2" />
            {isCreatingPath ? 'Stop Path Creation' : 'Create Path'}
          </Button>
          <Button variant="outline" onClick={clearPath}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Path
          </Button>
        </div>
      </div>

      {/* Path Status */}
      <div className="bg-muted p-3 rounded-lg">
        <p className="text-sm">
          <strong>Path Status:</strong> {pathCells.length} / {targetPathCells} cells
          {isCreatingPath && (
            <span className="ml-2 text-primary">Click cells to add to path</span>
          )}
        </p>
      </div>

      <div className="flex gap-6">
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
                        ? 'border-green-500'
                        : 'border-border hover:border-primary/50',
                      isCreatingPath && 'hover:ring-2 hover:ring-primary/30'
                    )}
                    style={{ backgroundColor: cellData.color }}
                    onClick={() => handleCellClick(col, row)}
                  >
                    {cellData.isPath && (
                      <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1 rounded">
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
                    Path Order: {selectedCellData.pathOrder + 1}
                  </p>
                )}
              </div>

              {/* Color Palette */}
              <div>
                <Label>Background Color</Label>
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

              {/* Path Cell Info */}
              {selectedCellData?.isPath && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <Square className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Path Cell #{selectedCellData.pathOrder + 1}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {isCreatingPath 
                ? "Click on cells to create the robot path"
                : "Click on a cell to edit its properties"
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridDesigner;
