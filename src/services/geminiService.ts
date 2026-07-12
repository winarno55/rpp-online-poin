import { LessonPlanInput } from '../types';

const getFase = (k: string) => {
    if (["Kelas I", "Kelas II"].includes(k)) return "Fase A";
    if (["Kelas III", "Kelas IV"].includes(k)) return "Fase B";
    if (["Kelas V", "Kelas VI"].includes(k)) return "Fase C";
    if (["Kelas VII", "Kelas VIII", "Kelas IX"].includes(k)) return "Fase D";
    if (k === "Kelas X") return "Fase E";
    if (["Kelas XI", "Kelas XII"].includes(k)) return "Fase F";
    return "";
};

export const generateLessonPlanPrompt = (input: LessonPlanInput): string => {
  const { 
    mataPelajaran, singkatan, kelasFase, tahunPelajaran, alokasiWaktu, jpPerMinggu, durasiPertemuan,
    materi, jumlahPertemuan, tujuanPembelajaran, praktikPedagogis,
    dimensiProfilLulusan
  } = input;

  const fase = getFase(kelasFase);
  const kelasFaseCombined = `${kelasFase} / ${fase}`;

  const isPjok = mataPelajaran?.toLowerCase().includes('pjok') ||
                 mataPelajaran?.toLowerCase().includes('penjas') ||
                 mataPelajaran?.toLowerCase().includes('jasmani') ||
                 mataPelajaran?.toLowerCase().includes('olahraga');

  const pjokSpecificRules = isPjok ? `
KHUSUS MATAPELAJARAN PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan):
Sesuai **BSKAP No. 046/H/KR/2025**, elemen PJOK tidak lagi menggunakan elemen lama (Keterampilan Gerak, Pengetahuan Gerak, Pemanfaatan Gerak, dsb). 
Anda **WAJIB** menggunakan 4 Elemen Baru PJOK berikut beserta deskripsi Capaian Pembelajarannya:
1. **Terampil Bergerak** (TB) - Capaian Pembelajaran: Peserta didik mempraktikkan keterampilan gerak dasar (lokomotor, non-lokomotor, manipulatif) secara mandiri atau dalam bentuk variasi dan kombinasi gerak secara tepat dalam berbagai aktivitas jasmani, permainan, dan olahraga.
2. **Belajar melalui Gerak** (BMG) - Capaian Pembelajaran: Peserta didik memahami dan menerapkan konsep, prinsip, prosedur, taktik, dan strategi gerak, serta menginternalisasi nilai-nilai karakter (mandiri, kerja sama, sportivitas, tanggung jawab) melalui aktivitas jasmani secara aman dan menyenangkan.
3. **Bergaya Hidup Aktif** (BHA) - Capaian Pembelajaran: Peserta didik melakukan aktivitas jasmani secara teratur untuk memelihara dan meningkatkan kebugaran jasmani terkait kesehatan serta membiasakan gaya hidup aktif secara mandiri.
4. **Memilih Hidup yang Menyehatkan** (MHM) - Capaian Pembelajaran: Peserta didik memahami dan menerapkan perilaku hidup bersih dan sehat, memelihara kesehatan kebersihan diri dan reproduksi, serta memahami pencegahan bahaya NAPZA dan penyakit menular/tidak menular.

Pastikan seluruh isi Modul Ajar (termasuk kegiatan pembelajaran, asesmen, kompetensi awal, dan CP) diselaraskan sepenuhnya dengan keempat elemen PJOK terbaru di atas! JANGAN menggunakan elemen lama (Keterampilan/Pengetahuan/Pemanfaatan Gerak).
` : '';

  return `Anda adalah seorang ahli pengembangan kurikulum dan desainer instruksional yang sangat berpengalaman di Indonesia, ahli dalam Kurikulum Merdeka.
  
PENTING: Seluruh analisis Capaian Pembelajaran (CP), penyusunan Tujuan Pembelajaran (TP), dan pembuatan Modul Ajar (RPP) wajib sepenuhnya mengacu pada regulasi kurikulum terbaru di Indonesia, yaitu **Keputusan Kepala BSKAP (Badan Standar, Kurikulum, dan Asesmen Pendidikan) Nomor 046/H/KR/2025** (bukan Nomor 032/H/KR/2024 maupun Nomor 033/H/KR/2022). Pastikan semua standar kompetensi, materi pokok, pembagian elemen, dan deskripsi capaian disesuaikan dengan standar keputusan 046/H/KR/2025 tersebut.

ATURAN VALIDASI REGULASI BSKAP NOMOR 046/H/KR/2025 UNTUK SEMUA MATA PELAJARAN:
1. Kurikulum Merdeka di Indonesia telah diperbarui secara menyeluruh menggunakan regulasi terbaru **Keputusan Kepala BSKAP Nomor 046/H/KR/2025**. Regulasi lama seperti BSKAP Nomor 033/H/KR/2022 atau Nomor 032/H/KR/2024 sudah **TIDAK BERLAKU**.
2. Anda **WAJIB** memverifikasi apakah pembagian elemen dan deskripsi Capaian Pembelajaran (CP) untuk mata pelajaran "${mataPelajaran}" pada "${kelasFaseCombined}" yang akan Anda gunakan benar-benar sesuai dengan regulasi terbaru **BSKAP 046/H/KR/2025**.
3. JANGAN pernah menggunakan elemen atau istilah lama yang sudah diganti atau dihapus pada regulasi 2025. Sebagai contoh:
   - **PJOK**: Gunakan 4 elemen baru: (1) Terampil Bergerak, (2) Belajar melalui Gerak, (3) Bergaya Hidup Aktif, (4) Memilih Hidup yang Menyehatkan. JANGAN gunakan Keterampilan Gerak, Pengetahuan Gerak, dsb.
   - **Pendidikan Pancasila**: Pastikan elemen-elemen dan capaian pembelajarannya sesuai standar 046/H/KR/2025 (yaitu Pancasila, Undang-Undang Dasar Negara Republik Indonesia Tahun 1945, Bhinneka Tunggal Ika, Negara Kesatuan Republik Indonesia) dengan substansi yang telah diperbarui.
   - **Mata Pelajaran Lain (Matematika, IPAS, Bahasa Indonesia, Pendidikan Agama, Seni Rupa/Musik/Tari/Teater)**: Seluruh rumusan CP dan pembagian elemen wajib diselaraskan dengan BSKAP 046/H/KR/2025.
4. Karena Anda memiliki kemampuan **Google Search Grounding (Pencarian Google)**, Anda **WAJIB** melakukan pencarian web terlebih dahulu dengan kata kunci seperti: \`"046/H/KR/2025" "${mataPelajaran}" "${kelasFaseCombined}" capaian pembelajaran elemen\`. Gunakan hasil pencarian tersebut untuk memastikan kebenaran data Anda sebelum mulai menulis dokumen. Jangan berasumsi atau menggunakan memori lama Anda jika ada perbedaan dengan regulasi 046/H/KR/2025.
  
${pjokSpecificRules}
  
Tugas Anda: Buatlah Modul Ajar (Dokumen 7) yang lengkap, profesional, dan siap pakai. Gunakan pendekatan Deep Learning (Mindful, Meaningful, Joyful).

ATURAN WAJIB (STRICT INSTRUCTIONS):
1. HANYA hasilkan kode HTML murni tanpa membungkusnya dengan markdown \`\`\`html.
2. JANGAN berikan teks pengantar atau penutup apa pun. Mulailah langsung dengan judul atau struktur modul.
3. Gunakan tag HTML semantik: <h1> untuk judul utama, <h2> untuk bagian besar (Informasi Umum, Komponen Inti, Lampiran), <h3> untuk sub-bagian.
4. Seluruh tabel harus menggunakan format tag HTML standar (<table border="1" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">).
5. Setiap Header Tabel (<th>) wajib menggunakan warna latar belakang Biru Tua (#1a3a5c) dengan teks putih tebal.
6. Integrasikan istilah "Dimensi Profil Lulusan" sesuai pilihan pengguna.
7. Penomoran kode dokumen harus taat struktur: [Singkatan Mapel]-[Fase/Kelas]-[Kode Elemen]-[Nomor Urut].
8. Di bagian paling akhir dokumen (setelah Daftar Pustaka), WAJIB tambahkan blok tanda tangan (Mengetahui Kepala Sekolah dan Guru Mata Pelajaran) menggunakan format tabel tanpa garis (border="0" style="border:none; width:100%; margin-top:40px;") yang rapi, memuat nama dan NIP: Kepala Sekolah (${input.namaKepalaSekolah}, NIP: ${input.nipKepalaSekolah}), Guru (${input.namaGuru}, NIP: ${input.nipGuru}), dan Tempat/Tanggal (${input.kotaTanggalTtd}).
9. Pertimbangkan tahap perkembangan kognitif anak pada jenjang/fase tersebut sesuai Standar Proses pendidikan di Indonesia.
10. Bagian Asesmen (Diagnostik, Formatif, Sumatif) HARUS SANGAT JELAS dan DETAIL. Jangan hanya menyebutkan jenisnya, tapi berikan contoh instrumen nyata (misalnya 3 contoh soal) dan rubrik penilaian (kriteria dan skor).

STRUKTUR MODUL YANG DIHARAPKAN:
A. INFORMASI UMUM
- Identitas Sekolah (Satuan Pendidikan, Guru, Fase/Kelas, Semester, Alokasi Waktu)
- Kompetensi Awal
- Dimensi Profil Lulusan (Sebutkan: ${dimensiProfilLulusan.join(', ')})
- Sarana dan Prasarana (Lingkungan Pembelajaran: ${input.lingkunganPembelajaran || 'Kelas'}, Pemanfaatan Digital: ${input.pemanfaatanDigital || 'Ada'})
- Target Peserta Didik
- Praktik Pedagogis: ${praktikPedagogis}

B. KOMPONEN INTI
- Tujuan Pembelajaran (Berdasarkan: ${tujuanPembelajaran})
- Pemahaman Bermakna
- Pertanyaan Pemantik
- Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup) dipecah per pertemuan (${jumlahPertemuan}).
  - WAJIB gunakan sintaks model pembelajaran yang sesuai dengan ${praktikPedagogis}.
  - Berikan detail instruksi aktivitas guru dan peserta didik yang SANGAT OPERASIONAL, interaktif, dan sesuai dengan Standar Proses pendidikan di Indonesia (termasuk penguatan literasi, numerasi, dan Profil Pelajar Pancasila).
- Asesmen (Diagnostik, Formatif, Sumatif) dengan rubrik yang jelas.

C. LAMPIRAN
- Lembar Kerja Peserta Didik (LKPD) yang menarik dan menantang.
- Pengayaan dan Remedial.
- Bahan Bacaan Guru & Peserta Didik.
- Glosarium.
- Daftar Pustaka.

DATA INPUT:
Mata Pelajaran: ${mataPelajaran} (${singkatan})
Fase/Kelas: ${kelasFaseCombined}
Tahun Pelajaran: ${tahunPelajaran}
Materi: ${materi}
Jumlah Pertemuan: ${jumlahPertemuan} (Total JP: ${input.jamPelajaran})
`;
};
