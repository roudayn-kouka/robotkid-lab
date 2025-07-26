import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Play, Users, BarChart3, Gamepad2, Brain, Star, Target, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const LandingPage = () => {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const fadeInLeft = {
    hidden: {
      opacity: 0,
      x: -30
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const zoomIn = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  const staggerContainer = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const features = [{
    icon: <Gamepad2 className="h-8 w-8 text-violet" />,
    title: "Jeux Éducatifs",
    description: "Créez et jouez à des jeux de circuit interactifs pour développer la logique et la résolution de problèmes."
  }, {
    icon: <Brain className="h-8 w-8 text-bleu" />,
    title: "Apprentissage Adaptatif",
    description: "Des contenus pédagogiques personnalisés qui s'adaptent au rythme de chaque enfant."
  }, {
    icon: <BarChart3 className="h-8 w-8 text-orange" />,
    title: "Suivi des Progrès",
    description: "Tableaux de bord détaillés pour suivre l'évolution et les performances des élèves."
  }, {
    icon: <Users className="h-8 w-8 text-rouge" />,
    title: "Gestion de Classes",
    description: "Outils complets pour les enseignants et parents pour organiser et superviser l'apprentissage."
  }];
  const benefits = [{
    icon: <Target className="h-6 w-6 text-violet" />,
    title: "Objectifs Pédagogiques Clairs",
    description: "Chaque activité est conçue avec des objectifs d'apprentissage précis"
  }, {
    icon: <Zap className="h-6 w-6 text-orange" />,
    title: "Engagement Maximal",
    description: "Les enfants apprennent en s'amusant grâce à la gamification"
  }, {
    icon: <Shield className="h-6 w-6 text-bleu" />,
    title: "Environnement Sécurisé",
    description: "Plateforme sûre et adaptée aux enfants de 4 ans et plus"
  }];
  const testimonials = [{
    name: "Marie Dubois",
    role: "Enseignante CE2",
    content: "RobotKid Lab a transformé ma façon d'enseigner. Les enfants sont plus engagés et apprennent en s'amusant !",
    rating: 5
  }, {
    name: "Pierre Martin",
    role: "Parent",
    content: "Mon fils adore les jeux de circuit. Je peux suivre ses progrès facilement depuis mon tableau de bord.",
    rating: 5
  }, {
    name: "Sophie Laurent",
    role: "Directrice d'école",
    content: "Une plateforme complète qui répond à tous nos besoins pédagogiques. Excellent support technique !",
    rating: 5
  }];
  return <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5
          }} className="flex items-center space-x-3">
              <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-10 w-10" />
              <span className="text-2xl font-bold text-violet">RoboKid Lab</span>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-violet transition-colors duration-300 hover:scale-105">
                Fonctionnalités
              </button>
              <button onClick={() => scrollToSection('benefits')} className="text-gray-600 hover:text-violet transition-colors duration-300 hover:scale-105">
                Avantages
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-violet transition-colors duration-300 hover:scale-105">
                Témoignages
              </button>
              <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                <Button onClick={() => navigate('/auth')} className="bg-violet hover:bg-violet/90 transition-all duration-300">
                  Se Connecter
                </Button>
              </motion.div>
            </nav>

            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button onClick={() => navigate('/auth')} className="md:hidden bg-violet hover:bg-violet/90">
                Se Connecter
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet/10 via-bleu/10 to-orange/10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                L'Apprentissage
                <span className="block text-violet">par le Jeu</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600 leading-relaxed">Découvrez RoboKid Lab, la plateforme éducative qui transforme l'apprentissage en aventure passionnante grâce aux jeux de circuit interactifs pour les enfants à partir de 4 ans.</motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{
                scale: 1.05,
                y: -2
              }} whileTap={{
                scale: 0.98
              }}>
                  <Button size="lg" onClick={() => navigate('/auth')} className="bg-violet hover:bg-violet/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Play className="mr-2 h-5 w-5" />
                    Commencer Maintenant
                  </Button>
                </motion.div>
                <motion.div whileHover={{
                scale: 1.05,
                y: -2
              }} whileTap={{
                scale: 0.98
              }}>
                  <Button size="lg" variant="outline" className="border-violet text-violet hover:bg-violet hover:text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                    Découvrir la Plateforme
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="relative">
              <img src="/lovable-uploads/b9c7e286-56d6-44fe-8adc-98a77b98a2b9.png" alt="Enfants utilisant RobotKid Lab" className="rounded-2xl shadow-2xl w-full hover:shadow-3xl transition-shadow duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir RobotKid Lab ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète conçue pour révolutionner l'apprentissage des enfants
            </p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <motion.div key={index} variants={zoomIn} whileHover={{
            scale: 1.05,
            y: -10,
            transition: {
              duration: 0.3
            }
          }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="text-center pb-4">
                    <motion.div whileHover={{
                  rotate: 360
                }} transition={{
                  duration: 0.6
                }} className="w-16 h-16 bg-gradient-to-r from-violet/10 to-bleu/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </motion.div>
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
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.8
          }}>
              <img src="/lovable-uploads/7a127ee6-c9ea-49c0-8ca3-1c5c25640131.png" alt="Interface RobotKid Lab" className="rounded-2xl shadow-xl w-full hover:shadow-2xl transition-shadow duration-500" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={staggerContainer} className="space-y-8">
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900">
                Des Avantages Concrets pour l'Apprentissage
              </motion.h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => <motion.div key={index} variants={fadeInLeft} whileHover={{
                x: 10,
                transition: {
                  duration: 0.3
                }
              }} className="flex items-start space-x-4">
                    <motion.div whileHover={{
                  scale: 1.1,
                  rotate: 5
                }} className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>)}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ce que Disent nos Utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos enseignants, parents et élèves
            </p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <motion.div key={index} variants={zoomIn} whileHover={{
            y: -10,
            transition: {
              duration: 0.3
            }
          }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {Array.from({
                    length: testimonial.rating
                  }).map((_, i) => <motion.div key={i} initial={{
                    opacity: 0,
                    scale: 0
                  }} whileInView={{
                    opacity: 1,
                    scale: 1
                  }} viewport={{
                    once: true
                  }} transition={{
                    delay: i * 0.1
                  }}>
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>)}
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
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.8
    }} className="py-20 px-4 bg-gradient-to-r from-violet to-bleu">
        <div className="container mx-auto text-center">
          <motion.h2 initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à Révolutionner l'Apprentissage ?
          </motion.h2>
          <motion.p initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Rejoignez des milliers d'enseignants et de parents qui font confiance à RoboKid Lab</motion.p>
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} whileHover={{
          scale: 1.05,
          y: -5
        }} whileTap={{
          scale: 0.98
        }}>
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-violet hover:bg-white/90 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300">
              Commencer Gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-white py-12 px-4 bg-cyan-50">
        <div className="container mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="/lovable-uploads/978af6a0-f975-4397-b2b1-1dffd0019eda.png" alt="RobotKid Lab" className="h-8 w-8" />
              <span className="text-2xl font-bold text-slate-900">RobotKid Lab</span>
            </div>
            <p className="mb-4 text-gray-700">
              L'apprentissage par le jeu pour une éducation moderne et efficace
            </p>
            <p className="text-sm text-gray-700">
              © 2024 RobotKid Lab. Tous droits réservés.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;