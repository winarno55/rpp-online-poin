const fs = require('fs');

function patchFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
        /\} else \{\s*res\.end\(\);\s*\}/g,
        `} else {\n                res.write('\\n\\n[INFO SISTEM: Maaf, teks terpotong. Alasan: ' + (aiError.message || 'Waktu eksekusi habis/Server terputus') + ']');\n                res.end();\n            }`
    );
    fs.writeFileSync(file, content, 'utf8');
}

patchFile('api/generate.ts');
patchFile('api/generate-bundle-step.ts');
console.log('Patched error handling');
