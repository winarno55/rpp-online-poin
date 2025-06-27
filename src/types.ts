import { FASE_KURIKULUM, SEMESTER_OPTIONS } from './constants';

export type Fase = typeof FASE_KURIKULUM[number];
export type Semester = typeof SEMESTER_OPTIONS[number];

export interface LessonPlanInput {
  mataPelajaran: string;
  fase: Fase;
  kelas: string;
  semester: Semester;
  materi: string;
  alokasiWaktu: string;
  tujuanPembelajaran: string;
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

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(true);
        }

        const request = indexedDB.open('RPP_HistoryDB', 1);

        request.onerror = () => {
            console.error('Database error:', request.error);
            reject('Error membuka database riwayat.');
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(true);
        };

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('rpp_history')) {
                const store = db.createObjectStore('rpp_history', { keyPath: 'id', autoIncrement: true });
                store.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
    });
};

export const addRppToHistory = (input: LessonPlanInput, generatedPlan: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['rpp_history'], 'readwrite');
        const store = transaction.objectStore('rpp_history');
        
        const newItem = {
            ...input,
            generatedPlan,
            createdAt: new Date(),
        };

        const request = store.add(newItem);

        request.onsuccess = () => {
            resolve(request.result as number);
        };

        request.onerror = () => {
            console.error('Error adding item:', request.error);
            reject('Gagal menambahkan item ke riwayat.');
        };
    });
};


export const getAllRpps = (): Promise<RppHistoryItem[]> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['rpp_history'], 'readonly');
        const store = transaction.objectStore('rpp_history');
        const index = store.index('createdAt');
        const request = index.getAll();

        request.onsuccess = () => {
            resolve(request.result.reverse()); // Newest first
        };

        request.onerror = () => {
            console.error('Error fetching all items:', request.error);
            reject('Gagal memuat riwayat.');
        };
    });
};


export const getRppById = (id: number): Promise<RppHistoryItem | undefined> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['rpp_history'], 'readonly');
        const store = transaction.objectStore('rpp_history');
        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Error fetching item by id:', request.error);
            reject('Gagal memuat RPP yang dipilih.');
        };
    });
};


export const deleteRppById = (id: number): Promise<void> => {
     return new Promise((resolve, reject) => {
        const transaction = db.transaction(['rpp_history'], 'readwrite');
        const store = transaction.objectStore('rpp_history');
        const request = store.delete(id);
        
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            console.error('Error deleting item:', request.error);
            reject('Gagal menghapus RPP yang dipilih.');
        };
    });
}
