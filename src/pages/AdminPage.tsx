import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Tipe data untuk pengguna yang diambil dari API admin
interface FetchedUser {
    _id: string;
    email: string;
    points: number;
    createdAt: string;
}

const AdminPage: React.FC = () => {
    const { authData } = useAuth();
    const [users, setUsers] = useState<FetchedUser[]>([]);
    const [pointsToAdd, setPointsToAdd] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});

    const fetchUsers = useCallback(async () => {
        if (!authData.token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal memuat daftar pengguna.');
            }
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
        } finally {
            setLoading(false);
        }
    }, [authData.token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handlePointsInputChange = (userId: string, value: string) => {
        setPointsToAdd(prev => ({ ...prev, [userId]: value }));
    };

    const handleAddPoints = async (userEmail: string, userId: string) => {
        if (!authData.token) return;
        const points = Number(pointsToAdd[userId]);
        if (isNaN(points) || points <= 0) {
            setMessages(prev => ({ ...prev, [userId]: { type: 'error', text: 'Poin harus angka positif.' } }));
            return;
        }

        try {
            const response = await fetch('/api/admin/add-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ email: userEmail, points }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambahkan poin.');
            }
            setMessages(prev => ({ ...prev, [userId]: { type: 'success', text: result.message } }));
            setPointsToAdd(prev => ({...prev, [userId]: ''})); // Clear input on success
            // Set timeout untuk membersihkan pesan sukses setelah beberapa detik
            setTimeout(() => {
                 setMessages(prev => {
                    const newMessages = { ...prev };
                    delete newMessages[userId];
                    return newMessages;
                });
            }, 5000);
            await fetchUsers(); // Refresh user list to show updated points
        } catch (err) {
            setMessages(prev => ({ ...prev, [userId]: { type: 'error', text: err instanceof Error ? err.message : 'Terjadi kesalahan' } }));
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }

    const inputClass = "p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100 w-24 text-center";
    const buttonClass = "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-md shadow-sm transition-all text-sm disabled:opacity-50";

    return (
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Admin Panel - Manajemen Pengguna</h2>
                <button onClick={fetchUsers} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all text-sm">
                    Refresh Data
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-slate-300">
                    <thead className="bg-slate-900/50 text-xs text-sky-300 uppercase">
                        <tr>
                            <th className="p-3">Email Pengguna</th>
                            <th className="p-3 text-center">Poin Saat Ini</th>
                            <th className="p-3 text-center">Tanggal Registrasi</th>
                            <th className="p-3">Tambah Poin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map(user => (
                            <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="p-3 font-medium text-white">{user.email}</td>
                                <td className="p-3 text-center font-bold text-emerald-400 text-lg">{user.points}</td>
                                <td className="p-3 text-center text-sm">{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={pointsToAdd[user._id] || ''}
                                            onChange={(e) => handlePointsInputChange(user._id, e.target.value)}
                                            className={inputClass}
                                            placeholder="Jumlah"
                                            min="1"
                                        />
                                        <button onClick={() => handleAddPoints(user.email, user._id)} className={buttonClass}>
                                            Tambah
                                        </button>
                                    </div>
                                    {messages[user._id] && (
                                        <p className={`text-xs mt-1 ${messages[user._id].type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                            {messages[user._id].text}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center p-6 text-slate-400">
                                    Tidak ada pengguna yang terdaftar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
