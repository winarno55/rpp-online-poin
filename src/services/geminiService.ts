import { LessonPlanInput, BankSoalInput, MateriAjarInput, PenilaianInput } from '../types';

// Helper function to create a section for the prompt only if the data exists.
// It also provides a clear "not filled" message for the AI to interpret.
const createOptionalSection = (label: string, data: string | undefined | null | string[]) => {
  if (Array.isArray(data) && data.length > 0) {
    return `${label}: ${data.join(', ')}`;
  }
  if (typeof data === 'string' && data.trim()) {
    return `${label}: ${data.trim()}`;
  }
  return ``; // Return empty string if not provided
};

export const generateLessonPlanPrompt = (input: LessonPlanInput): string => {
  const { 
    mataPelajaran, kelasFase, materi, jumlahPertemuan, tujuanPembelajaran, praktikPedagogis,
    jamPelajaran, pesertaDidik, dimensiProfilLulusan, capaianPembelajaran, lintasDisiplinIlmu,
    lingkunganPembelajaran, pemanfaatanDigital, kemitraanPembelajaran
  } = input;

  return `
Anda adalah seorang ahli pengembangan kurikulum dan desainer instruksional yang sangat berpengalaman, memiliki pemahaman mendalam tentang pembelajaran modern dan Kurikulum Merdeka. Tugas Anda adalah membantu guru membuat Rencana Pelaksanaan Pembelajaran (RPP) atau Modul Ajar yang komprehensif, efektif, dan sesuai dengan prinsip Mindful Learning, Meaningful Learning, dan Joyful Learning.

Berdasarkan input yang diberikan, buatlah Modul Ajar yang lengkap.

PENTING: Jika sebuah bidang bertanda "[Tidak diisi oleh pengguna]", JANGAN sertakan judul atau konten bidang tersebut dalam output akhir Anda. Hilangkan seluruh bagian itu dari hasil generate.

--- INPUT DARI PENGGUNA ---

### Identitas
Mata Pelajaran: ${mataPelajaran}
Kelas/Fase: ${kelasFase}
Materi: ${materi}
Jumlah Pertemuan: ${jumlahPertemuan}
Jam Pelajaran per Pertemuan: ${jamPelajaran} JP
${createOptionalSection('Peserta Didik', pesertaDidik)}

### IDENTIFIKASI
${createOptionalSection('Dimensi Profil Lulusan', dimensiProfilLulusan)}
${createOptionalSection('Capaian Pembelajaran', capaianPembelajaran)}
${createOptionalSection('Lintas Disiplin Ilmu', lintasDisiplinIlmu)}
Tujuan Pembelajaran: ${tujuanPembelajaran}
Praktik Pedagogis: ${praktikPedagogis}
${createOptionalSection('Lingkungan Pembelajaran', lingkunganPembelajaran)}
${createOptionalSection('Pemanfaatan Digital', pemanfaatanDigital)}
${createOptionalSection('Kemitraan Pembelajaran', kemitraanPembelajaran)}

--- STRUKTUR OUTPUT MODUL AJAR YANG DIINGINKAN ---

Hasilkan Modul Ajar dalam format Markdown yang rapi, terstruktur, dan siap pakai. Ikuti struktur di bawah ini dengan SEKSAMA.

# **MODUL AJAR: [Buat judul yang menarik dan relevan berdasarkan Materi: ${materi}]**

## Identitas
- **Mata Pelajaran:** ${mataPelajaran}
- **Kelas/Fase:** ${kelasFase}
- **Materi:** ${materi}
- **Alokasi Waktu:** [Hitung total alokasi waktu. Gunakan input Jumlah Pertemuan (${jumlahPertemuan}), Jam Pelajaran per pertemuan (${jamPelajaran} JP), dan Kelas/Fase (${kelasFase}). Asumsikan: 1 JP SD = 35 menit, 1 JP SMP = 40 menit, 1 JP SMA/SMK = 45 menit. Tentukan jenjang (SD/SMP/SMA) dari input Kelas/Fase. Tampilkan hasilnya dalam format 'X Pertemuan @ Y JP (Z menit per pertemuan)'. Contoh untuk 3 Pertemuan @ 2 JP di SMA: '3 Pertemuan @ 2 JP (90 menit per pertemuan)']
${createOptionalSection('- **Peserta Didik:**', pesertaDidik)}

## IDENTIFIKASI

### Desain Pembelajaran
${createOptionalSection('- **Capaian Pembelajaran:**', capaianPembelajaran)}
${createOptionalSection('- **Dimensi Profil Lulusan:**', dimensiProfilLulusan)}
${createOptionalSection('- **Lintas Disiplin Ilmu:**', lintasDisiplinIlmu)}
- **Tujuan Pembelajaran:** [
    **Analisis Input Pengguna:** "${tujuanPembelajaran}"
    **Instruksi Penting:**
    1.  Identifikasi **semua kompetensi utama** yang diminta oleh pengguna (misalnya: "menganalisis", "membuat", "mempresentasikan").
    2.  Untuk **SETIAP** kompetensi utama tersebut, kembangkan menjadi beberapa tujuan pembelajaran yang lebih spesifik dan operasional.
    3.  Saat mengembangkan tujuan, pertimbangkan dan jelaskan secara eksplisit dalam tiga ranah berikut, jika relevan:
        *   **Ranah Kognitif:** Tujuan yang berkaitan dengan pengetahuan, pemahaman, dan proses berpikir (Contoh: Menjelaskan, menganalisis, membandingkan).
        *   **Ranah Psikomotor:** Tujuan yang berkaitan dengan keterampilan fisik atau penggunaan alat (Contoh: Menulis, menggambar, mempraktikkan, merancang).
        *   **Ranah Afektif:** Tujuan yang berkaitan dengan sikap, nilai, dan karakter (Contoh: Menunjukkan sikap kritis, bekerja sama, bertanggung jawab).
    4.  Sajikan hasilnya dalam format daftar yang terstruktur. Kelompokkan tujuan berdasarkan kompetensi utama jika ada lebih dari satu.
    
    **Contoh Format Output (jika input "menganalisis dan menyajikan data"):**
    Melalui serangkaian kegiatan pembelajaran, peserta didik diharapkan dapat:
    1.  **Menganalisis Data:**
        *   (Kognitif) Mengidentifikasi informasi kunci dari set data yang diberikan dengan tepat.
        *   (Kognitif) Membandingkan tren atau pola dalam data menggunakan metode yang sesuai.
        *   (Afektif) Menunjukkan ketelitian dan sikap kritis saat memeriksa validitas data.
    2.  **Menyajikan Data:**
        *   (Kognitif) Memilih bentuk penyajian (grafik, tabel) yang paling efektif untuk data yang dianalisis.
        *   (Psikomotor) Membuat visualisasi data yang jelas dan mudah dibaca menggunakan alat bantu yang ditentukan.
        *   (Afektif) Menunjukkan rasa percaya diri dan bertanggung jawab saat mempresentasikan hasil analisisnya.
]
- **Praktik Pedagogis:** ${praktikPedagogis}
${createOptionalSection('- **Lingkungan Pembelajaran:**', lingkunganPembelajaran)}
${createOptionalSection('- **Pemanfaatan Digital:**', pemanfaatanDigital)}
${createOptionalSection('- **Kemitraan Pembelajaran:**', kemitraanPembelajaran)}

## Pengalaman Belajar

### Langkah-Langkah Pembelajaran
[PENTING: Rincikan langkah-langkah untuk setiap pertemuan, dari Pertemuan 1 hingga ${jumlahPertemuan}. Setiap pertemuan harus memiliki struktur AWAL, INTI, dan PENUTUP. Rancang aktivitas pada bagian INTI agar selaras dengan Dimensi Profil Lulusan yang dipilih.]

---
#### **PERTEMUAN 1**
---
**AWAL (Prinsip: Mindful, Joyful, Meaningful)**
[Rincikan kegiatan pembuka untuk mempersiapkan siswa: orientasi bermakna, apersepsi kontekstual, dan motivasi yang menggembirakan.]

**INTI (Prinsip: Mindful, Joyful, Meaningful)**
[Pada tahap ini, siswa aktif terlibat dalam pengalaman belajar. Rancang aktivitas agar murid juga dapat meningkatkan kompetensi globalnya sesuai Dimensi Profil Lulusan yang dipilih. Bagi menjadi tiga sub-tahap berikut:]
1.  **Memahami:** [Rincikan kegiatan yang memfasilitasi siswa untuk aktif membangun pengetahuan dari berbagai sumber dan konteks terkait materi.]
2.  **Mengaplikasi:** [Rincikan kegiatan di mana siswa mengaplikasikan pemahaman mereka dalam konteks dunia nyata untuk mengembangkan kompetensi.]
3.  **Merefleksi:** [Rincikan kegiatan yang memfasilitasi siswa untuk mengevaluasi proses dan hasil belajar, memaknai pengalaman, dan merencanakan tindak lanjut.]

**PENUTUP (Prinsip: Mindful, Joyful, Meaningful)**
[Rincikan kegiatan penutup: umpan balik konstruktif, kesimpulan bersama, dan pelibatan siswa dalam perencanaan pembelajaran selanjutnya.]

---
#### **PERTEMUAN 2** (dan seterusnya, ulangi struktur yang sama hingga pertemuan terakhir)
---
[Ulangi struktur AWAL, INTI (Memahami, Mengaplikasi, Merefleksi), dan PENUTUP untuk setiap pertemuan berikutnya, pastikan ada kesinambungan logis antar pertemuan.]


### Asesmen Pembelajaran
[Rancang rencana asesmen yang relevan untuk mengukur Tujuan Pembelajaran. Jelaskan teknik dan instrumen yang digunakan pada **awal, proses, dan akhir** pembelajaran. Tekankan pada *assessment as learning* (penilaian diri/sejawat), *assessment for learning* (umpan balik), dan *assessment of learning* (pencapaian). Berikan contoh konkret seperti: Penilaian Sejawat, Penilaian Diri, Observasi, Proyek, Produk, Kinerja, Tes Tulis, dll. Kaitkan asesmen dengan pertemuan yang sesuai.]

## LAMPIRAN

### 1. Rubrik Penilaian
[Sediakan contoh rubrik penilaian yang relevan untuk SALAH SATU asesmen yang dijelaskan di atas (misal: rubrik proyek atau presentasi). Rubrik harus mencakup kriteria, deskriptor untuk setiap level capaian (Sangat Baik, Baik, Cukup, Perlu Bimbingan), dan skor/bobot.]

### 2. LKPD (Lembar Kerja Peserta Didik)
[Buat LKPD yang praktis dan sesuai dengan kegiatan inti pembelajaran. Jika ada beberapa pertemuan, Anda bisa membuat satu LKPD yang dibagi per bagian atau beberapa LKPD terpisah. Gunakan format berikut:]
**Nama:** .............................................
**Kelas:** .............................................
**Nomor Absen:** .............................................

**Petunjuk Pengerjaan:**
[Tulis petunjuk yang jelas.]

[Sajikan beberapa soal atau aktivitas yang mendukung pencapaian Tujuan Pembelajaran.]

### 3. Evaluasi Mandiri
[Buat bagian evaluasi mandiri dengan format berikut. Isi dengan 3-5 soal isian singkat (esai singkat) yang secara langsung mengukur pemahaman siswa terhadap Tujuan Pembelajaran. Yang terpenting, SERTAKAN KUNCI JAWABAN yang jelas dan ringkas untuk setiap soal untuk memudahkan guru melakukan koreksi.]

**Nama:** .............................................
**Kelas:** .............................................
**Nomor Absen:** .............................................

**Soal Evaluasi:**
[Sajikan 3-5 soal esai singkat di sini.]

**Kunci Jawaban:**
[Sajikan kunci jawaban untuk setiap soal di sini.]

### 4. Materi Ajar
[Sediakan ringkasan singkat materi atau poin-poin kunci. Ini bukan materi lengkap, tetapi highlight untuk guru. Bisa juga berupa saran sumber belajar tambahan (misalnya, tautan video, artikel, atau buku teks).]

Pastikan seluruh output dalam Bahasa Indonesia yang profesional dan mudah dipahami.
`;
};

