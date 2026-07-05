
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
    // If the text already contains HTML tags (like <h2>, <td>, etc.), don't escape it.
    // This allows the AI to return raw HTML as requested in the prompt.
    const hasHtml = /<[a-z][\s\S]*>/i.test(text);
    let html = hasHtml ? text : escapeHtml(text); 

    // Regex for bold and italic:
    html = html.replace(/(?<!\w)\*\*(?!\s)(.+?)(?<!\s)\*\*(?!\w)/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\w)\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, '<em>$1</em>');
    
    // Simpler fallbacks
    html = html.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        if (p1.includes('<strong>') || p1.includes('&lt;strong&gt;') || (hasHtml && p1.includes('<'))) return match;
        return `<strong>${p1}</strong>`;
    });
    html = html.replace(/\*(.*?)\*/g, (match, p1) => {
        if (p1.includes('<em>') || p1.includes('&lt;em&gt;') || (hasHtml && p1.includes('<'))) return match;
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
        const isNextLineSeparator = lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/);
        
        if (isNextLineSeparator || (headerCellsContent.some(c => c.length > 0) && lines.length === 0) ) {
            html += '<thead>\n<tr>\n';
            headerCellsContent.forEach(cell => {
                html += `<th>${parseInlineMarkdownToHtmlSpans(cell)}</th>\n`; 
            });
            html += '</tr>\n</thead>\n';
            hasHeader = true;
        } else {
            lines.unshift(headerLine);
        }
    }
    
    if (lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/)) {
        lines.shift(); 
        if (!hasHeader && lines.length === 0) return `<p>${parseInlineMarkdownToHtmlSpans(tableMarkdown)}</p>`;
    } else if (hasHeader && lines.length === 0) {
        html += '<tbody></tbody>\n</table>\n';
        return html;
    } else if (!hasHeader && lines.length === 0 && !headerLine) {
        return '';
    } else if (!hasHeader && lines.length === 0 && headerLine && !headerLine.split('|').slice(1,-1).join("").trim()){
        return '';
    }

    html += '<tbody>\n';
    let rowCount = 0;
    lines.forEach(line => {
        const bodyCellsContent = line.split('|').slice(1, -1);
        if (bodyCellsContent.join("").trim() === "") return;

        html += '<tr>\n';
        bodyCellsContent.forEach(cell => {
            html += `<td>${parseInlineMarkdownToHtmlSpans(cell.trim())}</td>\n`; 
        });
        html += '</tr>\n';
        rowCount++;
    });

    html += '</tbody>\n</table>\n';
    
    if (!hasHeader && rowCount === 0) {
       return tableMarkdown.split('\n').map(line => `<p>${parseInlineMarkdownToHtmlSpans(line)}</p>`).join('\n');
    }
    return html;
}

export function cleanMarkdownContent(markdown: string): string {
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
        "Tentu, Bapak/Ibu Guru",
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
    if (cleanedMarkdown.startsWith("<p>Tidak ada konten")) {
        return cleanedMarkdown;
    }

    // If the content is already mostly HTML (e.g. from the AI instructed to return raw HTML),
    // return it directly so we don't break the HTML structure by wrapping lines in <p> tags.
    if (/<(?:table|h[1-6]|ul|ol|div|p)\b/i.test(cleanedMarkdown)) {
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
            const currentLevel = Math.max(0, Math.floor(indentSpace / 2));

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
    if (cleanedMarkdown.startsWith("<p>Tidak ada konten")) {
        return cleanedMarkdown.replace(/<p>/g, '').replace(/<\/p>/g, '');
    }

    let text = cleanedMarkdown;
    text = text.replace(/<[^>]+>/g, ''); 

    const lines = text.split('\n');
    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|') && trimmedLine.match(/^\|\s*[:\-\s|]+\s*\|$/)) {
            return '';
        }
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            return trimmedLine.slice(1, -1).replace(/\|/g, '  ').trim();
        }
        return line;
    }).filter(line => line !== null);

    text = processedLines.join('\n');
    text = text.replace(/^#{1,6}\s+/gm, '');
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');
    text = text.replace(/~~(.*?)~~/g, '$1');
    text = text.replace(/^>\s+/gm, '');
    text = text.replace(/^\s*([\*\-\+]|\d+\.)\s+/gm, '');
    text = text.replace(/^\s*(\*\*\*|---|___)\s*$/gm, '');
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.trim();

    return text;
}

export function htmlToPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    tempDiv.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    tempDiv.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6').forEach(el => {
        el.appendChild(document.createTextNode('\n'));
    });
    tempDiv.querySelectorAll('tr').forEach(tr => {
        tr.querySelectorAll('td, th').forEach(cell => {
             cell.appendChild(document.createTextNode('\t'));
        });
        tr.appendChild(document.createTextNode('\n'));
    });

    let text = tempDiv.textContent || '';
    text = text.replace(/[ \t]{2,}/g, ' ');
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
}

// --- DOCX TEMPLATER PARSER ---

export interface DocxJson {
  [key: string]: any;
}

