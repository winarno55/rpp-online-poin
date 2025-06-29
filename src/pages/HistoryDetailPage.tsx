import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initDB, getRppById, RppHistoryItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { markdownToPlainText } from '../utils/markdownUtils';

const HistoryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [rpp, setRpp] = useState<RppHistoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRpp = async () => {
            if (!id) {
                setError("ID Modul Ajar tidak ditemukan.");
                setLoading(false);
                return;
            }
            try {
                await initDB();
                const numericId = parseInt(id, 10);
                const item = await getRppById(numericId);
                if (item) {
                    setRpp(item);
                } else {
                    setError("Modul Ajar dengan ID ini tidak ditemukan di riwayat Anda.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Gagal memuat Modul Ajar dari riwayat.");
            } finally {
                setLoading(false);
            }
        };
        loadRpp();
    }, [id]);
    
    const handleDownloadTxt = useCallback(() => {
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
        } catch (e) {
            console.error("Error creating TXT", e);
            setError(e instanceof Error ? `Kesalahan TXT: ${e.message}` : 'Gagal membuat TXT.');
        }
    }, [rpp]);

    const handlePrint = useCallback(() => {
        if (!rpp) return;
        window.print();
    }, [rpp]);
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (error) {
        return (
             <div className="text-center">
                <p className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>
                <Link to="/history" className="mt-4 inline-block text-sky-400 hover:underline">Kembali ke Riwayat</Link>
            </div>
        );
    }
    
    if (!rpp) {
        return <div className="text-center text-slate-400">Modul Ajar tidak ditemukan.</div>;
    }
    
    const downloadButtonBaseClass = "text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-base flex items-center justify-center gap-2 w-full sm:w-auto";

    return (
        <div className="grid grid-cols-1 gap-8">
            <div className="w-full">
                <div className="text-center mb-6 no-print">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                        Detail Riwayat Modul Ajar
                    </h2>
                    <p className="text-slate-300 mt-1">Dibuat pada {new Date(rpp.createdAt).toLocaleString('id-ID')}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                        <button onClick={handleDownloadTxt} className={`${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`}>Unduh TXT</button>
                        <button onClick={handlePrint} className={`${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`}>Cetak / Simpan PDF</button>
                        <Link to="/history" className={`${downloadButtonBaseClass} bg-slate-600 hover:bg-slate-500`}>Kembali ke Riwayat</Link>
                    </div>
                </div>
                
                <div className="bg-slate-200 shadow-inner rounded-xl p-2 sm:p-4 print-content">
                    <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                        <LessonPlanDisplay planText={rpp.generatedPlan} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryDetailPage;