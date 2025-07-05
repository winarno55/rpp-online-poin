import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { BankSoalInput } from '../types';
import { useAuth } from '../hooks/useAuth';
import { KELAS_FASE_OPTIONS, TIPE_SOAL_OPTIONS, TINGKAT_KESULITAN_OPTIONS, COST_BANK_SOAL } from '../constants';

const GeneratorBankSoalPage: React.FC = () => {
    const { authData, updatePoints } = useAuth();
    const [formData, setFormData] = useState<BankSoalInput>({
        mataPelajaran: '',
        kelasFase: KELAS_FASE_OPTIONS[0],
        materi: '',
        jumlahSoal: 10,
        tipeSoal: TIPE_SOAL_OPTIONS[0],
        tingkatKesulitan: TINGKAT_KESULITAN_OPTIONS[1],
        petunjukTambahan: ''
    });
    const [generatedSoal, setGeneratedSoal] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<React.ReactNode | null>(null);

    const cost = COST_BANK_SOAL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'number' ? parseInt(value) : value 
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authData.token || !authData.user) {
            setError("Anda harus login untuk menggunakan fitur ini.");
            return;
        }

        if (authData.user.points < cost) {
            setError(
                <>
                    Poin Anda tidak cukup (butuh {cost} poin). Silakan{' '}
                    <Link to="/pricing" className="font-bold underline text-sky-400 hover:text-sky-300">
                        isi ulang di sini
                    </Link>
                    .
                </>
            );
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedSoal(null);

        try {
            const response = await fetch('/api/generate-bank-soal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal terhubung ke server.');
            }

            const { soal, newPoints } = result;
            if (!soal || soal.trim() === "") {
                setGeneratedSoal(null);
                setError("Gagal menghasilkan soal. AI mengembalikan respons kosong.");
            } else {
                setGeneratedSoal(soal);
                updatePoints(newPoints);
            }
        } catch (e) {
            console.error("Error generating question bank:", e);
            setGeneratedSoal(null);
            setError(e instanceof Error ? `Terjadi kesalahan: ${e.message}` : "Terjadi kesalahan yang tidak diketahui.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClass = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-50";
    const labelClass = "block mb-2 text-sm font-medium text-sky-300";

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                    Generator Bank Soal
                </h1>
                <p className="text-slate-300 mt-2 text-lg">
                    Buat set soal ulangan atau kuis lengkap dengan kunci jawaban dan rubrik.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8">
                   <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="mataPelajaran" className={labelClass}>Mata Pelajaran</label>
                          <input type="text" name="mataPelajaran" id="mataPelajaran" value={formData.mataPelajaran} onChange={handleChange} className={inputClass} placeholder="cth: Sejarah Indonesia" required />
                        </div>
                         <div>
                            <label htmlFor="kelasFase" className={labelClass}>Kelas/Fase</label>
                            <select name="kelasFase" id="kelasFase" value={formData.kelasFase} onChange={handleChange} className={inputClass} required>
                                {KELAS_FASE_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                            </select>
                        </div>
                        <div>
                          <label htmlFor="materi" className={labelClass}>Materi/Topik Spesifik</label>
                          <input type="text" name="materi" id="materi" value={formData.materi} onChange={handleChange} className={inputClass} placeholder="cth: Perjuangan Kemerdekaan 1945-1949" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="jumlahSoal" className={labelClass}>Jumlah Soal</label>
                                <input type="number" name="jumlahSoal" id="jumlahSoal" value={formData.jumlahSoal} onChange={handleChange} className={inputClass} required min="1" max="25" />
                            </div>
                            <div>
                                <label htmlFor="tipeSoal" className={labelClass}>Tipe Soal</label>
                                <select name="tipeSoal" id="tipeSoal" value={formData.tipeSoal} onChange={handleChange} className={inputClass} required>
                                    {TIPE_SOAL_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                                </select>
                            </div>
                        </div>
                        
                         <div>
                            <label htmlFor="tingkatKesulitan" className={labelClass}>Tingkat Kesulitan</label>
                            <select name="tingkatKesulitan" id="tingkatKesulitan" value={formData.tingkatKesulitan} onChange={handleChange} className={inputClass} required>
                                {TINGKAT_KESULITAN_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                            </select>
                        </div>
                        
                        <div>
                          <label htmlFor="petunjukTambahan" className={labelClass}>Petunjuk Tambahan <span className="text-slate-400 font-light">(Opsional)</span></label>
                          <textarea name="petunjukTambahan" id="petunjukTambahan" value={formData.petunjukTambahan} onChange={handleChange} rows={3} className={inputClass} placeholder="cth: Fokus pada soal analisis (HOTS), jangan sertakan soal tentang tanggal spesifik." />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || (authData.user?.points ?? 0) < cost}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {isLoading ? 'Membuat Soal...' : `Buat Bank Soal (Biaya: ${cost} Poin)`}
                        </button>
                         {!isLoading && (authData.user?.points ?? 0) < cost && (
                           <p className="text-center text-red-400 mt-2">Poin tidak cukup.</p>
                        )}
                   </form>
                </div>

                <div className="bg-slate-200 shadow-inner rounded-xl p-2 sm:p-4 min-h-[400px]">
                     {isLoading && <div className="flex items-center justify-center h-full"><div className="text-slate-800"><LoadingSpinner /></div></div>}
                    {error && !isLoading && (
                        <div className="flex items-center justify-center h-full p-4">
                            <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg w-full max-w-md border border-red-300">
                                <p className="font-semibold text-xl">Error!</p>
                                <div>{error}</div>
                            </div>
                        </div>
                    )}
                    {generatedSoal && !isLoading && !error && (
                        <div className="w-full">
                           <div className="text-center mb-4">
                             <h2 className="text-2xl font-bold text-slate-800">Bank Soal Berhasil Dibuat!</h2>
                             <p className="text-slate-600 mb-1">Anda telah menggunakan {cost} poin.</p>
                           </div>
                           <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                                <LessonPlanDisplay planText={generatedSoal} />
                           </div>
                        </div>
                    )}
                    {!isLoading && !error && !generatedSoal && (
                        <div className="flex-grow flex flex-col items-center justify-center h-full text-slate-500 text-center p-4">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.15 12.082 12.082 0 0 1 .664 6.66l-3.602 3.602a.75.75 0 0 0 1.06 1.06l3.602-3.602a12.082 12.082 0 0 1 6.66.664A2.25 2.25 0 0 1 18 15.75h.008a2.25 2.25 0 0 1 2.15 2.242m-5.305 0a2.25 2.25 0 0 0-2.242-2.15M5.25 6H5.25" /></svg>
                            <p className="text-xl text-slate-600">Bank soal akan ditampilkan di sini.</p>
                            <p className="text-sm text-slate-500">Isi formulir di samping untuk memulai.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GeneratorBankSoalPage;