export interface Report {
  id: string;
  imageUrl: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  neighborhood: string;
  severity: 'منخفضة' | 'متوسطة' | 'عالية' | 'حرجة';
  aiAnalysis: string;
  status: 'قيد المعالجة' | 'تم الحل' | 'مرفوض';
  createdAt: string;
  reporterName: string;
}

export interface NeighborhoodRank {
  id: string;
  name: string;
  resolvedCount: number;
  totalReports: number;
  points: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PlatformStats {
  totalReports: number;
  resolvedReports: number;
  activeNeighborhoods: number;
  tonsRemoved: number;
  responseRate: string;
}
