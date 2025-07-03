
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Image, Volume2, X } from 'lucide-react';
import { InformativeCell } from '@/types/game';
import { useFileUpload } from '@/hooks/useFileUpload';
import AudioRecorder from './AudioRecorder';

interface InformativeCellsEditorProps {
  informativeCells: InformativeCell[];
  onUpdate: (id: string, updates: Partial<InformativeCell>) => void;
}

const InformativeCellsEditor: React.FC<InformativeCellsEditorProps> = ({
  informativeCells,
  onUpdate,
}) => {
  const { uploadFile, uploading } = useFileUpload();

  const handleImageUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const result = await uploadFile(file);
      if (result.url) {
        onUpdate(id, { imageUrl: result.url });
      }
    }
  };

  const handleAudioUpload = (id: string, url: string) => {
    onUpdate(id, { audioUrl: url });
  };

  return (
    <div className="space-y-4">
      {informativeCells.map((cell, index) => (
        <Card key={cell.id} className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cellule Informative {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Section */}
            <div>
              <Label htmlFor={`content-${cell.id}`}>Contenu Éducatif</Label>
              <Textarea
                id={`content-${cell.id}`}
                placeholder="Entrez le contenu éducatif pour cette cellule..."
                value={cell.content}
                onChange={(e) => onUpdate(cell.id, { content: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Section */}
              <div>
                <Label>Image de la Cellule</Label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(cell.id, e)}
                      className="hidden"
                      id={`image-upload-${cell.id}`}
                      disabled={uploading}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`image-upload-${cell.id}`)?.click()}
                      className="w-full"
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Upload...' : 'Importer une Image'}
                    </Button>
                  </div>
                  
                  {cell.imageUrl ? (
                    <div className="relative">
                      <img
                        src={cell.imageUrl}
                        alt={`Cellule informative ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => onUpdate(cell.id, { imageUrl: '' })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Image className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Aucune image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Section */}
              <div>
                <Label>Audio de la Cellule</Label>
                <div className="space-y-3">
                  <AudioRecorder
                    onAudioUploaded={(url) => handleAudioUpload(cell.id, url)}
                    disabled={uploading}
                  />
                  
                  {cell.audioUrl && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4" />
                          <span className="text-sm">Audio enregistré</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <audio controls className="h-8">
                            <source src={cell.audioUrl} type="audio/wav" />
                          </audio>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdate(cell.id, { audioUrl: '' })}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
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
          <p>Aucune cellule informative configurée. Augmentez le nombre ci-dessus pour ajouter des cellules.</p>
        </div>
      )}
    </div>
  );
};

export default InformativeCellsEditor;
