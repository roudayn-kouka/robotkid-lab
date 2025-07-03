
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Image, Trash2 } from 'lucide-react';
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

  const handleImageUpload = async (cellId: string, file: File) => {
    const result = await uploadFile(file);
    if (result.url) {
      onUpdate(cellId, { imageUrl: result.url });
    }
  };

  const handleAudioUpload = (cellId: string, audioUrl: string) => {
    onUpdate(cellId, { audioUrl });
  };

  const removeImage = (cellId: string) => {
    onUpdate(cellId, { imageUrl: '' });
  };

  const removeAudio = (cellId: string) => {
    onUpdate(cellId, { audioUrl: '' });
  };

  if (informativeCells.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucune cellule informative à configurer</p>
        <p className="text-sm mt-2">Ajoutez des cellules informatives dans le concepteur de circuit</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {informativeCells.map((cell, index) => (
        <Card key={cell.id} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg">Cellule Informative {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`content-${cell.id}`}>Contenu Textuel</Label>
              <Textarea
                id={`content-${cell.id}`}
                placeholder="Décrivez le contenu éducatif de cette cellule..."
                value={cell.content || ''}
                onChange={(e) => onUpdate(cell.id, { content: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section Image */}
              <div className="space-y-3">
                <Label>Image</Label>
                {cell.imageUrl ? (
                  <div className="relative">
                    <img
                      src={cell.imageUrl}
                      alt="Aperçu"
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(cell.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(cell.id, file);
                      }}
                      className="hidden"
                      id={`image-upload-${cell.id}`}
                      disabled={uploading}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`image-upload-${cell.id}`)?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Upload...' : 'Ajouter une image'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Section Audio */}
              <div className="space-y-3">
                <Label>Audio</Label>
                {cell.audioUrl ? (
                  <div className="space-y-2">
                    <audio controls className="w-full">
                      <source src={cell.audioUrl} type="audio/mpeg" />
                      Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAudio(cell.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer l'audio
                    </Button>
                  </div>
                ) : (
                  <AudioRecorder
                    onAudioUploaded={(url) => handleAudioUpload(cell.id, url)}
                    disabled={uploading}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InformativeCellsEditor;
