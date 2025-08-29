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
}

const PricingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [config, setConfig] = useState<PricingConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }
    
    if (error) {
        return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>;
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

            {/* Point Packages */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Pilih Paket</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(config.pointPackages || []).map((pkg, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-6 text-center flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform duration-300 bg-slate-50">
                            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">{pkg.points}</p>
                            <p className="text-xl text-sky-700 mb-4 font-semibold">Poin</p>
                            <p className="text-2xl font-bold text-slate-800">{formatCurrency(pkg.price)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Methods */}
             <div className="bg-white shadow-xl rounded-xl p-8 border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Cara Pembayaran</h2>
                <div className="space-y-4 max-w-lg mx-auto">
                    {(config.paymentMethods || []).map((pm, index) => (
                        <div key={index} className="bg-slate-100 rounded-lg p-4 flex items-center justify-between shadow-sm border border-slate-200">
                           <div>
                             <p className="font-semibold text-sky-700 text-lg">{pm.method}</p>
                             <p className="text-slate-800 text-xl font-mono">{pm.details}</p>
                           </div>
                           <button onClick={() => handleCopy(pm.details)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-3 rounded-md text-sm transition-colors border border-slate-300">
                            {copied === pm.details ? 'Tersalin!' : 'Salin'}
                           </button>
                        </div>
                    ))}
                </div>
            </div>

             {/* Call to Action */}
             <div className="bg-gradient-to-r from-sky-500 to-emerald-500 shadow-2xl rounded-xl p-8 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Langkah Terakhir</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                    Setelah melakukan pembayaran, kirim bukti transfer Anda untuk konfirmasi. Poin akan ditambahkan ke akun Anda oleh admin.
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