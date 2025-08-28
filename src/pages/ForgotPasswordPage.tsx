import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await fetch('/api/auth?action=forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengirim email reset.');
            }
            // Use a more generic success message for security (prevents email enumeration)
            setMessage({ type: 'success', text: "Jika email Anda terdaftar, Anda akan menerima tautan untuk mereset password. Silakan cek inbox (dan folder spam) Anda." });
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Terjadi kesalahan' });
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-100";
    const labelClass = "block mb-2 text-sm font-medium text-sky-300";

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md bg-slate-800 shadow-2xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Lupa Password</h2>
                <p className="text-center text-slate-400 mb-6">Masukkan email Anda untuk menerima tautan reset password.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <p className={`${message.type === 'success' ? 'text-green-400 bg-green-900/50' : 'text-red-400 bg-red-900/50'} p-3 rounded-lg text-center`}>
                            {message.text}
                        </p>
                    )}
                    <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value.toLowerCase())} 
                            required 
                            className={inputClass} 
                            placeholder="email.terdaftar@contoh.com"
                            autoCapitalize="none"
                            autoCorrect="off" 
                        />
                    </div>
                    <button type="submit" disabled={isLoading || message?.type === 'success'} className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                        {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </button>
                </form>
                <p className="text-center text-slate-400 mt-6">
                    Ingat password Anda? <Link to="/login" className="font-medium text-sky-400 hover:underline">Login di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;