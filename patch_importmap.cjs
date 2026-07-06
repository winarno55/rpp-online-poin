const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const importMap = `<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.1.0",
    "react-dom/client": "https://esm.sh/react-dom@^19.1.0/client",
    "react-router-dom": "https://esm.sh/react-router-dom@^6.20.1",
    "react-dom/": "https://esm.sh/react-dom@^19.1.0/",
    "react/": "https://esm.sh/react@^19.1.0/",
    "mongoose": "https://esm.sh/mongoose@^8.16.1",
    "bcryptjs": "https://esm.sh/bcryptjs@^3.0.2",
    "@vercel/node": "https://esm.sh/@vercel/node@^5.3.0",
    "jsonwebtoken": "https://esm.sh/jsonwebtoken@^9.0.2",
    "cors": "https://esm.sh/cors@^2.8.5",
    "@google/genai": "https://esm.sh/@google/genai@^1.6.0",
    "crypto": "https://esm.sh/crypto@^1.0.1",
    "nodemailer": "https://esm.sh/nodemailer@^7.0.3",
    "pizzip": "https://esm.sh/pizzip@3.1.7",
    "docxtemplater": "https://esm.sh/docxtemplater@3.47.2",
    "file-saver": "https://esm.sh/file-saver@2.0.5",
    "fs": "https://esm.sh/fs@^0.0.1-security",
    "path": "https://esm.sh/path@^0.12.7",
    "process": "https://esm.sh/process@^0.11.10",
    "vite": "https://aistudiocdn.com/vite@^7.1.3"
  }
}
</script>`;

html = html.replace('</head>', `${importMap}\n</head>`);
html = html.replace('<script type="module" src="/src/index.tsx"></script>', '<script type="module" src="/bundle.js"></script>');
fs.writeFileSync('index.html', html);
