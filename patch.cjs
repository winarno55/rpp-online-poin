const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');

const downloadFunc = `
    const handleDownloadDoc = async (htmlContent: string, fileName: string, isLandscape: boolean = false) => {
        try {
            const { exportToWord } = await import('../utils/docxUtils');
            exportToWord(htmlContent, fileName, isLandscape ? 'landscape' : 'portrait');
        } catch (e: any) {
            setError('Gagal membuat DOC: ' + e.message);
        }
    };
`;

if (!content.includes('handleDownloadDoc')) {
    content = content.replace('const printDocument = (', downloadFunc + '\n    const printDocument = (');
}

// Add download button for Modul Ajar
const btnHtml = `<button onClick={() => handleDownloadDoc(modulHtml || '', \`ModulAjar_\${formData.mataPelajaran}\`, false)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Unduh DOC</button>`;

if (!content.includes('Unduh DOC')) {
    content = content.replace(
        '<button onClick={() => setIsEditingModul(!isEditingModul)}',
        btnHtml + '\n                                        <button onClick={() => setIsEditingModul(!isEditingModul)}'
    );
}

// Add download button for Dokumen 1-6
const btnHtmlDocs = `<button onClick={() => handleDownloadDoc(docs[activeTab] || '', \`Dokumen_\${activeTab}_\${formData.mataPelajaran}\`, activeTab >= 3 && activeTab <= 6)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Unduh DOC</button>`;
if (!content.includes('Dokumen_')) {
    content = content.replace(
        '<button onClick={() => printDocument(docs[activeTab] || \'\', activeTab >= 3 && activeTab <= 6)}',
        btnHtmlDocs + '\n                            <button onClick={() => printDocument(docs[activeTab] || \'\', activeTab >= 3 && activeTab <= 6)}'
    );
}


fs.writeFileSync('src/pages/HomePage.tsx', content);
