# Ogasawara Fishing Research — Source Material Index

This folder mirrors the approach used in `../tokiq-chat-2026`: the raw ChatGPT
share page is saved as HTML, then parsed into a clean transcript plus an image
reference list, so **all text and every image link** from the chat is preserved
locally.

**ChatGPT source:** https://chatgpt.com/share/6a23944e-cac4-8323-9cad-f0b37438889e
(title: *"Fishing Gear Guide"*) — captured 2026-06-06.

## Files

| File | What it is |
|------|------------|
| `Ogasawara_2018_Fishing_Species_Guide.pdf` | The species guide uploaded into the chat (referenced as `fileciteturn0file0`). The source of all Ogasawara species + bait + depth data. |
| `chatgpt_share.html` | Raw downloaded share page (754 KB). The complete, untouched source. |
| `chat_transcript.md` | Full conversation extracted to clean Markdown — **32 text entries**, all 4 assistant answers in full. |
| `image_references.md` | **103 unique image URLs** pulled from the chat, with captions and source sites. |
| `extract_chat.js` | Parser: HTML → `chat_transcript.md`. |
| `extract_images.js` | Parser: HTML → `image_references.md`. |

## Completeness check — do we have everything? ✅

- **All text:** Yes. The 4 assistant responses (the gear guide, the strategy
  overview, the species-by-species build-out, and the consolidated field guide)
  are captured in full in `chat_transcript.md`. The only redacted items are the
  ChatGPT-internal "tool / plugin output" lines, which contain no user-facing
  content — same as in the tokiq example.
- **All images:** Yes. 103 unique image URLs extracted. 89 carry a descriptive
  caption; 14 are bare URLs (mostly thumbnail/CDN variants). The chat defines
  **19 `image_group` carousels** (visible inline in `chat_transcript.md`); those
  carousels are filled from this same pool of 103 image results.
- **Source data:** Yes. The uploaded `Ogasawara_2018_Fishing_Species_Guide.pdf`
  is present, so every `fileciteturn0file0` reference can be traced.

## What the chat covers (the actual research)

The 4 tools you asked about, each with a step-by-step guide and target species:

1. **Fishing rods** — light / medium / heavy, mapped to species.
2. **Spinning reels** — bail-arm casting steps; shore + offshore species.
3. **Baitcasting reels** — tension/brake/thumb control; GT, amberjack, tuna.
4. **Nets** — landing, cast, scoop, gill; landing-net and cast-net steps.

Plus Ogasawara-specific additions the chat layered on top: jigging technique,
deep-water (Ruby Snapper, 250–300 m) fishing, natural baits (sea urchin,
muroaji/mackerel scad, squid), a gear-to-fish reference table, and a recommended
beginner kit.

## To regenerate

```bash
cd fishing
node extract_chat.js     # rewrites chat_transcript.md from chatgpt_share.html
node extract_images.js   # rewrites image_references.md from chatgpt_share.html
```
