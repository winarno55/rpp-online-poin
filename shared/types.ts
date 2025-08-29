import { JUMLAH_PERTEMUAN_OPTIONS } from './constants.js';

export type JumlahPertemuan = typeof JUMLAH_PERTEMUAN_OPTIONS[number];

export interface LessonPlanTemplate {
  title: string;
  description: string;
  data: LessonPlanInput;
}

export interface LessonPlanInput {
  mataPelajaran: string;
  kelasFase: string;
  materi: string;
  jumlahPertemuan: JumlahPertemuan;
  jamPelajaran: string;
  pesertaDidik: string; 
  dimensiProfilLulusan: string[];
  capaianPembelajaran: string;
  lintasDisiplinIlmu: string; 
  tujuanPembelajaran: string;
  praktikPedagogis: string;
  lingkunganPembelajaran: string; 
  pemanfaatanDigital: string; 
  kemitraanPembelajaran: string; 
}

export interface User {
  id: string;
  email: string;
  points: number;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  authData: {
    token: string | null;
    user: User | null;
  };
  login: (token: string, user: User) => void;
  logout: () => void;
  updatePoints: (newPoints: number) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface RppHistoryItem extends LessonPlanInput {
    id: number;
    generatedPlan: string;
    createdAt: Date;
}