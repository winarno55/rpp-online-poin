import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto py-10 space-y-8">
             <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                    Kebijakan Privasi
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                    Terakhir diperbarui: 28 Juni 2024
                </p>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700">
                <p>
                    Terima kasih telah menggunakan Modul Ajar Cerdas ("kami", "situs", "layanan"). Kami berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
                </p>

                <h2 className="text-slate-800">1. Informasi yang Kami Kumpulkan</h2>
                <p>Kami mengumpulkan jenis informasi berikut:</p>
                <ul>
                    <li><strong>Informasi yang Anda Berikan:</strong> Saat Anda mendaftar, kami mengumpulkan alamat email dan password yang telah di-hash (terenkripsi). Saat Anda menggunakan layanan, kami mengumpulkan data yang Anda masukkan ke dalam formulir pembuatan Modul Ajar (seperti mata pelajaran, materi, dll.).</li>
                    <li><strong>Informasi Penggunaan:</strong> Kami menyimpan catatan tentang jumlah poin yang Anda miliki dan kapan Anda menggunakannya untuk membuat Modul Ajar.</li>
                </ul>

                <h2 className="text-slate-800">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
                <p>Informasi yang kami kumpulkan digunakan untuk:</p>
                <ul>
                    <li>Menyediakan, mengoperasikan, dan memelihara layanan kami.</li>
                    <li>Memproses transaksi dan mengelola akun Anda, termasuk penambahan dan pengurangan poin.</li>
                    <li>Mengirimkan informasi penting terkait akun, seperti email untuk reset password.</li>
                    <li>Menganalisis dan meningkatkan layanan kami. Data prompt yang Anda masukkan dapat kami gunakan secara anonim untuk melatih dan meningkatkan kualitas model AI kami.</li>
                </ul>

                <h2 className="text-slate-800">3. Keamanan Data</h2>
                <p>
                    Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi Anda. Password Anda disimpan dalam bentuk hash yang aman menggunakan enkripsi bcrypt, yang berarti kami sendiri tidak dapat melihat password asli Anda. Komunikasi dengan server kami dilindungi oleh enkripsi SSL/TLS.
                </p>

                <h2 className="text-slate-800">4. Penyimpanan Riwayat Modul Ajar</h2>
                <p>
                    Fitur "Riwayat Modul Ajar" menyimpan data RPP yang telah Anda generate secara lokal di perangkat Anda menggunakan teknologi IndexedDB pada browser Anda. Data ini **tidak disimpan di server kami**. Ini berarti riwayat Anda bersifat pribadi dan hanya dapat diakses dari browser tempat Anda membuatnya. Menghapus data browser (cache/cookies) dapat menghapus riwayat ini secara permanen.
                </p>
                
                <h2 className="text-slate-800">5. Berbagi Informasi</h2>
                <p>
                    Kami **tidak akan** menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali sebagaimana diwajibkan oleh hukum.
                </p>

                <h2 className="text-slate-800">6. Perubahan pada Kebijakan Privasi Ini</h2>
                <p>
                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan.
                </p>

                <h2 className="text-slate-800">7. Hubungi Kami</h2>
                <p>
                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui informasi kontak yang tersedia di situs ini.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;