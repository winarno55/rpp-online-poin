const fs = require('fs');

function patchFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add imports if needed
    if (!content.includes('HarmCategory')) {
        content = content.replace("import { GoogleGenAI } from '@google/genai';", "import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';");
    }
    
    // Fix usage
    content = content.replace(/"HARM_CATEGORY_HATE_SPEECH"/g, "HarmCategory.HARM_CATEGORY_HATE_SPEECH");
    content = content.replace(/"HARM_CATEGORY_DANGEROUS_CONTENT"/g, "HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT");
    content = content.replace(/"HARM_CATEGORY_SEXUALLY_EXPLICIT"/g, "HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT");
    content = content.replace(/"HARM_CATEGORY_HARASSMENT"/g, "HarmCategory.HARM_CATEGORY_HARASSMENT");
    content = content.replace(/"BLOCK_NONE"/g, "HarmBlockThreshold.BLOCK_NONE");
    
    fs.writeFileSync(file, content, 'utf8');
}

patchFile('api/generate.ts');
patchFile('api/generate-bundle-step.ts');
console.log('Fixed safety types');
