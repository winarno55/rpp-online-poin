
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LessonPlanForm } from '../components/LessonPlanForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { LessonPlanEditor } from '../components/LessonPlanEditor';
import { LessonPlanInput, addRppToHistory, initDB } from '../types';
import { templates } from '../templates'; // Import templates
import { markdownToPlainText, markdownToHtml, htmlToPlainText, parseMarkdownToDocxJson } from '../utils/markdownUtils';
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
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [displayHtml, setDisplayHtml] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [dynamicCost, setDynamicCost] = useState(0);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [templateData, setTemplateData] = useState<LessonPlanInput | null>(null);
  
  // Ref untuk auto-scroll
  const resultRef = useRef<HTMLDivElement>(null);

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
  
  // Effect to convert markdown to HTML when generation is complete
  useEffect(() => {
    if (generatedMarkdown) {
      setDisplayHtml(markdownToHtml(generatedMarkdown));
    } else {
      setDisplayHtml(null);
    }
    // Always exit edit mode when a new plan is generated
    setIsEditing(false); 
  }, [generatedMarkdown]);

  // Effect to update nav links when display HTML changes
  useEffect(() => {
    if (displayHtml && !isLoading) {
        const headings: NavLink[] = [];
        const headingRegex = /<h([1-2]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
        let match;
        const tempDiv = document.createElement('div');

        while ((match = headingRegex.exec(displayHtml)) !== null) {
            const level = parseInt(match[1], 10);
            const id = match[2];
            
            // Use DOM parsing to safely get text content from the inner HTML
            tempDiv.innerHTML = match[3];
            const text = tempDiv.textContent || '';
            
            headings.push({ id, text, level });
        }
        setNavLinks(headings);
    } else if (!displayHtml) {
        setNavLinks([]);
    }
  }, [displayHtml, isLoading]);

  // Auto-scroll to result when loading starts
  useEffect(() => {
    if (isLoading && resultRef.current) {
        // Beri sedikit delay agar rendering awal selesai
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [isLoading]);


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
    setGeneratedMarkdown(''); // Reset to empty string for streaming
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
        setGeneratedMarkdown(accumulatedPlan); // Stream raw markdown
      }
      
      const finalUserPoints = authData.user.points - calculatedCost;
      updatePoints(finalUserPoints);

      try {
        await addRppToHistory(data, accumulatedPlan); // Save raw markdown to history
      } catch (dbError) {
        console.error("Gagal menyimpan Modul Ajar ke riwayat:", dbError);
      }

    } catch (e) {
      console.error("Error generating lesson plan:", e);
      setGeneratedMarkdown(null);
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
    if (!displayHtml || !lessonPlanInput) return;
     try {
        const plainTextContent = htmlToPlainText(displayHtml);
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
  }, [displayHtml, lessonPlanInput]);

  const handleDownloadDoc = useCallback(async () => {
    if (!displayHtml || !lessonPlanInput) return;
    try {
        const { exportToWord } = await import('../utils/docxUtils');
        const fileName = `ModulAjar_${lessonPlanInput.mataPelajaran.replace(/\s+/g, '_')}`;
        exportToWord(displayHtml, fileName);
    } catch (e) {
        console.error("Error creating DOC", e);
        setError(e instanceof Error ? `Kesalahan DOC: ${e.message}` : 'Gagal membuat DOC.');
    }
  }, [displayHtml, lessonPlanInput]);
  
  const handleDownloadDocx = useCallback(async () => {
    if (!generatedMarkdown || !lessonPlanInput) return;
    try {
        const { exportWithDocxTemplater } = await import('../utils/docxTemplaterUtils');
        const jsonData = parseMarkdownToDocxJson(generatedMarkdown);
        const fileName = `ModulAjar_${lessonPlanInput.mataPelajaran.replace(/\s+/g, '_')}.docx`;
        await exportWithDocxTemplater(jsonData, fileName);
    } catch (e) {
        console.error("Error creating DOCX from template:", e);
        setError(e instanceof Error ? `Gagal membuat file DOCX. Kesalahan: ${e.message}` : 'Gagal membuat DOCX.');
    }
  }, [generatedMarkdown, lessonPlanInput]);

  const handlePrint = useCallback(() => {
    if (!generatedMarkdown) return;
    window.print();
  }, [generatedMarkdown]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => {
      setIsEditing(false);
      if (generatedMarkdown) {
          setDisplayHtml(markdownToHtml(generatedMarkdown));
      }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    const selectedTemplate = templates.find(t => t.title === selectedTitle);
    setTemplateData(selectedTemplate ? selectedTemplate.data : null);
  };

  const downloadButtonBaseClass = "text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-base flex items-center justify-center gap-2 w-full sm:w-auto no-print";
  const editButtonBaseClass = "font-semibold py-2 px-4 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2";

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

      {/* Main Container - Stacked Vertical Layout */}
      <div className="flex flex-col gap-16">
        
        {/* SECTION 1: FORMULIR INPUT */}
        <div className="w-full max-w-5xl mx-auto bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-10 no-print border border-slate-700">
          <div className="flex-shrink-0 mb-8 border-b border-slate-700 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Mulai Perencanaan</h2>
              <label htmlFor="template-selector" className="block mb-2 text-sm font-medium text-sky-300">Gunakan Template Cepat (Opsional)</label>
              <select 
                id="template-selector" 
                onChange={handleTemplateChange}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors text-slate-100"
              >
                <option value="">-- Pilih Template atau Isi Formulir Sendiri --</option>
                {templates.map(template => (
                  <option key={template.title} value={template.title}>{template.title}</option>
                ))}
              </select>
          </div>
          {/* Form Content - Remove fixed height constraints */}
          <div className="min-h-0">
            <LessonPlanForm 
              onSubmit={handleFormSubmit} 
              isLoading={isLoading || !pricingConfig} 
              points={authData.user?.points ?? 0}
              sessionCosts={pricingConfig?.sessionCosts || []}
              initialData={templateData}
              token={authData.token}
              updatePoints={updatePoints}
            />
          </div>
        </div>

        {/* SECTION 2: HASIL GENERATE (DOCUMENT VIEW) */}
        {/* Only show this section if loading, error, or result exists */}
        {(isLoading || displayHtml || error) && (
            <div ref={resultRef} id="lesson-plan-result" className="w-full scroll-mt-24 bg-slate-100 rounded-2xl p-6 sm:p-8 min-h-[600px] border border-slate-300 shadow-inner">
                
                {isLoading && !displayHtml && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <LoadingSpinner />
                        <p className="mt-4 text-slate-600 animate-pulse text-lg font-medium">AI sedang menyusun Modul Ajar terbaik untuk Anda...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="flex items-center justify-center py-10">
                        <div className="text-center text-red-700 bg-red-100 p-6 rounded-xl w-full max-w-2xl border border-red-300 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="font-bold text-2xl mb-2">Terjadi Kesalahan</h3>
                            <div className="text-lg">{error}</div>
                        </div>
                    </div>
                )}

                {displayHtml !== null && !error && lessonPlanInput && (
                    <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
                        
                        {/* Sidebar Navigation (Sticky on Desktop) */}
                        {navLinks.length > 0 && !isLoading && (
                            <nav className="w-full lg:w-64 order-2 lg:order-1 lg:sticky top-24 self-start no-print bg-white p-5 rounded-xl border border-slate-200 shadow-md max-h-[80vh] overflow-y-auto">
                                <h3 className="font-bold text-slate-800 mb-4 text-lg border-b pb-2">Daftar Isi</h3>
                                <ul className="space-y-3">
                                    {navLinks.map(link => (
                                        <li key={link.id}>
                                            <a href={`#${link.id}`} 
                                            className={`block text-sm hover:text-sky-600 transition-colors leading-snug ${
                                                link.level === 1 ? 'font-bold text-slate-800' : 'text-slate-600 pl-4 border-l-2 border-slate-200 hover:border-sky-300'
                                            }`}>
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        {/* Document Area */}
                        <div className="flex-1 w-full max-w-[8.5in] order-1 lg:order-2">
                            {/* Toolbar (Download & Edit) */}
                            <div className="mb-8 no-print bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                                <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Dokumen Modul Ajar</h2>
                                {!isLoading && (
                                    <>
                                        <p className="text-slate-500 text-center mb-6">
                                            Digenerate menggunakan {dynamicCost} poin. Sisa poin: <span className="font-bold text-emerald-600">{authData.user?.points}</span>
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-3 justify-center mb-6">
                                            <button onClick={handleDownloadDocx} className={`${downloadButtonBaseClass} bg-blue-600 hover:bg-blue-700`}>Unduh DOCX (Template)</button>
                                            <button onClick={handleDownloadDoc} className={`${downloadButtonBaseClass} bg-gray-600 hover:bg-gray-700`}>Unduh DOC (Lama)</button>
                                            <button onClick={handleDownloadTxt} className={`${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`}>Unduh TXT</button>
                                            <button onClick={handlePrint} className={`${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`}>Cetak / PDF</button>
                                        </div>

                                        <div className="flex justify-center border-t border-slate-100 pt-4">
                                            {!isEditing ? (
                                                <button onClick={handleEdit} className={`${editButtonBaseClass} bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                                                    Mode Edit Dokumen
                                                </button>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button onClick={handleSave} className={`${editButtonBaseClass} bg-emerald-500 hover:bg-emerald-600 text-white px-5`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        Selesai Edit
                                                    </button>
                                                    <button onClick={handleCancel} className={`${editButtonBaseClass} bg-slate-500 hover:bg-slate-600 text-white px-5`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        Batal
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                {isLoading && (
                                    <p className="text-center text-sky-600 animate-pulse font-medium">Sedang menyusun...</p>
                                )}
                            </div>
                            
                            {/* THE PAPER PREVIEW */}
                            <div id="rpp-paper-preview" className="bg-white rounded-none sm:rounded-md shadow-2xl mx-auto p-8 md:p-16 min-h-[11in] text-slate-900 border border-slate-200" style={{maxWidth: '8.5in'}}>
                                {isEditing ? (
                                    <LessonPlanEditor html={displayHtml} onChange={setDisplayHtml} />
                                ) : (
                                    <LessonPlanDisplay htmlContent={displayHtml} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
