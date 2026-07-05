import { LessonPlanInput } from '../types';

export const generateLessonPlanPrompt = (input: LessonPlanInput): string => {
  const { 
    mataPelajaran, singkatan, kelasFase, tahunPelajaran, alokasiWaktu, jpPerMinggu, durasiPertemuan,
    materi, jumlahPertemuan, tujuanPembelajaran, praktikPedagogis,
    dimensiProfilLulusan
  } = input;

  return `Anda adalah seorang ahli pengembangan kurikulum dan desainer instruksional yang sangat berpengalaman.

Tugas Anda: Buatlah Modul Ajar (Dokumen 7) yang super presisi berbasis Deep Learning (Mindful, Meaningful, Joyful).

ATURAN WAJIB (STRICT INSTRUCTIONS):
1. HANYA hasilkan kode HTML murni tanpa membungkusnya dengan markdown \`\`\`html.
2. JANGAN berikan teks pengantar atau penutup apa pun.
3. Seluruh tabel harus menggunakan format tag HTML standar (<table border="1" style="border-collapse: collapse; width: 100%;">).
4. Setiap Header Tabel (<th>) wajib menggunakan warna latar belakang Biru Tua (#1a3a5c) dengan teks putih tebal.
5. Integrasikan istilah "Dimensi Profil Lulusan".
6. Penomoran kode dokumen harus taat struktur: [Singkatan Mapel]-[Fase/Kelas]-[Kode Elemen]-[Nomor Urut].

Gunakan data berikut:
Mata Pelajaran: ${mataPelajaran}
Singkatan Mapel: ${singkatan}
Fase/Kelas: ${kelasFase}
Tahun Pelajaran: ${tahunPelajaran}
Alokasi Waktu: ${alokasiWaktu}
Durasi Pertemuan: ${durasiPertemuan}
Materi: ${materi}
Jumlah Pertemuan: ${jumlahPertemuan}
Tujuan Pembelajaran: ${tujuanPembelajaran}
Dimensi Profil Lulusan: ${dimensiProfilLulusan.join(', ')}
Praktik Pedagogis: ${praktikPedagogis}

Susun Modul Ajar lengkap dengan Asesmen Diagnostik (Kognitif & Non-Kognitif), Kegiatan Inti yang dipecah per sintak model pembelajaran lengkap dengan tag kognitif, serta Lampiran LKPD utuh. Gunakan tag HTML semantik (<h1>, <h2>, <p>, <ul>, <table>, dll).`;
};
