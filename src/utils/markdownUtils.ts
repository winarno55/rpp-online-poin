// Helper to escape HTML special characters
function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
}

// Helper to convert inline markdown (bold, italic) to HTML spans
function parseInlineMarkdownToHtmlSpans(text: string): string {
    let html = escapeHtml(text); // Escape HTML first

    // Regex for bold and italic:
    // \*\*(.*?)\*\* matches **bold text** (non-greedy)
    // \*(.*?)\* matches *italic text* (non-greedy)
    // Using lookarounds to avoid matching mid-word asterisks or asterisks adjacent to punctuation if they are part of it.
    // (?<!\w) means "not preceded by a word character"
    // (?!\s) means "not followed by whitespace" (for opening)
    // (?<!\s) means "not preceded by whitespace" (for closing)
    // (?!\w) means "not followed by a word character"
    html = html.replace(/(?<!\w)\*\*(?!\s)(.+?)(?<!\s)\*\*(?!\w)/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\w)\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, '<em>$1</em>');
    
    // Simpler fallbacks if the above are too restrictive or for more common markdown variations
    // Ensure these don't double-wrap by checking if <strong> or <em> is already there (unlikely due to escaping)
    html = html.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        // A basic check to avoid double-encoding if somehow already processed (though escapeHtml should prevent this)
        if (p1.includes('<strong>') || p1.includes('&lt;strong&gt;')) return match;
        return `<strong>${p1}</strong>`;
    });
    html = html.replace(/\*(.*?)\*/g, (match, p1) => {
        if (p1.includes('<em>') || p1.includes('&lt;em&gt;')) return match;
        return `<em>${p1}</em>`;
    });
    
    return html;
}


// Function to convert a single Markdown table block to an HTML table string
function parseSingleMarkdownTableToHtml(tableMarkdown: string): string {
    const lines = tableMarkdown.split('\n').map(l => l.trim()).filter(line => line.startsWith('|') && line.endsWith('|'));
    if (lines.length === 0) return `<p>${parseInlineMarkdownToHtmlSpans(tableMarkdown)}</p>`; // Not a table

    let html = '<table>\n'; 

    const headerLine = lines.shift();
    let hasHeader = false;
    if (headerLine) {
        const headerCellsContent = headerLine.split('|').slice(1, -1).map(s => s.trim());
        // Check if next line is a separator, or if this is the only line and has content
        const isNextLineSeparator = lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/);
        
        if (isNextLineSeparator || (headerCellsContent.some(c => c.length > 0) && lines.length === 0) ) {
            html += '<thead>\n<tr>\n';
            headerCellsContent.forEach(cell => {
                html += `<th>${parseInlineMarkdownToHtmlSpans(cell)}</th>\n`; 
            });
            html += '</tr>\n</thead>\n';
            hasHeader = true;
        } else {
            // Not a header, put it back to be processed as a body row
            lines.unshift(headerLine);
        }
    }
    
    // Remove separator line if present
    if (lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/)) {
        lines.shift(); 
        if (!hasHeader && lines.length === 0) return `<p>${parseInlineMarkdownToHtmlSpans(tableMarkdown)}</p>`; // Separator without header or body
    } else if (hasHeader && lines.length === 0) {
        // Header only table
        html += '<tbody></tbody>\n</table>\n';
        return html;
    } else if (!hasHeader && lines.length > 0) {
        // No clear header and no separator, likely not a well-formed markdown table according to common conventions.
        // Or, it's a table without a formal header row. Treat all as body.
    } else if (!hasHeader && lines.length === 0 && !headerLine) { // Empty input
        return '';
    } else if (!hasHeader && lines.length === 0 && headerLine && !headerLine.split('|').slice(1,-1).join("").trim()){ // only | | |
        return '';
    }


    html += '<tbody>\n';
    let rowCount = 0;
    lines.forEach(line => {
        const bodyCellsContent = line.split('|').slice(1, -1);
        if (bodyCellsContent.join("").trim() === "") return; // Skip empty rows like | | |

        html += '<tr>\n';
        bodyCellsContent.forEach(cell => {
            html += `<td>${parseInlineMarkdownToHtmlSpans(cell.trim())}</td>\n`; 
        });
        html += '</tr>\n';
        rowCount++;
    });

    html += '</tbody>\n</table>\n';
    
    // If no header was formally identified AND no body rows were actually produced, it's not a table.
    if (!hasHeader && rowCount === 0) {
       return tableMarkdown.split('\n').map(line => `<p>${parseInlineMarkdownToHtmlSpans(line)}</p>`).join('\n');
    }
    return html;
}

