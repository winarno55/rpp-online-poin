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
    
    // 1. Fetch the template file from the dedicated API endpoint.
    const response = await fetch('/api/template');
    if (!response.ok) {
        // Try to parse the error message from the API if available
        try {
            const errorData = await response.json();
            throw new Error(`Gagal mengambil file template dari server: ${errorData.message || response.statusText}`);
        } catch (e) {
            throw new Error(`Gagal mengambil file template dari server (status: ${response.status}).`);
        }
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
        // The 'zip' error is the most common one when the template is invalid.
        if (error instanceof Error && error.message.includes("Can't find end of central directory")) {
            throw new Error('File template yang diterima dari server rusak atau tidak valid. Silakan hubungi admin.');
        }
        // Lemparkan kembali error lain yang tidak terduga.
        throw error;
    }
};
