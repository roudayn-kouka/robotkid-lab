
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Phone, MapPin, Instagram, LogOut, Menu, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const LandingPage = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rediriger l'utilisateur connecté vers son dashboard
  useEffect(() => {
    if (user && profile) {
      switch (profile.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'parent':
          navigate('/parent');
          break;
      }
    }
  }, [user, profile, navigate]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setMobileMenuOpen(false);
  };

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-10 w-10" />
              <span className="font-bold text-xl text-violet">RobotKid Lab</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('accueil')} className="text-gray-700 hover:text-violet transition-colors">
                Accueil
              </button>
              <button onClick={() => scrollToSection('apropos')} className="text-gray-700 hover:text-violet transition-colors">
                À propos
              </button>
              <button onClick={() => scrollToSection('connexion')} className="text-gray-700 hover:text-violet transition-colors">
                Se connecter
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-violet transition-colors">
                Contact
              </button>
              {user && (
                <Button onClick={handleSignOut} variant="outline" size="sm" className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {user && (
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-violet"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button onClick={() => scrollToSection('accueil')} className="block px-3 py-2 text-gray-700 hover:text-violet w-full text-left">
                  Accueil
                </button>
                <button onClick={() => scrollToSection('apropos')} className="block px-3 py-2 text-gray-700 hover:text-violet w-full text-left">
                  À propos
                </button>
                <button onClick={() => scrollToSection('connexion')} className="block px-3 py-2 text-gray-700 hover:text-violet w-full text-left">
                  Se connecter
                </button>
                <button onClick={() => scrollToSection('contact')} className="block px-3 py-2 text-gray-700 hover:text-violet w-full text-left">
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Section Accueil */}
      <section id="accueil" className="min-h-screen bg-gradient-to-br from-violet via-bleu to-orange flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="mb-8">
            <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-24 w-24 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">RobotKid Lab</h1>
            <p className="text-xl md:text-2xl mb-8">Robot pédagogique pour les enfants dès 4 ans</p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Créez des jeux éducatifs avec des robots et découvrez l'apprentissage par le jeu
            </p>
            <Button
              onClick={() => scrollToSection('connexion')}
              className="bg-white text-violet hover:bg-gray-100 text-lg px-8 py-3"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section id="apropos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">À propos de RobotKid Lab</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RobotKid Lab est une plateforme innovante qui permet aux enfants d'apprendre 
              la programmation et la robotique de manière ludique et interactive.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/b9c7e286-56d6-44fe-8adc-98a77b98a2b9.png" 
                alt="Présentation RobotKid Lab" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Notre Mission</h3>
              <p className="text-gray-600 mb-6">
                Nous croyons que l'apprentissage de la technologie doit être accessible, 
                amusant et adapté à l'âge des enfants. Notre plateforme offre des outils 
                intuitifs pour créer des expériences d'apprentissage engageantes.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-violet rounded-full mr-3"></div>
                  Apprentissage par le jeu
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-bleu rounded-full mr-3"></div>
                  Interface adaptée aux enfants
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange rounded-full mr-3"></div>
                  Suivi des progrès
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Innovation Pédagogique</h3>
              <p className="text-gray-600 mb-6">
                Nos méthodes d'enseignement sont basées sur les dernières recherches 
                en pédagogie numérique et sont conçues pour stimuler la créativité 
                et la pensée logique des enfants.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="/lovable-uploads/7a127ee6-c9ea-49c0-8ca3-1c5c25640131.png" 
                alt="Innovation pédagogique" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Se connecter */}
      <section id="connexion" className="py-20 bg-gradient-to-br from-violet via-bleu to-orange">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white mb-12">
            <h2 className="text-4xl font-bold mb-6">Rejoignez RobotKid Lab</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Créez votre compte pour accéder à notre plateforme et commencer 
              à créer des expériences d'apprentissage extraordinaires
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-lg font-semibold"
            >
              Se connecter / S'inscrire
            </Button>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Contactez-nous</h2>
            <p className="text-xl text-gray-600">
              Une question ? N'hésitez pas à nous contacter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img 
                src="/lovable-uploads/2bb4c080-1581-4b0e-b63f-7f8417a46673.png" 
                alt="Présentation RobotKid Lab" 
                className="rounded-lg shadow-lg w-full mb-8"
              />
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet/10 to-bleu/10 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Informations</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-violet/20 p-2 rounded-full">
                      <User className="h-5 w-5 text-violet" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Catégorie</p>
                      <p className="text-gray-600">Enfants et éducation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-bleu/20 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-bleu" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Adresse</p>
                      <p className="text-gray-600">Rue Ibn Khaldoun, Manouba, Tunisia, 2010</p>
                      <p className="text-gray-600">Zone de service : Tunis, Tunisie</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange/20 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-orange" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Téléphone</p>
                      <p className="text-gray-600">+216 22 987 454</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-rouge/20 p-2 rounded-full">
                      <Instagram className="h-5 w-5 text-rouge" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Instagram</p>
                      <a 
                        href="https://www.instagram.com/sameh.zenned" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-violet hover:text-violet/80 underline"
                      >
                        @sameh.zenned
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange/10 to-jaune/10 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Notre Mission</h3>
                <p className="text-gray-600">
                  Robot pédagogique pour les enfants dès 4 ans. Nous rendons 
                  l'apprentissage de la technologie accessible et amusant pour 
                  tous les enfants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-8 w-8" />
            <span className="font-bold text-xl">RobotKid Lab</span>
          </div>
          <p className="text-gray-400">
            © 2024 RobotKid Lab. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
