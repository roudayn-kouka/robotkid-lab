
import React, { useState } from 'react';
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
  Shield,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/shared/DashboardHeader';
import EstablishmentManagementModal from '@/components/modals/EstablishmentManagementModal';
import GameManagementModal from '@/components/modals/GameManagementModal';
import { useSavedGames } from '@/hooks/useSavedGames';

const Index = () => {
  const navigate = useNavigate();
  const { games, loading: gamesLoading } = useSavedGames();

  // Game management modal state
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [gameModalMode, setGameModalMode] = useState<'edit' | 'delete' | 'view'>('view');

  // Mock data - à remplacer par de vraies données
  const stats = {
    totalGames: games?.length || 24,
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
    }
  ];

  const handleGameAction = (gameId: string, mode: 'edit' | 'delete' | 'view') => {
    setSelectedGameId(gameId);
    setGameModalMode(mode);
    setGameModalOpen(true);
  };

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Actions Rapides</h2>
            <EstablishmentManagementModal />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Games Management */}
        <div className="mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GamepadIcon className="h-5 w-5 text-violet" />
                <span>Gestion des Jeux</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gamesLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Chargement des jeux...</div>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {games?.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{game.name}</h4>
                        <p className="text-sm text-gray-600">{game.description || 'Pas de description'}</p>
                        <div className="flex space-x-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            game.is_published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {game.is_published ? 'Publié' : 'Brouillon'}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {game.max_moves} mouvements max
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGameAction(game.id, 'view')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGameAction(game.id, 'edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGameAction(game.id, 'delete')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!games || games.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      Aucun jeu créé pour le moment
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and System Status */}
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

      {/* Game Management Modal */}
      <GameManagementModal
        isOpen={gameModalOpen}
        onClose={() => setGameModalOpen(false)}
        gameId={selectedGameId}
        mode={gameModalMode}
      />
    </div>
  );
};

export default Index;
