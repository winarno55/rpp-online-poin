const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// 1. Add activeDocumentId state
code = code.replace(
    'const [isSaving, setIsSaving] = useState(false);',
    `const [isSaving, setIsSaving] = useState(false);\n    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);`
);

// 2. Add handleSave functions
const saveCode = `
    const handleSave = async () => {
        if (!authData?.token) {
            setError("Silakan login untuk menyimpan dokumen.");
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            const title = \`\${appMode === 'bundle' ? 'Bundle' : 'Modul'} \${formData.mataPelajaran || 'Tanpa Judul'} - \${new Date().toLocaleDateString('id-ID')}\`;
            const dataToSave = {
                formData,
                docs,
                modulHtml
            };
            if (activeDocumentId) {
                await updateDocument(activeDocumentId, title, dataToSave);
            } else {
                const newDoc = await saveDocument(title, appMode, dataToSave);
                setActiveDocumentId(newDoc._id);
            }
            
            // Refresh saved docs
            const updatedDocs = await getDocuments();
            setSavedDocuments(updatedDocs);
            alert('Dokumen berhasil disimpan!');
        } catch (e: any) {
            setError(e.message || "Gagal menyimpan dokumen");
        } finally {
            setIsSaving(false);
        }
    };
    
    const loadDocument = (doc: SavedDocument) => {
        setAppMode(doc.type);
        setFormData(doc.data.formData || emptyForm);
        setDocs(doc.data.docs || {});
        setModulHtml(doc.data.modulHtml || null);
        setActiveDocumentId(doc._id);
        setActiveTab(doc.type === 'bundle' ? 0 : 7);
    };
    
    const handleCreateNew = (mode: 'bundle' | 'modul_ajar') => {
        setFormData(emptyForm);
        setDocs({});
        setModulHtml(null);
        setActiveDocumentId(null);
        setAppMode(mode);
        setActiveTab(mode === 'bundle' ? 0 : 7);
    };
`;

code = code.replace(
    'const handleGenerateBundle = async () => {',
    saveCode + '\n    const handleGenerateBundle = async () => {'
);

// 3. Add Save Button to Sidebar
code = code.replace(
    '{TABS.map((tab, idx) => (',
    `
                                <li>
                                    <button 
                                        onClick={() => setAppMode('select')}
                                        className="w-full text-left px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 flex items-center mb-4"
                                    >
                                        ← Kembali
                                    </button>
                                </li>
                                {TABS.map((tab, idx) => (`
);

code = code.replace(
    '</ul>\n                        </div>\n                    )}',
    `</ul>
                            <div className="mt-6 pt-4 border-t border-slate-600">
                                <button onClick={handleSave} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                    {isSaving ? 'Menyimpan...' : (activeDocumentId ? 'Simpan Perubahan' : 'Simpan Bundle')}
                                </button>
                            </div>
                        </div>
                    )}`
);

// For Modul Ajar mode
code = code.replace(
    'Modul Ajar\n                                    </button>\n                                </li>\n                            </ul>\n                        </div>\n                    )}',
    `Modul Ajar
                                    </button>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-slate-600">
                                <button onClick={handleSave} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                    {isSaving ? 'Menyimpan...' : (activeDocumentId ? 'Simpan Perubahan' : 'Simpan Modul')}
                                </button>
                            </div>
                        </div>
                    )}`
);


// 4. Modify App Mode Select to include "Buat Baru" logic in the cards
code = code.replace(
    'onClick={() => { setAppMode(\'modul_ajar\'); setActiveTab(7); }}',
    'onClick={() => handleCreateNew(\'modul_ajar\')}'
);
code = code.replace(
    'onClick={() => { setAppMode(\'bundle\'); setActiveTab(0); }}',
    'onClick={() => handleCreateNew(\'bundle\')}'
);

// 5. Add Saved Documents list to Select Mode
const savedDocsHtml = `
                    {/* Saved Documents Section */}
                    {authData?.token && savedDocuments.length > 0 && (
                        <div className="max-w-4xl w-full mt-12 mb-12">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Dokumen Tersimpan</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedDocuments.map(doc => (
                                    <div key={doc._id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col" onClick={() => loadDocument(doc)}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={\`text-xs font-semibold px-2 py-1 rounded-md \${doc.type === 'bundle' ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'}\`}>
                                                {doc.type === 'bundle' ? 'Bundle' : 'Modul'}
                                            </span>
                                            <span className="text-xs text-slate-500">{new Date(doc.updatedAt).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 line-clamp-2">{doc.title}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
`;

code = code.replace(
    '</div>\n            )}\n\n            {appMode !== \'select\' && (',
    `</div>\n                        ${savedDocsHtml}\n                    </div>\n                </div>\n            )}\n\n            {appMode !== 'select' && (`
);

fs.writeFileSync('src/pages/HomePage.tsx', code);
