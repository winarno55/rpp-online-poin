import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ==========================================
// 1. INTERACTIVE 3D NEURAL NETWORK CANVAS
// ==========================================
const NeuralNetwork3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = containerRef.current?.clientWidth || 500);
        let height = (canvas.height = containerRef.current?.clientHeight || 500);

        const handleResize = () => {
            if (!containerRef.current || !canvas) return;
            width = canvas.width = containerRef.current.clientWidth;
            height = canvas.height = containerRef.current.clientHeight;
        };

        window.addEventListener('resize', handleResize);

        // Dynamic 3D Points
        const numPoints = 45;
        const points: Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; color: string }> = [];
        const colors = ['#38bdf8', '#10b981', '#6366f1', '#06b6d4'];

        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: (Math.random() - 0.5) * 320,
                y: (Math.random() - 0.5) * 320,
                z: (Math.random() - 0.5) * 320,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                vz: (Math.random() - 0.5) * 0.6,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let targetRotX = 0;
        let targetRotY = 0;
        let currentRotX = 0;
        let currentRotY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            targetRotY = (x / rect.width) * 0.8;
            targetRotX = -(y / rect.height) * 0.8;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        let angle = 0;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            currentRotX += (targetRotX - currentRotX) * 0.05;
            currentRotY += (targetRotY - currentRotY) * 0.05;
            angle += 0.005;

            const fov = 350;
            const centerX = width / 2;
            const centerY = height / 2;

            const rotY = angle + currentRotY;
            const rotX = currentRotX;

            const projectedPoints: Array<{ x: number; y: number; z: number; scale: number; color: string }> = [];

            for (let p of points) {
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;

                if (Math.abs(p.x) > 180) p.vx *= -1;
                if (Math.abs(p.y) > 180) p.vy *= -1;
                if (Math.abs(p.z) > 180) p.vz *= -1;

                let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
                let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);

                let y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
                let z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);

                const scale = fov / (fov + z2 + 250);
                const projX = centerX + x1 * scale;
                const projY = centerY + y2 * scale;

                projectedPoints.push({ x: projX, y: projY, z: z2, scale, color: p.color });
            }

            // Lines
            ctx.lineWidth = 1;
            for (let i = 0; i < projectedPoints.length; i++) {
                for (let j = i + 1; j < projectedPoints.length; j++) {
                    const p1 = projectedPoints[i];
                    const p2 = projectedPoints[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * Math.min(p1.scale, p2.scale) * 0.7;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        grad.addColorStop(0, p1.color);
                        grad.addColorStop(1, p2.color);
                        ctx.strokeStyle = grad;
                        ctx.globalAlpha = alpha;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            // Core Glow
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, 55 * Math.sin(angle * 2) + 60, 0, Math.PI * 2);
            const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 90);
            coreGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
            coreGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
            coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = coreGrad;
            ctx.fill();
            ctx.restore();

            // Nodes
            projectedPoints.sort((a, b) => b.z - a.z);

            for (let p of projectedPoints) {
                const radius = Math.max(2, 5 * p.scale);
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 12 * p.scale;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[400px] md:h-[480px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <canvas ref={canvasRef} className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing" />

            <div className="absolute top-6 left-2 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-300 shadow-2xl flex items-center gap-2 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>🧠 Model Neural AI v2.0</span>
            </div>

            <div className="absolute bottom-10 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 shadow-2xl flex items-center gap-2 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <span className="text-base">📜</span>
                <span>CP No. 046 &amp; 020 (PAI)</span>
            </div>

            <div className="absolute top-12 right-2 z-20 bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-300 shadow-2xl flex items-center gap-2 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <span className="text-base">⚡</span>
                <span>10x Lebih Cepat &amp; Presisi</span>
            </div>
        </div>
    );
};

// ==========================================
// 2. 3D INTERACTIVE TILT CARD
// ==========================================
const Card3D: React.FC<{ icon: React.ReactNode; title: string; description: string; tag?: string }> = ({
    icon,
    title,
    description,
    tag,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<{ transform: string; shine: string }>({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        shine: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 80%)',
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
            shine: `radial-gradient(circle at ${x}px ${y}px, rgba(56, 189, 248, 0.15) 0%, transparent 70%)`,
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            shine: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)',
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: style.transform, transition: 'transform 0.15s ease-out' }}
            className="relative bg-white/90 backdrop-blur-sm p-7 rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-2xl text-left overflow-hidden group"
        >
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: style.shine }}
            />

            {tag && (
                <span className="inline-block px-2.5 py-0.5 mb-3 text-[10px] font-bold tracking-wider uppercase bg-sky-100 text-sky-700 rounded-full">
                    {tag}
                </span>
            )}

            <div className="text-sky-500 mb-4 p-3 bg-sky-50 rounded-xl inline-block group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                {icon}
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                {title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
};

