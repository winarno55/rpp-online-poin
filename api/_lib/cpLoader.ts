import fs from 'fs';
import path from 'path';

export interface CpAsset {
  filename: string;
  mimeType: string;
  data: string; // Base64 encoded PDF
  versionInfo: string;
}

/**
 * Memeriksa apakah mata pelajaran termasuk kelompok PAI (Pendidikan Agama Islam)
 */
export function isPaiSubject(mataPelajaran?: string): boolean {
  if (!mataPelajaran) return false;
  const lower = mataPelajaran.toLowerCase();
  return (
    lower.includes('pai') ||
    lower.includes('agama islam') ||
    lower.includes('pendidikan agama islam')
  );
}

/**
 * Memuat file PDF Capaian Pembelajaran (CP) berdasarkan Mata Pelajaran:
 * - CP 020/2026 untuk PAI
 * - CP 046/2025 untuk Mata Pelajaran Umum lainnya
 */
export function getCpContentForSubject(mataPelajaran?: string): CpAsset | null {
  try {
    const isPai = isPaiSubject(mataPelajaran);
    const fileName = isPai ? 'cp-020-2026-pai.pdf' : 'cp-046-2025-umum.pdf';
    const filePath = path.join(process.cwd(), 'data', 'cp', fileName);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const versionInfo = isPai
        ? 'Dokumen Resmi CP No. 020/H/KR/2026 (Khusus PAI)'
        : 'Dokumen Resmi CP No. 046/H/KR/2025 (Mata Pelajaran Umum)';

      return {
        filename: fileName,
        mimeType: 'application/pdf',
        data: base64Data,
        versionInfo
      };
    }
  } catch (err) {
    console.warn('[CP Loader] Gagal membaca file PDF CP:', err);
  }

  return null;
}

/**
 * Menyusun payload `contents` untuk Gemini API
 */
export function buildGeminiContents(promptText: string, _mataPelajaran?: string) {
  // Teks CP spesifik sudah ada di dalam prompt dari formulir input.
  // Tidak melampirkan file PDF utuh (1691 halaman) untuk menghindari batas 1000 halaman Gemini API & error kuota.
  return promptText;
}
