import { DocxJson } from './markdownUtils';

/**
 * Generates a DOCX file from a template and JSON data.
 * Fetches a template file, fills it with data, and triggers a download.
 */
export const exportWithDocxTemplater = async (data: DocxJson, fileName: string) => {
    // Dynamically import libraries only when the function is called to prevent initial load crashes.
    const PizZip = (await import('pizzip')).default;
    const Docxtemplater = (await import('docxtemplater')).default;
    const { saveAs } = await import('file-saver');
    
    // 1. Fetch the template file from the public folder.
    const response = await fetch('/template.docx');
    if (!response.ok) {
        throw new Error(`Server tidak dapat menemukan template.docx (status: ${response.status}). Pastikan file berada di folder 'public' pada direktori utama proyek Anda.`);
    }
    const templateBlob = await response.arrayBuffer();

    try {
        // 2. Load the template with PizZip and create a Docxtemplater instance.
        const zip = new PizZip(templateBlob);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true, // Handles newlines (\n) in data by converting them to <w:br/>
        });

        // 3. Set the data for the template.
        doc.setData(data);

        // 4. Render the document (replace placeholders with data).
        doc.render();

        // 5. Generate the output file as a blob.
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        
        // 6. Trigger the download using FileSaver.js.
        saveAs(out, fileName);

    } catch (error) {
        // --- DIAGNOSIS CERDAS ---
        // Menangkap error 'zip' yang membingungkan dan memberikan pesan yang lebih baik.
        if (error instanceof Error && error.message.includes("Can't find end of central directory")) {
            const contentType = response.headers.get('content-type');
            
            // Cek apakah server mengirimkan file HTML
            if (contentType && contentType.includes('text/html')) {
                throw new Error("Kesalahan Konfigurasi Server: Server mengirimkan halaman web (HTML) alih-alih file template.docx. Pastikan folder 'public' berada di direktori utama (root) proyek dan konfigurasi 'vercel.json' Anda sudah benar.");
            } else {
                // Server mengirimkan file lain yang bukan DOCX valid.
                throw new Error(`File template.docx yang diterima dari server tampaknya rusak atau bukan format yang benar. Tipe file yang diterima: ${contentType || 'tidak diketahui'}.`);
            }
        }
        // Lemparkan kembali error lain yang tidak terduga.
        throw error;
    }
};