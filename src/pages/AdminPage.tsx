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
interface PricingConfig {
    pointPackages: PointPackage[];
    paymentMethods: PaymentMethod[];
}

const AdminPage: React.FC = () => {
    const { authData } = useAuth();
    const [users, setUsers] = useState<FetchedUser[]>([]);
    const [pointsToAdd, setPointsToAdd] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } }>({});

    // State untuk pricing config
    const [pricingConfig, setPricingConfig] = useState<PricingConfig>({ pointPackages: [], paymentMethods: [] });
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [configMessage, setConfigMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
            const configData = await configResponse.json();
            if (!configResponse.ok) throw new Error(configData.message || 'Gagal memuat konfigurasi harga.');
            if (configData) {
               setPricingConfig(configData);
            }

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

    // Handler untuk pricing config
    const handleConfigChange = (type: 'pointPackages' | 'paymentMethods', index: number, field: string, value: string | number) => {
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
                <div className="overflow-x-auto">
                     <table className="w-full text-left text-slate-300">
                        <thead className="bg-slate-900/50 text-xs text-sky-300 uppercase">
                            <tr>
                                <th className="p-3">Email</th>
                                <th className="p-3 text-center">Poin</th>
                                <th className="p-3 text-center">Tgl. Daftar</th>
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
                                            <input type="number" value={pointsToAdd[user._id] || ''} onChange={(e) => handlePointsInputChange(user._id, e.target.value)} className={`${inputClass} w-24 text-center`} placeholder="Jumlah" min="1" />
                                            <button onClick={() => handleAddPoints(user.email, user._id)} className={buttonClass}>Tambah</button>
                                        </div>
                                        {messages[user._id] && <p className={`text-xs mt-1 ${messages[user._id].type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{messages[user._id].text}</p>}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="text-center p-6 text-slate-400">Tidak ada pengguna.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pricing Config Section */}
            <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto">
                 <h2 className="text-3xl font-bold text-white mb-6">Pengaturan Harga & Pembayaran</h2>
                 <div className="space-y-8">
                    {/* Payment Methods */}
                    <div>
                        <h3 className="text-xl font-semibold text-sky-300 mb-4">Metode Pembayaran</h3>
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
                        <h3 className="text-xl font-semibold text-sky-300 mb-4">Paket Poin</h3>
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