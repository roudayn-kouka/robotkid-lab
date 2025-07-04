
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Play, Users, BarChart3, Gamepad2, Brain, Star, Target, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8 text-violet" />,
      title: "Jeux Éducatifs",
      description: "Créez et jouez à des jeux de circuit interactifs pour développer la logique et la résolution de problèmes."
    },
    {
      icon: <Brain className="h-8 w-8 text-bleu" />,
      title: "Apprentissage Adaptatif",
      description: "Des contenus pédagogiques personnalisés qui s'adaptent au rythme de chaque enfant."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange" />,
      title: "Suivi des Progrès",
      description: "Tableaux de bord détaillés pour suivre l'évolution et les performances des élèves."
    },
    {
      icon: <Users className="h-8 w-8 text-rouge" />,
      title: "Gestion de Classes",
      description: "Outils complets pour les enseignants et parents pour organiser et superviser l'apprentissage."
    }
  ];

  const benefits = [
    {
      icon: <Target className="h-6 w-6 text-violet" />,
      title: "Objectifs Pédagogiques Clairs",
      description: "Chaque activité est conçue avec des objectifs d'apprentissage précis"
    },
    {
      icon: <Zap className="h-6 w-6 text-orange" />,
      title: "Engagement Maximal",
      description: "Les enfants apprennent en s'amusant grâce à la gamification"
    },
    {
      icon: <Shield className="h-6 w-6 text-bleu" />,
      title: "Environnement Sécurisé",
      description: "Plateforme sûre et adaptée aux enfants de 4 ans et plus"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Enseignante CE2",
      content: "RobotKid Lab a transformé ma façon d'enseigner. Les enfants sont plus engagés et apprennent en s'amusant !",
      rating: 5
    },
    {
      name: "Pierre Martin",
      role: "Parent",
      content: "Mon fils adore les jeux de circuit. Je peux suivre ses progrès facilement depuis mon tableau de bord.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Directrice d'école",
      content: "Une plateforme complète qui répond à tous nos besoins pédagogiques. Excellent support technique !",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-10 w-10" />
              <span className="text-2xl font-bold text-violet">RobotKid Lab</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-violet transition-colors">Fonctionnalités</a>
              <a href="#benefits" className="text-gray-600 hover:text-violet transition-colors">Avantages</a>
              <a href="#testimonials" className="text-gray-600 hover:text-violet transition-colors">Témoignages</a>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-violet hover:bg-violet/90"
              >
                Se Connecter
              </Button>
            </nav>

            <Button 
              onClick={() => navigate('/auth')}
              className="md:hidden bg-violet hover:bg-violet/90"
            >
              Se Connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet/10 via-bleu/10 to-orange/10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                L'Apprentissage
                <span className="block text-violet">par le Jeu</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Découvrez RobotKid Lab, la plateforme éducative qui transforme l'apprentissage en aventure passionnante 
                grâce aux jeux de circuit interactifs pour les enfants à partir de 4 ans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="bg-violet hover:bg-violet/90 text-lg px-8 py-4"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Commencer Maintenant
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-violet text-violet hover:bg-violet hover:text-white text-lg px-8 py-4"
                >
                  Découvrir la Plateforme
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/b9c7e286-56d6-44fe-8adc-98a77b98a2b9.png" 
                alt="Enfants utilisant RobotKid Lab"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir RobotKid Lab ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète conçue pour révolutionner l'apprentissage des enfants
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-violet/10 to-bleu/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/7a127ee6-c9ea-49c0-8ca3-1c5c25640131.png" 
                alt="Interface RobotKid Lab"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Des Avantages Concrets pour l'Apprentissage
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ce que Disent nos Utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos enseignants, parents et élèves
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 text-lg italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-violet to-bleu">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à Révolutionner l'Apprentissage ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'enseignants et de parents qui font confiance à RobotKid Lab
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white text-violet hover:bg-white/90 text-lg px-8 py-4"
          >
            Commencer Gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-8 w-8" />
              <span className="text-2xl font-bold">RobotKid Lab</span>
            </div>
            <p className="text-gray-400 mb-4">
              L'apprentissage par le jeu pour une éducation moderne et efficace
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 RobotKid Lab. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
