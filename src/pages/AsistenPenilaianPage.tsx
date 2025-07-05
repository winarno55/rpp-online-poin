import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { PenilaianInput } from '../types';
import { useAuth } from '../hooks/useAuth';
import { COST_ASISTEN_PENILAIAN } from '../constants';

const AsistenPenilaianPage: React.FC = () => {
    const { authData, updatePoints } = useAuth();
    const [formData, setFormData] = useState<PenilaianInput>({
        teksSiswa: '',
        kriteriaPenilaian: '',
    });
    const [generatedFeedback, setGeneratedFeedback] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<React.ReactNode | null>(null);

    const cost = COST_ASISTEN_PENILAIAN;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        setGeneratedFeedback(null);

        try {
            const response = await fetch('/api/generate-penilaian', {
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

            const { feedback, newPoints } = result;
            if (!feedback || feedback.trim() === "") {
                setGeneratedFeedback(null);
                setError("Gagal menghasilkan umpan balik. AI mengembalikan respons kosong.");
            } else {
                setGeneratedFeedback(feedback);
                updatePoints(newPoints);
            }
        } catch (e) {
            console.error("Error generating feedback:", e);
            setGeneratedFeedback(null);
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
                    Asisten Penilaian AI
                </h1>
                <p className="text-slate-300 mt-2 text-lg">
                    Dapatkan umpan balik konstruktif untuk esai siswa secara otomatis.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="teksSiswa" className={labelClass}>Teks/Esai Siswa</label>
                            <textarea name="teksSiswa" id="teksSiswa" value={formData.teksSiswa} onChange={handleChange} rows={10} className={inputClass} placeholder="Tempelkan (paste) seluruh teks atau esai yang ditulis siswa di sini..." required />
                        </div>
                        <div>
                            <label htmlFor="kriteriaPenilaian" className={labelClass}>Tujuan Pembelajaran / Kriteria Penilaian</label>
                            <textarea name="kriteriaPenilaian" id="kriteriaPenilaian" value={formData.kriteriaPenilaian} onChange={handleChange} rows={5} className={inputClass} placeholder="Jelaskan apa yang seharusnya didemonstrasikan siswa dalam tulisannya. cth: 'Siswa mampu menganalisis penyebab Perang Dunia I dari berbagai sudut pandang'..." required />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || (authData.user?.points ?? 0) < cost}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {isLoading ? 'Menganalisis...' : `Beri Umpan Balik (Biaya: ${cost} Poin)`}
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
                    {generatedFeedback && !isLoading && !error && (
                        <div className="w-full">
                           <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-slate-800">Umpan Balik Dihasilkan!</h2>
                                <p className="text-slate-600 mb-1">Anda telah menggunakan {cost} poin.</p>
                           </div>
                           <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                                <LessonPlanDisplay planText={generatedFeedback} />
                           </div>
                        </div>
                    )}
                    {!isLoading && !error && !generatedFeedback && (
                        <div className="flex-grow flex flex-col items-center justify-center h-full text-slate-500 text-center p-4">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                             <p className="text-xl text-slate-600">Hasil umpan balik akan muncul di sini.</p>
                             <p className="text-sm text-slate-500">Isi formulir di samping untuk memulai.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AsistenPenilaianPage;