import { LessonPlanInput } from '../types.js';

// Helper function to create a section for the prompt only if the data exists.
// It also provides a clear "not filled" message for the AI to interpret.
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
    pesertaDidik, dimensiProfilLulusan, capaianPembelajaran, lintasDisiplinIlmu,
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
- **Jumlah Pertemuan:** ${jumlahPertemuan}
- **Peserta Didik:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${pesertaDidik}"]

## IDENTIFIKASI

### Desain Pembelajaran
- **Capaian Pembelajaran:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${capaianPembelajaran}"]
- **Dimensi Profil Lulusan:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${dimensiProfilLulusan.join(', ')}"]
- **Lintas Disiplin Ilmu:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${lintasDisiplinIlmu}"]
- **Tujuan Pembelajaran:** [Kembangkan tujuan pembelajaran awal ("${tujuanPembelajaran}") menjadi lebih rinci, operasional, dan SMART (Specific, Measurable, Achievable, Relevant, Time-bound) sesuai dengan kelas/fase dan materi.]
- **Praktik Pedagogis:** ${praktikPedagogis}
- **Lingkungan Pembelajaran:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${lingkunganPembelajaran}"]
- **Pemanfaatan Digital:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${pemanfaatanDigital}"]
- **Kemitraan Pembelajaran:** [Hanya tampilkan jika diisi oleh pengguna. Isinya adalah: "${kemitraanPembelajaran}"]

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