// ==========================================
// 3. MAIN LANDING PAGE
// ==========================================
const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location]);

    if (isAuthenticated) {
        return <Navigate to="/app" replace />;
    }

    return (
        <div className="space-y-24 sm:space-y-32 py-6">
            {/* HERO SECTION WITH 3D NEURAL CANVAS */}
            <section className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 pt-4">
                <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-sm backdrop-blur-sm">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        📢 Update CP Resmi: BSKAP No. 046/2025 &amp; CP No. 020 (PAI) Ditambahkan
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                        Evolusi Perencanaan Mengajar.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500">
                            Ditenagai AI Deep Learning.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Bukan sekadar generator instan. Platform kami menggunakan model neural interaktif yang menyusun Modul Ajar (RPP) yang dipersonalisasi, relevan, dan 100% selaras dengan standar nasional terbaru.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <Link
                            to="/register"
                            className="relative group bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all duration-300 text-lg text-center transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Mulai Buat Modul Ajar
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>
                        <Link
                            to="/#tutorial"
                            className="bg-white/80 hover:bg-slate-100/90 text-slate-700 font-semibold py-4 px-8 rounded-xl shadow-md border border-slate-200/90 transition-all duration-200 text-center text-lg backdrop-blur-sm"
                        >
                            Pelajari Cara Kerja
                        </Link>
                    </div>

                    <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                        <div>
                            <div className="text-2xl font-black text-slate-800">100%</div>
                            <div className="text-xs text-slate-500 font-medium">Sesuai Kurikulum Merdeka</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-sky-600">BSKAP 046</div>
                            <div className="text-xs text-slate-500 font-medium">&amp; CP 020 (PAI)</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-emerald-600">&lt; 3 Mnt</div>
                            <div className="text-xs text-slate-500 font-medium">Waktu Pembuatan</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 relative flex items-center justify-center">
                    <NeuralNetwork3D />
                </div>
            </section>

            {/* 4-STEP TUTORIAL SECTION */}
            <section id="tutorial" className="text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 px-6 sm:px-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 px-3.5 py-1.5 rounded-full border border-sky-800/50">
                        Alur Kerja Efisien
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 text-white">Cara Kerja dalam 4 Langkah Mudah</h2>
                    <p className="mt-3 text-slate-400 text-base sm:text-lg">
                        Dari konsep materi menjadi Modul Ajar terstruktur lengkap dalam hitungan menit.
                    </p>
                </div>

                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {[
                        {
                            step: '01',
                            title: '1. Isi Formulir',
                            desc: 'Pilih mata pelajaran, fase/kelas, dan topik. Ambil CP resmi secara otomatis dengan satu klik.',
                            icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            ),
                        },
                        {
                            step: '02',
                            title: '2. Proses Neural AI',
                            desc: 'Mesin AI deep learning menyusun RPP lengkap (CP, TP, ATP, Kegiatan, Asesmen, Rubrik) secara real-time.',
                            icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            ),
                        },
                        {
                            step: '03',
                            title: '3. Tinjau & Edit',
                            desc: 'Pratinjau hasil dalam tampilan rapi. Sempurnakan detail atau ubah poin tertentu langsung di editor.',
                            icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            ),
                        },
                        {
                            step: '04',
                            title: '4. Ekspor DOCX',
                            desc: 'Unduh dokumen profesional (.docx) siap cetak dengan tata letak dan tabel standar sekolah.',
                            icon: (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            ),
                        },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 text-left relative group hover:border-sky-500/50 transition-all duration-300">
                            <span className="absolute top-4 right-4 text-3xl font-black text-slate-700/60 group-hover:text-sky-500/30 transition-colors">
                                {item.step}
                            </span>
                            <div className="w-12 h-12 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    {item.icon}
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3D TILT FEATURE CARDS */}
            <section id="fitur" className="text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                    Keunggulan Utama
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
                    Platform yang Didesain Khusus untuk Pendidik Modern
                </h2>
                <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-base">
                    Gabungan antara kecerdasan buatan terpadu dan kepatuhan regulasi pendidikan Indonesia.
                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card3D
                        tag="Akurasi Regulasi"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        title="Database CP Resmi Terintegrasi"
                        description="Dilengkapi rujukan Capaian Pembelajaran BSKAP No. 046/2025 dan Keputusan CP No. 020 untuk PAI. Cukup sekali klik untuk menarik CP resmi."
                    />

                    <Card3D
                        tag="Kecerdasan Kontekstual"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                        title="Formulasi Pembelajaran Berdampak"
                        description="AI menyusun Alur Tujuan Pembelajaran (ATP), Aktivitas Pemantik, Pertanyaan Inti, hingga Asesmen Diagnostik &amp; Formatif secara koheren."
                    />

                    <Card3D
                        tag="Tata Letak Rapi"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                        title="Ekspor DOCX &amp; Google Docs"
                        description="Dokumen langsung siap pakai dengan styling tabel profesional, border elegan, dan format tulisan yang tidak berantakan saat dibuka di Microsoft Word."
                    />
                </div>
            </section>

            {/* CALL TO ACTION BOTTOM */}
            <section className="relative text-center bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 text-white p-10 sm:p-14 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Siap Menghemat Waktu Administrasi Anda?
                    </h2>
                    <p className="text-sky-100 text-base sm:text-lg leading-relaxed">
                        Fokus pada hal yang paling utama: membimbing dan menginspirasi siswa di kelas. Biarkan AI kami menangani kerangka dokumen pembelajaran Anda.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/register"
                            className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-10 rounded-xl shadow-2xl transition-all text-lg transform hover:scale-105 inline-block"
                        >
                            Daftar &amp; Coba Sekarang
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

