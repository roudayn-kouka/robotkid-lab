
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Heart, BookOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const ParentDashboard = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet via-bleu to-orange">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-8 w-8" />
              <span className="font-bold text-xl text-violet">RobotKid Lab - Parent</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl font-bold mb-4">Tableau de bord Parent</h1>
          <p className="text-xl">Suivez les progrès de vos enfants avec RobotKid Lab</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-rouge" />
                <span>Mes Enfants</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Gérez les profils de vos enfants</p>
              <Button className="mt-4 bg-rouge hover:bg-rouge/90">
                Voir les profils
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-violet" />
                <span>Activités</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Découvrez les activités réalisées</p>
              <Button className="mt-4 bg-violet hover:bg-violet/90">
                Voir les activités
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-bleu" />
                <span>Progrès</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Suivez les progrès de vos enfants</p>
              <Button className="mt-4 bg-bleu hover:bg-bleu/90">
                Voir les progrès
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
