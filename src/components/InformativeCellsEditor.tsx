
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Image } from 'lucide-react';
import { InformativeCell } from '@/types/game';

interface InformativeCellsEditorProps {
  informativeCells: InformativeCell[];
  onUpdate: (id: string, updates: Partial<InformativeCell>) => void;
}

const InformativeCellsEditor: React.FC<InformativeCellsEditorProps> = ({
  informativeCells,
  onUpdate,
}) => {
  const handleImageUpload = (id: string) => {
    // Placeholder for image upload functionality
    console.log('Upload image for cell:', id);
    // In a real implementation, this would handle file upload
  };

  return (
    <div className="space-y-4">
      {informativeCells.map((cell, index) => (
        <Card key={cell.id} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Informative Cell {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content Section */}
              <div>
                <Label htmlFor={`content-${cell.id}`}>Content</Label>
                <Textarea
                  id={`content-${cell.id}`}
                  placeholder="Enter educational content for this cell..."
                  value={cell.content}
                  onChange={(e) => onUpdate(cell.id, { content: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              {/* Image Section */}
              <div>
                <Label>Cell Image</Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImageUpload(cell.id)}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  
                  {cell.imageUrl ? (
                    <div className="relative">
                      <img
                        src={cell.imageUrl}
                        alt={`Informative cell ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => onUpdate(cell.id, { imageUrl: '' })}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Image className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No image uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {informativeCells.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No informative cells configured. Increase the count above to add cells.</p>
        </div>
      )}
    </div>
  );
};

export default InformativeCellsEditor;
