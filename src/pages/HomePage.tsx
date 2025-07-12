import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LessonPlanForm } from '../components/LessonPlanForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { LessonPlanInput, addRppToHistory, initDB } from '../types';
import { markdownToPlainText, markdownToHtml } from '../utils/markdownUtils';
import { exportToDocx } from '../utils/docxUtils';
import { useAuth } from '../hooks/useAuth';

interface SessionCost {
  sessions: number;
  cost: number;
}
interface PricingConfig {
  sessionCosts: SessionCost[];
}
interface NavLink {
    id: string;
    text: string;
    level: number;
}


const HomePage: React.FC = () => {
  const { authData, updatePoints } = useAuth();
  const [lessonPlanInput, setLessonPlanInput] = useState<LessonPlanInput | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [dynamicCost, setDynamicCost] = useState(0);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    initDB().catch(err => {
      console.error("Gagal menginisialisasi IndexedDB:", err);
    });

    const fetchPricingConfig = async () => {
        try {
            const response = await fetch('/api/pricing/config');
            const data = await response.json();
            if (!response.ok) throw new Error('Gagal memuat konfigurasi biaya.');
            setPricingConfig(data);
        } catch (error) {
            console.error("Error fetching pricing config:", error);
            setError("Gagal memuat konfigurasi biaya dari server.");
        }
    };
    fetchPricingConfig();

  }, []);
  
  useEffect(() => {
    if (generatedPlan && !isLoading) {
        const lines = generatedPlan.split('\n');
        const headings: NavLink[] = [];
        const headingRegex = /^(#{1,3})\s+(.*)/;
        
        lines.forEach(line => {
            const match = line.match(headingRegex);
            if (match) {
                const level = match[1].length;
                // Hanya ambil H1 dan H2 untuk navigasi utama
                if (level > 2) return;
                
                const text = match[2].replace(/\*\*/g, '').trim();
                const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
                headings.push({ id, text, level });
            }
        });
        setNavLinks(headings);
    } else if (!generatedPlan) {
        setNavLinks([]); // Hapus navigasi jika tidak ada plan
    }
  }, [generatedPlan, isLoading]);


  const handleFormSubmit = useCallback(async (data: LessonPlanInput) => {
    if (!authData.token || !authData.user) {
      setError("Anda harus login untuk membuat Modul Ajar.");
      return;
    }
    
    const numSessions = parseInt(data.jumlahPertemuan) || 1;
    const costConfig = pricingConfig?.sessionCosts.find(sc => sc.sessions === numSessions);
    const calculatedCost = costConfig ? costConfig.cost : 0;
    
    if (calculatedCost === 0) {
        setError("Konfigurasi biaya untuk jumlah sesi yang dipilih tidak ditemukan.");
        return;
    }
    setDynamicCost(calculatedCost);

    if (authData.user.points < calculatedCost) {
      setError(
        <>
          Poin Anda tidak cukup (butuh {calculatedCost} poin). Silakan{' '}
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
    setGeneratedPlan(''); // Reset to empty string for streaming
    setLessonPlanInput(data);
    setNavLinks([]); // Hapus navigasi lama

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Gagal terhubung ke server.');
      }
      
      if (!response.body) {
          throw new Error("Respons streaming tidak memiliki body.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedPlan = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedPlan += chunk;
        setGeneratedPlan(accumulatedPlan);
      }
      
      // Update points and save to history after stream is complete
      const finalUserPoints = authData.user.points - calculatedCost;
      updatePoints(finalUserPoints);

      try {
        await addRppToHistory(data, accumulatedPlan);
      } catch (dbError) {
        console.error("Gagal menyimpan Modul Ajar ke riwayat:", dbError);
        // This is a non-critical error, so we just log it.
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
  }, [authData, updatePoints, pricingConfig]);
  
  const handleDownloadTxt = useCallback(async () => {
    if (!generatedPlan || !lessonPlanInput) return;
     try {
        const plainTextContent = markdownToPlainText(generatedPlan);
        const fileName = `ModulAjar_${lessonPlanInput.mataPelajaran.replace(/\s+/g, '_')}.txt`;
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

  const handleDownloadDocx = useCallback(() => {
    if (!generatedPlan || !lessonPlanInput) return;
    try {
        const htmlContent = markdownToHtml(generatedPlan);
        const fileName = `ModulAjar_${lessonPlanInput.mataPelajaran.replace(/\s+/g, '_')}`;
        exportToDocx(htmlContent, fileName);
    } catch (e) {
        console.error("Error creating DOCX", e);
        setError(e instanceof Error ? `Kesalahan DOCX: ${e.message}` : 'Gagal membuat DOCX.');
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
          Modul Ajar Cerdas
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Buat Modul Ajar Inovatif dengan Prinsip Mindful, Meaningful, & Joyful Learning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 no-print">
          <LessonPlanForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading || !pricingConfig} 
            points={authData.user?.points ?? 0}
            sessionCosts={pricingConfig?.sessionCosts || []}
          />
        </div>

        <div id="lesson-plan-display-container" className="bg-slate-200 shadow-inner rounded-xl p-2 sm:p-4 min-h-[400px] print-content">
          {isLoading && !generatedPlan && <div className="flex items-center justify-center h-full"><div className="text-slate-800"><LoadingSpinner /></div></div>}
          {error && !isLoading && (
             <div className="flex items-center justify-center h-full p-4">
                <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg w-full max-w-md border border-red-300">
                  <p className="font-semibold text-xl">Error!</p>
                  <div>{error}</div>
                </div>
            </div>
          )}
          {generatedPlan !== null && !error && lessonPlanInput && (
            <div className="w-full flex flex-col lg:flex-row gap-6">
               {navLinks.length > 0 && !isLoading && (
                    <nav className="w-full lg:w-1/4 h-full lg:h-screen lg:sticky top-24 self-start no-print bg-slate-100 p-4 rounded-lg border border-slate-300">
                        <h3 className="font-bold text-slate-800 mb-3 text-lg">Navigasi Cepat</h3>
                        <ul className="space-y-2">
                            {navLinks.map(link => (
                                <li key={link.id}>
                                    <a href={`#${link.id}`} 
                                       className={`block text-sm hover:text-sky-600 transition-colors ${
                                           link.level === 1 ? 'font-bold text-slate-700' : 'text-slate-600 pl-3'
                                       }`}>
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-center mb-6 no-print">
                    <h2 className="text-2xl font-bold text-slate-800">Modul Ajar Dihasilkan</h2>
                    {!isLoading && (
                        <>
                            <p className="text-slate-600 mb-1">Anda telah menggunakan {dynamicCost} poin.</p>
                            <p className="text-slate-700 mb-4 text-md">Sisa poin Anda: <span className="font-bold text-emerald-600">{authData.user?.points}</span></p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={handleDownloadDocx} className={`${downloadButtonBaseClass} bg-blue-600 hover:bg-blue-700`}>Unduh DOCX</button>
                            <button onClick={handleDownloadTxt} className={`${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`}>Unduh TXT</button>
                            <button onClick={handlePrint} className={`${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`}>Cetak / Simpan PDF</button>
                            </div>
                        </>
                    )}
                    {isLoading && (
                        <p className="text-slate-600 animate-pulse">AI sedang menulis, mohon tunggu...</p>
                    )}
                  </div>
                  <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                      <LessonPlanDisplay planText={generatedPlan} />
                  </div>
                </div>
            </div>
          )}
          {!isLoading && !error && generatedPlan === null && (
            <div className="flex-grow flex flex-col items-center justify-center h-full text-slate-500 text-center no-print p-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              <p className="text-xl text-slate-600">Modul Ajar akan dihasilkan di sini.</p>
              <p className="text-sm text-slate-500">Isi formulir di samping dan klik "Buat Modul Ajar" untuk memulai.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;