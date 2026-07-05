#!/bin/bash
cat << 'INNEREOF' > src/pages/HomePage.tsx
import { fetchWithRetry } from "../utils/fetchWithRetry";
import React, { useState, useEffect, useRef } from 'react';
import { LessonPlanInput, initDB, addRppToHistory } from '../types';
import { IdentityForm } from '../components/IdentityForm';
import { LessonPlanForm } from '../components/LessonPlanForm';
import { LessonPlanDisplay } from '../components/LessonPlanDisplay';
import { LessonPlanEditor } from '../components/LessonPlanEditor';
import { useAuth } from '../hooks/useAuth';
import { initGoogleAuth } from '../utils/googleDocs';
import { markdownToHtml } from '../utils/markdownUtils';

const TABS = [
    'Identitas & Kurikulum', 
    '1. Analisis CP', 
    '2. Tujuan Pembelajaran', 
    '3. Alur TP (ATP)', 
    '4. Program Tahunan', 
    '5. Program Semester', 
    '6. KKTP', 
    '7. Modul Ajar'
];

const emptyForm: LessonPlanInput = {
    provinsiKota: "", dinasPendidikan: "", satuanPendidikan: "SMP Negeri 3 Kerinci", alamatSekolah: "Jl. Lempur Tengah, Kec. Gunung Raya, Kab. Kerinci",
    mataPelajaran: "", singkatan: "", kelasFase: "D / VII", tahunPelajaran: "", alokasiWaktu: "", jpPerMinggu: "",
    durasiPertemuan: "", namaGuru: "", nipGuru: "", namaKepalaSekolah: "", nipKepalaSekolah: "", kotaTanggalTtd: "",
    elemenKode: "", cpUmum: "", cpPerElemen: "", kalenderPendidikan: "", rentangNilaiKktp: "",
    materi: "", jumlahPertemuan: "1 Pertemuan", jamPelajaran: "", pesertaDidik: "", dimensiProfilLulusan: [],
    capaianPembelajaran: "", lintasDisiplinIlmu: "", tujuanPembelajaran: "", praktikPedagogis: "Pendekatan Berdiferensiasi",
    lingkunganPembelajaran: "", pemanfaatanDigital: "", kemitraanPembelajaran: ""
};

