

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const PaymentStatusPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { authData, refetchUser } = useAuth(); // Use the new refetchUser function
    const [status, setStatus] = useState<'processing' | 'success' | 'failed' | 'timeout'>('processing');
    const [message, setMessage] = useState('Memeriksa status pembayaran Anda...');

    const transactionId = searchParams.get('transaction_id');
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);
    const attempts = useRef(0);
    const maxAttempts = 15; // Poll for 30 seconds (15 attempts * 2 seconds)

    const checkStatus = useCallback(async () => {
        if (!transactionId || !authData.token) {
            setStatus('failed');
            setMessage('ID transaksi tidak valid atau Anda tidak diautentikasi.');
            if (pollingInterval.current) clearInterval(pollingInterval.current);
            return;
        }
        
        attempts.current++;

        try {
            const response = await fetch(`/api/payment/status/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                },
            });

            if (response.status === 404) {
                throw new Error('Transaksi tidak ditemukan.');
            }
            if (response.status === 403) {
                throw new Error('Anda tidak memiliki izin untuk melihat transaksi ini.');
            }
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Gagal memeriksa status.');
            }

            const data = await response.json();

            if (data.status === 'COMPLETED') {
                setStatus('success');
                setMessage('Pembayaran Anda telah berhasil dikonfirmasi! Poin telah ditambahkan.');
                if (pollingInterval.current) clearInterval(pollingInterval.current);
                await refetchUser(); // Refresh user data to show new points in header
            } else if (data.status === 'FAILED') {
                setStatus('failed');
                setMessage('Pembayaran Anda gagal atau dibatalkan.');
                if (pollingInterval.current) clearInterval(pollingInterval.current);
            } else {
                // Status is still PENDING, continue polling
                if (attempts.current >= maxAttempts) {
                    setStatus('timeout');
                    setMessage('Pemeriksaan memakan waktu lebih lama dari biasanya. Poin Anda akan ditambahkan secara otomatis saat pembayaran terkonfirmasi. Anda dapat menutup halaman ini.');
                    if (pollingInterval.current) clearInterval(pollingInterval.current);
                }
            }

        } catch (err) {
            setStatus('failed');
            setMessage(err instanceof Error ? err.message : 'Terjadi kesalahan saat memeriksa status.');
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        }
    }, [transactionId, authData.token, refetchUser]);

    useEffect(() => {
        if (!transactionId) {
            setStatus('failed');
            setMessage('ID Transaksi tidak ditemukan di URL.');
            return;
        }

        // Start polling immediately, then set interval
        checkStatus();
        pollingInterval.current = setInterval(checkStatus, 2000);

        // Cleanup function to stop polling when component unmounts
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [transactionId, checkStatus]);

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="text-center text-slate-800">
                        <LoadingSpinner />
                        <p className="text-slate-600 mt-4">{message}</p>
                        <p className="text-slate-500 text-sm">Mohon jangan tutup halaman ini...</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center text-green-800 bg-green-100 p-8 rounded-lg w-full max-w-md border-2 border-green-300 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
                        <p className="mb-6">{message}</p>
                        <p className="text-slate-700 mb-6 text-md">Sisa poin Anda: <span className="font-bold text-emerald-600">{authData.user?.points}</span></p>
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
                        <h2 className="text-2xl font-bold mb-2">Pembayaran Gagal</h2>
                        <p className="mb-6">{message}</p>
                        <Link to="/pricing" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                            Coba Lagi
                        </Link>
                    </div>
                );
            case 'timeout':
                return (
                     <div className="text-center text-amber-800 bg-amber-100 p-8 rounded-lg w-full max-w-md border-2 border-amber-300 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Pengecekan Berlangsung</h2>
                        <p className="mb-6">{message}</p>
                        <Link to="/app" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                            Kembali ke Halaman Utama
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