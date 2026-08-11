
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
    bundleCost: number;
    midtransSandbox?: boolean;
    midtransEnabled?: boolean;
    complaintUrl?: string;
    referralCommissionPercent?: number;
    minWithdrawalAmount?: number;
    referralEnabled?: boolean;
}

interface AdminWithdrawalItem {
    _id: string;
    userId: string;
    userEmail: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    status: 'PENDING' | 'PAID' | 'REJECTED';
    adminNote?: string;
    createdAt: string;
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
    const [pricingConfig, setPricingConfig] = useState<PricingConfig>({ 
        pointPackages: [], 
        paymentMethods: [], 
        sessionCosts: [], 
        bundleCost: 50,
        midtransSandbox: true,
        midtransEnabled: false,
        complaintUrl: '',
        referralCommissionPercent: 15,
        minWithdrawalAmount: 50000,
        referralEnabled: true
    });
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [configMessage, setConfigMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // State untuk Withdrawals
    const [withdrawals, setWithdrawals] = useState<AdminWithdrawalItem[]>([]);
    const [updatingWithdrawalId, setUpdatingWithdrawalId] = useState<string | null>(null);
    const [withdrawalMsg, setWithdrawalMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [rejectNote, setRejectNote] = useState<{ [key: string]: string }>({});

    const maxSessions = 5;

    // State untuk Broadcast Email
    const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'active'>('active');
    const [broadcastSubject, setBroadcastSubject] = useState('📢 Rekomendasikan Modul Ajar Cerdas, Dapatkan Komisi Tunai 15%! 💸');
    const [broadcastMessage, setBroadcastMessage] = useState(`<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background-color: #ffffff;">
    <h2 style="color: #0ea5e9; margin-top: 0;">Hai Bapak/Ibu Guru Hebat,</h2>
    <p>Kami punya kabar gembira untuk Anda! Kini <strong>Modul Ajar Cerdas</strong> telah meluncurkan <strong>Program Afiliasi & Referral Resmi</strong>.</p>
    
    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 16px;">🎁 Dapatkan Komisi Tunai 15%</h3>
        <p style="margin: 0; color: #1e293b; font-size: 14px;">Setiap kali rekan guru yang Anda undang melakukan pembelian poin di Modul Ajar Cerdas, Anda akan otomatis mendapatkan komisi tunai sebesar <strong>15%</strong>!</p>
    </div>

    <p>Komisi yang Anda kumpulkan dapat ditarik (Withdraw) kapan saja langsung ke Rekening Bank atau E-Wallet pilihan Anda (DANA, OVO, ShopeePay, dll) dengan batas minimal penarikan Rp 50.000 saja!</p>

    <h3 style="color: #0ea5e9; font-size: 16px; margin-top: 24px;">Bagaimana Cara Memulainya?</h3>
    <ol style="padding-left: 20px; color: #475569; font-size: 14px;">
        <li style="margin-bottom: 8px;">Masuk ke akun Anda di <strong>Modul Ajar Cerdas</strong>.</li>
        <li style="margin-bottom: 8px;">Buka menu <strong>💰 Afiliasi</strong> di bar navigasi atas.</li>
        <li style="margin-bottom: 8px;">Salin <strong>Link Referral Anda</strong> atau <strong>Kode Referral Anda</strong>.</li>
        <li>Bagikan ke grup WhatsApp guru, rekan sejawat, atau sosial media Anda!</li>
    </ol>

    <div style="text-align: center; margin: 30px 0;">
        <a href="https://modulajarcerdas.my.id/app/affiliate" style="background-color: #0ea5e9; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ambil Link Referral Saya</a>
    </div>

    <p style="font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 30px;">
        Mari saling membantu sesama guru untuk menyiapkan perangkat ajar terbaik dengan lebih mudah dan cepat, sekaligus menikmati penghasilan tambahan bersama Modul Ajar Cerdas!
    </p>
    <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">Salam hangat,</p>
    <p style="font-size: 13px; color: #475569; font-weight: bold; margin: 4px 0 0 0;">Tim Modul Ajar Cerdas</p>
</div>`);
    const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
    const [broadcastResult, setBroadcastResult] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showBroadcastPreview, setShowBroadcastPreview] = useState(false);

    const handleSendBroadcast = async () => {
        if (!authData.token) return;
        const confirmSend = window.confirm(
            `Apakah Anda yakin ingin mengirim email massal ini ke semua ${
                broadcastTarget === 'active' ? 'Anggota Aktif (Poin > 200)' : 'Anggota Terdaftar'
            }? Tindakan ini tidak dapat dibatalkan.`
        );
        if (!confirmSend) return;

        setIsSendingBroadcast(true);
        setBroadcastResult(null);

        try {
            const res = await fetch('/api/admin/broadcast-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    target: broadcastTarget,
                    subject: broadcastSubject,
                    message: broadcastMessage
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Gagal mengirim broadcast email.');
            setBroadcastResult({ type: 'success', text: data.message || 'Email massal berhasil dikirim ke seluruh anggota kriteria!' });
        } catch (err: any) {
            setBroadcastResult({ type: 'error', text: err.message || 'Gagal mengirim broadcast.' });
        } finally {
            setIsSendingBroadcast(false);
        }
    };

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

            // Fetch withdrawals
            const wdResponse = await fetch('/api/admin/withdrawals', {
                headers: { 'Authorization': `Bearer ${authData.token}` },
            });
            if (wdResponse.ok) {
                const wdData = await wdResponse.json();
                setWithdrawals(wdData);
            }

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

    const handleUpdateWithdrawalStatus = async (withdrawalId: string, status: 'PAID' | 'REJECTED') => {
        if (!authData.token) return;
        setUpdatingWithdrawalId(withdrawalId);
        setWithdrawalMsg(null);
        try {
            const res = await fetch('/api/admin/update-withdrawal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    withdrawalId,
                    status,
                    adminNote: rejectNote[withdrawalId] || ''
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Gagal memperbarui status penarikan.');
            setWithdrawalMsg({ type: 'success', text: data.message || `Status berhasil diubah menjadi ${status}` });
            await fetchAllData();
        } catch (err: any) {
            setWithdrawalMsg({ type: 'error', text: err.message || 'Gagal memperbarui status.' });
        } finally {
            setUpdatingWithdrawalId(null);
            setTimeout(() => setWithdrawalMsg(null), 4000);
        }
    };


    if (loading) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    if (error) return <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;

    const inputClass = "p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100";
    const buttonClass = "bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-md shadow-sm transition-all text-sm disabled:opacity-50";

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalUsersCount = users.length;
    const activeUsersCount = users.filter(user => user.points > 200).length;
    const passiveUsersCount = totalUsersCount - activeUsersCount;
    const activePercentage = totalUsersCount > 0 ? Math.round((activeUsersCount / totalUsersCount) * 100) : 0;
    const passivePercentage = totalUsersCount > 0 ? Math.round((passiveUsersCount / totalUsersCount) * 100) : 0;

    return (
        <div className="space-y-12">
            {/* Dashboard Analisis Aktivitas Pengguna */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
                {/* Total Users Card */}
                <div className="bg-slate-800 border border-slate-700/50 shadow-xl rounded-xl p-6 flex flex-col justify-between transition-all hover:border-sky-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-sky-400 uppercase tracking-wider">Total Pengguna</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sky-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 18H9.749A11.378 11.378 0 0 1 4.873 19.237V19.13c0-1.113.285-2.16.786-3.07M15 19.128v.109a11.386 11.386 0 0 1-4.911-1.237c-.501-.91-.786-1.957-.786-3.07M10.828 10.089A4.125 4.125 0 1 0 6.172 6.172a4.125 4.125 0 0 0 4.656 3.917Z" />
                        </svg>
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-4xl font-extrabold text-white">{totalUsersCount}</span>
                        <span className="text-xs text-slate-400 font-medium">Pengguna terdaftar</span>
                    </div>
                </div>

                {/* Active Users Card */}
                <div className="bg-slate-800 border border-slate-700/50 shadow-xl rounded-xl p-6 flex flex-col justify-between transition-all hover:border-emerald-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Pengguna Aktif</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium border border-emerald-500/20">Poin &gt; 200</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-4xl font-extrabold text-emerald-400">{activeUsersCount}</span>
                        <span className="text-xs text-slate-400 font-medium">({activePercentage}%) dari total</span>
                    </div>
                </div>

                {/* Passive Users Card */}
                <div className="bg-slate-800 border border-slate-700/50 shadow-xl rounded-xl p-6 flex flex-col justify-between transition-all hover:border-rose-500/30">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-rose-400 uppercase tracking-wider">Pengguna Pasif</span>
                        <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-medium border border-rose-500/20">Poin ≤ 200</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-4xl font-extrabold text-rose-400">{passiveUsersCount}</span>
                        <span className="text-xs text-slate-400 font-medium">({passivePercentage}%) dari total</span>
                    </div>
                </div>
            </div>

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

                <div className="overflow-x-auto max-h-[380px] overflow-y-auto border border-slate-700/60 rounded-xl shadow-inner custom-scrollbar">
                     <table className="w-full text-left text-slate-300 relative">
                        <thead className="bg-slate-900 sticky top-0 z-10 text-xs text-sky-300 uppercase shadow-md">
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

            {/* Broadcast Email Section */}
            <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto border border-sky-500/20">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <span>📢 Kirim Pengumuman Email Massal (Broadcast)</span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                        Kirim pesan email promosi, kabar terbaru, atau ajakan program afiliasi ke anggota aktif atau seluruh pengguna Anda sekaligus secara otomatis.
                    </p>
                </div>

                {broadcastResult && (
                    <div className={`p-4 rounded-lg mb-6 text-sm font-semibold ${broadcastResult.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'}`}>
                        {broadcastResult.text}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Target Selection */}
                    <div>
                        <span className="block text-sm font-medium text-slate-300 mb-2">Target Penerima</span>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setBroadcastTarget('active')}
                                className={`flex-1 py-3 px-4 rounded-lg font-bold border transition-all text-sm flex flex-col items-center gap-1 ${
                                    broadcastTarget === 'active'
                                        ? 'bg-sky-500/20 border-sky-500 text-white shadow-lg'
                                        : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                            >
                                <span className="text-base">🔥 Hanya Anggota Aktif</span>
                                <span className="text-[11px] font-normal text-slate-400">Poin &gt; 200 (Total {users.filter(u => u.points > 200).length} Guru)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setBroadcastTarget('all')}
                                className={`flex-1 py-3 px-4 rounded-lg font-bold border transition-all text-sm flex flex-col items-center gap-1 ${
                                    broadcastTarget === 'all'
                                        ? 'bg-sky-500/20 border-sky-500 text-white shadow-lg'
                                        : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                            >
                                <span className="text-base">👥 Semua Pengguna Terdaftar</span>
                                <span className="text-[11px] font-normal text-slate-400">Total {users.length} Guru</span>
                            </button>
                        </div>
                    </div>

                    {/* Subject Input */}
                    <div>
                        <label htmlFor="broadcast-subject" className="block text-sm font-medium text-slate-300 mb-2">Subjek Email</label>
                        <input
                            type="text"
                            id="broadcast-subject"
                            value={broadcastSubject}
                            onChange={(e) => setBroadcastSubject(e.target.value)}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100 font-medium"
                            placeholder="Tulis subjek email..."
                        />
                    </div>

                    {/* Email Body Textarea */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="broadcast-message" className="block text-sm font-medium text-slate-300">Isi Email (HTML Diizinkan)</label>
                            <button
                                type="button"
                                onClick={() => setShowBroadcastPreview(!showBroadcastPreview)}
                                className="text-xs bg-slate-700 hover:bg-slate-600 text-sky-400 border border-slate-600 px-3 py-1 rounded transition-all font-semibold flex items-center gap-1"
                            >
                                {showBroadcastPreview ? 'Tutup Live Preview' : '👀 Tampilkan Live Preview'}
                            </button>
                        </div>
                        <textarea
                            id="broadcast-message"
                            rows={12}
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 transition-colors placeholder-slate-400 text-slate-100 font-mono text-xs leading-relaxed"
                            placeholder="Tulis pesan email (HTML diizinkan)..."
                        />
                    </div>

                    {/* Live HTML Preview Box */}
                    {showBroadcastPreview && (
                        <div className="border border-slate-600 rounded-lg overflow-hidden bg-white p-4">
                            <div className="text-slate-500 text-[11px] font-bold border-b border-slate-200 pb-2 mb-3 uppercase tracking-wider flex justify-between items-center">
                                <span>Pratinjau Email Penerima:</span>
                                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">HTML Rendered</span>
                            </div>
                            <div 
                                className="preview-html-container overflow-y-auto max-h-[350px]"
                                dangerouslySetInnerHTML={{ __html: broadcastMessage }}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={handleSendBroadcast}
                            disabled={isSendingBroadcast}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50 text-base"
                        >
                            {isSendingBroadcast ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Sedang Mengirim Email Broadcast...</span>
                                </span>
                            ) : (
                                <span>🚀 Kirim Broadcast Email Sekarang</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Withdrawal Management Section */}
            <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto border border-emerald-500/20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span>💸 Manajemen Penarikan Dana Komisi (WD)</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Kelola pengajuan penarikan dana dari para afiliator/pengguna.
                        </p>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
                        {withdrawals.filter(w => w.status === 'PENDING').length} Pending
                    </span>
                </div>

                {withdrawalMsg && (
                    <div className={`p-3 rounded-lg mb-4 text-xs font-medium ${withdrawalMsg.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'}`}>
                        {withdrawalMsg.text}
                    </div>
                )}

                <div className="overflow-x-auto max-h-[420px] overflow-y-auto border border-slate-700/60 rounded-xl shadow-inner custom-scrollbar">
                    <table className="w-full text-left text-slate-300 relative text-xs">
                        <thead className="bg-slate-900 sticky top-0 z-10 text-sky-300 uppercase shadow-md">
                            <tr>
                                <th className="p-3">User &amp; Tanggal</th>
                                <th className="p-3">Nominal WD</th>
                                <th className="p-3">Tujuan Transfer</th>
                                <th className="p-3">Status &amp; Aksi Admin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/60">
                            {withdrawals.length > 0 ? withdrawals.map(w => (
                                <tr key={w._id} className="hover:bg-slate-700/40 transition-colors">
                                    <td className="p-3">
                                        <div className="font-semibold text-white">{w.userEmail}</div>
                                        <div className="text-[11px] text-slate-400">
                                            {new Date(w.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="p-3 font-extrabold text-emerald-400 text-sm whitespace-nowrap">
                                        Rp {w.amount.toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-3">
                                        <div className="font-bold text-sky-300">{w.bankName} - {w.accountNumber}</div>
                                        <div className="text-[11px] text-slate-300">a.n {w.accountHolder}</div>
                                    </td>
                                    <td className="p-3">
                                        {w.status === 'PENDING' ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateWithdrawalStatus(w._id, 'PAID')}
                                                        disabled={updatingWithdrawalId === w._id}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-2.5 py-1 rounded shadow text-xs disabled:opacity-50"
                                                    >
                                                        {updatingWithdrawalId === w._id ? 'Proses...' : '✓ Tandai Lunas'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateWithdrawalStatus(w._id, 'REJECTED')}
                                                        disabled={updatingWithdrawalId === w._id}
                                                        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-2.5 py-1 rounded shadow text-xs disabled:opacity-50"
                                                    >
                                                        ✕ Tolak WD
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Alasan tolak (opsional)..."
                                                    value={rejectNote[w._id] || ''}
                                                    onChange={(e) => setRejectNote({ ...rejectNote, [w._id]: e.target.value })}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 placeholder-slate-500"
                                                />
                                            </div>
                                        ) : w.status === 'PAID' ? (
                                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                                ✓ Lunas / Ditransfer
                                            </span>
                                        ) : (
                                            <div>
                                                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                                    ✕ Ditolak (Refund)
                                                </span>
                                                {w.adminNote && (
                                                    <p className="text-[11px] text-slate-400 mt-1 italic">{w.adminNote}</p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-slate-400 italic">
                                        Belum ada pengajuan penarikan dana dari pengguna.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pricing Config Section */}
            <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto">
                 <h2 className="text-3xl font-bold text-white mb-6">Pengaturan Aplikasi &amp; Harga</h2>
                 <div className="space-y-8">
                    {/* Program Afiliasi & Referral Config */}
                    <div className="p-4 bg-slate-700/40 rounded-xl border border-emerald-500/30">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🤝</span>
                            <h3 className="text-xl font-semibold text-emerald-300">Pengaturan Program Afiliasi &amp; Referral</h3>
                        </div>
                        <p className="text-xs text-slate-300 mb-4">
                            Atur persentase komisi tunai dan batas minimal penarikan (WD) dana untuk para pengguna yang mengundang rekan lain.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
                                <div>
                                    <p className="font-semibold text-white text-sm">Status Program Afiliasi</p>
                                    <p className="text-xs text-slate-400">Aktifkan untuk memberikan komisi saat pengguna yang diundang melakukan pembelian.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPricingConfig({ ...pricingConfig, referralEnabled: pricingConfig.referralEnabled === undefined ? true : !pricingConfig.referralEnabled })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                        (pricingConfig.referralEnabled !== false) ? 'bg-emerald-500' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            (pricingConfig.referralEnabled !== false) ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Persentase Komisi (%)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={pricingConfig.referralCommissionPercent ?? 15}
                                            onChange={(e) => setPricingConfig({ ...pricingConfig, referralCommissionPercent: Number(e.target.value) })}
                                            className={`${inputClass} w-full font-bold text-center text-emerald-400`}
                                        />
                                        <span className="text-sm font-bold text-slate-300">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Minimal Penarikan Dana / WD (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="10000"
                                        step="5000"
                                        value={pricingConfig.minWithdrawalAmount ?? 50000}
                                        onChange={(e) => setPricingConfig({ ...pricingConfig, minWithdrawalAmount: Number(e.target.value) })}
                                        className={`${inputClass} w-full font-bold text-center text-emerald-400`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link Aduan / Saran */}
                    <div className="p-4 bg-slate-700/40 rounded-xl border border-sky-500/30">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📩</span>
                            <h3 className="text-xl font-semibold text-sky-300">Link Aduan &amp; Saran Pengguna</h3>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">
                            Tentukan URL form/layanan aduan (misal: Google Form, Form Layanan, atau link WhatsApp CS) yang akan dibuka saat pengguna menekan tombol "Aduan / Saran".
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <input 
                                type="url" 
                                placeholder="https://forms.gle/... atau https://wa.me/628..." 
                                value={pricingConfig.complaintUrl || ''} 
                                onChange={(e) => setPricingConfig({...pricingConfig, complaintUrl: e.target.value})} 
                                className={`${inputClass} flex-grow font-mono text-sm`} 
                            />
                            {pricingConfig.complaintUrl && (
                                <a 
                                    href={pricingConfig.complaintUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-sky-300 border border-slate-600 rounded-md text-xs font-medium text-center shrink-0 flex items-center justify-center gap-1"
                                >
                                    <span>Tes Link</span>
                                    <span>↗</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Bundle Cost */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-emerald-300 mb-4">Biaya Bundle Dokumen 1-6 (Poin)</h3>
                        <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                            <span className="font-medium text-slate-300 w-40">Dokumen 1-6</span>
                            <input type="number" value={pricingConfig.bundleCost || 50} onChange={(e) => setPricingConfig({...pricingConfig, bundleCost: Number(e.target.value)})} className={`${inputClass} w-40 text-center`} />
                            <span className="text-slate-400">Poin</span>
                        </div>
                    </div>

                    {/* Midtrans Config (Pembayaran Otomatis) */}
                    <div className="mb-8 border-t border-slate-700/50 pt-6">
                        <h3 className="text-xl font-semibold text-emerald-300 mb-4">Integrasi Pembayaran Otomatis (Midtrans)</h3>
                        <div className="space-y-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700/60">
                            {/* Toggle Midtrans Enabled */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">Status Pembayaran Otomatis</p>
                                    <p className="text-sm text-slate-400">Aktifkan atau nonaktifkan fitur pembayaran instan otomatis via Midtrans.</p>
                                </div>
                                <button
                                    onClick={() => setPricingConfig({ ...pricingConfig, midtransEnabled: !pricingConfig.midtransEnabled })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                        pricingConfig.midtransEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            pricingConfig.midtransEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Toggle Midtrans Sandbox */}
                            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                                <div>
                                    <p className="font-semibold text-white">Mode Sandbox (Uji Coba)</p>
                                    <p className="text-sm text-slate-400">
                                        Saat aktif (ON), sistem menggunakan lingkungan sandbox (uji coba) Midtrans. Nonaktifkan (OFF) untuk beralih ke Mode Production (Live).
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPricingConfig({ ...pricingConfig, midtransSandbox: pricingConfig.midtransSandbox === undefined ? true : !pricingConfig.midtransSandbox })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                        (pricingConfig.midtransSandbox !== false) ? 'bg-amber-500' : 'bg-slate-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            (pricingConfig.midtransSandbox !== false) ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="text-xs text-slate-400 bg-slate-800/60 p-3 rounded border border-slate-700/40">
                                <span className="font-bold text-amber-300">Catatan Konfigurasi:</span> Pastikan Anda telah mengatur variabel lingkungan server di Vercel:
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                    <li><code className="text-teal-300">MIDTRANS_CLIENT_KEY</code> &amp; <code className="text-teal-300">MIDTRANS_SERVER_KEY</code> (Default)</li>
                                    <li><code className="text-teal-300">MIDTRANS_SANDBOX_CLIENT_KEY</code> &amp; <code className="text-teal-300">MIDTRANS_SANDBOX_SERVER_KEY</code> (Spesifik Sandbox)</li>
                                    <li><code className="text-teal-300">MIDTRANS_PRODUCTION_CLIENT_KEY</code> &amp; <code className="text-teal-300">MIDTRANS_PRODUCTION_SERVER_KEY</code> (Spesifik Production)</li>
                                </ul>
                             </div>
                         </div>
                     </div>

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
