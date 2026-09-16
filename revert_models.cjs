const fs = require('fs');

function revertModelFix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the MODELS_TO_TRY array
    const searchRegex = /const MODELS_TO_TRY = \[[\s\S]*?\];/;
    const replacement = `const MODELS_TO_TRY = [
    'gemini-3.8-flash',          // Latest Gen 3.8 Flash
    'gemini-3.7-flash',          // Latest Gen 3.7 Flash
    'gemini-3.6-flash',          // Latest Gen 3.6 Flash
    'gemini-3.5-flash',          // Latest Gen 3.5 Flash
    'gemini-3.1-pro-preview',    // 1. Gen 3.1 Pro (Kualitas Tertinggi)
    'gemini-3-flash-preview',    // 2. Gen 3 Flash (Kecepatan Tertinggi)
    'gemini-2.5-pro-preview',    // 3. Gen 2.5 Pro (Penalaran Kuat)
    'gemini-2.0-pro-exp-02-05'   // 4. Gen 2.0 Pro (Kualitas Stabil)
];`;

    if (content.match(searchRegex)) {
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Reverted ${filePath}`);
    } else {
        console.log(`Could not find match in ${filePath}`);
    }
}

revertModelFix('api/generate.ts');
revertModelFix('api/generate-bundle-step.ts');
