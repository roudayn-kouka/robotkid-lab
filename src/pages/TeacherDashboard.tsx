
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Target, Clock, Award, AlertCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState<string>('6A');

  // Mock data
  const classes = [
    { id: '6A', name: '6ème A', studentCount: 25, averageScore: 78 },
    { id: '6B', name: '6ème B', studentCount: 23, averageScore: 82 },
    { id: '5A', name: '5ème A', studentCount: 27, averageScore: 75 }
  ];

  const students = [
    {
      id: '1',
      name: 'Marie Dupont',
      code: 'MD2024',
      gamesPlayed: 12,
      averageScore: 85,
      completionRate: 92,
      strengths: ['Logique', 'Séquences'],
      weaknesses: ['Boucles'],
      lastActivity: '2024-01-15'
    },
    {
      id: '2',
      name: 'Pierre Martin',
      code: 'PM2024',
      gamesPlayed: 8,
      averageScore: 72,
      completionRate: 78,
      strengths: ['Créativité'],
      weaknesses: ['Conditions', 'Variables'],
      lastActivity: '2024-01-14'
    },
    {
      id: '3',
      name: 'Sophie Bernard',
      code: 'SB2024',
      gamesPlayed: 15,
      averageScore: 88,
      completionRate: 95,
      strengths: ['Algorithmique', 'Résolution de problèmes'],
      weaknesses: ['Optimisation'],
      lastActivity: '2024-01-16'
    }
  ];

  const classStats = {
    totalStudents: 25,
    activeStudents: 22,
    averageScore: 78,
    averageCompletionRate: 85,
    totalGamesPlayed: 287
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Enseignant</h1>
          <p className="text-muted-foreground">École Primaire Jean Moulin - Lyon</p>
        </div>
      </div>

      {/* Class Selection */}
      <div className="flex gap-2">
        {classes.map((cls) => (
          <Button
            key={cls.id}
            variant={selectedClass === cls.id ? "default" : "outline"}
            onClick={() => setSelectedClass(cls.id)}
          >
            {cls.name} ({cls.studentCount})
          </Button>
        ))}
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Élèves total</p>
                <p className="text-2xl font-bold">{classStats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Élèves actifs</p>
                <p className="text-2xl font-bold">{classStats.activeStudents}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold">{classStats.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
                <p className="text-2xl font-bold">{classStats.averageCompletionRate}%</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jeux joués</p>
                <p className="text-2xl font-bold">{classStats.totalGamesPlayed}</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Statistiques par élève</TabsTrigger>
          <TabsTrigger value="performance">Analyse de performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques individuelles - {selectedClass}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Jeux joués</TableHead>
                    <TableHead>Score moyen</TableHead>
                    <TableHead>Taux de réussite</TableHead>
                    <TableHead>Points forts</TableHead>
                    <TableHead>Points faibles</TableHead>
                    <TableHead>Dernière activité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.code}</TableCell>
                      <TableCell>{student.gamesPlayed}</TableCell>
                      <TableCell>
                        <Badge variant={student.averageScore >= 80 ? "default" : student.averageScore >= 60 ? "secondary" : "destructive"}>
                          {student.averageScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>{student.completionRate}%</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.strengths.map((strength, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.weaknesses.map((weakness, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {weakness}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(student.lastActivity).toLocaleDateString('fr-FR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des performances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Excellent (80-100%)</span>
                    <Badge className="bg-green-100 text-green-800">8 élèves</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bon (60-79%)</span>
                    <Badge className="bg-blue-100 text-blue-800">12 élèves</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>À améliorer (&lt; 60%)</span>
                    <Badge className="bg-orange-100 text-orange-800">5 élèves</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compétences les plus difficiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Boucles conditionnelles</span>
                    <Badge variant="destructive">68% d'échec</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Variables complexes</span>
                    <Badge variant="destructive">45% d'échec</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Optimisation</span>
                    <Badge className="bg-orange-100 text-orange-800">35% d'échec</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recommandations pédagogiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Pour la classe {selectedClass}</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Organiser des séances de révision sur les boucles conditionnelles</li>
                  <li>• Proposer des exercices supplémentaires pour les élèves en difficulté</li>
                  <li>• Créer des groupes de travail mixant élèves forts et faibles</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Points positifs</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Excellente participation générale (88% des élèves actifs)</li>
                  <li>• Bonne maîtrise des concepts de base</li>
                  <li>• Progression constante sur les 3 dernières semaines</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
