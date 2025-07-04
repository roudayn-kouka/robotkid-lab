
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Users, BarChart3, Plus, Search, GraduationCap, Trophy } from 'lucide-react';
import DashboardHeader from '@/components/shared/DashboardHeader';

const TeacherDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - à remplacer par de vraies données
  const classes = [
    { id: '1', name: 'CE1 A', students: 24, code: 'CLS-ABC123' },
    { id: '2', name: 'CE2 B', students: 22, code: 'CLS-DEF456' },
  ];

  const recentActivities = [
    { student: 'Emma Martin', game: 'Circuit Logique 1', score: 85, date: '2024-01-15' },
    { student: 'Lucas Dubois', game: 'Parcours Robot', score: 92, date: '2024-01-15' },
    { student: 'Léa Petit', game: 'Circuit Logique 2', score: 78, date: '2024-01-14' },
  ];

  const stats = {
    totalStudents: 46,
    activeGames: 8,
    weeklyProgress: 94,
    averageScore: 82
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet/5 via-bleu/5 to-orange/5">
      <DashboardHeader 
        title="Tableau de bord Enseignant" 
        subtitle="Gérez vos classes et suivez les progrès de vos élèves"
        userType="teacher" 
      />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, Professeur !
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de l'activité de vos classes aujourd'hui.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-l-4 border-l-violet">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                  <p className="text-3xl font-bold text-violet">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-violet" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-bleu">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jeux Actifs</p>
                  <p className="text-3xl font-bold text-bleu">{stats.activeGames}</p>
                </div>
                <BookOpen className="h-8 w-8 text-bleu" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-orange">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progrès Semaine</p>
                  <p className="text-3xl font-bold text-orange">{stats.weeklyProgress}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-rouge">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score Moyen</p>
                  <p className="text-3xl font-bold text-rouge">{stats.averageScore}%</p>
                </div>
                <Trophy className="h-8 w-8 text-rouge" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Classes Management */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-violet" />
                <span>Mes Classes</span>
              </CardTitle>
              <Button size="sm" className="bg-violet hover:bg-violet/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Classe
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une classe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-3">
                  {classes.map((classe) => (
                    <div key={classe.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{classe.name}</h4>
                          <p className="text-sm text-gray-600">{classe.students} élèves</p>
                          <p className="text-xs text-gray-500">Code: {classe.code}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Voir Élèves
                          </Button>
                          <Button variant="outline" size="sm">
                            Stats
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-bleu" />
                <span>Activités Récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.student}</p>
                      <p className="text-sm text-gray-600">{activity.game}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
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
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-violet hover:bg-violet/90 h-12">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Assigner un Jeu
                </Button>
                <Button variant="outline" className="h-12">
                  <Users className="h-4 w-4 mr-2" />
                  Ajouter des Élèves
                </Button>
                <Button variant="outline" className="h-12">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Rapport Détaillé
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
