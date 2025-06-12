import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Target, Grid, Info } from 'lucide-react';
import { Game } from '@/types/game';

const GameLibrary = () => {
  // Mock data - replace with actual API call
  const games: Game[] = [
    {
      id: '1',
      name: 'Robot Adventure 1',
      maxMoves: 15,
      totalCircuitCells: 8,
      totalInfoCells: 3,
      gridConfig: [],
      informativeCells: [],
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Learning Circuit',
      maxMoves: 20,
      totalCircuitCells: 12,
      totalInfoCells: 5,
      gridConfig: [],
      informativeCells: [],
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      name: 'Math Challenge',
      maxMoves: 25,
      totalCircuitCells: 15,
      totalInfoCells: 4,
      gridConfig: [],
      informativeCells: [],
      createdAt: new Date('2024-01-25'),
    },
  ];

  const handleEdit = (id: string) => {
    console.log('Edit game:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete game:', id);
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-3xl font-bold">Game Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card key={game.id} className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{game.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created: {formatDate(game.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Max Moves: {game.maxMoves}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Grid className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Circuit Cells: {game.totalCircuitCells}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Info Cells: {game.totalInfoCells}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Badge className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                    {game.name.includes('Challenge') ? 'Challenge' : 'Adventure'}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(game.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(game.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {games.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No games found. Create a new game to start building your library!</p>
        </div>
      )}
    </div>
  );
};

export default GameLibrary;
