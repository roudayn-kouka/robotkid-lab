import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, BookOpen, BarChart3, Trophy, Clock, Target, TrendingUp, Star, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import DashboardHeader from '@/components/shared/DashboardHeader';
import { Badge } from '@/components/ui/badge';

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState('emma');

  // Mock data - à remplacer par de vraies données
  const children = [
    { 
      id: 'emma', 
      name: 'Emma', 
      age: 7, 
      level: 'CE1',
      progress: 78,
      totalGames: 12,
      completedGames: 9,
      averageScore: 85,
      strengths: ['Logique', 'Créativité', 'Persévérance'],
      weaknesses: ['Vitesse d\'exécution', 'Attention aux détails'],
      advice: [
        'Encouragez Emma à prendre son temps pour vérifier ses réponses',
        'Proposez des jeux de logique supplémentaires pour renforcer ses points forts',
        'Travaillez sur des exercices de concentration courte mais régulière'
      ]
    },
    { 
      id: 'lucas', 
      name: 'Lucas', 
      age: 5, 
      level: 'GS',
      progress: 45,
      totalGames: 8,
      completedGames: 4,
      averageScore: 72,
      strengths: ['Motivation', 'Curiosité'],
      weaknesses: ['Compréhension des consignes', 'Patience'],
      advice: [
        'Lisez les consignes ensemble avant de commencer',
        'Faites des pauses régulières pour maintenir sa concentration',
        'Célébrez chaque petit progrès pour maintenir sa motivation'
      ]
    }
  ];

  const currentChild = children.find(child => child.id === selectedChild) || children[0];

  const recentActivities = [
    { game: 'Circuit Logique 1', score: 92, date: '2024-01-15', duration: '12 min' },
    { game: 'Parcours Robot', score: 78, date: '2024-01-14', duration: '8 min' },
    { game: 'Défi Créatif', score: 85, date: '2024-01-13', duration: '15 min' },
  ];

  const achievements = [
    { title: 'Premier Circuit', description: 'Terminé son premier circuit', icon: Target, earned: true },
    { title: 'Série de 5', description: '5 jeux réussis consécutivement', icon: Star, earned: true },
    { title: 'Expert Logique', description: 'Score parfait en logique', icon: Trophy, earned: false },
  ];

  const recommendations = [
    {
      title: 'Circuit Avancé 1',
      description: 'Prêt pour le niveau suivant en logique',
      difficulty: 'Moyen',
      estimatedTime: '10-15 min'
    },
    {
      title: 'Jeu Collaboratif',
      description: 'Parfait pour jouer en famille',
      difficulty: 'Facile',
      estimatedTime: '5-10 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet/5 via-bleu/5 to-orange/5">
      <DashboardHeader 
        title="Tableau de bord Parent" 
        subtitle="Suivez les progrès de vos enfants avec RobotKid Lab"
        userType="parent" 
      />

      <main className="container mx-auto px-4 py-8">
        {/* Child Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tableau de bord Famille
          </h1>
          <div className="flex space-x-4">
            {children.map((child) => (
              <Button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                variant={selectedChild === child.id ? "default" : "outline"}
                className={selectedChild === child.id ? "bg-violet hover:bg-violet/90" : ""}
              >
                {child.name} ({child.age} ans)
              </Button>
            ))}
          </div>
        </div>

        {/* Child Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-l-4 border-l-violet">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progrès Global</p>
                  <p className="text-3xl font-bold text-violet">{currentChild.progress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-violet" />
              </div>
              <Progress value={currentChild.progress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-bleu">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jeux Terminés</p>
                  <p className="text-3xl font-bold text-bleu">
                    {currentChild.completedGames}/{currentChild.totalGames}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-bleu" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-orange">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Moyen</p>
                  <p className="text-3xl font-bold text-orange">{currentChild.averageScore}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-rouge">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Niveau</p>
                  <p className="text-3xl font-bold text-rouge">{currentChild.level}</p>
                </div>
                <Heart className="h-8 w-8 text-rouge" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Strengths and Weaknesses */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Points Forts et Axes d'Amélioration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Points Forts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentChild.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Axes d'Amélioration
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentChild.weaknesses.map((weakness, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Advice */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <span>Conseils Personnalisés</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentChild.advice.map((tip, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activities */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-bleu" />
                <span>Activités Récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.game}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{activity.date}</span>
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.score >= 80 
                          ? 'bg-green-100 text-green-800' 
                          : activity.score >= 60 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-orange" />
                <span>Réalisations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <achievement.icon className={`h-5 w-5 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        achievement.earned ? 'text-green-900' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div className="mt-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-violet" />
                <span>Recommandations pour {currentChild.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>Difficulté: {rec.difficulty}</span>
                        <span>Durée: {rec.estimatedTime}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Jouer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
