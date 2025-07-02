import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const PaymentStatusPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { authData, updatePoints } = useAuth();
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
            // Call the secure confirmation endpoint. This is NOT a webhook.
            const response = await fetch('/api/payment/webhook/lynk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`, // Auth is required
                },
                body: JSON.stringify({ transactionId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengkonfirmasi pembayaran.');
            }
            
            // Update points on the frontend after successful confirmation
            if (data.newPoints !== undefined) {
               updatePoints(data.newPoints);
            }

            setStatus('success');
            setMessage(data.message);

        } catch (err) {
            setStatus('failed');
            let errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
            if (errorMessage.includes('not authorized')) {
                errorMessage = 'Gagal mengkonfirmasi. Transaksi ini tidak terkait dengan akun Anda.';
            }
            setMessage(errorMessage);
        }
    }, [transactionId, authData.token, updatePoints]);

    useEffect(() => {
        const paymentProcessedKey = `payment_${transactionId}_processed`;
        if (!transactionId) {
             setStatus('failed');
             setMessage('ID transaksi tidak ditemukan di URL.');
             return;
        }
        
        // Prevent re-processing if we already tried for this session
        const isProcessed = sessionStorage.getItem(paymentProcessedKey);
        if (!isProcessed) {
            sessionStorage.setItem(paymentProcessedKey, 'true');
            // Simulate a short delay for payment systems to catch up
            setTimeout(() => {
                confirmPayment();
            }, 2000);
        } else {
            // If we've already run this, show an info message.
            setStatus('success');
            setMessage('Status pembayaran sudah diperbarui. Silakan periksa jumlah poin Anda.');
        }
    }, [transactionId, confirmPayment]);

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="text-center text-slate-800">
                        <LoadingSpinner />
                        <p className="text-slate-600 mt-4">Mohon jangan tutup halaman ini...</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center text-green-800 bg-green-100 p-8 rounded-lg w-full max-w-md border-2 border-green-300 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Konfirmasi Berhasil!</h2>
                        <p className="mb-6">{message}</p>
                        <p className="text-slate-700 mb-6 text-md">Jumlah poin Anda sekarang: <span className="font-bold text-emerald-600">{authData.user?.points}</span></p>
                        <Link to="/app" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                );
            case 'failed':
                return (
                     <div className="text-center text-red-800 bg-red-100 p-8 rounded-lg w-full max-w-md border-2 border-red-300 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Konfirmasi Gagal</h2>
                        <p className="mb-6">{message}</p>
                        <Link to="/pricing" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                            Kembali ke Halaman Harga
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
