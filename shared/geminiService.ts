import { LessonPlanInput } from './types.js';

const createOptionalSection = (label: string, data: string | undefined | null | string[]) => {
  if (Array.isArray(data) && data.length > 0) {
    return `${label}: ${data.join(', ')}`;
  }
  if (typeof data === 'string' && data.trim()) {
    return `${label}: ${data.trim()}`;
  }
  return `${label}: [Tidak diisi oleh pengguna]`;
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
- **Peserta Didik:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${pesertaDidik}"]

## IDENTIFIKASI

### Desain Pembelajaran
- **Capaian Pembelajaran:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${capaianPembelajaran}"]
- **Dimensi Profil Lulusan:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${dimensiProfilLulusan.join(', ')}"]
- **Lintas Disiplin Ilmu:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${lintasDisiplinIlmu}"]
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
- **Lingkungan Pembelajaran:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${lingkunganPembelajaran}"]
- **Pemanfaatan Digital:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${pemanfaatanDigital}"]
- **Kemitraan Pembelajaran:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${kemitraanPembelajaran}"]

## Pengalaman Belajar

### Langkah-Langkah Pembelajaran
[PENTING: Rincikan langkah-langkah untuk setiap pertemuan, dari Pertemuan 1 hingga ${jumlahPertemuan}. Setiap pertemuan harus memiliki struktur AWAL, INTI, dan PENUTUP.
**Instruksi Khusus untuk Prinsip Pembelajaran:** Untuk setiap aktivitas yang Anda rincikan dalam tahap AWAL, INTI, dan PENUTUP, jelaskan secara singkat bagaimana aktivitas tersebut menerapkan salah satu atau lebih dari prinsip **Mindful, Joyful, atau Meaningful Learning**. Tandai setiap aktivitas dengan prinsip yang relevan setelah deskripsinya, contoh: \`(Mindful)\`, \`(Joyful)\`, \`(Meaningful)\`.]

---
#### **PERTEMUAN 1**
---
**AWAL**
[Rincikan kegiatan pembuka. Contoh:
- Guru memulai dengan teknik stop sejenak untuk memusatkan perhatian siswa. (Mindful)
- Guru menampilkan gambar atau video lucu terkait topik untuk membangkitkan semangat. (Joyful)
- Guru mengaitkan topik dengan pengalaman sehari-hari siswa. (Meaningful)]

**INTI**
[Rancang aktivitas inti agar selaras dengan Dimensi Profil Lulusan yang dipilih. Bagi menjadi tiga sub-tahap berikut dan tandai setiap aktivitas dengan prinsip yang sesuai:]
1.  **Memahami:** [Rincikan kegiatan yang memfasilitasi siswa untuk aktif membangun pengetahuan dari berbagai sumber dan konteks terkait materi.]
2.  **Mengaplikasi:** [Rincikan kegiatan di mana siswa mengaplikasikan pemahaman mereka dalam konteks dunia nyata untuk mengembangkan kompetensi.]
3.  **Merefleksi:** [Rincikan kegiatan yang memfasilitasi siswa untuk mengevaluasi proses dan hasil belajar, memaknai pengalaman, dan merencanakan tindak lanjut.]

**PENUTUP**
[Rincikan kegiatan penutup, pastikan untuk menandai aktivitas dengan prinsip yang sesuai. Contoh:
- Siswa menuliskan satu hal baru yang dipelajari dan perasaannya hari ini di jurnal belajar. (Mindful, Meaningful)
- Guru memberikan apresiasi kepada kelompok yang paling aktif. (Joyful)]

---
#### **PERTEMUAN 2** (dan seterusnya, ulangi struktur yang sama hingga pertemuan terakhir)
---
[Ulangi struktur AWAL, INTI (Memahami, Mengaplikasi, Merefleksi), dan PENUTUP untuk setiap pertemuan berikutnya, pastikan ada kesinambungan logis antar pertemuan dan setiap aktivitas ditandai dengan prinsip yang relevan.]


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