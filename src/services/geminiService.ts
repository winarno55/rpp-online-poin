import { LessonPlanInput } from '../types';

export const generateLessonPlanPrompt = (input: LessonPlanInput): string => {
  const { 
    mataPelajaran, singkatan, kelasFase, tahunPelajaran, alokasiWaktu, jpPerMinggu, durasiPertemuan,
    materi, jumlahPertemuan, tujuanPembelajaran, praktikPedagogis,
    dimensiProfilLulusan
  } = input;

  return `Anda adalah seorang ahli pengembangan kurikulum dan desainer instruksional yang sangat berpengalaman di Indonesia, ahli dalam Kurikulum Merdeka.
  
Tugas Anda: Buatlah Modul Ajar (Dokumen 7) yang lengkap, profesional, dan siap pakai. Gunakan pendekatan Deep Learning (Mindful, Meaningful, Joyful).

ATURAN WAJIB (STRICT INSTRUCTIONS):
1. HANYA hasilkan kode HTML murni tanpa membungkusnya dengan markdown \`\`\`html.
2. JANGAN berikan teks pengantar atau penutup apa pun. Mulailah langsung dengan judul atau struktur modul.
3. Gunakan tag HTML semantik: <h1> untuk judul utama, <h2> untuk bagian besar (Informasi Umum, Komponen Inti, Lampiran), <h3> untuk sub-bagian.
4. Seluruh tabel harus menggunakan format tag HTML standar (<table border="1" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">).
5. Setiap Header Tabel (<th>) wajib menggunakan warna latar belakang Biru Tua (#1a3a5c) dengan teks putih tebal.
6. Integrasikan istilah "Dimensi Profil Lulusan" sesuai pilihan pengguna.
7. Penomoran kode dokumen harus taat struktur: [Singkatan Mapel]-[Fase/Kelas]-[Kode Elemen]-[Nomor Urut].

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
  - Gunakan sintaks model pembelajaran yang sesuai dengan ${praktikPedagogis}.
  - Berikan detail instruksi guru dan aktivitas siswa.
- Asesmen (Diagnostik, Formatif, Sumatif) dengan rubrik yang jelas.

C. LAMPIRAN
- Lembar Kerja Peserta Didik (LKPD) yang menarik dan menantang.
- Pengayaan dan Remedial.
- Bahan Bacaan Guru & Peserta Didik.
- Glosarium.
- Daftar Pustaka.

DATA INPUT:
Mata Pelajaran: ${mataPelajaran} (${singkatan})
Fase/Kelas: ${kelasFase}
Tahun Pelajaran: ${tahunPelajaran}
Materi: ${materi}
Jumlah Pertemuan: ${jumlahPertemuan} (Total JP: ${input.jamPelajaran})
`;
};
