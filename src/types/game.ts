
export type CellType = 'start' | 'end' | 'audio_interaction' | 'interaction' | 'obstacle';

export interface Cell {
  x: number;
  y: number;
  color: string;
  cellType: CellType;
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
  pathOrder: number;
  connections: number[];
}

export interface InformativeCell {
  id: string;
  content: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface Game {
  id: string;
  name: string;
  maxMoves: number;
  health: number;
  totalCircuitCells: number;
  totalInfoCells: number;
  gridConfig: Cell[];
  informativeCells: InformativeCell[];
  createdAt: Date;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  steps: string[];
  success: boolean;
  duration: number;
  errorCells: Cell[];
  timestamp: Date;
}

export interface GridDimensions {
  rows: number;
  columns: number;
}
