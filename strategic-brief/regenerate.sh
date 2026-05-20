#!/usr/bin/env bash
# Regenerate the Strategic Research Brief PDFs (EN + JP) from the HTML sources.
# Requires: wkhtmltopdf, ghostscript, poppler-utils (pdfinfo).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

render() {
  local html="$1" pdf_name="$2"
  local base="/tmp/_brief_base_$$.pdf"
  local stamp="/tmp/_stamp_$$.ps"

  wkhtmltopdf --enable-local-file-access --page-size A4 \
    --margin-top 25mm --margin-bottom 28mm --margin-left 25mm --margin-right 25mm \
    --encoding UTF-8 "$html" "$base" >/dev/null 2>&1

  local pages content
  pages=$(pdfinfo "$base" | awk '/^Pages:/ {print $2}')
  content=$((pages - 1))

  sed "s/#TOTAL#/${content}/" "$SCRIPT_DIR/stamp_footer.ps" > "$stamp"

  gs -o "$OUT_DIR/$pdf_name" -sDEVICE=pdfwrite -dBATCH -dNOPAUSE -dQUIET \
     "$stamp" "$base"

  echo "→ $pdf_name  ($pages pages, $content content)"
  rm -f "$base" "$stamp"
}

render "$SCRIPT_DIR/strategic_brief.html"    "Strategic Research Brief.pdf"
render "$SCRIPT_DIR/strategic_brief_jp.html" "Strategic Research Brief_jp.pdf"
