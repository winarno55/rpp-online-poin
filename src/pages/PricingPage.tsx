import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

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
        return <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }

    if (!config || (config.pointPackages.length === 0 && config.paymentMethods.length === 0)) {
        return <div className="text-center text-slate-400 p-4 rounded-lg">Admin belum mengatur informasi harga dan pembayaran. Silakan hubungi admin secara langsung.</div>;
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
        <div className="w-full max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                    Isi Ulang Poin
                </h1>
                <p className="text-slate-300 mt-2 text-lg">
                    Pilih paket yang sesuai dengan kebutuhan Anda dan lanjutkan aktivitas.
                </p>
            </div>

            {/* Point Packages */}
            <div className="bg-slate-800 shadow-2xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Pilih Paket Poin</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {config.pointPackages.map((pkg, index) => (
                        <div key={index} className="bg-slate-700/50 rounded-lg p-6 text-center flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">{pkg.points}</p>
                            <p className="text-lg text-sky-300 mb-4">Poin</p>
                            <p className="text-2xl font-semibold text-white">{formatCurrency(pkg.price)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Methods */}
             <div className="bg-slate-800 shadow-2xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Metode Pembayaran</h2>
                <div className="space-y-4 max-w-lg mx-auto">
                    {config.paymentMethods.map((pm, index) => (
                        <div key={index} className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between shadow-md">
                           <div>
                             <p className="font-semibold text-sky-300 text-lg">{pm.method}</p>
                             <p className="text-white text-xl font-mono">{pm.details}</p>
                           </div>
                           <button onClick={() => handleCopy(pm.details)} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors">
                            {copied === pm.details ? 'Tersalin!' : 'Salin'}
                           </button>
                        </div>
                    ))}
                </div>
            </div>

             {/* Call to Action */}
             <div className="bg-slate-800 shadow-2xl rounded-xl p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Langkah Terakhir</h2>
                <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
                    Setelah melakukan pembayaran ke salah satu metode di atas, silakan kirim bukti transfer Anda untuk konfirmasi. Poin akan segera ditambahkan ke akun Anda.
                </p>
                <a 
                    href="https://wa.me/6282232835976?text=Halo%20Admin%20RPP%20Cerdas,%20saya%20sudah%20melakukan%20pembayaran%20untuk%20isi%20ulang%20poin."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105"
                >
                    Konfirmasi via WhatsApp
                </a>
            </div>
        </div>
    );
};

export default PricingPage;
