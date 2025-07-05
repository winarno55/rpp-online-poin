import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { MateriAjarInput } from '../types';
import { useAuth } from '../hooks/useAuth';
import { TIPE_MATERI_AJAR_OPTIONS, COST_MATERI_AJAR } from '../constants';

const GeneratorMateriAjarPage: React.FC = () => {
    const { authData, updatePoints } = useAuth();
    const [formData, setFormData] = useState<MateriAjarInput>({
        tipeMateri: TIPE_MATERI_AJAR_OPTIONS[0],
        topik: '',
        sasaran: '',
        detailTambahan: ''
    });
    const [generatedMateri, setGeneratedMateri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<React.ReactNode | null>(null);

    const cost = COST_MATERI_AJAR;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setGeneratedMateri(null);

        try {
            const response = await fetch('/api/generate-materi-ajar', {
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

            const { materi, newPoints } = result;
            if (!materi || materi.trim() === "") {
                setGeneratedMateri(null);
                setError("Gagal menghasilkan materi ajar. AI mengembalikan respons kosong.");
            } else {
                setGeneratedMateri(materi);
                updatePoints(newPoints);
            }
        } catch (e) {
            console.error("Error generating teaching material:", e);
            setGeneratedMateri(null);
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
                    Generator Materi Ajar
                </h1>
                <p className="text-slate-300 mt-2 text-lg">
                    Buat artikel, studi kasus, naskah drama, dan lainnya untuk memperkaya pembelajaran.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8">
                   <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="tipeMateri" className={labelClass}>Tipe Materi Ajar</label>
                            <select name="tipeMateri" id="tipeMateri" value={formData.tipeMateri} onChange={handleChange} className={inputClass} required>
                                {TIPE_MATERI_AJAR_OPTIONS.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                            </select>
                        </div>
                        <div>
                          <label htmlFor="topik" className={labelClass}>Topik / Tema Utama</label>
                          <input type="text" name="topik" id="topik" value={formData.topik} onChange={handleChange} className={inputClass} placeholder="cth: Dampak Perubahan Iklim di Indonesia" required />
                        </div>
                        <div>
                          <label htmlFor="sasaran" className={labelClass}>Target Audiens / Sasaran</label>
                          <input type="text" name="sasaran" id="sasaran" value={formData.sasaran} onChange={handleChange} className={inputClass} placeholder="cth: Siswa Kelas XI SMA, Anak Usia Dini" required />
                        </div>
                        <div>
                          <label htmlFor="detailTambahan" className={labelClass}>Detail Tambahan <span className="text-slate-400 font-light">(Opsional)</span></label>
                          <textarea name="detailTambahan" id="detailTambahan" value={formData.detailTambahan} onChange={handleChange} rows={4} className={inputClass} placeholder="Jelaskan instruksi khusus. cth: Buat naskah drama dengan 4 tokoh, fokus pada dialog yang lucu. Untuk artikel, sertakan 3 sub-judul." />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || (authData.user?.points ?? 0) < cost}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {isLoading ? 'Membuat Materi...' : `Buat Materi Ajar (Biaya: ${cost} Poin)`}
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
                    {generatedMateri && !isLoading && !error && (
                        <div className="w-full">
                           <div className="text-center mb-4">
                             <h2 className="text-2xl font-bold text-slate-800">Materi Ajar Berhasil Dibuat!</h2>
                             <p className="text-slate-600 mb-1">Anda telah menggunakan {cost} poin.</p>
                           </div>
                           <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                                <LessonPlanDisplay planText={generatedMateri} />
                           </div>
                        </div>
                    )}
                    {!isLoading && !error && !generatedMateri && (
                        <div className="flex-grow flex flex-col items-center justify-center h-full text-slate-500 text-center p-4">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                            <p className="text-xl text-slate-600">Materi ajar akan ditampilkan di sini.</p>
                            <p className="text-sm text-slate-500">Isi formulir di samping untuk memulai.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GeneratorMateriAjarPage;