export function cleanMarkdownContent(markdown: string): string {
    // First, let's strip any markdown code fences surrounding the whole content.
    let content = markdown.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = content.match(fenceRegex);
    if (match && match[2]) {
      content = match[2].trim();
    }
    
    let lines = content.split('\n');
    let startIndex = 0;

    const judulMarker = "[JUDUL RPP/MODUL AJAR:";
    const sectionAMarker = "A. INFORMASI UMUM";
    const unwantedPreamblePhrases = [
        "Tentu, sebagai ahli", 
        "Tentu, berikut adalah", 
        "Tentu, Bapak/Ibu Guru", // Catches variations including the user's example
        "Berikut adalah drafnya:",
        "Berikut adalah rancangan RPP/Modul Ajar",
        "Berikut rancangan Modul Ajar",
        "saya tidak perlu itu",
        "langsung saja pada RPP/MODUL AJAR",
        "---" 
    ];
    const genericRppHeaderRegex = /^RPP\/MODUL AJAR\s*.*?:?\s*$/i;

    let judulLineIndex = -1;
    let sectionALineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const currentLineTrimmed = lines[i].trim();
        if (currentLineTrimmed.includes(judulMarker)) {
            judulLineIndex = i;
            break; 
        }
        if (sectionALineIndex === -1 && currentLineTrimmed.startsWith(sectionAMarker)) {
            sectionALineIndex = i;
        }
    }
    
    if (judulLineIndex !== -1) {
        startIndex = judulLineIndex;
    } else if (sectionALineIndex !== -1) {
        let potentialTitleIndex = -1;
        for (let i = sectionALineIndex - 1; i >= 0; i--) {
            const lineToCheck = lines[i].trim();
            if (lineToCheck.length === 0) continue; 

            const isUnwanted = unwantedPreamblePhrases.some(phrase => lineToCheck.toLowerCase().includes(phrase.toLowerCase())) || 
                               genericRppHeaderRegex.test(lineToCheck);
            
            if (!isUnwanted) {
                potentialTitleIndex = i; 
                break;
            } else if (genericRppHeaderRegex.test(lineToCheck) || lineToCheck.toLowerCase().includes("langsung saja pada")) {
                break;
            }
        }
        startIndex = (potentialTitleIndex !== -1) ? potentialTitleIndex : sectionALineIndex;
    } else {
        for (let i = 0; i < lines.length; i++) {
            const currentLineTrimmed = lines[i].trim();
            if (currentLineTrimmed.length === 0) {
                startIndex = i + 1; 
                continue;
            }
            const isUnwanted = unwantedPreamblePhrases.some(phrase => currentLineTrimmed.toLowerCase().includes(phrase.toLowerCase())) ||
                               genericRppHeaderRegex.test(currentLineTrimmed);
            if (!isUnwanted) {
                startIndex = i;
                break;
            } else {
                startIndex = i + 1; 
            }
        }
    }
    
    if (startIndex >= lines.length) {
      return "<p>Tidak ada konten RPP yang dapat ditampilkan. Respons AI mungkin hanya berisi pendahuluan.</p>";
    }

    const finalLinesToParse = lines.slice(startIndex);
    if (finalLinesToParse.length === 0 || finalLinesToParse.every(line => line.trim() === "")) {
         return "<p>Tidak ada konten RPP yang dapat ditampilkan setelah pembersihan pendahuluan.</p>";
    }
    return finalLinesToParse.join('\n');
}


