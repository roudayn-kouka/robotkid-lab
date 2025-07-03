
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SavedGame {
  id: string;
  name: string;
  description: string;
  max_moves: number;
  grid_rows: number;
  grid_columns: number;
  creator_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useSavedGames = () => {
  const [games, setGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching games:', error);
      } else {
        setGames(data || []);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGame = async (gameData: {
    name: string;
    description: string;
    max_moves: number;
    grid_rows: number;
    grid_cols: number;
    grid_cells: any[];
    info_cells: any[];
  }) => {
    try {
      const { data, error } = await supabase.rpc('save_complete_game', {
        game_name: gameData.name,
        game_description: gameData.description,
        max_moves_count: gameData.max_moves,
        grid_rows: gameData.grid_rows,
        grid_cols: gameData.grid_cols,
        grid_cells: JSON.stringify(gameData.grid_cells),
        info_cells: JSON.stringify(gameData.info_cells)
      });

      if (error) {
        console.error('Error saving game:', error);
        return { success: false, error };
      }

      await fetchGames();
      return { success: true, gameId: data };
    } catch (error) {
      console.error('Error saving game:', error);
      return { success: false, error };
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from('saved_games')
        .delete()
        .eq('id', gameId);

      if (error) {
        console.error('Error deleting game:', error);
        return { success: false, error };
      }

      await fetchGames();
      return { success: true };
    } catch (error) {
      console.error('Error deleting game:', error);
      return { success: false, error };
    }
  };

  const publishGame = async (gameId: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_games')
        .update({ is_published: isPublished })
        .eq('id', gameId);

      if (error) {
        console.error('Error updating game:', error);
        return { success: false, error };
      }

      await fetchGames();
      return { success: true };
    } catch (error) {
      console.error('Error updating game:', error);
      return { success: false, error };
    }
  };

  return {
    games,
    loading,
    saveGame,
    deleteGame,
    publishGame,
    refetch: fetchGames
  };
};
