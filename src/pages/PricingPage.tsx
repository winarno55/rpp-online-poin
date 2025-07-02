import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

interface PointPackage {
    _id: string; // ID paket dibutuhkan untuk transaksi
    points: number;
    price: number;
}
interface PaymentMethod {
    method: string;
    details: string;
}
interface PricingConfig {
    pointPackages: PointPackage[];
    paymentMethods: PaymentMethod[];
}

const PricingPage: React.FC = () => {
    const { isAuthenticated, authData } = useAuth();
    const navigate = useNavigate();
    const [config, setConfig] = useState<PricingConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/pricing/config');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Gagal memuat informasi harga.');
                }
                setConfig(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleCreateTransaction = async (packageId: string) => {
        if (!isAuthenticated || !authData.token) {
            navigate('/login');
            return;
        }
        setIsProcessing(packageId);
        setError(null);
        try {
            const response = await fetch('/api/payment/create-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify({ packageId }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal memulai transaksi.');
            }
            // Arahkan ke URL pembayaran (disimulasikan) yang diberikan oleh backend
            window.location.href = data.paymentUrl;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal membuat transaksi.');
            setIsProcessing(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }
    
    if (error && !isProcessing) {
        return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>;
    }

    if (!config || (config.pointPackages.length === 0)) {
        return <div className="text-center text-slate-500 p-4 rounded-lg bg-slate-100">Admin belum mengatur paket harga.</div>;
    }
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const waText = isAuthenticated 
        ? `Halo Admin, saya sudah melakukan pembayaran untuk top up poin untuk akun email: ${authData.user?.email}. Mohon dicek.`
        : `Halo Admin, saya ingin melakukan pembayaran manual untuk top up poin.`;
    // Ganti nomor WhatsApp di bawah ini dengan nomor admin yang benar
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waText)}`;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-16 py-10">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                    Isi Ulang Poin
                </h1>
                <p className="text-slate-600 mt-2 text-lg max-w-2xl mx-auto">
                    Pilih metode pembayaran yang paling sesuai untuk Anda.
                </p>
            </div>

            {/* AUTOMATIC PAYMENT SECTION */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Pembayaran Otomatis (Rekomendasi)</h2>
                <p className="text-center text-slate-500 mb-8">Poin akan langsung ditambahkan ke akun Anda setelah pembayaran berhasil.</p>
                {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center border border-red-200 mb-6">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(config.pointPackages || []).map((pkg) => (
                        <div key={pkg._id} className="border border-slate-200 rounded-lg p-6 text-center flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform duration-300 bg-slate-50">
                            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">{pkg.points}</p>
                            <p className="text-xl text-sky-700 mb-4 font-semibold">Poin</p>
                            <p className="text-2xl font-bold text-slate-800 mb-6">{formatCurrency(pkg.price)}</p>
                            <button 
                                onClick={() => handleCreateTransaction(pkg._id)}
                                disabled={isProcessing === pkg._id || pkg.price < 10000}
                                className="w-full mt-auto bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing === pkg._id ? 'Memproses...' : 'Top Up Poin'}
                            </button>
                            {pkg.price < 10000 && (
                                <p className="text-xs text-slate-500 mt-2">
                                    Pembayaran otomatis min. Rp 10.000.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* MANUAL PAYMENT SECTION */}
            {config.paymentMethods && config.paymentMethods.length > 0 && (
                <div className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">Alternatif: Pembayaran Manual</h3>
                    <p className="text-center text-slate-600 mb-6">
                        Anda juga dapat melakukan transfer manual. Poin akan ditambahkan oleh admin setelah konfirmasi.
                    </p>
                    <div className="space-y-4 max-w-lg mx-auto">
                        {config.paymentMethods.map((method, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                                <p className="font-bold text-sky-700 text-lg">{method.method}</p>
                                <p className="text-slate-800 font-mono text-xl tracking-wider">{method.details}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md max-w-lg mx-auto">
                        <p className="font-bold">PENTING:</p>
                        <p>Setelah transfer, kirim bukti pembayaran ke Admin untuk proses verifikasi. {isAuthenticated && `(Sebutkan email Anda: ${authData.user?.email})`}</p>
                        <a 
                            href={waUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-3 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all"
                        >
                            Konfirmasi via WhatsApp
                        </a>
                    </div>
                </div>
            )}


            {!isAuthenticated && (
                <div className="bg-gradient-to-r from-sky-500 to-emerald-500 shadow-2xl rounded-xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Anda Belum Login</h2>
                    <p className="text-lg mb-6 max-w-2xl mx-auto">
                        Silakan login atau daftar untuk melakukan isi ulang poin.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/login" className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105">
                            Login
                        </Link>
                         <Link to="/register" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105 hover:bg-white/10">
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingPage;