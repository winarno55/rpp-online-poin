const fs = require('fs');

function applyModelFix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the MODELS_TO_TRY array
    const searchRegex = /const MODELS_TO_TRY = \[[\s\S]*?\];/;
    const replacement = `const MODELS_TO_TRY = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.0-pro-exp-02-05',
    'gemini-1.5-pro'
];`;

    if (content.match(searchRegex)) {
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched ${filePath}`);
    } else {
        console.log(`Could not find match in ${filePath}`);
    }
}

applyModelFix('api/generate.ts');
applyModelFix('api/generate-bundle-step.ts');