// Main function to convert Markdown text to an HTML string
export function markdownToHtml(markdown: string): string {
    const cleanedMarkdown = cleanMarkdownContent(markdown);
    if (cleanedMarkdown.startsWith("<p>")) { // If cleaning returned an error message
        return cleanedMarkdown;
    }

    let lines = cleanedMarkdown.split('\n');
    let htmlOutput = '';
    let inListType: 'ul' | 'ol' | null = null;
    let listLevel = 0; 
    let tableLinesBuffer: string[] = [];

    function closeOpenList(targetLevel = -1) { 
        while (inListType && listLevel >= targetLevel) {
            htmlOutput += (inListType === 'ul' ? '</ul>\n' : '</ol>\n');
            listLevel--;
            if (listLevel < 0) {
              inListType = null;
              listLevel = 0; 
            }
        }
        if (targetLevel === -1) { 
          inListType = null;
          listLevel = 0;
        }
    }

    function flushTableBuffer() {
        if (tableLinesBuffer.length > 0) {
            htmlOutput += parseSingleMarkdownTableToHtml(tableLinesBuffer.join('\n'));
            tableLinesBuffer = [];
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]; 

        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            closeOpenList(); 
            tableLinesBuffer.push(line);
            if (i === lines.length - 1) flushTableBuffer(); 
            continue;
        } else if (tableLinesBuffer.length > 0) {
            flushTableBuffer();
        }

        const headingMatch = line.trim().match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            closeOpenList();
            const level = headingMatch[1].length;
            const contentText = headingMatch[2].trim();
            const slug = contentText.replace(/\*\*/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
            const content = parseInlineMarkdownToHtmlSpans(contentText);
            htmlOutput += `<h${level} id="${slug}">${content}</h${level}>\n`;
            continue;
        }
        
        const listItemMatch = line.match(/^(\s*)([\*\-\+]|\d+\.)\s+(.*)/);
        if (listItemMatch) {
            const indentSpace = listItemMatch[1].length;
            const marker = listItemMatch[2];
            const content = listItemMatch[3].trim();
            const currentLevel = Math.max(0, Math.floor(indentSpace / 2)); // Ensure non-negative level

            const newListType = marker.match(/\d+\./) ? 'ol' : 'ul';

            if (currentLevel < listLevel || (currentLevel === listLevel && inListType !== newListType && inListType)) {
                 closeOpenList(currentLevel);
            }
            
            if (!inListType || currentLevel > listLevel || (inListType !== newListType)) {
                htmlOutput += newListType === 'ul' ? '<ul>\n' : '<ol>\n';
                inListType = newListType;
                listLevel = currentLevel;
            }
            
            htmlOutput += `  <li>${parseInlineMarkdownToHtmlSpans(content)}</li>\n`;
            continue;
        }

        closeOpenList();

        if (line.trim().length > 0) {
            htmlOutput += `<p>${parseInlineMarkdownToHtmlSpans(line.trim())}</p>\n`;
        } else {
             if (htmlOutput.length > 0 && !htmlOutput.endsWith('<br />\n') && !htmlOutput.endsWith('</ol>\n') && !htmlOutput.endsWith('</ul>\n') && !htmlOutput.endsWith('</table>\n') && !htmlOutput.match(/<\/h[1-6]>\n$/) ) {
                 htmlOutput += '<br />\n';
             }
        }
    }
    closeOpenList(); 
    flushTableBuffer(); 

    return htmlOutput;
}