// Helper to remove markdown symbols for clean Word document output
function cleanTextForDocx(text: string): string {
    if (!text) return "";
    let clean = text;
    
    // Remove bold/italic markers (**text**, *text*, __text__)
    // Keeps the content inside
    clean = clean.replace(/\*\*(.*?)\*\*/g, '$1');
    clean = clean.replace(/\*(.*?)\*/g, '$1');
    clean = clean.replace(/__(.*?)__/g, '$1');
    
    // Remove headers (# Title -> Title)
    clean = clean.replace(/^#{1,6}\s+/gm, '');
    
    return clean.trim();
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
    // Looks for "- **Key:** Value" or "- Key: Value"
    const regex = new RegExp(`- (?:\\*\\*)?${key}:(?:\\*\\*)?\\s*(.*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
};


export function parseMarkdownToDocxJson(markdown: string): DocxJson {
    const json: DocxJson = {};

    // 1. Extract Title
    const titleMatch = markdown.match(/^# \*\*MODUL AJAR: (.*)\*\*/);
    json.judul_modul = titleMatch ? cleanTextForDocx(titleMatch[1].trim()) : "Tanpa Judul";

    // 2. Extract Identitas section
    const identitasSection = getContentBetween(markdown, "## Identitas", "## IDENTIFIKASI");
    json.mata_pelajaran = cleanTextForDocx(extractValue(identitasSection, "Mata Pelajaran"));
    json.kelas_fase = cleanTextForDocx(extractValue(identitasSection, "Kelas/Fase"));
    json.materi = cleanTextForDocx(extractValue(identitasSection, "Materi"));
    json.alokasi_waktu = cleanTextForDocx(extractValue(identitasSection, "Alokasi Waktu"));
    json.peserta_didik = cleanTextForDocx(extractValue(identitasSection, "Peserta Didik"));
    json.show_peserta_didik = !!json.peserta_didik;

    // 3. Extract IDENTIFIKASI section
    const identifikasiSection = getContentBetween(markdown, "## IDENTIFIKASI", "### Langkah-Langkah Pembelajaran"); // Update end marker to match standard prompt structure better
    json.capaian_pembelajaran = cleanTextForDocx(extractValue(identifikasiSection, "Capaian Pembelajaran"));
    json.show_capaian_pembelajaran = !!json.capaian_pembelajaran;
    json.dimensi_profil_lulusan = cleanTextForDocx(extractValue(identifikasiSection, "Dimensi Profil Lulusan"));
    json.show_dimensi_profil_lulusan = !!json.dimensi_profil_lulusan;
    json.lintas_disiplin_ilmu = cleanTextForDocx(extractValue(identifikasiSection, "Lintas Disiplin Ilmu"));
    json.show_lintas_disiplin_ilmu = !!json.lintas_disiplin_ilmu;
    
    // Tujuan Pembelajaran often is a list, we want to keep the structure but clean formatting
    let rawTujuan = getContentBetween(identifikasiSection, "- **Tujuan Pembelajaran:**", "- **Praktik Pedagogis:**").replace(/^- /gm, '').trim();
    // Sometimes contentBetween catches the start tag, let's ensure it's clean
    if(rawTujuan.startsWith("[")) rawTujuan = rawTujuan.substring(1);
    if(rawTujuan.endsWith("]")) rawTujuan = rawTujuan.substring(0, rawTujuan.length-1);
    
    json.tujuan_pembelajaran = cleanTextForDocx(rawTujuan);
    json.praktik_pedagogis = cleanTextForDocx(extractValue(identifikasiSection, "Praktik Pedagogis"));

    // 4. Extract Langkah-Langkah Pembelajaran
    const langkahSection = getContentBetween(markdown, "### Langkah-Langkah Pembelajaran", "### Asesmen Pembelajaran");
    
    // More robust split regex: allows loose dashes, optional bolds, and spaces
    const pertemuanBlocks = langkahSection.split(/---+\s*#{1,6}\s*\**PERTEMUAN\s+(\d+)\**\s*---+/i).slice(1);
    
    json.langkah_pembelajaran = [];
    for (let i = 0; i < pertemuanBlocks.length; i += 2) {
        const pertemuanKe = pertemuanBlocks[i];
        const blockContent = pertemuanBlocks[i + 1];
        if (blockContent) {
            const kegiatan_awal = cleanTextForDocx(getContentBetween(blockContent, "**AWAL**", "**INTI**"));
            const kegiatan_inti = cleanTextForDocx(getContentBetween(blockContent, "**INTI**", "**PENUTUP**"));
            // For Penutup, take everything after PENUTUP marker
            const penutupMarker = "**PENUTUP**";
            const penutupIndex = blockContent.indexOf(penutupMarker);
            const kegiatan_penutup = penutupIndex !== -1 ? cleanTextForDocx(blockContent.substring(penutupIndex + penutupMarker.length).trim()) : "";

            json.langkah_pembelajaran.push({
                pertemuan_ke: pertemuanKe,
                kegiatan_awal,
                kegiatan_inti,
                kegiatan_penutup
            });
        }
    }
    
    // 5. Extract Asesmen
    json.asesmen_pembelajaran = cleanTextForDocx(getContentBetween(markdown, "### Asesmen Pembelajaran", "## LAMPIRAN"));

    // 6. Extract Lampiran sections
    const lampiranSection = markdown.substring(markdown.indexOf("## LAMPIRAN"));
    json.rubrik_penilaian = cleanTextForDocx(getContentBetween(lampiranSection, "### 1. Rubrik Penilaian", "### 2. LKPD"));
    json.lkpd = cleanTextForDocx(getContentBetween(lampiranSection, "### 2. LKPD", "### 3. Evaluasi Mandiri"));
    json.evaluasi_mandiri = cleanTextForDocx(getContentBetween(lampiranSection, "### 3. Evaluasi Mandiri", "### 4. Materi Ajar"));
    json.materi_ajar = cleanTextForDocx(lampiranSection.substring(lampiranSection.indexOf("### 4. Materi Ajar") + "### 4. Materi Ajar".length).trim());

    return json;
}
