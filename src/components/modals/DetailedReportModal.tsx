
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, TrendingUp, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DetailedReportModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const reportData = {
    totalStudents: 46,
    activeStudents: 42,
    averageScore: 82,
    completionRate: 78,
    weeklyProgress: 94,
    topPerformers: [
      { name: 'Emma Martin', score: 95, games: 12 },
      { name: 'Lucas Dubois', score: 92, games: 10 },
      { name: 'Léa Petit', score: 89, games: 11 },
    ],
    strugglingStudents: [
      { name: 'Hugo Bernard', score: 45, games: 8 },
      { name: 'Sarah Moreau', score: 52, games: 6 },
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12">
          <BarChart3 className="h-4 w-4 mr-2" />
          Rapport Détaillé
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Rapport Détaillé des Performances</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-violet" />
                  <div>
                    <p className="text-sm text-gray-600">Élèves Actifs</p>
                    <p className="text-xl font-bold">{reportData.activeStudents}/{reportData.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Score Moyen</p>
                    <p className="text-xl font-bold">{reportData.averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Taux Completion</p>
                    <p className="text-xl font-bold">{reportData.completionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Progrès Semaine</p>
                    <p className="text-xl font-bold">{reportData.weeklyProgress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meilleurs Élèves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.topPerformers.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.games} jeux complétés</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{student.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Struggling Students */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Élèves en Difficulté</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.strugglingStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.games} jeux tentés</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{student.score}%</p>
                      <p className="text-xs text-gray-500">Nécessite un soutien</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedReportModal;
