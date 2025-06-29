
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'parent';
  establishmentId?: string;
  region?: string;
  city?: string;
  childrenCodes?: string[];
  createdAt: Date;
}

export interface Establishment {
  id: string;
  name: string;
  city: string;
  region: string;
  createdAt: Date;
}

export interface Class {
  id: string;
  name: string;
  establishmentId: string;
  classCode: string;
  createdAt: Date;
}

export interface Student {
  id: string;
  code: string;
  establishmentId: string;
  classId?: string;
  performance: StudentPerformance;
}

export interface StudentPerformance {
  gamesPlayed: number;
  averageScore: number;
  completionRate: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}
