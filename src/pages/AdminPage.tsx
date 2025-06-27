import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AdminPage: React.FC = () => {
  const { authData } = useAuth();
  const [targetEmail, setTargetEmail] = useState('');
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authData.token) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/add-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`,
        },
        body: JSON.stringify({ email: targetEmail, points: pointsToAdd }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menambahkan poin.');
      }

      setMessage({ type: 'success', text: result.message });
      setTargetEmail('');
      setPointsToAdd(0);
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
        <h2 className="text-3xl font-bold text-center text-white mb-6">Admin Panel - Tambah Poin</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <p className={`${message.type === 'success' ? 'text-green-400 bg-green-900/50' : 'text-red-400 bg-red-900/50'} p-3 rounded-lg text-center`}>
              {message.text}
            </p>
          )}
          <div>
            <label htmlFor="targetEmail" className={labelClass}>Email Pengguna</label>
            <input
              type="email"
              id="targetEmail"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label htmlFor="pointsToAdd" className={labelClass}>Jumlah Poin</label>
            <input
              type="number"
              id="pointsToAdd"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(Number(e.target.value))}
              required
              min="1"
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg">
            {isLoading ? 'Memproses...' : 'Tambah Poin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;