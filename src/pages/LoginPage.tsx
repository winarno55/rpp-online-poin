import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }
      login(data.token, data.user);
      navigate(from, { replace: true });
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
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center border border-red-200">{error}</p>}
          <div>
            <label htmlFor="login-identity" className={labelClass}>Email atau Username Admin</label>
            <input 
              type="text" 
              id="login-identity" 
              value={email} 
              onChange={(e) => setEmail(e.target.value.toLowerCase())} 
              required 
              className={inputClass}
              placeholder="Masukkan email Anda atau 'admin'"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg">
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-slate-500 mt-6">
          Belum punya akun? <Link to="/register" className="font-medium text-sky-600 hover:underline">Register di sini</Link>
        </p>
        <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-slate-500 hover:text-sky-600 transition-colors">
                Lupa Password?
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;