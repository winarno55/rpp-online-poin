const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

if (!code.includes('deleteDocument')) {
    code = code.replace('updateDocument, SavedDocument }', 'updateDocument, deleteDocument, SavedDocument }');
}

const deleteCode = `
    const handleDeleteDocument = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
        try {
            await deleteDocument(id);
            if (activeDocumentId === id) {
                handleCreateNew('select' as any);
            }
            const updatedDocs = await getDocuments();
            setSavedDocuments(updatedDocs);
        } catch (err: any) {
            alert(err.message || 'Gagal menghapus dokumen');
        }
    };
`;

if (!code.includes('handleDeleteDocument')) {
    code = code.replace("const handleCreateNew = (mode: 'bundle' | 'modul_ajar') => {", deleteCode + "\\n    const handleCreateNew = (mode: 'bundle' | 'modul_ajar') => {");
}

code = code.replace(
    '<h4 className="font-bold text-slate-800 line-clamp-2">{doc.title}</h4>',
    `<h4 className="font-bold text-slate-800 line-clamp-2 pr-8">{doc.title}</h4>
                                        <button onClick={(e) => handleDeleteDocument(e, doc._id)} className="absolute bottom-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Hapus Dokumen">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>`
);

code = code.replace(
    'className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col"',
    'className="relative bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col"'
);

fs.writeFileSync('src/pages/HomePage.tsx', code);
