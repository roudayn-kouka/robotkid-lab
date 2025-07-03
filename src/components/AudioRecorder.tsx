
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Upload } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface AudioRecorderProps {
  onAudioUploaded: (url: string) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioUploaded, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { uploadAudio, uploading } = useFileUpload();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const uploadRecording = async () => {
    if (audioBlob) {
      const result = await uploadAudio(audioBlob);
      if (result.url) {
        onAudioUploaded(result.url);
        // Reset after successful upload
        setAudioBlob(null);
        setAudioUrl(null);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const { uploadFile } = useFileUpload();
      const result = await uploadFile(file);
      if (result.url) {
        onAudioUploaded(result.url);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center space-x-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            <Mic className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            disabled={disabled}
            variant="destructive"
            size="sm"
          >
            <Square className="h-4 w-4 mr-2" />
            Arrêter
          </Button>
        )}
        
        {/* File Upload */}
        <div>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-upload"
            disabled={disabled}
          />
          <Button
            onClick={() => document.getElementById('audio-upload')?.click()}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div className="flex items-center space-x-2">
          <audio ref={audioRef} src={audioUrl} />
          
          {!isPlaying ? (
            <Button onClick={playAudio} variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Écouter
            </Button>
          ) : (
            <Button onClick={pauseAudio} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={uploadRecording}
            disabled={uploading}
            variant="default"
            size="sm"
          >
            {uploading ? 'Upload...' : 'Sauvegarder'}
          </Button>
        </div>
      )}
      
      {isRecording && (
        <div className="text-red-500 text-sm flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
          Enregistrement en cours...
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
