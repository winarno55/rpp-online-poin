import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="text-sky-500 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();

    // Jika pengguna sudah login, langsung arahkan ke aplikasi utama
    if (isAuthenticated) {
        return <Navigate to="/app" replace />;
    }

    return (
        <div className="space-y-20 py-10">
            {/* Hero Section */}
            <section className="text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600 leading-tight">
                    Modul Ajar AI: Buat RPP & Modul Ajar Berkualitas dalam Menit
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                    Platform cerdas berbasis AI untuk membantu para guru di Indonesia membuat Modul Ajar (RPP) Kurikulum Merdeka yang inovatif, efektif, dan menyenangkan.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/register" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-lg">
                        Coba Gratis Sekarang
                    </Link>
                    <Link to="/login" className="bg-white hover:bg-slate-100 text-slate-700 font-semibold py-3 px-8 rounded-lg shadow-md border border-slate-300 transition-all">
                        Login
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="text-center">
                <h2 className="text-3xl font-bold text-slate-800">Kenapa Memilih Modul Ajar Cerdas?</h2>
                <p className="mt-2 text-slate-500">Fitur unggulan yang dirancang khusus untuk kebutuhan Anda.</p>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                        title="Generator Berbasis AI"
                        description="Ditenagai oleh teknologi AI terkini untuk menghasilkan konten Modul Ajar yang relevan, mendalam, dan sesuai dengan kaidah pedagogis."
                    />
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        title="Sesuai Kurikulum Merdeka"
                        description="Struktur dan komponen Modul Ajar telah disesuaikan dengan panduan terbaru Kurikulum Merdeka, mulai dari Fase A hingga Fase F."
                    />
                     <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                        title="Fleksibel & Dapat Diunduh"
                        description="Sesuaikan jumlah pertemuan, lalu cetak atau unduh hasilnya dalam format PDF dan TXT yang rapi dan siap digunakan."
                    />
                </div>
            </section>

             {/* Call to Action Bottom */}
            <section className="text-center bg-slate-800 text-white p-10 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold">Siap Menghemat Waktu Anda?</h2>
                <p className="mt-3 text-slate-300 max-w-2xl mx-auto">Bergabunglah dengan ribuan guru lainnya yang telah merasakan kemudahan dalam menyusun administrasi pembelajaran.</p>
                <div className="mt-8">
                    <Link to="/register" className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-all text-xl transform hover:scale-105">
                        Daftar & Dapatkan Poin Gratis
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;