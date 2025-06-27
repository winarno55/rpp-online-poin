import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LessonPlanForm } from '../components/LessonPlanForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { LessonPlanInput } from '../types';
import { markdownToPlainText } from '../utils/markdownUtils';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { authData, updatePoints } = useAuth();
  const [lessonPlanInput, setLessonPlanInput] = useState<LessonPlanInput | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<React.ReactNode | null>(null);

  const POINTS_PER_GENERATION = 20;

  const handleFormSubmit = useCallback(async (data: LessonPlanInput) => {
    if (!authData.token || !authData.user) {
      setError("Anda harus login untuk membuat RPP.");
      return;
    }

    if (authData.user.points < POINTS_PER_GENERATION) {
      setError(
        <>
          Poin Anda tidak cukup. Silakan{' '}
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
    setGeneratedPlan(null);
    setLessonPlanInput(data);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal terhubung ke server.');
      }
      
      const { lessonPlan, newPoints } = result;
      
      if (!lessonPlan || lessonPlan.trim() === "") {
        setGeneratedPlan(null);
        setError("Gagal menghasilkan konten RPP. AI mengembalikan respons kosong.");
      } else {
        setGeneratedPlan(lessonPlan);
        updatePoints(newPoints); // Update points in context
      }

    } catch (e) {
      console.error("Error generating lesson plan:", e);
      setGeneratedPlan(null);
      if (e instanceof Error) {
        setError(`Terjadi kesalahan: ${e.message}`);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [authData, updatePoints]);
  
  const handleDownloadTxt = useCallback(async () => {
    if (!generatedPlan || !lessonPlanInput) return;
     try {
        const plainTextContent = markdownToPlainText(generatedPlan);
        const fileName = `RPP_${lessonPlanInput.mataPelajaran.replace(/\s+/g, '_')}.txt`;
        const blob = new Blob([plainTextContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Error TXT", e);
        setError(e instanceof Error ? `Kesalahan TXT: ${e.message}` : 'Gagal membuat TXT.');
    }
  }, [generatedPlan, lessonPlanInput]);
  
  const handlePrint = useCallback(() => {
    if (!generatedPlan) return;
    window.print();
  }, [generatedPlan]);

  const downloadButtonBaseClass = "text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-base flex items-center justify-center gap-2 w-full sm:w-auto no-print";

  return (
    <>
      <div className="text-center mb-8 no-print">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
          Generator RPP/Modul Ajar Cerdas
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Buat RPP Inovatif dengan Prinsip Mindful, Meaningful, & Joyful Learning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 no-print">
          <LessonPlanForm onSubmit={handleFormSubmit} isLoading={isLoading} points={authData.user?.points ?? 0} cost={POINTS_PER_GENERATION} />
        </div>

        <div id="lesson-plan-display-container" className="bg-slate-200 shadow-inner rounded-xl p-2 sm:p-4 min-h-[400px] print-content">
          {isLoading && <div className="flex items-center justify-center h-full"><div className="text-slate-800"><LoadingSpinner /></div></div>}
          {error && !isLoading && (
             <div className="flex items-center justify-center h-full p-4">
                <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg w-full max-w-md border border-red-300">
                  <p className="font-semibold text-xl">Error!</p>
                  <div>{error}</div>
                </div>
            </div>
          )}
          {generatedPlan && !isLoading && !error && lessonPlanInput && (
            <div className="w-full">
              <div className="text-center mb-6 no-print">
                 <h2 className="text-2xl font-bold text-slate-800">RPP Berhasil Dibuat!</h2>
                 <p className="text-slate-600 mb-1">Anda telah menggunakan {POINTS_PER_GENERATION} poin.</p>
                 <p className="text-slate-700 mb-4 text-md">Sisa poin Anda: <span className="font-bold text-emerald-600">{authData.user?.points}</span></p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={handleDownloadTxt} className={`${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`} disabled={isLoading}>Unduh TXT</button>
                  <button onClick={handlePrint} className={`${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`} disabled={isLoading}>Cetak / Simpan PDF</button>
                </div>
              </div>
              
              <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                  <LessonPlanDisplay planText={generatedPlan} />
              </div>
            </div>
          )}
          {!isLoading && !error && !generatedPlan && (
            <div className="flex-grow flex flex-col items-center justify-center h-full text-slate-500 text-center no-print p-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              <p className="text-xl text-slate-600">RPP/Modul Ajar akan dihasilkan di sini.</p>
              <p className="text-sm text-slate-500">Isi formulir di samping dan klik "Buat RPP" untuk memulai.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;