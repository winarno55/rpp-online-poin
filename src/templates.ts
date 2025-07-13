import { LessonPlanTemplate } from './types';
import { KELAS_FASE_OPTIONS, PRAKTIK_PEDAGOGIS_OPTIONS, DIMENSI_PROFIL_LULUSAN, PRAKTIK_PEDAGOGIS_LAINNYA } from './constants';

export const templates: LessonPlanTemplate[] = [
  {
    title: "Praktikum IPA: Uji Makanan",
    description: "Template untuk pembelajaran praktikum IPA mengidentifikasi kandungan zat makanan.",
    data: {
      mataPelajaran: "Ilmu Pengetahuan Alam (IPA)",
      kelasFase: KELAS_FASE_OPTIONS[6], // Kelas VII / Fase D
      materi: "Uji Kandungan Zat Makanan (Karbohidrat, Protein, Lemak)",
      jumlahPertemuan: "2 Kali Pertemuan",
      jamPelajaran: "3",
      pesertaDidik: "Peserta didik reguler dengan kemampuan heterogen.",
      dimensiProfilLulusan: [
        DIMENSI_PROFIL_LULUSAN[3], // Penalaran Kritis
        DIMENSI_PROFIL_LULUSAN[5], // Kolaborasi
      ],
      capaianPembelajaran: "Peserta didik dapat melakukan pengujian sederhana untuk mengidentifikasi kandungan gizi dalam bahan makanan.",
      lintasDisiplinIlmu: "Kimia, Kesehatan",
      tujuanPembelajaran: "1. Mengidentifikasi kandungan karbohidrat, protein, dan lemak dalam berbagai bahan makanan melalui uji sederhana.\n2. Merancang dan melaksanakan percobaan uji makanan secara sistematis dan aman.\n3. Menyajikan hasil pengamatan dalam bentuk tabel dan menarik kesimpulan.",
      praktikPedagogis: PRAKTIK_PEDAGOGIS_OPTIONS[2], // Pembelajaran Inkuiri (Inquiry-Based Learning)
      lingkunganPembelajaran: "Laboratorium IPA sekolah.",
      pemanfaatanDigital: "Menggunakan kamera ponsel untuk mendokumentasikan hasil percobaan dan proyektor untuk presentasi kelompok.",
      kemitraanPembelajaran: "",
    }
  },
  {
    title: "Bahasa Indonesia: Teks Negosiasi",
    description: "Template untuk pembelajaran menganalisis dan menulis teks negosiasi.",
    data: {
      mataPelajaran: "Bahasa Indonesia",
      kelasFase: KELAS_FASE_OPTIONS[9], // Kelas X / Fase E
      materi: "Menganalisis dan Menciptakan Teks Negosiasi",
      jumlahPertemuan: "3 Kali Pertemuan",
      jamPelajaran: "2",
      pesertaDidik: "",
      dimensiProfilLulusan: [
        DIMENSI_PROFIL_LULUSAN[6], // Komunikasi
        DIMENSI_PROFIL_LULUSAN[2], // Kreativitas
      ],
      capaianPembelajaran: "Peserta didik mampu mengevaluasi informasi dan gagasan dari teks negosiasi serta menulis teks negosiasi untuk menyampaikan gagasan secara efektif.",
      lintasDisiplinIlmu: "Ekonomi, Kewirausahaan",
      tujuanPembelajaran: "1. Menganalisis struktur dan kaidah kebahasaan teks negosiasi.\n2. Mengidentifikasi unsur pengajuan, penawaran, dan persetujuan dalam teks negosiasi.\n3. Menulis teks negosiasi sederhana berdasarkan konteks yang diberikan.",
      praktikPedagogis: PRAKTIK_PEDAGOGIS_OPTIONS[0], // Pembelajaran Berbasis Masalah (Problem-Based Learning)
      lingkunganPembelajaran: "Suasana kelas yang interaktif dengan simulasi jual-beli atau situasi negosiasi lainnya.",
      pemanfaatanDigital: "Menonton contoh video negosiasi dari YouTube.",
      kemitraanPembelajaran: "Mengundang wirausahawan lokal sebagai narasumber (opsional).",
    }
  }
];
