import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { protect } from './_lib/auth.js';
import dbConnect from './_lib/db.js';
import User, { IUser } from './_lib/models/User.js';
import PricingConfig from './_lib/models/PricingConfig.js';
import BundleSession from './_lib/models/BundleSession.js';
import { getAllGeminiApiKeys } from './_lib/geminiKeyManager.js';
import cors from 'cors';

const corsHandler = cors();

const MODELS_TO_TRY = [
    'gemini-3.1-pro-preview',
    'gemini-3-flash-preview',
    'gemini-2.5-pro-preview',
    'gemini-2.0-pro-exp-02-05',
    'gemini-2.0-flash-exp'
];

type AuthRequest = VercelRequest & { user?: IUser; };

async function apiHandler(req: AuthRequest, res: VercelResponse) {
    try {
        await dbConnect();
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        if (req.user.role === 'admin') return res.status(403).json({ message: 'Admin users cannot generate.' });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({ message: 'User not found.' });

        const { step, inputData, previousDocs, bundleId } = req.body;

        let activeBundleId = bundleId;

        // Step 1: Charge points and create session
        if (step === 1) {
            const pricingConfig = await PricingConfig.findOne().exec();
            const bundleCost = pricingConfig?.bundleCost || 50;

            if (user.points < bundleCost) {
                return res.status(403).json({ message: `Poin Anda tidak cukup untuk Bundle (butuh ${bundleCost} poin).` });
            }

            user.points -= bundleCost;
            await user.save();

            const session = new BundleSession({ userId: user._id });
            await session.save();
            activeBundleId = session._id.toString();
        } else {
            // Verify session
            if (!activeBundleId) return res.status(400).json({ message: 'Missing bundleId' });
            const session = await BundleSession.findOne({ _id: activeBundleId, userId: user._id, status: 'active' });
            if (!session) return res.status(403).json({ message: 'Invalid or expired bundle session.' });
            
            // If it's the last step, mark completed
            if (step === 6) {
                session.status = 'completed';
                await session.save();
            }
        }

        try {
            const prompt = constructPromptForStep(step, inputData, previousDocs);
            const apiKeys = getAllGeminiApiKeys();
            let responseStream = null;
            let lastError = null;

            modelLoop: for (const modelName of MODELS_TO_TRY) {
                for (let i = 0; i < apiKeys.length; i++) {
                    try {
                        const ai = new GoogleGenAI({ apiKey: apiKeys[i] });
                        const stream = await ai.models.generateContentStream({
                            model: modelName,
                            contents: prompt,
                        });
                        responseStream = stream;
                        break modelLoop;
                    } catch (error: any) {
                        lastError = error;
                    }
                }
            }

            if (!responseStream) throw lastError || new Error("Failed to connect to AI");

            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Bundle-Id': activeBundleId
            });

            for await (const chunk of responseStream) {
                if (chunk.text) res.write(chunk.text);
            }
            res.end();
        } catch (aiError: any) {
            console.error('Gemini Error:', aiError);
            if (step === 1 && !res.headersSent) {
                // Refund points
                const pricingConfig = await PricingConfig.findOne().exec();
                user.points += (pricingConfig?.bundleCost || 50);
                await user.save();
                res.status(424).json({ message: 'Gagal komunikasi AI. Poin dikembalikan.', error: aiError.message });
            } else if (!res.headersSent) {
                res.status(424).json({ message: 'Gagal komunikasi AI.', error: aiError.message });
            } else {
                res.end();
            }
        }
    } catch (dbError: any) {
        if (!res.headersSent) res.status(500).json({ message: 'Server error', error: dbError.message });
    }
}

