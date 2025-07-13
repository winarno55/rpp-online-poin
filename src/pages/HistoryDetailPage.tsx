import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { initDB, getRppById, RppHistoryItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { LessonPlanEditor } from '../components/LessonPlanEditor'; // Import editor
import { markdownToHtml, htmlToPlainText } from '../utils/markdownUtils'; // Import htmlToPlainText
import { exportToWord } from '../utils/docxUtils';

const HistoryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [rpp, setRpp] = useState<RppHistoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State untuk fitur editor interaktif
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [displayHtml, setDisplayHtml] = useState<string | null>(null);
    const [originalHtml, setOriginalHtml] = useState<string | null>(null);

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
                    const html = markdownToHtml(item.generatedPlan);
                    setDisplayHtml(html);
                    setOriginalHtml(html);
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
        if (!rpp || !displayHtml) return;
        try {
            const plainTextContent = htmlToPlainText(displayHtml); // Gunakan HTML yang sudah diedit
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
    }, [rpp, displayHtml]);

    const handleDownloadDoc = useCallback(() => {
        if (!rpp || !displayHtml) return;
        try {
            const fileName = `ModulAjar_${rpp.mataPelajaran.replace(/\s+/g, '_')}`;
            exportToWord(displayHtml, fileName);
        } catch (e) {
            console.error("Error creating DOC file:", e);
            setError(e instanceof Error ? `Kesalahan saat membuat file DOC: ${e.message}` : 'Gagal membuat file DOC.');
        }
    }, [rpp, displayHtml]);
    
    const handlePrint = useCallback(() => {
        if (!rpp) return;
        window.print();
    }, [rpp]);

    // Handler untuk fungsionalitas edit
    const handleEdit = () => setIsEditing(true);
    const handleSave = () => setIsEditing(false); // Perubahan sudah tersimpan di state `displayHtml`
    const handleCancel = () => {
        setIsEditing(false);
        if (originalHtml) {
            setDisplayHtml(originalHtml); // Kembalikan ke konten asli
        }
    };

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
    const editButtonBaseClass = "font-semibold py-2 px-4 rounded-lg shadow-sm transition-all text-sm flex items-center gap-2";

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
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                    <button onClick={handleDownloadDoc} className={`${downloadButtonBaseClass} bg-blue-600 hover:bg-blue-700`}>Unduh DOC (Word)</button>
                    <button onClick={handleDownloadTxt} className={`${downloadButtonBaseClass} bg-emerald-500 hover:bg-emerald-600`}>Unduh TXT</button>
                    <button onClick={handlePrint} className={`${downloadButtonBaseClass} bg-sky-500 hover:bg-sky-600`}>Cetak / Simpan PDF</button>
                </div>
                 <div className="mt-4 flex flex-row gap-3 justify-center">
                    {!isEditing ? (
                        <button onClick={handleEdit} className={`${editButtonBaseClass} bg-slate-600 hover:bg-slate-700 text-white`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                            Edit Modul
                        </button>
                    ) : (
                        <>
                            <button onClick={handleSave} className={`${editButtonBaseClass} bg-green-500 hover:bg-green-600 text-white`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Simpan Perubahan
                            </button>
                            <button onClick={handleCancel} className={`${editButtonBaseClass} bg-gray-500 hover:bg-gray-600 text-white`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                Batalkan
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <div id="rpp-paper-preview" className="bg-white rounded-md shadow-lg mx-auto p-8 md:p-12" style={{maxWidth: '8.5in'}}>
                 {displayHtml && (
                    isEditing ? (
                        <LessonPlanEditor html={displayHtml} onChange={setDisplayHtml} />
                    ) : (
                        <LessonPlanDisplay htmlContent={displayHtml} />
                    )
                )}
            </div>
        </div>
    );
};

export default HistoryDetailPage;