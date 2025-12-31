
export function getAllGeminiApiKeys(): string[] {
  const keys: string[] = [];

  // 1. Ambil key utama
  if (process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }

  // 2. Ambil key tambahan (GEMINI_API_KEY_2, GEMINI_API_KEY_3, dst.)
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('GEMINI_API_KEY_') && process.env[key]) {
      keys.push(process.env[key] as string);
    }
  });

  if (keys.length === 0) {
    throw new Error('Tidak ada GEMINI_API_KEY yang ditemukan di environment variables.');
  }

  // 3. Acak urutan array (Fisher-Yates Shuffle)
  // Ini memastikan beban terbagi rata, tetapi kita tetap mendapatkan list lengkap untuk dicoba satu per satu (fallback).
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  return keys;
}

// Keep backward compatibility if needed, though we will update consumers
export function getGeminiApiKey(): string {
  const keys = getAllGeminiApiKeys();
  return keys[0];
}