export const generateBankSoalPrompt = (input: BankSoalInput): string => {
    const { mataPelajaran, kelasFase, materi, jumlahSoal, tipeSoal, tingkatKesulitan, petunjukTambahan } = input;

    return `
Anda adalah seorang guru ahli dan pembuat soal profesional yang sangat berpengalaman dalam evaluasi pembelajaran sesuai Kurikulum Merdeka. Tugas Anda adalah membuat satu set soal yang berkualitas tinggi berdasarkan spesifikasi yang diberikan.

--- SPESIFIKASI SOAL ---
- **Mata Pelajaran:** ${mataPelajaran}
- **Kelas/Fase:** ${kelasFase}
- **Materi/Topik:** ${materi}
- **Jumlah Soal:** ${jumlahSoal}
- **Tipe Soal:** ${tipeSoal}
- **Tingkat Kesulitan:** ${tingkatKesulitan}
${createOptionalSection('- **Petunjuk Tambahan dari Guru:**', petunjukTambahan)}

--- STRUKTUR OUTPUT YANG DIINGINKAN ---
Hasilkan output dalam format Markdown yang rapi dan jelas. Ikuti struktur ini dengan SEKSAMA:

# **BANK SOAL: ${materi}**

- **Mata Pelajaran:** ${mataPelajaran}
- **Kelas/Fase:** ${kelasFase}
- **Tingkat Kesulitan:** ${tingkatKesulitan}

---

## A. SOAL-SOAL

[Buat ${jumlahSoal} soal sesuai dengan tipe (${tipeSoal}) dan tingkat kesulitan yang diminta. Jika tipe "Campuran", buat sekitar 60% pilihan ganda dan 40% esai.]

### Bagian Pilihan Ganda (Hanya jika diminta)
[Nomor soal secara berurutan. Setiap soal harus diikuti oleh 4 atau 5 pilihan jawaban (A, B, C, D, E).]
**Contoh:**
1.  Pertanyaan untuk soal pilihan ganda...
    A. Pilihan A
    B. Pilihan B
    C. Pilihan C
    D. Pilihan D

### Bagian Esai (Hanya jika diminta)
[Nomor soal secara berurutan, melanjutkan dari nomor terakhir pilihan ganda jika ada.]
**Contoh:**
5.  Jelaskan dengan kata-katamu sendiri tentang proses...

---

## B. KUNCI JAWABAN

[Sediakan kunci jawaban yang jelas dan ringkas untuk SEMUA soal.]

### Kunci Jawaban Pilihan Ganda
1.  B
2.  D
...

### Kunci Jawaban Esai
5.  Poin-poin utama jawaban: [Jelaskan secara singkat poin-poin kunci atau konsep yang harus ada dalam jawaban siswa].
...

---

## C. RUBRIK PENILAIAN (KHUSUS SOAL ESAI)

[Hanya jika ada soal esai. Buat satu rubrik penilaian UMUM yang bisa digunakan untuk menilai semua soal esai yang dibuat. Rubrik harus mencakup kriteria dan skor.]

| Kriteria Penilaian | Skor Maksimal | Deskripsi |
| :--- | :--- | :--- |
| **Ketepatan Konsep** | 5 | Siswa menunjukkan pemahaman yang mendalam dan akurat terhadap konsep yang ditanyakan. |
| **Kelengkapan Jawaban** | 3 | Siswa menjawab semua bagian pertanyaan dengan argumen yang lengkap dan relevan. |
| **Struktur & Bahasa** | 2 | Jawaban terstruktur dengan baik, logis, dan menggunakan bahasa yang jelas serta mudah dipahami. |
| **Total** | **10** | |

Pastikan seluruh output dalam Bahasa Indonesia yang profesional dan siap digunakan oleh guru.
`;
};

