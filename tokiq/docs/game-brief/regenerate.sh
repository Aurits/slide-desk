#!/usr/bin/env bash
# Regenerate the Tokiq Game Brief — EN + JA — as A4 PDFs (with footer page
# numbers that skip the cover) and editable .docx companions.
# Pipeline: wkhtmltopdf (HTML → PDF) · ghostscript (footer stamp) · pandoc (→ docx).
# Requires: wkhtmltopdf, ghostscript (gs), poppler-utils (pdfinfo), pandoc,
# and the Noto CJK JP fonts for the Japanese edition.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

render() {
  local html="$1" pdf="$2"
  local base="/tmp/_gb_base_$$.pdf" stamp="/tmp/_gb_stamp_$$.ps"

  wkhtmltopdf --enable-local-file-access --page-size A4 \
    --margin-top 20mm --margin-bottom 22mm --margin-left 24mm --margin-right 24mm \
    --encoding UTF-8 --javascript-delay 2500 \
    "$DIR/$html" "$base" >/dev/null 2>&1

  local pages content
  pages=$(pdfinfo "$base" | awk '/^Pages:/ {print $2}')
  content=$((pages - 1))                       # exclude the cover from numbering

  sed "s/#TOTAL#/${content}/" "$DIR/stamp_footer.ps" > "$stamp"
  gs -o "$DIR/$pdf" -sDEVICE=pdfwrite -dBATCH -dNOPAUSE -dQUIET "$stamp" "$base"

  echo "→ $pdf  ($pages pages, $content numbered)"
  rm -f "$base" "$stamp"
}

docx() {
  local html="$1" out="$2"
  pandoc "$DIR/$html" -f html -t docx -o "$DIR/$out" 2>/dev/null \
    && echo "→ $out" || echo "  (pandoc docx skipped: $out)"
}

render tokiq_game_brief_en.html "Tokiq Game Brief.pdf"
render tokiq_game_brief_ja.html "Tokiq Game Brief_jp.pdf"
docx   tokiq_game_brief_en.html "Tokiq Game Brief.docx"
docx   tokiq_game_brief_ja.html "Tokiq Game Brief_jp.docx"

echo "done."