// Function to convert Markdown to Plain Text
export function markdownToPlainText(rawMarkdown: string): string {
    const cleanedMarkdown = cleanMarkdownContent(rawMarkdown);
    if (cleanedMarkdown.startsWith("<p>Tidak ada konten")) { // Error from cleanMarkdownContent
        return cleanedMarkdown.replace(/<p>/g, '').replace(/<\/p>/g, ''); // Return plain error message
    }

    let text = cleanedMarkdown;

    // Remove HTML tags that might be generated by error messages or simple structures
    text = text.replace(/<[^>]+>/g, ''); 

    // Process tables: remove separator lines and convert cell separators to spaces
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();
        // Check for table separator line (e.g., |---|---| or |:---|:---|)
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|') && trimmedLine.match(/^\|\s*[:\-\s|]+\s*\|$/)) {
            return ''; // Remove separator line
        }
        // For other table lines, remove leading/trailing pipes and replace inner pipes with spaces
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            return trimmedLine.slice(1, -1).replace(/\|/g, '  ').trim();
        }
        return line;
    }).filter(line => line !== null); // Remove null lines if any intermediate step produced them

    text = processedLines.join('\n');

    // Headings: remove '#'
    text = text.replace(/^#{1,6}\s+/gm, '');

    // Bold and Italic: remove '**' and '*'
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');
    
    // Strikethrough (if used)
    text = text.replace(/~~(.*?)~~/g, '$1');

    // Blockquotes: remove '>'
    text = text.replace(/^>\s+/gm, '');

    // List items: remove '  *', '- ', '1. ' etc.
    text = text.replace(/^\s*([\*\-\+]|\d+\.)\s+/gm, '');

    // Horizontal rules
    text = text.replace(/^\s*(\*\*\*|---|___)\s*$/gm, '');
    
    // Links: extract text part [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    // Images: extract alt text ![alt](url) -> alt
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');

    // Remove potential markdown code blocks (```) or inline code (`)
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');

    // Normalize multiple newlines to a maximum of two (one blank line)
    text = text.replace(/\n{3,}/g, '\n\n');

    // Trim leading/trailing whitespace from the whole text
    text = text.trim();

    return text;
}

export function htmlToPlainText(html: string): string {
    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Replace <br> tags with newlines for better formatting
    tempDiv.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    // Handle paragraphs and list items by adding a newline after them
    tempDiv.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6').forEach(el => {
        el.appendChild(document.createTextNode('\n'));
    });
    // For tables, add tabs between cells and newlines between rows
    tempDiv.querySelectorAll('tr').forEach(tr => {
        tr.querySelectorAll('td, th').forEach(cell => {
             cell.appendChild(document.createTextNode('\t'));
        });
        tr.appendChild(document.createTextNode('\n'));
    });

    // Use textContent to get the plain text, which automatically decodes HTML entities
    let text = tempDiv.textContent || '';
    
    // Clean up extra whitespace
    text = text.replace(/[ \t]{2,}/g, ' '); // Replace multiple spaces/tabs with a single space
    text = text.replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newlines
    
    return text.trim();
}

// --- DOCX TEMPLATER PARSER ---

export interface DocxJson {
  [key: string]: any;
}

// Helper to get content between two headings/sections
const getContentBetween = (text: string, start: string, end: string): string => {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return '';
    const endIndex = text.indexOf(end, startIndex);
    const content = endIndex === -1 ? text.substring(startIndex + start.length) : text.substring(startIndex + start.length, endIndex);
    return content.trim();
};

