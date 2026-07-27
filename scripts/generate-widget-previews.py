#!/usr/bin/env python3
"""Generate Android widget picker previews that match the iOS Bobble Tasks widgets."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src/assets/images"
FONTS = ROOT / "node_modules/@expo-google-fonts/sniglet"
OUT_SMALL = ASSETS / "widget-preview-small.png"
OUT_MEDIUM = ASSETS / "widget-preview-medium.png"

PURPLE = (159, 82, 242)
PURPLE_LIGHT = (216, 180, 254)
WHITE = (255, 255, 255)
WHITE_SOFT = (243, 232, 255)


def _font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    sniglet = FONTS / "400Regular/Sniglet_400Regular.ttf"
    if sniglet.exists():
        return ImageFont.truetype(str(sniglet), size)
    return ImageFont.load_default()


def _gradient(size: tuple[int, int], radius: int) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / max(w - 1, 1) + y / max(h - 1, 1)) / 2
            r = int(PURPLE[0] + (PURPLE_LIGHT[0] - PURPLE[0]) * t)
            g = int(PURPLE[1] + (PURPLE_LIGHT[1] - PURPLE[1]) * t)
            b = int(PURPLE[2] + (PURPLE_LIGHT[2] - PURPLE[2]) * t)
            px[x, y] = (r, g, b, 255)

    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    img.putalpha(mask)
    return img


def _paste_mascot(base: Image.Image, mascot_path: Path, size: int, right: int, bottom: int) -> None:
    mascot = Image.open(mascot_path).convert("RGBA")
    mascot.thumbnail((size, size), Image.Resampling.LANCZOS)
    x = base.width - mascot.width - right
    y = base.height - mascot.height - bottom
    base.alpha_composite(mascot, (x, y))


def _progress_bar(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, progress: float) -> None:
    height = 6
    draw.rounded_rectangle((x, y, x + width, y + height), radius=3, fill=(255, 255, 255, 90))
    fill_w = max(int(width * progress), 0)
    if fill_w > 0:
        draw.rounded_rectangle((x, y, x + fill_w, y + height), radius=3, fill=WHITE)


def render_small() -> Image.Image:
    w, h, radius = 420, 420, 24
    img = _gradient((w, h), radius)
    draw = ImageDraw.Draw(img)

    title_font = _font(22)
    headline_font = _font(56)
    body_font = _font(22)

    draw.text((28, 28), "Today's Tasks", font=title_font, fill=WHITE_SOFT)
    draw.text((28, 58), "0/1", font=headline_font, fill=WHITE)
    draw.text((28, h - 72), "Just 1 task to go!", font=body_font, fill=WHITE)

    _paste_mascot(img, ASSETS / "bobble-nerd.png", 128, 16, 16)
    return img


def render_medium() -> Image.Image:
    w, h, radius = 840, 420, 24
    img = _gradient((w, h), radius)
    draw = ImageDraw.Draw(img)

    title_font = _font(24)
    headline_font = _font(52)
    body_font = _font(26)
    meta_font = _font(22)

    x = 32
    draw.text((x, 36), "Today's Tasks", font=title_font, fill=WHITE_SOFT)
    draw.text((x, 68), "0/1", font=headline_font, fill=WHITE)
    draw.text((x, 138), "Just 1 task to go!", font=body_font, fill=WHITE)
    draw.text((x, 178), "Next: Testing · 9:00 AM", font=meta_font, fill=WHITE_SOFT)
    _progress_bar(draw, x, 228, w - 32 - 160, 0.0)

    _paste_mascot(img, ASSETS / "bobble-nerd.png", 184, 24, 24)
    return img


def main() -> None:
    render_small().save(OUT_SMALL, optimize=True)
    render_medium().save(OUT_MEDIUM, optimize=True)
    print(f"Wrote {OUT_SMALL.relative_to(ROOT)}")
    print(f"Wrote {OUT_MEDIUM.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
