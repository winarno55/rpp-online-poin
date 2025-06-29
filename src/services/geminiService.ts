import { LessonPlanInput } from '../types';

export const generateLessonPlanPrompt = (input: LessonPlanInput): string => {
  const { mataPelajaran, fase, kelas, semester, jumlahPertemuan, materi, alokasiWaktu, tujuanPembelajaran } = input;

  return `Anda adalah seorang ahli pengembangan kurikulum dan desainer instruksional yang sangat berpengalaman, memiliki pemahaman mendalam tentang pembelajaran modern dan Kurikulum Merdeka. Tugas Anda adalah membantu guru membuat Rencana Pelaksanaan Pembelajaran (RPP) atau Modul Ajar yang komprehensif, efektif, dan sesuai dengan prinsip Mindful Learning, Meaningful Learning, dan Joyful Learning.

Berdasarkan input berikut:
Mata Pelajaran: ${mataPelajaran}
Fase: ${fase}
Kelas: ${kelas}
Semester: ${semester}
Jumlah Sesi Pembelajaran: ${jumlahPertemuan}
Materi: ${materi}
Alokasi Waktu per Sesi: ${alokasiWaktu}
Tujuan Pembelajaran Awal: ${tujuanPembelajaran}

CATATAN PENTING UNTUK INTERPRETASI ALOKASI WAKTU:
Anda HARUS secara cerdas menginterpretasikan input "Alokasi Waktu per Sesi" (${alokasiWaktu}) berdasarkan Fase yang dipilih. Durasi standar 1 Jam Pelajaran (JP) adalah sebagai berikut:
- Fase A, B, C (Umumnya SD/MI): 1 JP = 35 menit.
- Fase D (Umumnya SMP/MTs): 1 JP = 40 menit.
- Fase E, F (Umumnya SMA/SMK/MA): 1 JP = 45 menit.
Contoh: Jika input "Alokasi Waktu per Sesi" adalah "2 JP" dan Fase adalah "A", maka total durasi per sesi adalah 70 menit. Jika Fase adalah "D" untuk "2 JP", maka total durasi per sesi adalah 80 menit.
Pastikan total durasi rincian kegiatan dalam "Langkah-Langkah Kegiatan Pembelajaran" (Pendahuluan, Inti, Penutup) di setiap pertemuan secara akurat mencerminkan total alokasi waktu yang telah diinterpretasikan dengan benar ini.

CATATAN PENTING UNTUK STRUKTUR MULTI-SESI:
Anda HARUS menyusun seluruh Modul Ajar ini untuk durasi total sejumlah **${jumlahPertemuan}**. Rincikan dengan jelas kegiatan untuk 'Pertemuan 1', 'Pertemuan 2', dan seterusnya. Bagilah 'Langkah-Langkah Kegiatan Pembelajaran' dan 'Asesmen' secara logis ke dalam setiap pertemuan tersebut. Setiap pertemuan harus memiliki struktur Pendahuluan, Inti, dan Penutup yang jelas.

Hasilkan Modul Ajar dengan struktur dan konten berikut. Pastikan output rapi dan terorganisir, siap untuk disalin ke dokumen (misalnya DOCX/PDF). Gunakan Bahasa Indonesia yang baik dan benar.

[JUDUL MODUL AJAR: Buat judul yang menarik dan sesuai dengan Materi (${materi}), Kelas (${kelas}), dan Semester (${semester})]

A. INFORMASI UMUM
   Mata Pelajaran         : ${mataPelajaran}
   Fase                   : ${fase}
   Kelas                  : ${kelas}
   Semester               : ${semester}
   Materi                 : ${materi}
   Jumlah Pertemuan       : ${jumlahPertemuan}
   Alokasi Waktu per Sesi : ${alokasiWaktu} [AI: Tampilkan juga hasil interpretasi total menit berdasarkan Fase di sini. Contoh: "2 JP (Total 70 menit/sesi untuk Fase A)" atau "120 menit/sesi (Total 120 menit)"]

B. TUJUAN PEMBELAJARAN
   [Kembangkan tujuan pembelajaran awal (${tujuanPembelajaran}) menjadi lebih rinci dan operasional. Pastikan tujuan tersebut SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Jika input tujuan awal sudah spesifik, kembangkan sedikit dengan menambahkan aspek implementasi atau kedalaman pemahaman.]

C. ASESMEN PEMBELAJARAN
   [Rancang rencana asesmen yang relevan dan proporsional untuk secara langsung mengukur pencapaian Tujuan Pembelajaran yang telah dirumuskan di Bagian B. Sebutkan asesmen apa saja yang akan dilakukan dan pada pertemuan ke berapa.
    - Sebutkan jenis asesmen (diagnostik, formatif, sumatif).
    - Berikan contoh konkret bentuk asesmen (misal: observasi partisipasi, tes tulis pilihan ganda/esai singkat, presentasi hasil diskusi kelompok, penugasan proyek sederhana, unjuk kerja).
    - Jelaskan secara singkat instrumen yang bisa digunakan untuk masing-masing bentuk asesmen (misal: lembar observasi, soal tes, rubrik presentasi, rubrik proyek).]

D. LANGKAH-LANGKAH KEGIATAN PEMBELAJARAN
   [PENTING: Rincikan langkah-langkah pembelajaran untuk setiap pertemuan secara terpisah. Setiap pertemuan harus memiliki struktur Pendahuluan, Inti, dan Penutup. DURASI SETIAP BAGIAN DI SETIAP PERTEMUAN HARUS KONSISTEN DENGAN INTERPRETASI CERDAS ALOKASI WAKTU TOTAL YANG TELAH DIJELASKAN DI CATATAN PENTING SEBELUMNYA.]

   --- PERTEMUAN 1 ---
   1. Pendahuluan (Durasi: sekitar 10-15% dari total menit per sesi)
      [Rincikan langkah-langkah pendahuluan: Pembukaan, Apersepsi, Motivasi, Penyampaian Tujuan Pembelajaran, Asesmen Diagnostik Singkat.]

   2. Inti (Durasi: sekitar 70-80% dari total menit per sesi)
      [Kembangkan langkah-langkah kegiatan inti yang detail, interaktif, dan berpusat pada siswa, secara eksplisit mengintegrasikan Mindful, Meaningful, dan Joyful Learning. Rincikan aktivitas siswa dan guru terkait ${materi} untuk pertemuan ini.]
      [Sertakan juga opsi untuk PEMBELAJARAN BERDIFERENSIASI dalam kegiatan inti.]

   3. Penutup (Durasi: sekitar 10-15% dari total menit per sesi)
      [Rincikan langkah-langkah penutup: Kesimpulan Bersama, Refleksi, Umpan Balik, Penguatan Materi, Info Pertemuan Berikutnya, Salam penutup.]

   --- PERTEMUAN 2 --- (dan seterusnya, sesuai dengan ${jumlahPertemuan})
   [Ulangi struktur yang sama untuk pertemuan-pertemuan berikutnya. Pastikan ada alur yang logis dan kesinambungan antar pertemuan. Kegiatan di pertemuan selanjutnya harus membangun pemahaman dari pertemuan sebelumnya.]

E. LAMPIRAN

   1. Rubrik Penilaian
      [Sediakan contoh rubrik penilaian yang relevan untuk salah satu asesmen formatif atau sumatif yang disebutkan di bagian C. Misalnya, rubrik untuk presentasi kelompok atau penilaian esai terkait ${materi}. Rubrik harus mencakup kriteria penilaian, deskriptor untuk setiap level capaian (misal: Sangat Baik, Baik, Cukup, Perlu Bimbingan), dan skor/bobot jika ada.]

   2. LKPD (Lembar Kerja Peserta Didik)
      [Sajikan LKPD yang sesuai dengan kegiatan inti pembelajaran ${materi} dan mendukung pencapaian Tujuan Pembelajaran. Mulai LKPD dengan format berikut:
       Nama          : .............................................
       Kelas         : .............................................
       Nomor Absen   : .............................................

       Petunjuk Pengerjaan:
       [Tuliskan di sini petunjuk umum pengerjaan LKPD, misalnya: "Bacalah setiap soal dengan teliti.", "Kerjakan soal secara mandiri/kelompok.", "Tuliskan jawabanmu pada tempat yang disediakan."]
       Jika modul ini untuk beberapa pertemuan, Anda bisa membuat beberapa LKPD atau satu LKPD yang dibagi per pertemuan.]

   3. Materi Ajar
      [Sediakan ringkasan singkat materi atau poin-poin kunci dari ${materi} yang akan diajarkan. Ini bukan materi lengkap, tetapi highlight yang bisa membantu guru mengingat inti materi. Bisa juga berupa saran sumber belajar tambahan (misal: tautan video pembelajaran, artikel, atau buku teks yang relevan dengan ${materi} dan Kelas (${kelas})).]

   4. Evaluasi Mandiri
      [Buat bagian evaluasi mandiri yang terdiri dari 3 sampai 5 soal isian singkat (esai singkat). Soal-soal ini harus secara langsung mengukur pemahaman siswa terhadap Tujuan Pembelajaran (Bagian B) dan sesuai dengan tingkat kesulitan untuk Kelas (${kelas}). Yang terpenting, SERTAKAN KUNCI JAWABAN yang jelas dan ringkas untuk setiap soal untuk memudahkan guru melakukan koreksi.]

Pastikan bahasa yang digunakan jelas, lugas, profesional, dan mudah dipahami oleh guru. Seluruh output harus dalam Bahasa Indonesia. Format akhir harus konsisten dan terstruktur dengan baik.
`;
};