
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GamepadIcon, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  Library,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/shared/DashboardHeader';

const Index = () => {
  const navigate = useNavigate();

  // Mock data - à remplacer par de vraies données
  const stats = {
    totalGames: 24,
    totalUsers: 1247,
    activeToday: 89,
    completionRate: 94
  };

  const recentActivity = [
    { user: 'Marie Dubois', action: 'Créé un nouveau jeu', time: 'Il y a 2h' },
    { user: 'Pierre Martin', action: 'Terminé Circuit Logique 3', time: 'Il y a 3h' },
    { user: 'Sophie Laurent', action: 'Ajouté 12 élèves', time: 'Il y a 5h' },
  ];

  const quickActions = [
    {
      title: 'Créer un Jeu',
      description: 'Concevez un nouveau jeu éducatif',
      icon: Plus,
      color: 'violet',
      onClick: () => navigate('/create-game')
    },
    {
      title: 'Bibliothèque',
      description: 'Parcourez tous les jeux disponibles',
      icon: Library,
      color: 'bleu',
      onClick: () => navigate('/games')
    },
    {
      title: 'Analytics',
      description: 'Consultez les statistiques détaillées',
      icon: BarChart3,
      color: 'orange',
      onClick: () => navigate('/analytics')
    },
    {
      title: 'Gestion',
      description: 'Administrez les utilisateurs et contenus',
      icon: Settings,
      color: 'rouge',
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet/5 via-bleu/5 to-orange/5">
      <DashboardHeader 
        title="RobotKid Lab - Administration" 
        subtitle="Tableau de bord administrateur"
        userType="admin" 
      />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, Administrateur !
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de l'activité de votre plateforme RobotKid Lab.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-l-4 border-l-violet">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jeux</p>
                  <p className="text-3xl font-bold text-violet">{stats.totalGames}</p>
                </div>
                <GamepadIcon className="h-8 w-8 text-violet" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-bleu">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                  <p className="text-3xl font-bold text-bleu">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-bleu" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-orange">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs Aujourd'hui</p>
                  <p className="text-3xl font-bold text-orange">{stats.activeToday}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-l-4 border-l-rouge">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
                  <p className="text-3xl font-bold text-rouge">{stats.completionRate}%</p>
                </div>
                <Shield className="h-8 w-8 text-rouge" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={action.onClick}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-${action.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <action.icon className={`h-8 w-8 text-${action.color}`} />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center text-sm">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-bleu" />
                <span>Activité Récente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-bleu rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>État du Système</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base de données</span>
                  <span className="text-green-600 font-semibold">Opérationnelle</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stockage fichiers</span>  
                  <span className="text-green-600 font-semibold">Opérationnelle</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API External</span>
                  <span className="text-green-600 font-semibold">Opérationnelle</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Dernière sauvegarde</span>
                  <span className="text-gray-500 text-sm">Il y a 1h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
