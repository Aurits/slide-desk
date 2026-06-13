#!/usr/bin/env bash
# Regenerate the Ogasawara fishing-gear guide PDFs (EN + JP) from the HTML sources.
# Requires: wkhtmltopdf, ghostscript, poppler-utils (pdfinfo).
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

render() {
  local html="$1" pdf_name="$2"
  local base="/tmp/_fish_base_$$.pdf"
  local stamp="/tmp/_fish_stamp_$$.ps"

  wkhtmltopdf --enable-local-file-access --page-size A4 \
    --margin-top 22mm --margin-bottom 26mm --margin-left 22mm --margin-right 22mm \
    --encoding UTF-8 "$html" "$base" >/dev/null 2>&1

  local pages content
  pages=$(pdfinfo "$base" | awk '/^Pages:/ {print $2}')
  content=$((pages - 1))

  sed "s/#TOTAL#/${content}/" "$SCRIPT_DIR/stamp_footer.ps" > "$stamp"
  gs -o "$SCRIPT_DIR/$pdf_name" -sDEVICE=pdfwrite -dBATCH -dNOPAUSE -dQUIET "$stamp" "$base"
  echo "→ $pdf_name  ($pages pages, $content content)"
  rm -f "$base" "$stamp"
}

# Render a full-bleed CSS cover page (0 margins) + a normal body, then merge and
# footer-stamp in a single ghostscript run. The cover becomes page 1 (no footer);
# body pages are numbered "Page 1..N of N" by stamp_footer.ps.
render_with_cover() {
  local cover_html="$1" body_html="$2" pdf_name="$3"
  local cov="/tmp/_fish_cov_$$.pdf" base="/tmp/_fish_body_$$.pdf" stamp="/tmp/_fish_stamp_$$.ps"

  wkhtmltopdf --enable-local-file-access --page-size A4 \
    --margin-top 0 --margin-bottom 0 --margin-left 0 --margin-right 0 \
    --disable-smart-shrinking --encoding UTF-8 "$cover_html" "$cov" >/dev/null 2>&1

  wkhtmltopdf --enable-local-file-access --page-size A4 \
    --margin-top 22mm --margin-bottom 26mm --margin-left 22mm --margin-right 22mm \
    --encoding UTF-8 "$body_html" "$base" >/dev/null 2>&1

  local body_pages body_stamped="/tmp/_fish_bstamp_$$.pdf"
  body_pages=$(pdfinfo "$base" | awk '/^Pages:/ {print $2}')

  # Stamp footers on the body ALONE (numbers every body page 1..N), then prepend
  # the unstamped full-bleed cover. This keeps numbering correct regardless of how
  # the cover PDF interacts with the EndPage hook.
  sed "s/#TOTAL#/${body_pages}/" "$SCRIPT_DIR/stamp_footer_noskip.ps" > "$stamp"
  gs -o "$body_stamped" -sDEVICE=pdfwrite -dBATCH -dNOPAUSE -dQUIET "$stamp" "$base"
  gs -o "$SCRIPT_DIR/$pdf_name" -sDEVICE=pdfwrite -dBATCH -dNOPAUSE -dQUIET "$cov" "$body_stamped"
  echo "→ $pdf_name  (1 cover + $body_pages content)"
  rm -f "$cov" "$base" "$stamp" "$body_stamped"
}

render "$SCRIPT_DIR/fishing_gear_guide.html"        "Ogasawara_Fishing_Gear_Usage_Guide_EN_Ambrose.pdf"
render "$SCRIPT_DIR/fishing_gear_guide_jp.html"     "Ogasawara_Fishing_Gear_Usage_Guide_JP_Ambrose.pdf"
render "$SCRIPT_DIR/how_to_clean_fishing_gear.html"    "Ogasawara_Fishing_Gear_Cleaning_Guide_EN_Ambrose.pdf"
render "$SCRIPT_DIR/how_to_clean_fishing_gear_jp.html" "Ogasawara_Fishing_Gear_Cleaning_Guide_JP_Ambrose.pdf"
render_with_cover "$SCRIPT_DIR/aibos_cover.html"    "$SCRIPT_DIR/aibos_ogasawara_fishing_guide.html"    "AIBOS_Ogasawara_Fishing_Guide.pdf"
render_with_cover "$SCRIPT_DIR/aibos_cover_jp.html" "$SCRIPT_DIR/aibos_ogasawara_fishing_guide_jp.html" "AIBOS_Ogasawara_Fishing_Guide_JP.pdf"
