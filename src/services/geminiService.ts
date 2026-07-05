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
