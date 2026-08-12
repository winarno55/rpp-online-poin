import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || searchParams.get('referral') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(initialRef);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialRef) {
      setReferralCode(initialRef);
    }
  }, [initialRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, referralCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }
      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputClass = "w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-800";
  const labelClass = "block mb-2 text-sm font-medium text-slate-600";

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-slate-200">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Register Gratis</h2>
        {initialRef && (
          <p className="text-center text-xs text-emerald-600 font-medium mb-6 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
            🎁 Mendaftar dengan Undangan Referral ({initialRef})
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center border border-red-200 text-sm">{error}</p>}
          {success && <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center border border-green-200 text-sm">{success}</p>}
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value.toLowerCase())} 
              required 
              className={inputClass} 
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="referralCode" className={labelClass}>
              Kode Referral {initialRef ? '(Terkunci)' : '(Opsional)'}
            </label>
            <div className="relative">
              <input 
                type="text" 
                id="referralCode" 
                value={referralCode} 
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())} 
                placeholder="Contoh: MAC12345"
                readOnly={!!initialRef}
                className={`${inputClass} ${initialRef ? 'bg-slate-200/80 text-slate-700 cursor-not-allowed font-mono font-semibold pr-24' : ''}`} 
              />
              {initialRef && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  🔒 Terkunci
                </span>
              )}
            </div>
            {initialRef && (
              <p className="text-[11px] text-slate-500 mt-1">
                Kode referral terisi otomatis dari link undangan yang Anda buka dan tidak dapat diubah.
              </p>
            )}
          </div>
          <button type="submit" disabled={isLoading || !!success} className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg">
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </form>
         <p className="text-center text-slate-500 mt-6 text-sm">
          Sudah punya akun? <Link to="/login" className="font-medium text-sky-600 hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;