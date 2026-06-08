// Extract conversation messages from a ChatGPT share-page HTML dump.
// The page hydrates via window.__reactRouterContext.streamController.enqueue("<json-string>")
// where <json-string> is a Remix/React-Router flattened representation:
// a single array whose first element is an object whose values are integer indices
// into the same array. We resolve those references back into nested objects.

const fs = require('fs');

const html = fs.readFileSync('chatgpt_share.html', 'utf8');

// Pull out every enqueued payload (there may be more than one).
const re = /streamController\.enqueue\("((?:\\.|[^"\\])*)"\)/g;
const chunks = [];
let m;
while ((m = re.exec(html)) !== null) chunks.push(m[1]);
console.error(`found ${chunks.length} enqueue chunks`);

// Each chunk is a JS string literal whose contents are JSON. Decode the string-literal
// escapes, then JSON.parse.
// Decode each chunk's string-literal escapes.
const decoded = chunks.map((s) => JSON.parse('"' + s + '"'));
// Remix streams may contain multiple frames separated by newlines, with a `P<id>:` /
// `S<id>:` prefix on continuation frames. Keep only frames that start with `[`.
const payloads = [];
for (const d of decoded) {
  for (const frame of d.split(/\n/)) {
    const trimmed = frame.trim();
    if (!trimmed) continue;
    // strip "<letter><digits>:" prefix if present
    const stripped = trimmed.replace(/^[A-Za-z]\d+:/, '');
    if (!stripped.startsWith('[') && !stripped.startsWith('{')) continue;
    try { payloads.push(JSON.parse(stripped)); }
    catch (e) { console.error('skip un-parseable frame:', stripped.slice(0, 80)); }
  }
}
console.error(`parsed ${payloads.length} payloads`);
// Use the first (largest) payload as the table.
const table = payloads[0];
console.error(`table length: ${table.length}`);

// Resolver: in this format an object's keys/values may be:
//   - a small negative int (sentinel: -5 = undefined/null usually)
//   - a non-negative int (an index into `table`)
//   - the literal value itself (string/number/bool)
// And object keys of the form "_<n>" mean "the real key is table[n]".
// We walk lazily with a memo and a recursion guard.

const seen = new Map();
function resolve(node, depth = 0) {
  if (depth > 200) return '<<depth>>';
  if (node === null || node === undefined) return node;
  if (typeof node !== 'object') return node;
  if (seen.has(node)) return seen.get(node);
  if (Array.isArray(node)) {
    const out = [];
    seen.set(node, out);
    for (const v of node) out.push(deref(v, depth + 1));
    return out;
  }
  const out = {};
  seen.set(node, out);
  for (const [k, v] of Object.entries(node)) {
    let realKey = k;
    if (/^_\d+$/.test(k)) {
      const idx = parseInt(k.slice(1), 10);
      const kv = table[idx];
      realKey = typeof kv === 'string' ? kv : k;
    }
    out[realKey] = deref(v, depth + 1);
  }
  return out;
}
function deref(v, depth) {
  if (typeof v === 'number') {
    if (v < 0) return null;        // sentinels like -5
    if (v >= 0 && v < table.length) return resolve(table[v], depth + 1);
    return v;
  }
  return resolve(v, depth);
}

// The root descriptor is table[0] in this format.
const root = resolve(table[0]);

// Try to locate the conversation messages. Walk the tree and collect any object
// shaped like { author: {role:..}, content: {...} }. Guard against cycles.
const messages = [];
const visited = new WeakSet();
function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (visited.has(node)) return;
  visited.add(node);
  if (Array.isArray(node)) { node.forEach(walk); return; }
  if (node.author && node.content) messages.push(node);
  for (const v of Object.values(node)) walk(v);
}
walk(root);
console.error(`found ${messages.length} message-shaped nodes`);

function textOf(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(textOf).join('\n');
  if (content.parts) return content.parts.map(textOf).join('\n');
  if (content.text) return content.text;
  if (content.content_type === 'text' && content.parts) return content.parts.join('\n');
  return '';
}

// Dedupe by message id (or by content fingerprint when id is missing) and order by
// create_time.
const byId = new Map();
for (const msg of messages) {
  const id = msg.id || JSON.stringify([msg.author && msg.author.role, textOf(msg.content).slice(0, 200)]);
  if (!byId.has(id)) byId.set(id, msg);
}
const uniq = [...byId.values()];
uniq.sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
console.error(`unique messages: ${uniq.length}`);

const out = [];
let i = 0;
for (const msg of uniq) {
  const role = msg.author && msg.author.role;
  // Skip system/tool-internal noise unless they have user-visible text.
  const text = textOf(msg.content);
  if (!text || !text.trim()) continue;
  if (role === 'system') continue;
  const when = msg.create_time ? new Date(msg.create_time * 1000).toISOString() : '';
  out.push(`### [${++i}] ${role || '?'}${when ? '  ·  ' + when : ''}\n\n${text}\n`);
}
fs.writeFileSync('chat_transcript.md', out.join('\n---\n\n'));
console.error('wrote chat_transcript.md size=', fs.statSync('chat_transcript.md').size, 'entries=', i);
