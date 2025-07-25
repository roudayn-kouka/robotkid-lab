import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InformativeCell } from '@/types/game';
import { useFileUpload } from '@/hooks/useFileUpload';
import AudioRecorder from './AudioRecorder';
import { toast } from "sonner";
import { Trash2, Upload, Play, Pause } from 'lucide-react';

interface NewInformativeCellsEditorProps {
  informativeCells: InformativeCell[];
  onUpdate: (id: string, updates: Partial<InformativeCell>) => void;
}

export const NewInformativeCellsEditor: React.FC<NewInformativeCellsEditorProps> = ({
  informativeCells,
  onUpdate
}) => {
  const { uploadFile } = useFileUpload();

  const handleImageUpload = async (cellId: string, file: File) => {
    try {
      const result = await uploadFile(file, 'game-assets');
      if (result.url) {
        onUpdate(cellId, { imageUrl: result.url });
        toast.success('Image uploadée avec succès');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
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
      <Card>
        <CardHeader>
          <CardTitle>Cellules Audio Interaction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucune cellule audio interaction définie. Ajoutez des cellules de type "Audio Interaction" dans la grille pour les configurer ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cellules Audio Interaction ({informativeCells.length})</h3>
      
      {informativeCells.map((cell, index) => (
        <Card key={cell.id} className="w-full">
          <CardHeader>
            <CardTitle className="text-base">Cellule Audio {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contenu texte */}
            <div>
              <Label htmlFor={`content-${cell.id}`}>Contenu</Label>
              <Textarea
                id={`content-${cell.id}`}
                value={cell.content}
                onChange={(e) => onUpdate(cell.id, { content: e.target.value })}
                placeholder="Décrivez le contenu de cette cellule..."
                className="min-h-[80px]"
              />
            </div>

            {/* Section Image */}
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(cell.id, file);
                  }}
                  className="flex-1"
                />
                {cell.imageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(cell.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {cell.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={cell.imageUrl} 
                    alt="Aperçu de la cellule" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Section Audio */}
            <div className="space-y-2">
              <Label>Audio</Label>
              <div className="border rounded-lg p-4 space-y-3">
                <AudioRecorder onAudioUploaded={(audioUrl) => handleAudioUpload(cell.id, audioUrl)} />
                
                {cell.audioUrl && (
                  <div className="flex items-center gap-2 p-2 bg-secondary rounded">
                    <audio controls className="flex-1">
                      <source src={cell.audioUrl} type="audio/mpeg" />
                      Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAudio(cell.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload manuel d'audio */}
            <div>
              <Label>Ou uploader un fichier audio</Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const result = await uploadFile(file, 'game-assets');
                      if (result.url) {
                        handleAudioUpload(cell.id, result.url);
                        toast.success('Audio uploadé avec succès');
                      } else {
                        throw new Error(result.error);
                      }
                    } catch (error) {
                      toast.error('Erreur lors de l\'upload de l\'audio');
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};