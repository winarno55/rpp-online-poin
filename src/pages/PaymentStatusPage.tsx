import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const PaymentStatusPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { authData, updatePoints } = useAuth(); // Ambil updatePoints dari context
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
    const [message, setMessage] = useState('Mengkonfirmasi pembayaran Anda...');

    const transactionId = searchParams.get('transaction_id');

    const confirmPayment = useCallback(async () => {
        if (!transactionId || !authData.token) {
            setStatus('failed');
            setMessage('ID transaksi tidak valid atau Anda tidak diautentikasi.');
            return;
        }

        try {
            // Ini adalah simulasi panggilan webhook dari klien untuk tujuan demo.
            // Dalam produksi, server akan menerima webhook langsung dari penyedia pembayaran.
            const response = await fetch('/api/payment/webhook/lynk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}` // Dibutuhkan untuk otorisasi webhook simulasi
                },
                body: JSON.stringify({ transactionId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengkonfirmasi pembayaran.');
            }
            
            // Perbarui poin di frontend setelah berhasil
            updatePoints(data.newPoints);

            setStatus('success');
            setMessage(data.message);

        } catch (err) {
            setStatus('failed');
            setMessage(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.');
        }
    }, [transactionId, authData.token, updatePoints]);

    useEffect(() => {
        // Mencegah panggilan ganda
        const paymentProcessed = sessionStorage.getItem(`payment_${transactionId}`);
        if (!transactionId) {
             setStatus('failed');
             setMessage('ID transaksi tidak ditemukan.');
        } else if (!paymentProcessed) {
            sessionStorage.setItem(`payment_${transactionId}`, 'true');
            // Menunggu sebentar untuk mensimulasikan waktu pemrosesan
            setTimeout(() => {
                confirmPayment();
            }, 1500);
        } else {
             setStatus('success');
             setMessage('Poin sudah ditambahkan. Anda bisa kembali ke halaman utama.');
        }

        return () => {
            // Bersihkan saat komponen dibongkar untuk memungkinkan pemrosesan ulang jika diperlukan (jarang terjadi)
            // sessionStorage.removeItem(`payment_${transactionId}`);
        };
    }, [transactionId, confirmPayment]);

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return <div className="text-slate-800"><LoadingSpinner /></div>;
            case 'success':
                return (
                    <div className="text-center text-green-800 bg-green-100 p-8 rounded-lg w-full max-w-md border-2 border-green-300 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
                        <p className="mb-6">{message}</p>
                        <p className="text-slate-700 mb-6 text-md">Sisa poin Anda sekarang: <span className="font-bold text-emerald-600">{authData.user?.points}</span></p>
                        <Link to="/app" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                            Kembali ke Home
                        </Link>
                    </div>
                );
            case 'failed':
                return (
                     <div className="text-center text-red-800 bg-red-100 p-8 rounded-lg w-full max-w-md border-2 border-red-300 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Pembayaran Gagal</h2>
                        <p className="mb-6">{message}</p>
                        <Link to="/pricing" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                            Coba Lagi
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div className="flex items-center justify-center py-10" style={{ minHeight: '50vh' }}>
            {renderContent()}
        </div>
    );
};

export default PaymentStatusPage;