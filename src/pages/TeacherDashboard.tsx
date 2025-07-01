
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, BookOpen, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const TeacherDashboard = () => {
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
              <span className="font-bold text-xl text-violet">RobotKid Lab - Enseignant</span>
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
          <h1 className="text-4xl font-bold mb-4">Tableau de bord Enseignant</h1>
          <p className="text-xl">Gérez vos classes et suivez les progrès de vos élèves</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-violet" />
                <span>Mes Cours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Créez et gérez vos cours avec RobotKid Lab</p>
              <Button className="mt-4 bg-violet hover:bg-violet/90">
                Créer un cours
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-bleu" />
                <span>Mes Élèves</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Suivez les progrès de vos élèves</p>
              <Button className="mt-4 bg-bleu hover:bg-bleu/90">
                Voir les élèves
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange" />
                <span>Statistiques</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Analysez les performances de votre classe</p>
              <Button className="mt-4 bg-orange hover:bg-orange/90">
                Voir les stats
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