const HomePage: React.FC = () => {
    const { authData, updatePoints } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<LessonPlanInput>(emptyForm);
    const [pricingConfig, setPricingConfig] = useState<any>(null);
    const [docs, setDocs] = useState<{[key: number]: string}>({});
    const [isLoadingStep, setIsLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [extractedTPs, setExtractedTPs] = useState<any[]>([]);

    // Modul Ajar specific states
    const [modulHtml, setModulHtml] = useState<string | null>(null);
    const [isGeneratingModul, setIsGeneratingModul] = useState(false);
    const [isEditingModul, setIsEditingModul] = useState(false);
    
    useEffect(() => {
        initGoogleAuth((u, t) => {}, () => {});
        initDB().catch(console.error);
        fetch('/api/pricing/config').then(res => res.json()).then(setPricingConfig).catch(console.error);
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const parseATP = (htmlContent: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const tables = doc.querySelectorAll('table');
        let tps: any[] = [];
        
        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td, th');
                let rowText = row.textContent || '';
                if (rowText.includes('TP') || (cells.length >= 4)) {
                    if (cells[0].tagName.toLowerCase() === 'td') {
                        tps.push({
                            kode: cells[0]?.textContent?.trim(),
                            tujuan: cells[1]?.textContent?.trim(),
                            materi: cells[2]?.textContent?.trim(),
                            alokasi: cells[3]?.textContent?.trim()
                        });
                    }
                }
            });
        });
        setExtractedTPs(tps);
    };

    const handleGenerateBundle = async () => {
        setError(null);
        let bundleId = null;
        let previousDocs: any = {};
        
        for (let step = 1; step <= 6; step++) {
            setIsLoadingStep(step);
            try {
                const response = await fetchWithRetry('/api/generate-bundle-step', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.token}` },
                    body: JSON.stringify({ step, inputData: formData, previousDocs, bundleId })
                }, 3);
                
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.message || `Gagal generate dokumen ${step}`);
                }
                
                bundleId = response.headers.get('X-Bundle-Id') || bundleId;
                const text = await response.text();
                const html = markdownToHtml(text);
                
                setDocs(prev => ({ ...prev, [step]: html }));
                previousDocs[`doc${step}`] = text;
                
                if (step === 3) parseATP(html);

            } catch (err: any) {
                setError(err.message);
                setIsLoadingStep(0);
                return;
            }
        }
        setIsLoadingStep(0);
        
        // Deduct points locally for UI since we charged on step 1
        const bundleCost = pricingConfig?.bundleCost || 50;
        updatePoints(Math.max(0, (authData.user?.points || 0) - bundleCost));
        
        setActiveTab(1); // Auto move to Dokumen 1
    };

    const handleGenerateModulAjar = async (data: LessonPlanInput) => {
        if (!authData.token) return setError("Anda harus login");
        setIsGeneratingModul(true);
        setError(null);
        setModulHtml('');
        
        try {
            const response = await fetchWithRetry('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.token}` },
                body: JSON.stringify(data),
            }, 5);

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Gagal dari server AI.');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedMarkdown = '';
            let newPoints = authData.user?.points || 0;

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedMarkdown += chunk;
                    setModulHtml(markdownToHtml(accumulatedMarkdown));
                }
                
                // Deduct UI points based on cost calculation
                const numSessions = parseInt(data.jumlahPertemuan) || 1;
                const costConfig = pricingConfig?.sessionCosts.find((sc:any) => sc.sessions === numSessions);
                const cost = costConfig ? costConfig.cost : 0;
                updatePoints(Math.max(0, newPoints - cost));
                
                // Save to history
                try {
                    await addRppToHistory(data, accumulatedMarkdown);
                } catch (e) {
                    console.error("Gagal simpan riwayat", e);
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGeneratingModul(false);
        }
    };

    const printDocument = (content: string, isLandscape: boolean = false) => {
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed'; printFrame.style.right = '0'; printFrame.style.bottom = '0';
        printFrame.style.width = '0'; printFrame.style.height = '0'; printFrame.style.border = 'none';
        document.body.appendChild(printFrame);
        const doc = printFrame.contentWindow?.document;
        if (doc) {
            const size = isLandscape ? 'A4 landscape' : 'A4 portrait';
            doc.open();
            doc.write(`
                <html>
                <head>
                    <style>
                    @media print { 
                        @page { size: ${size}; margin: 1.5cm; } 
                        body { font-family: 'Calibri', sans-serif; color: black; line-height: 1.5; }
                        table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #1a3a5c !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                    </style>
                </head>
                <body>${content}</body>
                </html>
            `);
            doc.close();
            setTimeout(() => {
                printFrame.contentWindow?.focus();
                printFrame.contentWindow?.print();
                setTimeout(() => document.body.removeChild(printFrame), 500);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-screen">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0 bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 h-fit sticky top-8">
                <h3 className="text-white font-bold mb-4 text-lg border-b border-slate-600 pb-2">Menu Dokumen</h3>
                <ul className="space-y-2">
                    {TABS.map((tab, idx) => (
                        <li key={idx}>
                            <button 
                                onClick={() => setActiveTab(idx)}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === idx ? 'bg-sky-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'}`}
                            >
                                {tab}
                                {isLoadingStep === idx && <span className="ml-2 animate-pulse text-sky-300">⏳</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full max-w-[8.5in]">
                {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}
                
                {activeTab === 0 && (
                    <IdentityForm 
                        formData={formData} 
                        handleChange={handleChange} 
                        onSubmit={handleGenerateBundle} 
                        isLoading={isLoadingStep > 0} 
                        bundleCost={pricingConfig?.bundleCost || 50} 
                    />
                )}

                {activeTab > 0 && activeTab < 7 && (
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 min-h-[11in]">
                        <div className="flex justify-between items-center mb-6 no-print">
                            <h2 className="text-2xl font-bold text-slate-800">{TABS[activeTab]}</h2>
                            <button onClick={() => printDocument(docs[activeTab] || '', activeTab >= 3 && activeTab <= 6)} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Cetak / PDF</button>
                        </div>
                        {docs[activeTab] ? (
                            <div className="prose max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: docs[activeTab] }} />
                        ) : (
                            <div className="text-slate-500 text-center py-20 italic">Dokumen belum di-generate. Silakan generate dari tab Identitas.</div>
                        )}
                    </div>
                )}

                {activeTab === 7 && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Buat Modul Ajar Baru</h2>
                            {extractedTPs.length > 0 ? (
                                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <label className="block text-sm font-semibold text-emerald-800 mb-2">Pilih Tujuan Pembelajaran dari ATP:</label>
                                    <select 
                                        className="w-full p-2 border border-emerald-300 rounded" 
                                        onChange={(e) => setFormData({...formData, tujuanPembelajaran: e.target.value})}
                                    >
                                        <option value="">-- Pilih TP --</option>
                                        {extractedTPs.map((tp, i) => (
                                            <option key={i} value={tp.tujuan}>{tp.kode} - {tp.tujuan}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                                    ⚠️ ATP belum digenerate atau TP tidak ditemukan. Anda dapat mengisi manual.
                                </div>
                            )}
                            <LessonPlanForm 
                                onSubmit={(data) => handleGenerateModulAjar({...formData, ...data})} 
                                isLoading={isGeneratingModul} 
                                points={authData.user?.points || 0} 
                                sessionCosts={pricingConfig?.sessionCosts || []} 
                                token={authData.token}
                                initialData={formData}
                                updatePoints={() => {}}
                            />
                        </div>

                        {modulHtml && (
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 min-h-[11in]">
                                <div className="flex justify-between items-center mb-6 no-print">
                                    <h2 className="text-2xl font-bold text-slate-800">Preview Modul Ajar</h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsEditingModul(!isEditingModul)} className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                            {isEditingModul ? 'Simpan' : 'Edit'}
                                        </button>
                                        <button onClick={() => printDocument(modulHtml, false)} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Cetak / PDF</button>
                                    </div>
                                </div>
                                {isEditingModul ? (
                                    <LessonPlanEditor html={modulHtml} onChange={setModulHtml} />
                                ) : (
                                    <LessonPlanDisplay htmlContent={modulHtml} />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
INNEREOF
chmod +x fix_homepage.sh
./fix_homepage.sh
