import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto py-10 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                    Tentang Modul Ajar Cerdas
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                    Memberdayakan Guru, Menginspirasi Siswa.
                </p>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700">
                <p>
                    <strong>Modul Ajar Cerdas</strong> lahir dari sebuah pemahaman mendalam akan tantangan yang dihadapi para guru di Indonesia setiap harinya. Kami menyadari bahwa tugas seorang guru tidak hanya sebatas mengajar di depan kelas, tetapi juga mencakup beban administrasi yang signifikan, terutama dalam penyusunan Rencana Pelaksanaan Pembelajaran (RPP) atau Modul Ajar yang sesuai dengan tuntutan kurikulum modern seperti Kurikulum Merdeka.
                </p>
                <p>
                    Waktu dan energi yang seharusnya bisa lebih banyak dicurahkan untuk berinovasi di dalam kelas, berinteraksi dengan siswa, dan mengembangkan metode pengajaran yang kreatif, seringkali terkuras untuk memenuhi tuntutan administrasi tersebut.
                </p>

                <h2 className="text-slate-800">Misi Kami</h2>
                <p>
                    Misi kami sederhana: **mengembalikan waktu berharga para guru**. Kami percaya bahwa teknologi, khususnya kecerdasan buatan (AI), dapat menjadi asisten yang andal bagi para pendidik. Dengan Modul Ajar Cerdas, kami bertujuan untuk:
                </p>
                <ul>
                    <li><strong>Menyederhanakan Proses:</strong> Mengubah proses pembuatan Modul Ajar yang rumit menjadi beberapa klik sederhana.</li>
                    <li><strong>Meningkatkan Kualitas:</strong> Menyediakan kerangka kerja Modul Ajar yang tidak hanya lengkap secara administratif, tetapi juga kaya akan ide-ide pembelajaran yang bermakna, penuh kesadaran (mindful), dan menyenangkan (joyful).</li>
                    <li><strong>Mendukung Inovasi:</strong> Memberikan guru titik awal yang kuat sehingga mereka bisa lebih fokus pada penyesuaian dan implementasi kreatif di kelas masing-masing.</li>
                </ul>
                
                <h2 className="text-slate-800">Bagaimana Cara Kerjanya?</h2>
                <p>
                    Kami mengintegrasikan model AI canggih dengan pemahaman mendalam tentang prinsip-prinsip pedagogi dan struktur Kurikulum Merdeka. Anda hanya perlu memasukkan beberapa informasi kunci mengenai materi yang akan diajarkan, dan sistem kami akan menyusun draf Modul Ajar yang komprehensif, mulai dari informasi umum, tujuan pembelajaran, asesmen, hingga lampiran seperti LKPD dan rubrik penilaian.
                </p>
                 <p>
                    Kami bukan pengganti kreativitas guru, melainkan mitra dalam proses perencanaan. Kami adalah alat untuk memantik ide dan mempercepat pekerjaan, sehingga Anda bisa menjadi versi terbaik dari diri Anda sebagai seorang pendidik.
                </p>

                <div className="text-center mt-12 bg-slate-100 p-6 rounded-lg">
                    <p className="text-xl font-semibold text-slate-800">Siap untuk memulai?</p>
                    <Link to="/register" className="mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all">
                        Daftar Gratis Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;