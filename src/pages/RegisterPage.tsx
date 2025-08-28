import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Register Gratis</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center border border-red-200">{error}</p>}
          {success && <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center border border-green-200">{success}</p>}
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
          <button type="submit" disabled={isLoading || !!success} className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg">
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </form>
         <p className="text-center text-slate-500 mt-6">
          Sudah punya akun? <Link to="/login" className="font-medium text-sky-600 hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;