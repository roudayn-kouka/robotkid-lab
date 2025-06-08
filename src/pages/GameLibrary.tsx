
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Game } from '@/types/game';

const GameLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app this would come from API
  const mockGames: Game[] = [
    {
      id: '1',
      name: 'Robot Basics Adventure',
      maxMoves: 15,
      totalCircuitCells: 12,
      totalInfoCells: 4,
      gridConfig: [],
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Mathematical Maze',
      maxMoves: 25,
      totalCircuitCells: 20,
      totalInfoCells: 6,
      gridConfig: [],
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      name: 'Science Circuit Quest',
      maxMoves: 30,
      totalCircuitCells: 16,
      totalInfoCells: 5,
      gridConfig: [],
      createdAt: new Date('2024-01-25'),
    },
  ];

  const filteredGames = mockGames.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (gameId: string) => {
    console.log('Deleting game:', gameId);
    // In real app, this would call API to delete game
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Game Library</h1>
        <Link to="/create-game">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Game
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{game.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(game.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Max Moves:</span>
                  <div className="font-semibold">{game.maxMoves}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Circuit Cells:</span>
                  <div className="font-semibold">{game.totalCircuitCells}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {game.totalInfoCells} Info Cells
                </Badge>
                <Badge variant="outline">
                  {game.createdAt.toLocaleDateString()}
                </Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                Open Editor
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            {searchTerm ? 'No games found matching your search.' : 'No games created yet.'}
          </div>
          <Link to="/create-game">
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Game
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GameLibrary;
