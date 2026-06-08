// Extract image references (title + URL) from a ChatGPT share-page HTML dump.
// In this Remix/React-Router stream, image carousel items are encoded as
// adjacent JSON string literals: "<title>","<image-url>". We scan the decoded
// stream text for image URLs and grab the immediately-preceding quoted string
// as the title/caption.

const fs = require('fs');

const html = fs.readFileSync('chatgpt_share.html', 'utf8');

// Pull out every enqueued payload and decode the string-literal escapes so we
// work on the real JSON text (un-escaped quotes, slashes, unicode).
const re = /streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/g;
const chunks = [];
let m;
while ((m = re.exec(html)) !== null) chunks.push(m[1]);
const decoded = chunks.map((s) => JSON.parse('"' + s + '"')).join('\n');

// Match "<preceding string>","<image url>" — capture both. Image URL must end
// in an image extension (optionally followed by a query string).
const imgRe = /"((?:\\.|[^"\\]){0,300}?)"\s*,\s*"(https?:\/\/[^"\\]+?\.(?:png|jpe?g|webp|gif)(?:\?[^"\\]*)?)"/gi;

const seen = new Map(); // url -> title (first non-empty wins)
let match;
while ((match = imgRe.exec(decoded)) !== null) {
  let [, title, url] = match;
  title = title.replace(/\\"/g, '"').replace(/\\\//g, '/').trim();
  // Skip obvious non-caption noise (pure refs / very short)
  if (!seen.has(url) || (!seen.get(url) && title)) seen.set(url, title);
}

// Also catch any image URLs that did NOT have a preceding caption.
const bareRe = /(https?:\/\/[^"\\]+?\.(?:png|jpe?g|webp|gif)(?:\?[^"\\]*)?)/gi;
let bm;
while ((bm = bareRe.exec(decoded)) !== null) {
  if (!seen.has(bm[1])) seen.set(bm[1], '');
}

// Group by host for a readable report.
const rows = [...seen.entries()].map(([url, title]) => {
  const host = url.replace(/^https?:\/\/([^/]+).*/, '$1');
  return { host, url, title };
});
rows.sort((a, b) => a.host.localeCompare(b.host) || a.url.localeCompare(b.url));

const out = [];
out.push(`# ChatGPT "Fishing Gear Guide" — Extracted Image References\n`);
out.push(`Source: https://chatgpt.com/share/6a23944e-cac4-8323-9cad-f0b37438889e`);
out.push(`Total unique image URLs: **${rows.length}**\n`);
out.push(`| # | Caption / Title | Source site | Image URL |`);
out.push(`|---|---|---|---|`);
rows.forEach((r, i) => {
  const cap = (r.title || '—').replace(/\|/g, '\\|');
  out.push(`| ${i + 1} | ${cap} | ${r.host} | ${r.url} |`);
});
fs.writeFileSync('image_references.md', out.join('\n') + '\n');
console.error(`wrote image_references.md with ${rows.length} images`);