// Helper to extract a single value from a line
const extractValue = (text: string, key: string): string => {
    const regex = new RegExp(`- \\*\\*${key}:\\*\\*\\s*(.*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
};


export function parseMarkdownToDocxJson(markdown: string): DocxJson {
    const json: DocxJson = {};

    // 1. Extract Title
    const titleMatch = markdown.match(/^# \*\*MODUL AJAR: (.*)\*\*/);
    json.judul_modul = titleMatch ? titleMatch[1].trim() : "Tanpa Judul";

    // 2. Extract Identitas section
    const identitasSection = getContentBetween(markdown, "## Identitas", "## IDENTIFIKASI");
    json.mata_pelajaran = extractValue(identitasSection, "Mata Pelajaran");
    json.kelas_fase = extractValue(identitasSection, "Kelas/Fase");
    json.materi = extractValue(identitasSection, "Materi");
    json.alokasi_waktu = extractValue(identitasSection, "Alokasi Waktu");
    json.peserta_didik = extractValue(identitasSection, "Peserta Didik");
    json.show_peserta_didik = !!json.peserta_didik;

    // 3. Extract IDENTIFIKASI section
    const identifikasiSection = getContentBetween(markdown, "## IDENTIFIKASI", "## Pengalaman Belajar");
    json.capaian_pembelajaran = extractValue(identifikasiSection, "Capaian Pembelajaran");
    json.show_capaian_pembelajaran = !!json.capaian_pembelajaran;
    json.dimensi_profil_lulusan = extractValue(identifikasiSection, "Dimensi Profil Lulusan");
    json.show_dimensi_profil_lulusan = !!json.dimensi_profil_lulusan;
    json.lintas_disiplin_ilmu = extractValue(identifikasiSection, "Lintas Disiplin Ilmu");
    json.show_lintas_disiplin_ilmu = !!json.lintas_disiplin_ilmu;
    json.tujuan_pembelajaran = markdownToHtml(getContentBetween(identifikasiSection, "- **Tujuan Pembelajaran:**", "- **Praktik Pedagogis:**").replace(/^- /gm, '').trim());
    json.praktik_pedagogis = extractValue(identifikasiSection, "Praktik Pedagogis");

    // 4. Extract Langkah-Langkah Pembelajaran
    const langkahSection = getContentBetween(markdown, "### Langkah-Langkah Pembelajaran", "### Asesmen Pembelajaran");
    const pertemuanBlocks = langkahSection.split(/---+\s*#### \*\*PERTEMUAN (\d+)\*\*\s*---+/).slice(1);
    
    json.langkah_pembelajaran = [];
    for (let i = 0; i < pertemuanBlocks.length; i += 2) {
        const pertemuanKe = pertemuanBlocks[i];
        const blockContent = pertemuanBlocks[i + 1];
        if (blockContent) {
            const kegiatan_awal = markdownToHtml(getContentBetween(blockContent, "**AWAL**", "**INTI**"));
            const kegiatan_inti = markdownToHtml(getContentBetween(blockContent, "**INTI**", "**PENUTUP**"));
            const kegiatan_penutup = markdownToHtml(blockContent.substring(blockContent.indexOf("**PENUTUP**") + "**PENUTUP**".length).trim());
            json.langkah_pembelajaran.push({
                pertemuan_ke: pertemuanKe,
                kegiatan_awal,
                kegiatan_inti,
                kegiatan_penutup
            });
        }
    }
    
    // 5. Extract Asesmen
    json.asesmen_pembelajaran = markdownToHtml(getContentBetween(markdown, "### Asesmen Pembelajaran", "## LAMPIRAN"));

    // 6. Extract Lampiran sections
    const lampiranSection = markdown.substring(markdown.indexOf("## LAMPIRAN"));
    json.rubrik_penilaian = markdownToHtml(getContentBetween(lampiranSection, "### 1. Rubrik Penilaian", "### 2. LKPD"));
    json.lkpd = markdownToHtml(getContentBetween(lampiranSection, "### 2. LKPD", "### 3. Evaluasi Mandiri"));
    json.evaluasi_mandiri = markdownToHtml(getContentBetween(lampiranSection, "### 3. Evaluasi Mandiri", "### 4. Materi Ajar"));
    json.materi_ajar = markdownToHtml(lampiranSection.substring(lampiranSection.indexOf("### 4. Materi Ajar") + "### 4. Materi Ajar".length).trim());

    return json;
}