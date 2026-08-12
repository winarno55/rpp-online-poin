import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ReferralEarningItem, WithdrawalItem } from '../types';
import { TiltCard } from '../components/ui/be-ui-tilt-card';

export const AffiliatePage: React.FC = () => {
  const { authData } = useAuth();
  const token = authData.token;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Referral Data State
  const [referralCode, setReferralCode] = useState('');
  const [affiliateBalance, setAffiliateBalance] = useState(0);
  const [totalEarnedAffiliate, setTotalEarnedAffiliate] = useState(0);
  const [referredUsersCount, setReferredUsersCount] = useState(0);
  const [referredUsers, setReferredUsers] = useState<Array<{ id: string; email: string; createdAt: string }>>([]);
  const [earnings, setEarnings] = useState<ReferralEarningItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [config, setConfig] = useState<{ minWithdrawalAmount: number; referralCommissionPercent: number; referralEnabled: boolean }>({
    minWithdrawalAmount: 50000,
    referralCommissionPercent: 15,
    referralEnabled: true,
  });

  // Withdrawal Form State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');
  const [bankName, setBankName] = useState('BCA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchReferralData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/referral/info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memuat data afiliasi.');
      }
      setReferralCode(data.referralCode || '');
      setAffiliateBalance(data.affiliateBalance || 0);
      setTotalEarnedAffiliate(data.totalEarnedAffiliate || 0);
      setReferredUsersCount(data.referredUsersCount || 0);
      setReferredUsers(data.referredUsers || []);
      setEarnings(data.earnings || []);
      setWithdrawals(data.withdrawals || []);
      if (data.config) {
        setConfig(data.config);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [token]);

  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setWithdrawError('Nominal penarikan harus lebih dari 0.');
      return;
    }
    if (Number(withdrawAmount) < config.minWithdrawalAmount) {
      setWithdrawError(`Minimal penarikan adalah Rp ${config.minWithdrawalAmount.toLocaleString('id-ID')}.`);
      return;
    }
    if (Number(withdrawAmount) > affiliateBalance) {
      setWithdrawError('Saldo komisi Anda tidak mencukupi.');
      return;
    }
    if (!accountNumber.trim() || !accountHolder.trim()) {
      setWithdrawError('Mohon isi nomor rekening dan nama pemilik rekening dengan lengkap.');
      return;
    }

    setIsSubmittingWithdraw(true);
    setWithdrawError(null);
    try {
      const res = await fetch('/api/referral/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          bankName,
          accountNumber,
          accountHolder
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengajukan penarikan dana.');
      }
      setSuccessMsg(data.message || 'Pengajuan penarikan dana berhasil dikirim!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchReferralData();
    } catch (err: any) {
      setWithdrawError(err.message || 'Gagal mengirim pengajuan.');
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  const formatCurrency = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-800 to-emerald-900 border border-sky-500/30 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm tracking-wide uppercase">
            <span>🚀 Program Afiliasi & Referral</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Komisi {config.referralCommissionPercent}%
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ajak Rekan Guru, Dapatkan Komisi Tunai yang BISA DITARIK
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Dapatkan komisi tunai sebesar <span className="text-amber-300 font-bold">{config.referralCommissionPercent}%</span> secara otomatis setiap kali rekan yang Anda undang melakukan pembelian poin. Komisi yang terkumpul dapat ditarik langsung ke Rekening Bank atau E-Wallet pilihan Anda!
          </p>

          {/* Referral Link & Code Box */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-slate-950/60 border border-slate-700/80 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="overflow-hidden truncate">
                <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider mb-1">Link Referral Anda</span>
                <span className="text-sm font-mono text-sky-300 truncate block select-all">{referralLink}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="shrink-0 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                {copiedLink ? '✓ Tersalin!' : 'Salin Link'}
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-700/80 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider mb-1">Kode Kode Referral</span>
                <span className="text-base font-bold font-mono text-amber-400 tracking-wider">{referralCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs transition-all active:scale-95"
              >
                {copiedCode ? '✓ Copied' : 'Salin Kode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white font-bold ml-4 text-sm">✕</button>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white font-bold ml-4 text-sm">✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <TiltCard className="bg-slate-800/90 border border-emerald-500/40 p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Saldo Siap Ditarik (WD)</span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">Uang Nyata</span>
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight mb-4 drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)]">
            {formatCurrency(affiliateBalance)}
          </div>
          <button
            onClick={() => {
              setWithdrawError(null);
              setShowWithdrawModal(true);
            }}
            disabled={affiliateBalance < config.minWithdrawalAmount}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {affiliateBalance < config.minWithdrawalAmount
              ? `Min. WD ${formatCurrency(config.minWithdrawalAmount)}`
              : 'Tarik Dana Ke Rekening (WD)'}
          </button>
        </TiltCard>

        <TiltCard className="bg-slate-800/90 border border-slate-700/80 p-6 shadow-xl backdrop-blur-sm">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">Total Komisi Akumulasi</span>
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight mb-2 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
            {formatCurrency(totalEarnedAffiliate)}
          </div>
          <p className="text-xs text-slate-400">Total komisi {config.referralCommissionPercent}% dari seluruh transaksi pengguna yang diajak.</p>
        </TiltCard>

        <TiltCard className="bg-slate-800/90 border border-slate-700/80 p-6 shadow-xl backdrop-blur-sm">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">Pengguna Terdaftar via Anda</span>
          <div className="text-3xl font-extrabold text-sky-400 tracking-tight mb-2 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)]">
            {referredUsersCount} <span className="text-sm font-normal text-slate-300">Orang</span>
          </div>
          <p className="text-xs text-slate-400">Guru/Pengguna yang mendaftar menggunakan link atau kode referral Anda.</p>
        </TiltCard>
      </div>

      {/* Modal Withdrawal Form */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>💸 Form Penarikan Dana (Withdrawal)</span>
              </h3>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {withdrawError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nominal Penarikan (Rp) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min={config.minWithdrawalAmount}
                  max={affiliateBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`Contoh: ${config.minWithdrawalAmount}`}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>Min: {formatCurrency(config.minWithdrawalAmount)}</span>
                  <span>Saldo Tersedia: <strong className="text-emerald-400">{formatCurrency(affiliateBalance)}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Bank / E-Wallet <span className="text-rose-400">*</span>
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="BCA">Bank BCA</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">Bank BRI</option>
                  <option value="BNI">Bank BNI</option>
                  <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                  <option value="Permata">Bank Permata</option>
                  <option value="CIMB">Bank CIMB Niaga</option>
                  <option value="DANA">DANA (E-Wallet)</option>
                  <option value="GoPay">GoPay (E-Wallet)</option>
                  <option value="OVO">OVO (E-Wallet)</option>
                  <option value="ShopeePay">ShopeePay (E-Wallet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nomor Rekening / No. HP E-Wallet <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Contoh: 1234567890"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Pemilik Rekening / Akun <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Sesuai nama di buku tabungan / e-wallet"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWithdraw}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingWithdraw ? 'Mengirim...' : 'Kirim Pengajuan WD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Riwayat Penarikan Dana */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center justify-between">
            <span>📋 Riwayat Penarikan Dana (WD)</span>
            <span className="text-xs text-slate-400 font-normal">{withdrawals.length} riwayat</span>
          </h2>

          {withdrawals.length === 0 ? (
            <p className="text-slate-400 text-xs italic py-6 text-center border border-dashed border-slate-700 rounded-xl">
              Belum ada riwayat penarikan dana.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Nominal</th>
                    <th className="p-3">Tujuan Transfer</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {withdrawals.map((w) => (
                    <tr key={w._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 whitespace-nowrap text-slate-300">
                        {new Date(w.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 whitespace-nowrap font-bold text-emerald-400">
                        {formatCurrency(w.amount)}
                      </td>
                      <td className="p-3 text-slate-300">
                        <div className="font-semibold">{w.bankName} - {w.accountNumber}</div>
                        <div className="text-[11px] text-slate-400">a.n {w.accountHolder}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {w.status === 'PENDING' && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                            Pending
                          </span>
                        )}
                        {w.status === 'PAID' && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                            Selesai (Sudah Ditransfer)
                          </span>
                        )}
                        {w.status === 'REJECTED' && (
                          <div className="space-y-0.5">
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-semibold">
                              Ditolak (Saldo Ditambahkan Kembali)
                            </span>
                            {w.adminNote && (
                              <p className="text-[11px] text-rose-400 italic mt-0.5">{w.adminNote}</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Riwayat Komisi Masuk */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center justify-between">
            <span>🎉 Riwayat Komisi Masuk</span>
            <span className="text-xs text-slate-400 font-normal">{earnings.length} transaksi</span>
          </h2>

          {earnings.length === 0 ? (
            <p className="text-slate-400 text-xs italic py-6 text-center border border-dashed border-slate-700 rounded-xl">
              Belum ada komisi masuk. Bagikan link referral Anda untuk mulai mendapatkan komisi!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Pembeli</th>
                    <th className="p-3">Transaksi</th>
                    <th className="p-3">Komisi (+{config.referralCommissionPercent}%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {earnings.map((e) => (
                    <tr key={e._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 whitespace-nowrap text-slate-300">
                        {new Date(e.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-3 text-slate-300 font-medium truncate max-w-[140px]">
                        {e.refereeEmail}
                      </td>
                      <td className="p-3 text-slate-300 whitespace-nowrap">
                        {formatCurrency(e.transactionAmount)}
                      </td>
                      <td className="p-3 whitespace-nowrap font-extrabold text-amber-400">
                        +{formatCurrency(e.commissionAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Daftar Rekan Terdaftar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center justify-between">
          <span>👥 Pengguna Yang Anda Undang ({referredUsers.length})</span>
        </h2>

        {referredUsers.length === 0 ? (
          <p className="text-slate-400 text-xs italic py-4 text-center border border-dashed border-slate-700 rounded-xl">
            Belum ada pengguna yang mendaftar lewat kodenya.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {referredUsers.map((user) => (
              <div key={user.id} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between">
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-sky-300 truncate">{user.email}</div>
                  <div className="text-[11px] text-slate-400">
                    Bergabung: {new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span className="text-xs bg-sky-500/10 text-sky-400 px-2 py-1 rounded border border-sky-500/20 shrink-0">
                  Aktif
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliatePage;
