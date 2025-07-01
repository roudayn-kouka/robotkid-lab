
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, List, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Navigation = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/create-game', label: 'Create Game', icon: Plus },
    { path: '/games', label: 'Game Library', icon: List },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

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
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/admin" className="text-xl font-bold text-primary flex items-center space-x-2">
              <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-8 w-8" />
              <span>RobotKid Lab Admin</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
              <Settings className="h-5 w-5" />
            </button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
