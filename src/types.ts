
export interface LessonPlanInput {
  mataPelajaran: string;
  fase: string;
  kelas: string;
  semester: string;
  materi: string;
  alokasiWaktu: string;
  tujuanPembelajaran: string;
}

export interface SectionContent {
  title: string;
  contentLines: string[];
  subSections?: SectionContent[];
}

// --- NEW TYPES FOR AUTH & USER MANAGEMENT ---

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
