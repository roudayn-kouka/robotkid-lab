
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Game } from '@/types/game';
import { Database } from '@/integrations/supabase/types';

type CellType = Database['public']['Enums']['cell_type'];

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          game_cells (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching games:', error);
      } else {
        // Convertir les données de la base vers le format Game
        const formattedGames: Game[] = data.map(gameData => ({
          id: gameData.id,
          name: gameData.name,
          maxMoves: gameData.max_moves,
          health: gameData.health || 3,
          totalCircuitCells: gameData.game_cells?.filter((cell: any) => ['start', 'end', 'interaction'].includes(cell.cell_type)).length || 0,
          totalInfoCells: gameData.game_cells?.filter((cell: any) => cell.cell_type === 'audio_interaction').length || 0,
          gridConfig: gameData.game_cells?.map((cell: any) => ({
            x: cell.column_index,
            y: cell.row_index,
            color: getCellColor(cell.cell_type),
            cellType: cell.cell_type as any,
            content: cell.content || '',
            imageUrl: cell.image_url || '',
            audioUrl: cell.audio_url || '',
            pathOrder: 0,
            connections: []
          })) || [],
          informativeCells: gameData.game_cells
            ?.filter((cell: any) => cell.cell_type === 'audio_interaction')
            ?.map((cell: any) => ({
              id: cell.id,
              content: cell.content || '',
              imageUrl: cell.image_url || '',
              audioUrl: cell.audio_url || ''
            })) || [],
          createdAt: new Date(gameData.created_at)
        }));
        
        setGames(formattedGames);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (gameData: Partial<Game>) => {
    try {
      const { data: newGame, error } = await supabase
        .from('games')
        .insert({
          name: gameData.name,
          description: '',
          rows: 5,
          columns: 5,
          max_moves: gameData.maxMoves || 10,
          health: gameData.health || 3,
          is_published: false,
          chapter_index: 1,
          level_index: 1
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating game:', error);
        return { error };
      }

      // Créer les cellules du jeu
      if (gameData.gridConfig && gameData.gridConfig.length > 0) {
        const cellsData = gameData.gridConfig.map(cell => ({
          game_id: newGame.id,
          row_index: cell.y,
          column_index: cell.x,
          cell_type: getCellType(cell) as CellType,
          content: cell.content || null,
          image_url: cell.imageUrl || null
        }));

        const { error: cellsError } = await supabase
          .from('game_cells')
          .insert(cellsData);

        if (cellsError) {
          console.error('Error creating game cells:', cellsError);
          return { error: cellsError };
        }
      }

      await fetchGames();
      return { error: null };
    } catch (error) {
      console.error('Error creating game:', error);
      return { error };
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) {
        console.error('Error deleting game:', error);
        return { error };
      }

      await fetchGames();
      return { error: null };
    } catch (error) {
      console.error('Error deleting game:', error);
      return { error };
    }
  };

  return {
    games,
    loading,
    createGame,
    deleteGame,
    refetch: fetchGames
  };
};

// Fonctions utilitaires pour convertir les types
function getCellColor(cellType: string): string {
  switch (cellType) {
    case 'start': return '#22c55e';
    case 'end': return '#ef4444';
    case 'circuit': return '#3b82f6';
    case 'informative': return '#f59e0b';
    case 'obstacle': return '#6b7280';
    default: return '#ffffff';
  }
}

function getCellType(cell: any): CellType {
  return cell.cellType || 'interaction';
}
