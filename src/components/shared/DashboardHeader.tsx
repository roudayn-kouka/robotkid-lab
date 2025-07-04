
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userType?: 'admin' | 'teacher' | 'parent';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle = "Tableau de bord", 
  userType = 'admin' 
}) => {
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

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'admin': return 'Admin';
      case 'teacher': return 'Enseignant';
      case 'parent': return 'Parent';
      default: return 'Admin';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" 
              alt="RobotKid Lab" 
              className="h-8 w-8" 
            />
            <div>
              <span className="font-bold text-xl text-violet">
                RobotKid Lab - {getUserTypeLabel()}
              </span>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
