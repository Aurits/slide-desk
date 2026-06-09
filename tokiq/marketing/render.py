#!/usr/bin/env python3
"""Render the Tokiq marketing flyers to pixel-perfect PNGs.

Generates the QR code, injects it into each HTML template, then renders with a
headless Chromium at 2x and downscales for crisp text.

Variants:
  flyer.html         -> tokiq-flyer-square-1080.png   (1080x1080, near-miss)
  flyer-story.html   -> tokiq-flyer-story-1080x1920.png (1080x1920, near-miss)
  flyer-winner.html  -> tokiq-flyer-winner-1080.png    (1080x1080, winner moment)

Run with the shared repo-root venv:
    ../../.venv/bin/python render.py
"""
import base64
import io
from pathlib import Path

import qrcode
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
URL = "https://slide-desk.vercel.app/"
URL_TEXT = "slide-desk.vercel.app"
SCALE = 2  # supersample then downscale for crisp text

# (template, output, width, height)
JOBS = [
    ("flyer.html", "tokiq-flyer-square-1080.png", 1080, 1080),
    ("flyer-story.html", "tokiq-flyer-story-1080x1920.png", 1080, 1920),
    ("flyer-winner.html", "tokiq-flyer-winner-1080.png", 1080, 1080),
]


def qr_data_uri(url: str) -> str:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=20,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0a0b14", back_color="#ffffff").convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/png;base64,{b64}"


def build_html(template_name: str, data_uri: str) -> Path:
    template = (HERE / template_name).read_text(encoding="utf-8")
    html = template.replace("__QR_DATA_URI__", data_uri).replace(
        "__URL_TEXT__", URL_TEXT
    )
    out = HERE / f".{template_name}.rendered.html"
    out.write_text(html, encoding="utf-8")
    return out


def render_all() -> None:
    data_uri = qr_data_uri(URL)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for template_name, out_name, w, h in JOBS:
            html_path = build_html(template_name, data_uri)
            page = browser.new_page(
                viewport={"width": w, "height": h},
                device_scale_factor=SCALE,
            )
            page.goto(html_path.as_uri(), wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(500)
            png = page.screenshot(clip={"x": 0, "y": 0, "width": w, "height": h})
            page.close()

            img = Image.open(io.BytesIO(png)).convert("RGB")
            if img.size != (w, h):
                img = img.resize((w, h), Image.LANCZOS)
            (HERE / out_name).parent.mkdir(parents=True, exist_ok=True)
            img.save(HERE / out_name, format="PNG", optimize=True)
            print(f"wrote {out_name}  ({img.size[0]}x{img.size[1]})")
        browser.close()


if __name__ == "__main__":
    render_all()
