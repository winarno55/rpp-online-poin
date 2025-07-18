import { JUMLAH_PERTEMUAN_OPTIONS } from './constants';

// Note: Fase and Semester types are no longer needed with the new form structure.
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
  pesertaDidik: string; // opsional
  dimensiProfilLulusan: string[];
  capaianPembelajaran: string; // opsional
  lintasDisiplinIlmu: string; // opsional
  tujuanPembelajaran: string;
  praktikPedagogis: string;
  lingkunganPembelajaran: string; // opsional
  pemanfaatanDigital: string; // opsional
  kemitraanPembelajaran: string; // opsional
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
        // Use a cursor in descending order to get newest items first directly
        const request = index.openCursor(null, 'prev');
        
        const items: RppHistoryItem[] = [];

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                // The value is the stored object.
                const item = cursor.value;
                // The primary key ('id') is available on the cursor.
                // We assign it to the object to ensure it's always present,
                // fixing issues where it might be missing from the value.
                item.id = cursor.primaryKey as number; 
                items.push(item);
                cursor.continue();
            } else {
                // Cursor is done, all items have been collected.
                resolve(items);
            }
        };

        request.onerror = () => {
            console.error('Error fetching all items with cursor:', request.error);
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