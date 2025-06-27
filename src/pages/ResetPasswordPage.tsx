import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Password tidak cocok.' });
            return;
        }
        if (password.length < 6) {
             setMessage({ type: 'error', text: 'Password minimal harus 6 karakter.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`/api/auth/reset-password?token=${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mereset password.');
            }
            setMessage({ type: 'success', text: data.message });
            setTimeout(() => navigate('/login'), 3000);
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
                <h2 className="text-3xl font-bold text-center text-white mb-6">Reset Password Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <p className={`${message.type === 'success' ? 'text-green-400 bg-green-900/50' : 'text-red-400 bg-red-900/50'} p-3 rounded-lg text-center`}>
                            {message.text}
                        </p>
                    )}
                    <div>
                        <label htmlFor="password" className={labelClass}>Password Baru</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className={labelClass}>Konfirmasi Password Baru</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
                    </div>
                    <button type="submit" disabled={isLoading || message?.type === 'success'} className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                        {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                    </button>
                </form>
                {message?.type === 'success' && (
                    <p className="text-center text-slate-400 mt-6">
                        Anda akan diarahkan ke halaman <Link to="/login" className="font-medium text-sky-400 hover:underline">Login</Link>.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;