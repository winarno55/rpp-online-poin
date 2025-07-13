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
                            ul, ol { margin-top: 0; margin-bottom: 8pt; padding-left: 40px; }
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
 * Exports content as a .doc file. This version flattens lists to <p> tags
 * to ensure maximum compatibility and prevent auto-formatting issues in older Word versions.
 * This is effectively an HTML file disguised as a .doc file.
 */
export const exportAsDoc = (htmlContent: string, fileName: string) => {
    const flattenedHtml = htmlContent
        .replace(/<ul[^>]*>/gi, '')   // Remove opening <ul>
        .replace(/<\/ul>/gi, '')      // Remove closing </ul>
        .replace(/<ol[^>]*>/gi, '')   // Remove opening <ol>
        .replace(/<\/ol>/gi, '')      // Remove closing </ol>
        .replace(/<li[^>]*>/gi, '<p>') // Replace <li> with <p>
        .replace(/<\/li>/gi, '</p>');  // Replace </li> with </p>

    const wordCompatibleHtml = flattenedHtml.replace(/<br \/>/g, '<br>');
    const fullHtml = createWordHtml(wordCompatibleHtml);
    
    const blob = new Blob(['\ufeff', fullHtml], {
        type: 'application/msword'
    });

    triggerDownload(blob, `${fileName}.doc`);
};

/**
 * Exports content as a .docx file. This version preserves list tags (<ul>, <ol>, <li>)
 * for better formatting in modern versions of Word.
 * This is effectively an HTML file disguised as a .docx file.
 */
export const exportAsDocx = (htmlContent: string, fileName: string) => {
    const wordCompatibleHtml = htmlContent.replace(/<br \/>/g, '<br>');
    const fullHtml = createWordHtml(wordCompatibleHtml);

    const blob = new Blob(['\ufeff', fullHtml], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    triggerDownload(blob, `${fileName}.docx`);
};
