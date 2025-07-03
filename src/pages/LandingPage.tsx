
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Play, Users, BarChart3, Gamepad2, Brain, Star } from 'lucide-react';
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
      icon: <Users className="h-8 w-8 text-violet" />,
      title: "Gestion de Classes",
      description: "Outils complets pour les enseignants et parents pour organiser et superviser l'apprentissage."
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Enseignante CE2",
      content: "RoboKidz a transformé ma façon d'enseigner. Les enfants sont plus engagés et apprennent en s'amusant !",
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
    <div className="min-h-screen bg-gradient-to-br from-violet via-bleu to-orange">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet to-bleu rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet to-bleu bg-clip-text text-transparent">
                RoboKidz
              </span>
            </div>
            
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-violet to-bleu hover:from-violet/90 hover:to-bleu/90"
            >
              Se Connecter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              L'Apprentissage
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                par le Jeu
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez RoboKidz, la plateforme éducative qui transforme l'apprentissage en aventure passionnante 
              grâce aux jeux de circuit interactifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-white text-bleu hover:bg-white/90 text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Commencer Maintenant
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-bleu text-lg px-8 py-4"
              >
                Découvrir les Fonctionnalités
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pourquoi Choisir RoboKidz ?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Une plateforme complète conçue pour révolutionner l'apprentissage des enfants
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
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

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ce que Disent nos Utilisateurs
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Découvrez les témoignages de nos enseignants, parents et élèves
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
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
      <section className="py-20 px-4 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à Commencer l'Aventure ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez des milliers d'enseignants et de parents qui font confiance à RoboKidz 
              pour l'éducation de leurs enfants.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white text-xl px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              Créer un Compte Gratuit
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet to-bleu rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">RoboKidz</span>
            </div>
            <p className="text-gray-400 mb-4">
              L'apprentissage par le jeu pour une éducation moderne et efficace
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 RoboKidz. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
