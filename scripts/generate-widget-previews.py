#!/usr/bin/env python3
"""Generate Android widget picker previews that match BobbleTasksWidget layouts.

Sizes mirror src/widgets/bobble-tasks-widget.tsx (dp). Canvas is sized like a
Pixel-class 2×2 / 4×2 home-screen cell so picker density matches the live widget.
"""

from __future__ import annotations

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
# Matches widget `#FFFFFF59` track.
TRACK = (255, 255, 255, 89)

# Pixel-class launchers give a ~200dp 2×2 cell (not the 110dp minWidth).
# Using the minWidth made preview type look ~30% too large in the picker.
CELL_H_DP = 210
CELL_W_SMALL_DP = 210
CELL_W_MEDIUM_DP = 420  # 4×2

# Preview px per dp (xxhdpi). Keep fonts/padding in true dp proportions.
SCALE = 3

# Launcher / Android 12+ inset around RemoteViews — without this the preview
# fills the picker card edge-to-edge and reads larger than the home-screen widget.
SYSTEM_INSET_DP = 16

# PIL draws Sniglet ink larger than Android TextView at the same nominal dp;
# shrink preview type so picker density matches the live widget.
FONT_CORRECTION = 0.78


def dp(value: float) -> int:
    return max(1, round(value * SCALE))


def _font(size_dp: float) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    sniglet = FONTS / "400Regular/Sniglet_400Regular.ttf"
    size = dp(size_dp * FONT_CORRECTION)
    if sniglet.exists():
        return ImageFont.truetype(str(sniglet), size)
    return ImageFont.load_default()


def _gradient(size: tuple[int, int], radius_dp: float) -> Image.Image:
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
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, w - 1, h - 1), radius=dp(radius_dp), fill=255
    )
    img.putalpha(mask)
    return img


def _paste_mascot(
    base: Image.Image,
    mascot_path: Path,
    size_dp: float,
    *,
    right_dp: float,
    bottom_dp: float | None = None,
    center_y: bool = False,
) -> None:
    size = dp(size_dp)
    mascot = Image.open(mascot_path).convert("RGBA")
    mascot.thumbnail((size, size), Image.Resampling.LANCZOS)
    x = base.width - mascot.width - dp(right_dp)
    if center_y:
        y = (base.height - mascot.height) // 2
    else:
        y = base.height - mascot.height - dp(bottom_dp or 0)
    base.alpha_composite(mascot, (x, y))


def _progress_bar(
    base: Image.Image, x: int, y: int, width: int, height_dp: float, progress: float
) -> None:
    height = dp(height_dp)
    radius = max(1, height // 2)
    track = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(track)
    draw.rounded_rectangle((0, 0, width - 1, height - 1), radius=radius, fill=TRACK)
    fill_w = max(int(width * progress), 0)
    if fill_w > 0:
        draw.rounded_rectangle((0, 0, fill_w - 1, height - 1), radius=radius, fill=WHITE)
    base.alpha_composite(track, (x, y))


def _text_height(font: ImageFont.ImageFont, text: str) -> int:
    bbox = font.getbbox(text)
    return bbox[3] - bbox[1]


def _frame(width_dp: float, height_dp: float) -> tuple[Image.Image, Image.Image, int]:
    """Outer transparent cell + inner rounded gradient content (with system inset)."""
    outer_w, outer_h = dp(width_dp), dp(height_dp)
    outer = Image.new("RGBA", (outer_w, outer_h), (0, 0, 0, 0))
    inset = dp(SYSTEM_INSET_DP)
    inner_w = max(1, outer_w - inset * 2)
    inner_h = max(1, outer_h - inset * 2)
    inner = _gradient((inner_w, inner_h), 24)
    return outer, inner, inset


def render_small() -> Image.Image:
    """Match SmallWidget: clustered copy top-left + 96dp mascot bottom-right."""
    outer, inner, inset = _frame(CELL_W_SMALL_DP, CELL_H_DP)
    draw = ImageDraw.Draw(inner)

    title_font = _font(20)
    headline_font = _font(30)
    body_font = _font(11)

    pad_x = dp(12)
    y = dp(12)

    draw.text((pad_x, y), "Today's Tasks", font=title_font, fill=WHITE_SOFT)
    y += _text_height(title_font, "Today's Tasks") + dp(2)
    draw.text((pad_x, y), "0/1", font=headline_font, fill=WHITE)
    y += _text_height(headline_font, "0/1") + dp(6)
    draw.text((pad_x, y), "Just 1 task to go!", font=body_font, fill=WHITE)

    _paste_mascot(inner, ASSETS / "bobble-nerd.png", 96, right_dp=2, bottom_dp=2)

    outer.alpha_composite(inner, (inset, inset))
    return outer


def render_medium() -> Image.Image:
    """Match MediumWidget: centered column + 84dp mascot on the right."""
    outer, inner, inset = _frame(CELL_W_MEDIUM_DP, CELL_H_DP)
    draw = ImageDraw.Draw(inner)

    title_font = _font(20)
    headline_font = _font(28)
    body_font = _font(13)
    meta_font = _font(11)

    pad_x = dp(18)
    pad_y = dp(14)
    mascot_size = dp(84)
    gap = dp(10)
    text_width = inner.width - pad_x - gap - mascot_size - pad_x

    lines = [
        ("Today's Tasks", title_font, WHITE_SOFT, 0),
        ("0/1", headline_font, WHITE, 2),
        ("Just 1 task to go!", body_font, WHITE, 2),
        ("Next: Testing · 9:00 AM", meta_font, WHITE_SOFT, 2),
    ]

    content_h = 0
    for i, (text, font, _color, top_gap) in enumerate(lines):
        content_h += (dp(top_gap) if i else 0) + _text_height(font, text)
    content_h += dp(8) + dp(6)

    y = max(pad_y, (inner.height - content_h) // 2)
    for i, (text, font, color, top_gap) in enumerate(lines):
        if i:
            y += dp(top_gap)
        draw.text((pad_x, y), text, font=font, fill=color)
        y += _text_height(font, text)

    y += dp(8)
    _progress_bar(inner, pad_x, y, max(1, text_width), 6, 0.0)

    _paste_mascot(inner, ASSETS / "bobble-nerd.png", 84, right_dp=18, center_y=True)

    outer.alpha_composite(inner, (inset, inset))
    return outer


def main() -> None:
    render_small().save(OUT_SMALL, optimize=True)
    render_medium().save(OUT_MEDIUM, optimize=True)
    print(f"Wrote {OUT_SMALL.relative_to(ROOT)} ({Image.open(OUT_SMALL).size})")
    print(f"Wrote {OUT_MEDIUM.relative_to(ROOT)} ({Image.open(OUT_MEDIUM).size})")

    android_drawable = ROOT / "android/app/src/main/res/drawable"
    if android_drawable.is_dir():
        small_dest = android_drawable / "bobbletaskssmall_preview.png"
        medium_dest = android_drawable / "bobbletasks_preview.png"
        small_dest.write_bytes(OUT_SMALL.read_bytes())
        medium_dest.write_bytes(OUT_MEDIUM.read_bytes())
        print(f"Synced {small_dest.relative_to(ROOT)}")
        print(f"Synced {medium_dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
