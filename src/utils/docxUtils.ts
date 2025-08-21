// Helper function to create the base HTML structure for Word
const createWordHtml = (bodyContent: string): string => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
                        xmlns:w='urn:schemas-microsoft-com:office:word' 
                        xmlns='http://www.w3.org/TR/REC-html40'>
                        <head>
                          <meta charset='utf-8'>
                          <title>Modul Ajar</title>
                          <style>
                            /* --- General Word Compatibility Styles --- */
                            body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.3; }
                            p { margin: 0 0 8pt 0; }
                            /* Let Word handle list indentation by removing custom padding */
                            ul, ol { margin-top: 0; margin-bottom: 8pt; }
                            li { margin-bottom: 4pt; }
                            table { border-collapse: collapse; width: 100%; margin-bottom: 10pt; }
                            td, th { border: 1px solid black; padding: 5px; }
                            h1, h2, h3, h4, h5, h6 { font-family: 'Cambria', 'Times New Roman', serif; margin-top: 18pt; margin-bottom: 10pt; }
                          </style>
                        </head><body>`;
    const footer = "</body></html>";
    return header + bodyContent + footer;
};

// Helper function to trigger the download
const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Exports content as a .doc file. This version preserves list tags and provides
 * a reliable way to open the content in various Word versions.
 * This is effectively an HTML file disguised as a .doc file.
 */
export const exportToWord = (htmlContent: string, fileName: string) => {
    // Ensure lists are preserved and <br> tags are Word-compatible
    const wordCompatibleHtml = htmlContent.replace(/<br \/>/g, '<br>');
    const fullHtml = createWordHtml(wordCompatibleHtml);
    
    const blob = new Blob(['\ufeff', fullHtml], {
        type: 'application/msword'
    });

    triggerDownload(blob, `${fileName}.doc`);
};
