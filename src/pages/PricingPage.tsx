import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface PointPackage {
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
    midtrans?: {
        clientKey: string;
        isProduction: boolean;
        snapScriptUrl: string;
    };
}

const PricingPage: React.FC = () => {
    const { isAuthenticated, updatePoints } = useAuth();
    const [config, setConfig] = useState<PricingConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [payingIndex, setPayingIndex] = useState<number | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<{
        type: 'success' | 'pending' | 'error';
        message: string;
    } | null>(null);

    // Ganti menjadi 'true' jika akun Midtrans Anda sudah selesai disurvei/diterima (Aktif)
    const showAutomaticPayment = false;

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

    // Load Midtrans Snap SDK dynamically if configured
    useEffect(() => {
        if (config?.midtrans?.snapScriptUrl && config?.midtrans?.clientKey) {
            const scriptId = 'midtrans-snap-script';
            let script = document.getElementById(scriptId) as HTMLScriptElement;
            if (!script) {
                script = document.createElement('script');
                script.id = scriptId;
                script.src = config.midtrans.snapScriptUrl;
                script.setAttribute('data-client-key', config.midtrans.clientKey);
                document.body.appendChild(script);
            }
        }
    }, [config]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
    };

    const handleBuyInstant = async (pkg: PointPackage, index: number) => {
        if (!isAuthenticated) {
            setError("Silakan masuk (login) terlebih dahulu untuk melakukan pengisian poin.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setPayingIndex(index);
        setPaymentStatus(null);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    points: pkg.points,
                    price: pkg.price
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal membuat sesi pembayaran.');
            }

            if (!(window as any).snap) {
                throw new Error('Midtrans SDK belum termuat dengan sempurna. Silakan coba lagi.');
            }

            (window as any).snap.pay(data.token, {
                onSuccess: async function (result: any) {
                    console.log('Payment success:', result);
                    setPaymentStatus({
                        type: 'success',
                        message: `Pembayaran sukses! ${pkg.points} Poin telah berhasil ditambahkan ke akun Anda.`
                    });
                    
                    // Fetch fresh profile data to update points in context without reloading
                    try {
                        const meRes = await fetch('/api/auth/me', {
                            headers: {
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                            }
                        });
                        if (meRes.ok) {
                            const meData = await meRes.json();
                            if (meData?.user?.points !== undefined) {
                                updatePoints(meData.user.points);
                            }
                        }
                    } catch (fetchMeErr) {
                        console.error('Error fetching fresh user points:', fetchMeErr);
                        // Fallback fallback: reload
                        setTimeout(() => {
                            window.location.reload();
                        }, 2500);
                    }
                    
                    setPayingIndex(null);
                },
                onPending: function (result: any) {
                    console.log('Payment pending:', result);
                    setPaymentStatus({
                        type: 'pending',
                        message: 'Pembayaran tertunda. Silakan selesaikan pembayaran sesuai instruksi di jendela Midtrans.'
                    });
                    setPayingIndex(null);
                },
                onError: function (result: any) {
                    console.error('Payment error:', result);
                    setPaymentStatus({
                        type: 'error',
                        message: 'Gagal memproses pembayaran atau transaksi dibatalkan.'
                    });
                    setPayingIndex(null);
                },
                onClose: function () {
                    console.log('Payment popup closed');
                    setPayingIndex(null);
                }
            });

        } catch (err) {
            console.error('Payment checkout error:', err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses pembayaran.');
            setPayingIndex(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    if (!config || (config.pointPackages.length === 0 && config.paymentMethods.length === 0)) {
        return <div className="text-center text-slate-500 p-4 rounded-lg bg-slate-100">Admin belum mengatur informasi harga dan pembayaran. Silakan hubungi admin secara langsung.</div>;
    }
    
    // Format number to IDR currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-16 py-10">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                    Harga Poin
                </h1>
                <p className="text-slate-600 mt-2 text-lg max-w-2xl mx-auto">
                    Pilih paket yang sesuai dengan kebutuhan Anda untuk terus membuat Modul Ajar berkualitas.
                </p>
            </div>

            {/* Status & Error Alerts */}
            {(error || paymentStatus) && (
                <div className="max-w-xl mx-auto transition-all duration-300">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 shadow-sm flex items-center justify-between">
                            <p className="font-medium text-sm">{error}</p>
                            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold ml-2">×</button>
                        </div>
                    )}
                    {paymentStatus && (
                        <div className={`p-4 rounded-xl border shadow-sm flex items-center justify-between ${
                            paymentStatus.type === 'success' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : paymentStatus.type === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                            <p className="font-medium text-sm">{paymentStatus.message}</p>
                            <button onClick={() => setPaymentStatus(null)} className="font-bold ml-2 text-lg">×</button>
                        </div>
                    )}
                </div>
            )}

            {/* Point Packages */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Pilih Paket Poin</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(config.pointPackages || []).map((pkg, index) => (
                        <div key={index} className="border border-slate-200 rounded-xl p-6 text-center flex flex-col items-center justify-between shadow-lg transform hover:scale-105 transition-all duration-300 bg-slate-50 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 to-emerald-500"></div>
                            
                            <div className="my-4">
                                <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">{pkg.points}</p>
                                <p className="text-lg text-slate-500 font-semibold mt-1">Poin</p>
                            </div>

                            <div className="w-full border-t border-slate-100 pt-4 my-4">
                                <p className="text-2xl font-bold text-slate-800">{formatCurrency(pkg.price)}</p>
                            </div>

                            {showAutomaticPayment ? (
                                <button
                                    onClick={() => handleBuyInstant(pkg, index)}
                                    disabled={payingIndex !== null}
                                    className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                                >
                                    {payingIndex === index ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        <span>Bayar Instan (Otomatis)</span>
                                    )}
                                </button>
                            ) : (
                                <div className="text-xs text-slate-500 italic mt-2 bg-slate-100 p-2 rounded w-full">
                                    Gunakan transfer manual di bawah ini
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Cara Pembayaran Lainnya (Manual)</h2>
                <p className="text-slate-600 text-center mb-6 -mt-4 max-w-md mx-auto">
                    Anda juga dapat melakukan pembayaran secara manual melalui transfer bank/e-wallet di bawah ini:
                </p>
                <div className="space-y-4 max-w-lg mx-auto">
                    {(config.paymentMethods || []).map((pm, index) => (
                        <div key={index} className="bg-slate-50 rounded-lg p-4 flex items-center justify-between shadow-sm border border-slate-200">
                           <div>
                             <p className="font-semibold text-sky-700 text-sm">{pm.method}</p>
                             <p className="text-slate-800 text-lg font-mono font-bold">{pm.details}</p>
                           </div>
                           <button onClick={() => handleCopy(pm.details)} className="bg-white hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-md text-sm transition-colors border border-slate-300 shadow-xs">
                            {copied === pm.details ? 'Tersalin!' : 'Salin'}
                           </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-sky-500 to-emerald-500 shadow-2xl rounded-xl p-8 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Langkah Terakhir (Untuk Manual)</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                    Jika Anda membayar menggunakan **Cara Pembayaran Manual**, harap kirimkan bukti transfer Anda ke nomor WhatsApp admin untuk konfirmasi penambahan poin.
                </p>
                <a 
                    href="https://wa.me/6282232835976?text=Halo%20Admin%20Modul%20Ajar%20Cerdas,%20saya%20sudah%20melakukan%20pembayaran%20untuk%20isi%20ulang%20poin."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-emerald-600 font-bold py-4 px-8 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105"
                >
                    Konfirmasi via WhatsApp
                </a>
                {!isAuthenticated && (
                    <p className="mt-8">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-bold underline hover:text-yellow-300">
                            Daftar gratis di sini untuk memulai!
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default PricingPage;