export const generateMateriAjarPrompt = (input: MateriAjarInput): string => {
    const { tipeMateri, topik, sasaran, detailTambahan } = input;
    return `
Anda adalah seorang penulis konten pendidikan dan kreator materi ajar yang sangat ahli di bidangnya. Peran spesifik Anda saat ini adalah sebagai pembuat **${tipeMateri}**. Tugas Anda adalah menghasilkan sebuah karya yang menarik, informatif, dan sangat sesuai untuk audiens yang dituju.

--- SPESIFIKASI MATERI AJAR ---
- **Tipe Materi yang Dibuat:** ${tipeMateri}
- **Topik/Tema Utama:** ${topik}
- **Target Audiens (Sasaran):** ${sasaran}
${createOptionalSection('- **Detail Tambahan/Instruksi Khusus dari Guru:**', detailTambahan)}

--- INSTRUKSI PENTING ---
1.  **Adaptasi Gaya:** Sesuaikan gaya bahasa, kedalaman konten, dan kompleksitas kalimat dengan target audiens (${sasaran}).
2.  **Fokus pada Tipe:** Pastikan output akhir benar-benar mencerminkan format **${tipeMateri}**. Misalnya, jika diminta Naskah Drama, harus ada nama tokoh, dialog, dan petunjuk panggung. Jika Studi Kasus, harus ada latar belakang, masalah, dan pertanyaan analisis.
3.  **Kreatif dan Menarik:** Buat konten yang tidak hanya informatif tetapi juga mampu menarik minat dan imajinasi pembaca.
4.  **Struktur yang Jelas:** Gunakan heading, paragraf, dan daftar (jika perlu) untuk menyajikan informasi secara terstruktur dan mudah dicerna.

--- STRUKTUR OUTPUT YANG DIINGINKAN ---
Hasilkan output dalam format Markdown yang rapi.

# **[Buat Judul yang Kreatif dan Sesuai untuk Topik: ${topik}]**
*${tipeMateri} untuk ${sasaran}*

---

[Mulai tulis konten materi ajar di sini. Ikuti semua instruksi dan spesifikasi yang telah diberikan. Pastikan hasilnya adalah karya yang utuh dan siap pakai.]
`;
};

