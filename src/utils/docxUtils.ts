export const exportToDocx = (htmlContent: string, fileName: string) => {
    // This is a common hack to create a file that Word can open.
    // It's not a true .docx file but an HTML file with a .doc extension.
    // Word is generally good at interpreting this.
    
    // Add necessary HTML headers and CSS for Word compatibility
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
                            table { border-collapse: collapse; width: 100%; margin-bottom: 10pt; }
                            td, th { border: 1px solid black; padding: 5px; }
                            h1, h2, h3, h4, h5, h6 { font-family: 'Cambria', 'Times New Roman', serif; margin-top: 18pt; margin-bottom: 10pt; }
                            
                            /* --- Fix for List Indentation in Word --- */
                            /* This approach gives more predictable control over indentation in Word. */
                            /* We reset the list's own padding and apply a margin to the list items instead. */
                            ul, ol {
                                margin-top: 0;
                                margin-bottom: 8pt;
                                padding-left: 0; /* Remove default browser/Word padding on the container. */
                            }
                            li {
                                list-style-position: outside; /* Crucial: Puts the bullet/number outside the text block, allowing a clean indent. */
                                margin-left: 30pt;           /* This becomes the primary indentation for the list item. */
                                margin-bottom: 4pt;          /* Spacing between list items. */
                                padding-left: 0;             /* Ensure no extra padding is added. */
                            }
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
