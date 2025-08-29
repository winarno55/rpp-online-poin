import type { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import { AuthError } from './middleware.js';

const corsHandler = cors();

/**
 * Membuat pembungkus (wrapper) untuk semua handler API Vercel.
 * Wrapper ini menyediakan penanganan CORS dan blok try-catch terpusat yang tangguh.
 * Ini memastikan bahwa semua error, termasuk error kustom seperti `AuthError`,
 * ditangani dengan baik dan server selalu mengembalikan respons JSON yang valid,
 * mencegah server crash dan error 'Unexpected token T' di frontend.
 * @param handler Fungsi logika API asinkron yang akan dieksekusi.
 * @returns Sebuah handler Vercel yang siap diekspor.
 */
export function createApiHandler(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      // Menangani CORS sebagai langkah pertama
      await new Promise((resolve, reject) => {
        corsHandler(req, res, (result: any) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      });

      // Menjalankan logika inti dari API
      await handler(req, res);

    } catch (error: any) {
      // Mencatat error fatal di sisi server untuk debugging
      console.error(`[FATAL API ERROR @ ${req.url}]`, error);

      // Memeriksa apakah respons sudah dikirim; jika belum, kirim respons error JSON
      if (!res.headersSent) {
        const statusCode = error instanceof AuthError ? error.statusCode : 500;
        const message = error.message || 'Terjadi kesalahan internal pada server.';
        
        res.status(statusCode).json({ message });
      } 
      // Jika header sudah terkirim tapi stream belum selesai (misalnya saat streaming), coba tutup.
      else if (!res.writableEnded) {
        res.end();
      }
    }
  };
}