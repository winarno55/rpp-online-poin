const fs = require('fs');

function patchGeminiService() {
    let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');
    
    // Remove point 4 from generateLessonPlanPrompt
    const point4Regex = /4\. Karena Anda memiliki kemampuan \*\*Google Search Grounding.*?dengan regulasi 046\/H\/KR\/2025\./g;
    content = content.replace(point4Regex, '');
    
    // Add instruction to be concise
    content = content.replace('Tugas Anda: Buatlah Modul Ajar (Dokumen 7) yang lengkap, profesional, dan siap pakai. Gunakan pendekatan Deep Learning (Mindful, Meaningful, Joyful).',
    'Tugas Anda: Buatlah Modul Ajar (Dokumen 7) yang padat, ringkas, profesional, dan siap pakai. Gunakan pendekatan Deep Learning secara efisien. KARENA KETERBATASAN WAKTU SERVER, JANGAN BERTELE-TELE. Tuliskan poin-poin kegiatan pembelajaran secara langsung dan padat.');
    
    fs.writeFileSync('src/services/geminiService.ts', content, 'utf8');
    console.log('Patched geminiService.ts');
}

function patchApiGenerate() {
    let content = fs.readFileSync('api/generate.ts', 'utf8');
    // Force hasSearch to false in generate.ts to save time
    content = content.replace(/const hasSearch = modelName\.startsWith\('gemini-3'\);/g, 'const hasSearch = false; // Disabled to save execution time and prevent Vercel 60s timeout');
    fs.writeFileSync('api/generate.ts', content, 'utf8');
    console.log('Patched api/generate.ts');
}

patchGeminiService();
patchApiGenerate();