function constructPromptForStep(step: number, input: any, previousDocs: any): string {
    const getFase = (k: string) => {
        if (["Kelas I", "Kelas II"].includes(k)) return "Fase A";
        if (["Kelas III", "Kelas IV"].includes(k)) return "Fase B";
        if (["Kelas V", "Kelas VI"].includes(k)) return "Fase C";
        if (["Kelas VII", "Kelas VIII", "Kelas IX"].includes(k)) return "Fase D";
        if (k === "Kelas X") return "Fase E";
        if (["Kelas XI", "Kelas XII"].includes(k)) return "Fase F";
        return "";
    };
    const fase = getFase(input.kelasFase);
    const kelasFaseCombined = `${input.kelasFase} / ${fase}`;

    const commonRules = `
PENTING: Seluruh analisis Capaian Pembelajaran (CP), penyusunan Tujuan Pembelajaran (TP), pembuatan Alur Tujuan Pembelajaran (ATP), Prota, Promes, KKTP, dan Modul Ajar (RPP) wajib sepenuhnya mengacu pada regulasi kurikulum terbaru di Indonesia, yaitu **Keputusan Kepala BSKAP (Badan Standar, Kurikulum, dan Asesmen Pendidikan) Nomor 046/H/KR/2025** (bukan Nomor 032/H/KR/2024 maupun Nomor 033/H/KR/2022). Pastikan semua standar kompetensi, materi pokok, dan pembagian elemen disesuaikan dengan Keputusan Kepala BSKAP Nomor 046/H/KR/2025.

ATURAN WAJIB (STRICT INSTRUCTIONS):
1. HANYA hasilkan kode HTML murni tanpa membungkusnya dengan markdown \`\`\`html.
2. JANGAN berikan teks pengantar atau penutup apa pun. Mulailah langsung dengan konten utama.
3. Seluruh tabel harus menggunakan format tag HTML standar (<table border="1" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">).
4. Setiap Header Tabel (<th>) wajib menggunakan warna latar belakang Biru Tua (#1a3a5c) dengan teks putih tebal.
5. Gunakan istilah "Dimensi Profil Lulusan".
6. Penomoran kode dokumen harus taat struktur: [Singkatan Mapel]-[Fase/Kelas]-[Kode Elemen]-[Nomor Urut].
7. Gunakan tag HTML semantik: <h1> untuk judul dokumen, <h2> untuk bagian, <p> untuk teks, <ul>/<li> untuk daftar.
8. Di bagian paling akhir dokumen, WAJIB tambahkan blok tanda tangan (Mengetahui Kepala Sekolah dan Guru Mata Pelajaran) menggunakan format tabel tanpa garis (border="0" atau style="border:none; width: 100%; margin-top: 40px;") yang rapi, memuat nama dan NIP: Kepala Sekolah (${input.namaKepalaSekolah}, NIP: ${input.nipKepalaSekolah}), Guru (${input.namaGuru}, NIP: ${input.nipGuru}), dan Tempat/Tanggal (${input.kotaTanggalTtd}).
9. Pertimbangkan tahap perkembangan psikologis dan kognitif anak pada jenjang/fase tersebut sesuai standar proses di Indonesia.
`;
    const identityData = `
Mata Pelajaran: ${input.mataPelajaran}
Singkatan Mapel: ${input.singkatan}
Kelas/Fase: ${kelasFaseCombined}
Tahun Pelajaran: ${input.tahunPelajaran}
Alokasi Waktu: ${input.alokasiWaktu}
JP per Minggu: ${input.jpPerMinggu}
Durasi Pertemuan: ${input.durasiPertemuan}
Daftar Elemen & Kode: ${input.elemenKode}
CP Umum: ${input.cpUmum}
CP per Elemen: ${input.cpPerElemen}
`;

    if (step === 1) {
        return `${commonRules}\nBuatlah Dokumen 1 (Analisis Capaian Pembelajaran) yang komprehensif. Analisis elemen-elemen CP berikut dan hubungkan dengan Fase/Kelas. Hasil akhirnya adalah tabel analisis kompetensi dan ruang lingkup materi.\nData:\n${identityData}`;
    } else if (step === 2) {
        return `${commonRules}\nBerikut adalah Dokumen 1:\n${previousDocs.doc1}\nBuatlah Dokumen 2 (Tujuan Pembelajaran) berdasarkan Dokumen 1. Rumuskan Tujuan Pembelajaran (TP) yang ABCD (Audience, Behavior, Condition, Degree). Sajikan dalam tabel dengan kolom: Kode TP, Tujuan Pembelajaran, dan Kata Kunci.`;
    } else if (step === 3) {
        return `${commonRules}\nBerikut adalah Dokumen 2:\n${previousDocs.doc2}\nBuatlah Dokumen 3 (Alur Tujuan Pembelajaran - ATP). Susun TP ke dalam alur yang logis dan urut. \nWAJIB: Gunakan format tabel HTML dengan kolom: "Kode TP", "Tujuan Pembelajaran", "Materi Pokok", dan "Alokasi JP".`;
    } else if (step === 4) {
        return `${commonRules}\nBerikut adalah Dokumen 3 (ATP):\n${previousDocs.doc3}\nBuatlah Dokumen 4 (Program Tahunan). Alokasikan JP per semester berdasarkan data Kalender Pendidikan: ${input.kalenderPendidikan}`;
    } else if (step === 5) {
        return `${commonRules}\nBerikut adalah Dokumen 4:\n${previousDocs.doc4}\nBuatlah Dokumen 5 (Program Semester 1 & 2). Buat tabel distribusi JP per bulan/minggu untuk satu tahun pelajaran.`;
    } else if (step === 6) {
        return `${commonRules}\nBerikut adalah Dokumen 3:\n${previousDocs.doc3}\nBuatlah Dokumen 6 (Kriteria Ketercapaian Tujuan Pembelajaran - KKTP). Gunakan rentang nilai: ${input.rentangNilaiKktp}. Buat deskripsi kriteria ketuntasan untuk setiap TP.`;
    }
    return '';
}

export default function (req: VercelRequest, res: VercelResponse) {
    corsHandler(req, res, () => {
        protect(req as AuthRequest, res, () => {
            if (res.headersSent) return;
            apiHandler(req as AuthRequest, res);
        });
    });
};
