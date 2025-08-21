import { DocxJson } from './markdownUtils';

/**
 * Generates a DOCX file from a template and JSON data.
 * Fetches a template file from the server, fills it with data, and triggers a download.
 */
export const exportWithDocxTemplater = async (data: DocxJson, fileName: string) => {
    // Dynamically import libraries only when the function is called to prevent initial load crashes.
    const PizZip = (await import('pizzip')).default;
    const Docxtemplater = (await import('docxtemplater')).default;
    const { saveAs } = await import('file-saver');
    
    // 1. Fetch the template file from the public folder.
    const response = await fetch('/template.docx');
    if (!response.ok) {
        throw new Error(`Gagal memuat file template.docx (status: ${response.status})`);
    }
    const templateBlob = await response.arrayBuffer();

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
};