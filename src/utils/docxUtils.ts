export const exportToDocx = (htmlContent: string, fileName: string) => {
    // This is a common hack to create a file that Word can open.
    // It's not a true .docx file but an HTML file with a .doc extension.
    // Word is generally good at interpreting this.
    
    // Add necessary HTML headers for Word
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
                        xmlns:w='urn:schemas-microsoft-com:office:word' 
                        xmlns='http://www.w3.org/TR/REC-html40'>
                        <head>
                          <meta charset='utf-8'>
                          <title>Modul Ajar</title>
                          <style>
                            /* Simple styles for Word compatibility */
                            body { font-family: Calibri, sans-serif; font-size: 11pt; }
                            table { border-collapse: collapse; width: 100%; }
                            td, th { border: 1px solid black; padding: 5px; }
                            h1, h2, h3, h4, h5, h6 { font-family: 'Cambria', 'Times New Roman', serif; }
                          </style>
                        </head><body>`;
    const footer = "</body></html>";
    
    // Replace self-closing <br /> tags with <br> for better compatibility
    const wordCompatibleHtml = htmlContent.replace(/<br \/>/g, '<br>');

    const fullHtml = header + wordCompatibleHtml + footer;

    const blob = new Blob(['\ufeff', fullHtml], {
        type: 'application/msword'
    });

    // Create a link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
