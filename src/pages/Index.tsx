
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, List, BarChart3, Users, Target, Zap } from 'lucide-react';

const Index = () => {
  const quickStats = [
    { label: 'Total Games', value: '12', icon: List, color: 'text-blue-600' },
    { label: 'Active Players', value: '1,247', icon: Users, color: 'text-green-600' },
    { label: 'Success Rate', value: '78.5%', icon: Target, color: 'text-purple-600' },
    { label: 'Avg Session', value: '4m 15s', icon: Zap, color: 'text-orange-600' },
  ];

  const recentGames = [
    { name: 'Robot Basics Adventure', created: '2 days ago', status: 'Active' },
    { name: 'Mathematical Maze', created: '5 days ago', status: 'Active' },
    { name: 'Science Circuit Quest', created: '1 week ago', status: 'Draft' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            RoboEdu Admin Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create engaging educational robot-based games with customizable circuits, 
            track student performance, and analyze learning outcomes.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/create-game">
              <Button size="lg" className="px-8">
                <Plus className="h-5 w-5 mr-2" />
                Create New Game
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" size="lg" className="px-8">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Games */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/create-game">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Game
                </Button>
              </Link>
              <Link to="/games">
                <Button className="w-full justify-start" variant="outline">
                  <List className="h-4 w-4 mr-2" />
                  Manage Games
                </Button>
              </Link>
              <Link to="/analytics">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Games */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGames.map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{game.name}</p>
                      <p className="text-sm text-muted-foreground">Created {game.created}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        game.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {game.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/games">
                <Button variant="outline" className="w-full mt-4">
                  View All Games
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Intuitive Game Creator</h3>
            <p className="text-muted-foreground">
              Design custom circuit grids with drag-and-drop interface and rich content options.
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-muted-foreground">
              Track student performance, success rates, and learning patterns in real-time.
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Educational Focus</h3>
            <p className="text-muted-foreground">
              Built specifically for educational environments with teacher-friendly tools.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
