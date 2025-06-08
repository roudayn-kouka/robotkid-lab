
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Clock, Download } from 'lucide-react';

const Analytics = () => {
  const [selectedGame, setSelectedGame] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const mockStats = {
    totalPlays: 1247,
    avgMoves: 18.3,
    successRate: 78.5,
    avgDuration: 245, // seconds
  };

  const mockChartData = [
    { name: 'Mon', plays: 120, success: 95 },
    { name: 'Tue', plays: 150, success: 118 },
    { name: 'Wed', plays: 180, success: 142 },
    { name: 'Thu', plays: 200, success: 156 },
    { name: 'Fri', plays: 220, success: 172 },
    { name: 'Sat', plays: 190, success: 149 },
    { name: 'Sun', plays: 187, success: 147 },
  ];

  const mockGamePerformance = [
    { game: 'Robot Basics Adventure', plays: 456, success: 85.2, avgMoves: 15.6 },
    { game: 'Mathematical Maze', plays: 382, success: 72.1, avgMoves: 22.4 },
    { game: 'Science Circuit Quest', plays: 409, success: 78.8, avgMoves: 19.2 },
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="1">Robot Basics Adventure</SelectItem>
              <SelectItem value="2">Mathematical Maze</SelectItem>
              <SelectItem value="3">Science Circuit Quest</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPlays.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Moves</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgMoves}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+1.4</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(mockStats.avgDuration)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-15s</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="plays" fill="#3b82f6" name="Total Plays" />
                <Bar dataKey="success" fill="#10b981" name="Successful Plays" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Successful Plays"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Game Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Game Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Game Name</th>
                  <th className="text-left p-2">Total Plays</th>
                  <th className="text-left p-2">Success Rate</th>
                  <th className="text-left p-2">Avg Moves</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockGamePerformance.map((game, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{game.game}</td>
                    <td className="p-2">{game.plays}</td>
                    <td className="p-2">{game.success}%</td>
                    <td className="p-2">{game.avgMoves}</td>
                    <td className="p-2">
                      <Badge 
                        variant={game.success > 80 ? "default" : game.success > 70 ? "secondary" : "destructive"}
                      >
                        {game.success > 80 ? "Excellent" : game.success > 70 ? "Good" : "Needs Review"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
