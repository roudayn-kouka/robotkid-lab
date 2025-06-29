
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Trophy, TrendingUp, Clock, Star, Target, Lightbulb } from 'lucide-react';

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState<string>('child1');

  // Mock data for children
  const children = [
    {
      id: 'child1',
      name: 'Emma Martin',
      code: 'EM2024',
      class: '6ème A',
      establishment: 'École Jean Moulin',
      performance: {
        gamesPlayed: 18,
        averageScore: 87,
        completionRate: 94,
        totalTimeSpent: 12.5, // hours
        rank: 3,
        totalStudents: 25
      },
      progress: {
        concepts: [
          { name: 'Séquences', progress: 95, level: 'Excellent' },
          { name: 'Boucles', progress: 78, level: 'Bon' },
          { name: 'Conditions', progress: 65, level: 'En cours' },
          { name: 'Variables', progress: 45, level: 'Débutant' }
        ]
      },
      strengths: ['Logique algorithmique', 'Résolution de problèmes', 'Créativité'],
      weaknesses: ['Variables complexes', 'Optimisation'],
      recommendations: [
        'Encourager la pratique des exercices avec variables',
        'Féliciter pour les excellents résultats en logique',
        'Proposer des défis créatifs pour maintenir la motivation'
      ],
      recentGames: [
        { name: 'Robot Maze Adventure', score: 92, date: '2024-01-16', duration: '25 min' },
        { name: 'Logic Circuit Builder', score: 88, date: '2024-01-15', duration: '18 min' },
        { name: 'Pattern Recognition', score: 94, date: '2024-01-14', duration: '22 min' }
      ]
    },
    {
      id: 'child2',
      name: 'Lucas Martin',
      code: 'LM2024',
      class: '4ème B',
      establishment: 'École Jean Moulin',
      performance: {
        gamesPlayed: 14,
        averageScore: 76,
        completionRate: 82,
        totalTimeSpent: 9.2,
        rank: 8,
        totalStudents: 23
      },
      progress: {
        concepts: [
          { name: 'Séquences', progress: 88, level: 'Très bon' },
          { name: 'Boucles', progress: 72, level: 'Bon' },
          { name: 'Conditions', progress: 58, level: 'En cours' },
          { name: 'Variables', progress: 34, level: 'Débutant' }
        ]
      },
      strengths: ['Persévérance', 'Méthode'],
      weaknesses: ['Concentration', 'Concepts avancés'],
      recommendations: [
        'Faire des sessions plus courtes mais régulières',
        'Revoir les bases avant d\'aborder de nouveaux concepts',
        'Encourager et valoriser chaque progrès'
      ],
      recentGames: [
        { name: 'Simple Sequences', score: 84, date: '2024-01-16', duration: '35 min' },
        { name: 'Basic Loops', score: 71, date: '2024-01-13', duration: '28 min' },
        { name: 'Color Patterns', score: 79, date: '2024-01-12', duration: '31 min' }
      ]
    }
  ];

  const currentChild = children.find(child => child.id === selectedChild)!;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Parent</h1>
          <p className="text-muted-foreground">Suivi de la progression de vos enfants</p>
        </div>
      </div>

      {/* Child Selection */}
      <div className="flex gap-2">
        {children.map((child) => (
          <Button
            key={child.id}
            variant={selectedChild === child.id ? "default" : "outline"}
            onClick={() => setSelectedChild(child.id)}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            {child.name}
          </Button>
        ))}
      </div>

      {/* Child Info Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet to-bleu rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentChild.name}</h2>
                <p className="text-muted-foreground">{currentChild.class} - {currentChild.establishment}</p>
                <p className="text-sm text-muted-foreground">Code: {currentChild.code}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Classement: {currentChild.performance.rank}/{currentChild.performance.totalStudents}</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Score moyen: {currentChild.performance.averageScore}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jeux joués</p>
                <p className="text-2xl font-bold">{currentChild.performance.gamesPlayed}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
                <p className="text-2xl font-bold">{currentChild.performance.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps total</p>
                <p className="text-2xl font-bold">{currentChild.performance.totalTimeSpent}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Classement</p>
                <p className="text-2xl font-bold">{currentChild.performance.rank}e</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="strengths">Forces & Faiblesses</TabsTrigger>
          <TabsTrigger value="recommendations">Conseils</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progression par concept</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentChild.progress.concepts.map((concept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{concept.name}</span>
                    <Badge variant={
                      concept.level === 'Excellent' ? 'default' :
                      concept.level === 'Très bon' || concept.level === 'Bon' ? 'secondary' :
                      concept.level === 'En cours' ? 'outline' : 'destructive'
                    }>
                      {concept.level}
                    </Badge>
                  </div>
                  <Progress value={concept.progress} className="h-2" />
                  <p className="text-right text-sm text-muted-foreground">{concept.progress}%</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Points forts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentChild.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">À améliorer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentChild.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Conseils personnalisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentChild.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jeux récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentChild.recentGames.map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{game.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(game.date).toLocaleDateString('fr-FR')} • {game.duration}
                      </p>
                    </div>
                    <Badge variant={game.score >= 85 ? "default" : game.score >= 70 ? "secondary" : "outline"}>
                      {game.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;
