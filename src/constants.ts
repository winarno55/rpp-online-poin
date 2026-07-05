

export const JUMLAH_PERTEMUAN_OPTIONS = [
    "1 Kali Pertemuan",
    "2 Kali Pertemuan",
    "3 Kali Pertemuan",
    "4 Kali Pertemuan",
    "5 Kali Pertemuan"
] as const;

export const KELAS_OPTIONS = [
    "Kelas I",
    "Kelas II",
    "Kelas III",
    "Kelas IV",
    "Kelas V",
    "Kelas VI",
    "Kelas VII",
    "Kelas VIII",
    "Kelas IX",
    "Kelas X",
    "Kelas XI",
    "Kelas XII"
] as const;

export const getFaseForKelas = (kelas: string): string => {
    if (["Kelas I", "Kelas II"].includes(kelas)) return "Fase A";
    if (["Kelas III", "Kelas IV"].includes(kelas)) return "Fase B";
    if (["Kelas V", "Kelas VI"].includes(kelas)) return "Fase C";
    if (["Kelas VII", "Kelas VIII", "Kelas IX"].includes(kelas)) return "Fase D";
    if (kelas === "Kelas X") return "Fase E";
    if (["Kelas XI", "Kelas XII"].includes(kelas)) return "Fase F";
    return "";
};

export const DIMENSI_PROFIL_LULUSAN = [
    "Keimanan dan Ketakwaan terhadap Tuhan YME",
    "Kewargaan",
    "Kreativitas",
    "Penalaran Kritis",
    "Kemandirian",
    "Kolaborasi",
    "Komunikasi",
    "Kesehatan"
] as const;

export const PRAKTIK_PEDAGOGIS_LAINNYA = "Lainnya... (Tuliskan di bawah)";

export const PRAKTIK_PEDAGOGIS_OPTIONS = [
    "Pembelajaran Berbasis Masalah (Problem-Based Learning)",
    "Pembelajaran Berbasis Proyek (Project-Based Learning)",
    "Pembelajaran Inkuiri (Inquiry-Based Learning)",
    "Pembelajaran Kontekstual (Contextual Teaching and Learning)",
    "Pembelajaran Kooperatif (Cooperative Learning)",
    "Pembelajaran Berdiferensiasi (Differentiated Learning)",
    PRAKTIK_PEDAGOGIS_LAINNYA
] as const;


export const BASE_POINTS_PER_SESSION = 20;