export const generatePenilaianPrompt = (input: PenilaianInput): string => {
    const { teksSiswa, kriteriaPenilaian } = input;
    return `
Anda adalah seorang guru dan ahli evaluasi pembelajaran yang bijaksana, suportif, dan konstruktif. Tugas Anda adalah memberikan umpan balik yang mendalam terhadap hasil kerja (esai) seorang siswa.

**FOKUS UTAMA:** Tujuan Anda bukan untuk memberi nilai benar/salah, tetapi untuk membantu siswa memahami kekuatan dan area perbaikan dalam pekerjaannya. Umpan balik harus bersifat membangun dan memotivasi. JANGAN MEMBERIKAN SKOR ANGKA.

--- DATA DARI GURU ---
- **Kriteria Penilaian / Tujuan Pembelajaran:**
"${kriteriaPenilaian}"

- **Teks Esai yang Ditulis Siswa:**
"${teksSiswa}"

--- STRUKTUR UMPAN BALIK YANG DIINGINKAN ---
Hasilkan umpan balik dalam format Markdown yang rapi. Ikuti struktur 5 bagian ini dengan SEKSAMA:

# **Umpan Balik Konstruktif untuk Siswa**

### 1. Apresiasi & Poin Kuat
[Mulailah dengan positif. Identifikasi dan puji SECARA SPESIFIK satu atau dua hal yang sudah baik dari tulisan siswa. Contoh: "Kerja bagus dalam menggunakan contoh nyata untuk mendukung argumenmu di paragraf kedua." atau "Saya sangat suka pilihan katamu saat menjelaskan..."]

### 2. Analisis Struktur dan Alur Argumen
[Analisis bagaimana siswa menyusun gagasannya. Apakah alurnya logis? Apakah setiap paragraf memiliki ide pokok yang jelas? Apakah ada hubungan antar paragraf? Berikan komentar yang membangun.]

### 3. Analisis Penggunaan Bahasa dan Ejaan
[Tinjau penggunaan tata bahasa, pilihan kata (diksi), dan ejaan. Jika ada kesalahan berulang, sebutkan polanya tanpa harus mengoreksi setiap kata. Contoh: "Perhatikan kembali penggunaan tanda baca koma sebelum kata hubung." atau "Beberapa kalimat terasa sangat panjang, coba pecah menjadi kalimat yang lebih pendek agar lebih mudah dipahami."]

### 4. Kesesuaian dengan Kriteria Penilaian
[Hubungkan tulisan siswa dengan kriteria yang diberikan guru. Jelaskan bagian mana dari tulisan yang sudah mencapai tujuan/kriteria, dan bagian mana yang masih perlu dikembangkan lebih lanjut untuk memenuhi kriteria tersebut.]

### 5. Tiga Langkah Konkret untuk Perbaikan
[Berikan 3 saran yang sangat spesifik dan dapat ditindaklanjuti oleh siswa untuk merevisi atau meningkatkan kualitas tulisannya. Mulailah setiap poin dengan kata kerja.]
1.  **[Saran 1]** (Contoh: **Tambahkan** satu kalimat kesimpulan di akhir setiap paragraf untuk merangkum ide pokokmu.)
2.  **[Saran 2]** (Contoh: **Periksa kembali** penggunaan istilah 'X' dan 'Y', pastikan kamu menggunakannya secara konsisten.)
3.  **[Saran 3]** (Contoh: **Coba baca** tulisanmu dengan suara keras untuk menemukan kalimat yang terdengar janggal.)
`;
};
