#!/usr/bin/env python3
"""Render the Tokiq animated ad to MP4 at three aspect ratios, scored with the
app's audio (game-loop bed + 'success' sting on the win).

Pipeline: inject QR into ad.html -> Playwright captures every frame via the
deterministic seek(t) timeline -> ffmpeg (imageio-ffmpeg, libx264) encodes the
frames -> ffmpeg muxes the audio.

Run with the shared repo-root venv:
    ../../.venv/bin/python render_video.py
"""
import base64
import io
import shutil
import subprocess
from pathlib import Path

import imageio_ffmpeg
import qrcode
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SRC = HERE.parent / "src"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

URL = "https://slide-desk.vercel.app/"
URL_TEXT = "slide-desk.vercel.app"

FPS = 30
DURATION = 11.7            # seconds
NFRAMES = int(round(FPS * DURATION))
WIN_MS = 6600             # the 'success' sting hits the win

BG = SRC / "vairon_alexander-persecucion-game-loop-476260.mp3"
STING = SRC / "joyinsound-chasing-success-building-success-507156.mp3"

# (label, width, height)
ASPECTS = [
    ("vertical-1080x1920", 1080, 1920),
    ("square-1080x1080", 1080, 1080),
    ("landscape-1920x1080", 1920, 1080),
]


def qr_data_uri(url: str) -> str:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=1)
    qr.add_data(url); qr.make(fit=True)
    img = qr.make_image(fill_color="#0a0b14", back_color="#ffffff").convert("RGB")
    buf = io.BytesIO(); img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def build_html() -> Path:
    html = (HERE / "ad.html").read_text(encoding="utf-8")
    html = html.replace("__QR_DATA_URI__", qr_data_uri(URL)).replace("__URL_TEXT__", URL_TEXT)
    out = HERE / ".ad.rendered.html"
    out.write_text(html, encoding="utf-8")
    return out


def capture(page, w, h, frames_dir: Path):
    frames_dir.mkdir(parents=True, exist_ok=True)
    for f in range(NFRAMES):
        t = f / FPS
        page.evaluate("(t)=>window.seek(t)", t)
        page.screenshot(path=str(frames_dir / f"f{f:04d}.jpg"), type="jpeg", quality=92)
        if f % 60 == 0:
            print(f"    frame {f}/{NFRAMES}", flush=True)


def encode(frames_dir: Path, out: Path):
    dur = NFRAMES / FPS
    fade_out = max(0.0, dur - 0.9)
    cmd = [
        FFMPEG, "-y",
        "-framerate", str(FPS), "-i", str(frames_dir / "f%04d.jpg"),
        "-stream_loop", "-1", "-i", str(BG),
        "-i", str(STING),
        "-filter_complex",
        (f"[1:a]volume=0.28,afade=t=in:st=0:d=0.6,afade=t=out:st={fade_out:.2f}:d=0.8[bg];"
         f"[2:a]adelay={WIN_MS}|{WIN_MS},volume=0.95[st];"
         "[bg][st]amix=inputs=2:duration=first:normalize=0[a]"),
        "-map", "0:v", "-map", "[a]",
        "-t", f"{dur:.3f}",
        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
        str(out),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def main():
    html = build_html()
    work = Path("/tmp/tokiq_ad_frames")   # native ext4 — far faster than /mnt/c for many small writes
    shutil.rmtree(work, ignore_errors=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for label, w, h in ASPECTS:
            page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            page.goto(html.as_uri(), wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(400)
            fdir = work / label
            print(f"[{label}] capturing {NFRAMES} frames @ {w}x{h} …", flush=True)
            capture(page, w, h, fdir)
            page.close()
            out = HERE / f"tokiq-ad-{label}.mp4"
            print(f"[{label}] encoding -> {out.name} …", flush=True)
            encode(fdir, out)
            print(f"[{label}] done: {out}", flush=True)
        browser.close()
    shutil.rmtree(work, ignore_errors=True)
    print("ALL DONE")


if __name__ == "__main__":
    main()
