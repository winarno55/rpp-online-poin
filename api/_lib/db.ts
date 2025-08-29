import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (globalThis as any).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Pindahkan pengecekan ke dalam fungsi agar bisa ditangkap oleh blok try/catch di API handler.
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    // Melempar error di sini akan membuat API handler mengirim respons JSON yang benar,
    // bukan halaman error HTML dari Vercel.
    throw new Error('Variabel lingkungan MONGO_URI tidak terdefinisi. Harap konfigurasikan di pengaturan proyek Vercel Anda.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
