import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// SVG component untuk visualisasi jaringan saraf
const NeuralNetworkIcon: React.FC = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-70">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgb(56, 189, 248)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'rgb(16, 185, 129)', stopOpacity: 1}} />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        {/* Garis-garis koneksi */}
        <line x1="30" y1="50" x2="100" y2="30" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="30" y1="50" x2="100" y2="70" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="30" y1="50" x2="100" y2="110" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="30" y1="50" x2="100" y2="150" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="30" y1="120" x2="100" y2="30" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="30" y1="120" x2="100" y2="70" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="30" y1="120" x2="100" y2="110" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="30" y1="120" x2="100" y2="150" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="100" y1="30" x2="170" y2="90" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="100" y1="70" x2="170" y2="90" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="100" y1="110" x2="170" y2="90" stroke="url(#grad1)" strokeWidth="1.5" />
        <line x1="100" y1="150" x2="170" y2="90" stroke="url(#grad1)" strokeWidth="1.5" />
        {/* Node (simpul) */}
        <circle cx="30" cy="50" r="10" fill="#1e293b" stroke="rgb(56, 189, 248)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="30" cy="120" r="10" fill="#1e293b" stroke="rgb(56, 189, 248)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="100" cy="30" r="8" fill="#1e293b" stroke="rgb(56, 189, 248)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="100" cy="70" r="8" fill="#1e293b" stroke="rgb(56, 189, 248)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="100" cy="110" r="8" fill="#1e293b" stroke="rgb(16, 185, 129)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="100" cy="150" r="8" fill="#1e293b" stroke="rgb(16, 185, 129)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="170" cy="90" r="12" fill="#1e293b" stroke="rgb(16, 185, 129)" strokeWidth="2" filter="url(#glow)" />
    </svg>
);


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-left transform hover:-translate-y-2 transition-transform duration-300">
        <div className="text-sky-500 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/app" replace />;
    }

    return (
        <div className="space-y-20 sm:space-y-28 py-10">
            {/* Hero Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500 leading-tight">
                        Evolusi Perencanaan Mengajar. Ditenagai oleh AI Deep Learning.
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0">
                        Bukan sekadar generator. Platform kami belajar dan beradaptasi untuk menyusun Modul Ajar (RPP) yang dipersonalisasi, relevan, dan benar-benar berdampak.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                        <Link to="/register" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-lg text-center">
                            Mulai Evolusi Anda
                        </Link>
                        <Link to="/#fitur" className="bg-white hover:bg-slate-100 text-slate-700 font-semibold py-3 px-8 rounded-lg shadow-md border border-slate-300 transition-all text-center">
                            Pelajari Lebih Lanjut
                        </Link>
                    </div>
                </div>
                 <div className="w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg">
                    <NeuralNetworkIcon />
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="text-center">
                <h2 className="text-3xl font-bold text-slate-800">Platform yang Dibangun untuk Masa Depan Pendidikan</h2>
                <p className="mt-2 text-slate-500 max-w-3xl mx-auto">Tiga pilar teknologi yang mengubah cara Anda merancang pengalaman belajar.</p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                        title="Inti Kognitif (Cognitive Core)"
                        description="Menggunakan model deep learning canggih yang dilatih secara ekstensif pada data pedagogis untuk memahami konteks dan menghasilkan konten pembelajaran yang relevan secara mendalam."
                    />
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        title="Adaptasi Kurikulum Cerdas"
                        description="AI kami tidak hanya mengikuti template, tetapi 'memahami' nuansa Kurikulum Merdeka, memastikan setiap komponen selaras dengan prinsip dan tujuan pembelajaran terkini."
                    />
                     <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                        title="Personalisasi & Kontrol Penuh"
                        description="Dapatkan kerangka cerdas yang solid dari AI, lalu sempurnakan setiap detailnya. Anda memegang kendali penuh untuk menciptakan Modul Ajar yang otentik sesuai gaya mengajar Anda."
                    />
                </div>
            </section>

             {/* Call to Action Bottom */}
            <section className="text-center bg-slate-800 text-white p-10 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold">Siap Mengalami Masa Depan Perencanaan?</h2>
                <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
                    Bergabunglah dengan para pendidik visioner yang memanfaatkan kekuatan deep learning untuk menciptakan dampak nyata di ruang kelas.
                </p>
                <div className="mt-8">
                    <Link to="/register" className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105 inline-block">
                        Mulai Evolusi Mengajar Anda
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;