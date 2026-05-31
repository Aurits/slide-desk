// Extract plain text from a docx's word/document.xml.
// Joins runs within a paragraph, separates paragraphs with newlines.
const fs = require('fs');
const path = process.argv[2];
const xml = fs.readFileSync(path, 'utf8');

// Split into <w:p>...</w:p> paragraphs.
const paras = xml.split(/<w:p[\s>]/).slice(1).map((s) => '<w:p ' + s.split('</w:p>')[0] + '</w:p>');
const out = [];
for (const p of paras) {
  // Concatenate all <w:t> contents in this paragraph.
  const texts = [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
  // Tabs / breaks
  const hasBreak = /<w:br\b/.test(p);
  let line = texts.join('');
  // Decode XML entities lightly
  line = line.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  out.push(line);
  if (hasBreak) out.push('');
}
process.stdout.write(out.join('\n'));
