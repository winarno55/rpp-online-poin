
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

// Tipe data untuk konfigurasi harga
interface PointPackage {
    _id?: string;
    points: number;
    price: number;
}
interface PaymentMethod {
    _id?: string;
    method: string;
    details: string;
}
interface SessionCost {
    _id?: string;
    sessions: number;
    cost: number;
}
interface PricingConfig {
    pointPackages: PointPackage[];
    paymentMethods: PaymentMethod[];
    sessionCosts: SessionCost[];
}

const AdminPage: React.FC = () => {
    const { authData } = useAuth();
    const [users, setUsers] = useState<FetchedUser[]>([]);
    
    // State untuk fitur Add Points (Top Up)
    const [pointsToAdd, setPointsToAdd] = useState<{ [key: string]: string }>({});
    
    // State untuk fitur Edit Points (Set Points)
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editPointValue, setEditPointValue] = useState<string>('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk pricing config
    const [pricingConfig, setPricingConfig] = useState<PricingConfig>({ pointPackages: [], paymentMethods: [], sessionCosts: [] });
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [configMessage, setConfigMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const maxSessions = 5;

    const fetchAllData = useCallback(async () => {
        if (!authData.token) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch users
            const usersResponse = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${authData.token}` },
            });
            const usersData = await usersResponse.json();
            if (!usersResponse.ok) throw new Error(usersData.message || 'Gagal memuat pengguna.');
            setUsers(usersData);

            // Fetch pricing config
            const configResponse = await fetch('/api/pricing/config'); // This is a public endpoint
            const configData: PricingConfig = await configResponse.json();
            if (!configResponse.ok) throw new Error((configData as any).message || 'Gagal memuat konfigurasi harga.');
            
            // Ensure sessionCosts has entries for 1 to maxSessions
            const sessionCostsMap = new Map(configData.sessionCosts.map(sc => [sc.sessions, sc]));
            const fullSessionCosts: SessionCost[] = [];
            for (let i = 1; i <= maxSessions; i++) {
                if (sessionCostsMap.has(i)) {
                    fullSessionCosts.push(sessionCostsMap.get(i)!);
                } else {
                    fullSessionCosts.push({ sessions: i, cost: i * 20 }); // Default cost
                }
            }
            configData.sessionCosts = fullSessionCosts;
            setPricingConfig(configData);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
        } finally {
            setLoading(false);
        }
    }, [authData.token]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handlePointsInputChange = (userId: string, value: string) => {
        setPointsToAdd(prev => ({ ...prev, [userId]: value }));
    };

    // --- HANDLERS UNTUK ADD POINTS (TOP UP) ---
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
            if (!response.ok) throw new Error(result.message || 'Gagal menambahkan poin.');
            setMessages(prev => ({ ...prev, [userId]: { type: 'success', text: result.message } }));
            setPointsToAdd(prev => ({...prev, [userId]: ''}));
            setTimeout(() => {
                 setMessages(prev => {
                    const newMessages = { ...prev };
                    delete newMessages[userId];
                    return newMessages;
                });
            }, 5000);
            await fetchAllData();
        } catch (err) {
            setMessages(prev => ({ ...prev, [userId]: { type: 'error', text: err instanceof Error ? err.message : 'Terjadi kesalahan' } }));
        }
    };

    // --- HANDLERS UNTUK EDIT POINTS (OVERWRITE/SET) ---
    const startEditing = (user: FetchedUser) => {
        setEditingUserId(user._id);
        setEditPointValue(user.points.toString());
    };

    const cancelEditing = () => {
        setEditingUserId(null);
        setEditPointValue('');
    };

    const saveEditedPoints = async (userId: string) => {
        if (!authData.token) return;
        const newPoints = Number(editPointValue);
        
        if (isNaN(newPoints) || newPoints < 0) {
            setMessages(prev => ({ ...prev, [userId]: { type: 'error', text: 'Poin harus angka 0 atau lebih.' } }));
            return;
        }

        try {
            const response = await fetch('/api/admin/update-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ userId, points: newPoints }),
            });
            
            const result = await response.json();
            
            if (!response.ok) throw new Error(result.message || 'Gagal mengupdate poin.');
            
            setMessages(prev => ({ ...prev, [userId]: { type: 'success', text: 'Poin berhasil diubah.' } }));
            setEditingUserId(null); // Keluar dari mode edit
            setTimeout(() => {
                 setMessages(prev => {
                    const newMessages = { ...prev };
                    delete newMessages[userId];
                    return newMessages;
                });
            }, 3000);
            
            await fetchAllData(); // Refresh data

        } catch (err) {
             setMessages(prev => ({ ...prev, [userId]: { type: 'error', text: err instanceof Error ? err.message : 'Terjadi kesalahan' } }));
        }
    };

    // --- HANDLERS UNTUK PRICING CONFIG ---
    const handleConfigChange = (type: 'pointPackages' | 'paymentMethods' | 'sessionCosts', index: number, field: string, value: string | number) => {
        const newConfig = { ...pricingConfig };
        (newConfig[type][index] as any)[field] = value;
        setPricingConfig(newConfig);
    };

    const addConfigItem = (type: 'pointPackages' | 'paymentMethods') => {
        const newConfig = { ...pricingConfig };
        if (type === 'pointPackages') {
            newConfig.pointPackages.push({ points: 0, price: 0 });
        } else {
            newConfig.paymentMethods.push({ method: '', details: '' });
        }
        setPricingConfig(newConfig);
    };
    
    const removeConfigItem = (type: 'pointPackages' | 'paymentMethods', index: number) => {
        const newConfig = { ...pricingConfig };
        newConfig[type].splice(index, 1);
        setPricingConfig(newConfig);
    };

    const handleSaveConfig = async () => {
        if(!authData.token) return;
        setIsSavingConfig(true);
        setConfigMessage(null);
        try {
            const response = await fetch('/api/admin/pricing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify(pricingConfig)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal menyimpan konfigurasi.');
            setConfigMessage({ type: 'success', text: 'Konfigurasi berhasil disimpan!'});
            setPricingConfig(result); // Update state with saved data (including new _ids)
        } catch (err) {
            setConfigMessage({ type: 'error', text: err instanceof Error ? err.message : 'Terjadi kesalahan' });
        } finally {
            setIsSavingConfig(false);
            setTimeout(() => setConfigMessage(null), 5000);
        }
    }


    if (loading) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    if (error) return <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;

    const inputClass = "p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100";
    const buttonClass = "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-md shadow-sm transition-all text-sm disabled:opacity-50";

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            {/* User Management Section */}
            <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Manajemen Pengguna</h2>
                    <button onClick={fetchAllData} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-all text-sm">
                        Refresh Data
                    </button>
                </div>

                <div className="mb-6">
                    <label htmlFor="search-user" className="block text-sm font-medium text-sky-300 mb-2">Cari Pengguna</label>
                    <input
                        type="text"
                        id="search-user"
                        placeholder="Cari berdasarkan email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100"
                    />
                    <p className="text-xs text-slate-400 mt-2">Klik ikon pensil di kolom Poin untuk mengoreksi (overwrite) jumlah poin jika salah input.</p>
                </div>

                <div className="overflow-x-auto">
                     <table className="w-full text-left text-slate-300">
                        <thead className="bg-slate-900/50 text-xs text-sky-300 uppercase">
                            <tr>
                                <th className="p-3">Email</th>
                                <th className="p-3 text-center">Poin (Total)</th>
                                <th className="p-3 text-center">Tgl. Daftar</th>
                                <th className="p-3">Tambah (Top Up)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-3 font-medium text-white">{user.email}</td>
                                    <td className="p-3 text-center">
                                        {editingUserId === user._id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <input 
                                                    type="number" 
                                                    value={editPointValue} 
                                                    onChange={(e) => setEditPointValue(e.target.value)}
                                                    className="w-20 p-1 bg-slate-600 border border-sky-500 rounded text-center text-white"
                                                    min="0"
                                                />
                                                <button onClick={() => saveEditedPoints(user._id)} title="Simpan" className="text-green-400 hover:text-green-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                    </svg>
                                                </button>
                                                <button onClick={cancelEditing} title="Batal" className="text-red-400 hover:text-red-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 group">
                                                <span className="font-bold text-emerald-400 text-lg">{user.points}</span>
                                                <button onClick={() => startEditing(user)} className="text-sky-500 hover:text-sky-400 transition-colors" title="Edit Poin Manual">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 text-center text-sm">{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={pointsToAdd[user._id] || ''} onChange={(e) => handlePointsInputChange(user._id, e.target.value)} className={`${inputClass} w-24 text-center`} placeholder="Jumlah" min="1" />
                                            <button onClick={() => handleAddPoints(user.email, user._id)} className={buttonClass}>Tambah</button>
                                        </div>
                                        {messages[user._id] && <p className={`text-xs mt-1 ${messages[user._id].type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{messages[user._id].text}</p>}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-slate-400">
                                        {searchTerm ? 'Tidak ada pengguna yang cocok dengan pencarian.' : 'Tidak ada pengguna.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pricing Config Section */}
            <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto">
                 <h2 className="text-3xl font-bold text-white mb-6">Pengaturan Harga & Pembayaran</h2>
                 <div className="space-y-8">
                    {/* Session Costs */}
                    <div>
                         <h3 className="text-xl font-semibold text-sky-300 mb-4">Biaya Pembuatan Modul Ajar (Poin)</h3>
                        <div className="space-y-3">
                             {pricingConfig.sessionCosts.map((sc, index) => (
                                <div key={sc.sessions} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                                    <span className="font-medium text-slate-300 w-40">{sc.sessions} Sesi Pembelajaran</span>
                                    <input 
                                        type="number" 
                                        value={sc.cost} 
                                        onChange={(e) => handleConfigChange('sessionCosts', index, 'cost', Number(e.target.value))} 
                                        className={`${inputClass} w-40 text-center`} 
                                    />
                                    <span className="text-slate-400">Poin</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div>
                        <h3 className="text-xl font-semibold text-sky-300 mb-4">Metode Pembayaran (Isi Ulang)</h3>
                        <div className="space-y-3">
                            {pricingConfig.paymentMethods.map((pm, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                                    <input type="text" placeholder="Metode (cth: DANA)" value={pm.method} onChange={(e) => handleConfigChange('paymentMethods', index, 'method', e.target.value)} className={`${inputClass} flex-grow`} />
                                    <input type="text" placeholder="Detail (cth: 0812... a/n...)" value={pm.details} onChange={(e) => handleConfigChange('paymentMethods', index, 'details', e.target.value)} className={`${inputClass} flex-grow`} />
                                    <button onClick={() => removeConfigItem('paymentMethods', index)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm">Hapus</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addConfigItem('paymentMethods')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm">Tambah Metode</button>
                    </div>
                     {/* Point Packages */}
                    <div>
                        <h3 className="text-xl font-semibold text-sky-300 mb-4">Paket Poin (Isi Ulang)</h3>
                        <div className="space-y-3">
                             {pricingConfig.pointPackages.map((pp, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                                    <input type="number" placeholder="Jumlah Poin" value={pp.points} onChange={(e) => handleConfigChange('pointPackages', index, 'points', Number(e.target.value))} className={`${inputClass} w-1/3`} />
                                    <input type="number" placeholder="Harga (Rp)" value={pp.price} onChange={(e) => handleConfigChange('pointPackages', index, 'price', Number(e.target.value))} className={`${inputClass} w-1/3`} />
                                    <button onClick={() => removeConfigItem('pointPackages', index)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm">Hapus</button>
                                </div>
                            ))}
                        </div>
                         <button onClick={() => addConfigItem('pointPackages')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm">Tambah Paket</button>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <button onClick={handleSaveConfig} disabled={isSavingConfig} className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 text-lg">
                            {isSavingConfig ? 'Menyimpan...' : 'Simpan Perubahan Konfigurasi'}
                        </button>
                        {configMessage && <p className={`text-center mt-4 text-sm ${configMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{configMessage.text}</p>}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AdminPage;
