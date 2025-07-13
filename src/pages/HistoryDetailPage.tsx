import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initDB, getRppById, RppHistoryItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { markdownToPlainText, markdownToHtml } from '../utils/markdownUtils';
import { exportToDocx } from '../utils/docxUtils';

const HistoryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [rpp, setRpp] = useState<RppHistoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRpp = async () => {
            if (!id) {
                setError("ID Modul Ajar tidak ditemukan di URL.");
                setLoading(false);
                return;
            }
            try {
                await initDB();
                const numericId = parseInt(id, 10);
                if (isNaN(numericId)) {
                    setError("ID Modul Ajar tidak valid. Pastikan URL benar.");
                    setLoading(false);
                    return;
                }
                const item = await getRppById(numericId);
                if (item) {
                    setRpp(item);
                } else {
                    setError(`Modul Ajar dengan ID ${id} tidak ditemukan di riwayat Anda.`);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Gagal memuat Modul Ajar dari database lokal.');
            } finally {
                setLoading(false);
            }
        };

        loadRpp();
    }, [id]);

    const handleDownloadTxt = useCallback(async () => {
        if (!rpp) return;
        try {
            const plainTextContent = markdownToPlainText(rpp.generatedPlan);
            const fileName = `ModulAjar_${rpp.mataPelajaran.replace(/\s+/g, '_')}.txt`;
            const blob = new Blob([plainTextContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (e) {
            console.error("Error generating TXT file:", e);
            setError(e instanceof Error ? `Kesalahan saat membuat file TXT: ${e.message}` : 'Gagal membuat file TXT.');
        }
    }, [rpp]);

    const handleDownloadDocx = useCallback(() => {
        if (!rpp) return;
        try {
            const htmlContent = markdownToHtml(rpp.generatedPlan);
            const fileName = `ModulAjar_${rpp.mataPelajaran.replace(/\s+/g, '_')}`;
            exportToDocx(htmlContent, fileName);
        } catch (e) {
            console.error("Error creating DOCX file:", e);
            setError(e instanceof Error ? `Kesalahan saat membuat file DOCX: ${e.message}` : 'Gagal membuat file DOCX.');
        }
    }, [rpp]);
    
    const handlePrint = useCallback(() => {
        if (!rpp) return;
        window.print();
    }, [rpp]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    if (error) {
        return (
            <div className="text-center p-4 max-w-lg mx-auto">
                 <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg shadow-lg">
                    <p className="font-bold text-xl mb-2">Terjadi Kesalahan</p>
                    <p>{error}</p>
                </div>
                <Link to="/app/history" className="mt-6 inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-5 rounded-md text-sm transition-colors shadow-md">
                    Kembali ke Riwayat
                </Link>
            </div>
        );
    }

    if (!rpp) {
         return (
            <div className="text-center text-slate-400 py-10">
                <p className="text-xl">Modul Ajar tidak ditemukan.</p>
                <Link to="/app/history" className="mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors">
                    Kembali ke Riwayat
                </Link>
            </div>
        );
    }
    
    const downloadButtonBaseClass = "text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-base flex items-center justify-center gap-2 w-full sm:w-auto no-print";


    return (
        <div className="w-full">
            <div className="no-print mb-6">
                 <Link to="/app/history" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Kembali ke Riwayat
                </Link>
            </div>

            <div className="text-center mb-6 no-print">
                <h1 className="text-3xl font-bold text-white">{rpp.mataPelajaran}</h1>
                <p className="text-slate-300 mt-1 text-lg">{rpp.materi}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <button onClick={handleDownloadDocx} className={`${downloadButtonBaseClass} bg-blue-600 hover:bg-blue-700`}>Unduh DOCX</button>
                    <button onClick={handleDownloadTxt} className={`${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`}>Unduh TXT</button>
                    <button onClick={handlePrint} className={`${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`}>Cetak / Simpan PDF</button>
                </div>
            </div>
            
            <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                <LessonPlanDisplay htmlContent={markdownToHtml(rpp.generatedPlan)} />
            </div>
        </div>
    );
};

export default HistoryDetailPage;