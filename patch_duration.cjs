const fs = require('fs');

function patchFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    // Check if it already has export const maxDuration
    if (!content.includes('export const maxDuration')) {
        content = `export const maxDuration = 60;\n` + content;
        fs.writeFileSync(file, content, 'utf8');
    }
}

patchFile('api/generate.ts');
patchFile('api/generate-bundle-step.ts');
console.log('Patched maxDuration in files');
