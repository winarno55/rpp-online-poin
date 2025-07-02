
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
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    // This error will now be thrown during execution, not at module load time,
    // allowing it to be caught by the API handler's try...catch block.
    throw new Error('Please define the MONGO_URI environment variable inside .env.local or Vercel environment variables');
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
