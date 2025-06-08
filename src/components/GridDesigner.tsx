
import React, { useState } from 'react';
import { Cell, GridDimensions } from '@/types/game';
import { cn } from '@/lib/utils';
import { Upload, Palette, Type, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GridDesignerProps {
  dimensions: GridDimensions;
  cells: Cell[];
  onCellUpdate: (x: number, y: number, updates: Partial<Cell>) => void;
  onDimensionsChange: (dimensions: GridDimensions) => void;
}

const GridDesigner: React.FC<GridDesignerProps> = ({
  dimensions,
  cells,
  onCellUpdate,
  onDimensionsChange,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

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
      imageUrl: ''
    };
  };

  const handleCellClick = (x: number, y: number) => {
    setSelectedCell({ x, y });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (selectedCell) {
      onCellUpdate(selectedCell.x, selectedCell.y, { color });
    }
  };

  const selectedCellData = selectedCell ? getCellData(selectedCell.x, selectedCell.y) : null;

  return (
    <div className="space-y-6">
      {/* Grid Dimensions Controls */}
      <div className="flex space-x-4">
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
                        : 'border-border hover:border-primary/50'
                    )}
                    style={{ backgroundColor: cellData.color }}
                    onClick={() => handleCellClick(col, row)}
                  >
                    {cellData.isInformative && (
                      <div className="absolute top-1 right-1">
                        <Info className="h-3 w-3 text-white drop-shadow" />
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

              {/* Informative Cell Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="informative"
                  checked={selectedCellData?.isInformative || false}
                  onChange={(e) => onCellUpdate(selectedCell.x, selectedCell.y, { isInformative: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="informative">Informative Cell</Label>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter cell content..."
                  value={selectedCellData?.content || ''}
                  onChange={(e) => onCellUpdate(selectedCell.x, selectedCell.y, { content: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Cell Image</Label>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  {selectedCellData?.imageUrl && (
                    <img
                      src={selectedCellData.imageUrl}
                      alt="Cell preview"
                      className="w-full h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Click on a cell to edit its properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridDesigner;
