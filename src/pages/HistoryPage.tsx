import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { initDB, getAllRpps, deleteRppById, RppHistoryItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<RppHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        try {
            await initDB();
            const rpps = await getAllRpps();
            setHistory(rpps);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal memuat riwayat.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus riwayat Modul Ajar ini? Tindakan ini tidak dapat dibatalkan.')) {
            try {
                await deleteRppById(id);
                setHistory(prev => prev.filter(item => item.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal menghapus item.');
            }
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                    Riwayat Modul Ajar
                </h1>
                <p className="text-slate-300 mt-2 text-lg">
                    Lihat kembali Modul Ajar yang pernah Anda buat. Data disimpan di perangkat Anda.
                </p>
            </div>
            
            <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 space-y-4">
                {history.length === 0 ? (
                    <div className="text-center text-slate-400 py-10">
                        <p className="text-xl">Riwayat Anda masih kosong.</p>
                        <p>Setiap Modul Ajar yang Anda buat akan muncul di sini.</p>
                    </div>
                ) : (
                    history.map(item => (
                        <div key={item.id} className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between shadow-md hover:bg-slate-700 transition-colors">
                            <div>
                                <p className="font-semibold text-sky-300 text-lg">{item.mataPelajaran}</p>
                                <p className="text-white text-md font-light">{item.materi}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Dibuat pada: {new Date(item.createdAt).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link to={`/app/history/${item.id}`} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
                                    Lihat
                                </Link>
                                <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryPage;