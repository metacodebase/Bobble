#!/usr/bin/env python3
"""Generate Expo app icons from the Bobble mascot source image."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/images/bobble-main.png"
OUTPUT_DIR = ROOT / "src/assets/images"

ICON_SIZE = 1024
FOREGROUND_SCALE = 0.78
ICON_SCALE = 0.82
FAVICON_SIZE = 48
SPLASH_SIZE = 1024
WHITE_THRESHOLD = 245
BLACK_THRESHOLD = 40
DARK_BG = (10, 15, 26, 255)
LIGHT_BG = (255, 255, 255, 255)


def _is_near_white(red: int, green: int, blue: int) -> bool:
    return red >= WHITE_THRESHOLD and green >= WHITE_THRESHOLD and blue >= WHITE_THRESHOLD


def _is_near_black(red: int, green: int, blue: int) -> bool:
    return red <= BLACK_THRESHOLD and green <= BLACK_THRESHOLD and blue <= BLACK_THRESHOLD


def prepare_mascot_cutout(image: Image.Image) -> Image.Image:
    """Make the mascot background transparent without removing interior details like eyes."""
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if _is_near_white(red, green, blue):
                pixels[x, y] = (red, green, blue, 0)

    # Only remove black pixels connected to the image edge (background),
    # so interior black features such as the eyes are preserved.
    queue: deque[tuple[int, int]] = deque()
    visited: set[tuple[int, int]] = set()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(1, height - 1):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if x < 0 or x >= width or y < 0 or y >= height:
            continue
        if (x, y) in visited:
            continue
        visited.add((x, y))

        red, green, blue, alpha = pixels[x, y]
        if alpha == 0 or not _is_near_black(red, green, blue):
            continue

        pixels[x, y] = (red, green, blue, 0)
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return rgba


def fit_bobble_main_for_splash(image: Image.Image, size: int, scale: float) -> Image.Image:
    """Keep bobble-main as-is (including eyes) for native splash screens."""
    return fit_on_square(image.convert("RGBA"), size, scale)


def fit_on_square(image: Image.Image, size: int, scale: float) -> Image.Image:
    target = int(size * scale)
    fitted = ImageOps.contain(image, (target, target), method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - fitted.width) // 2, (size - fitted.height) // 2)
    canvas.paste(fitted, offset, fitted)
    return canvas


def to_monochrome(image: Image.Image, size: int, scale: float) -> Image.Image:
    fitted = fit_on_square(image, size, scale)
    alpha = fitted.split()[3]
    mono = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    white_layer = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    mono.paste(white_layer, (0, 0), alpha)
    return mono


def to_opaque_icon(
    image: Image.Image, size: int, scale: float, background_rgba: tuple[int, int, int, int]
) -> Image.Image:
    fitted = fit_on_square(image, size, scale)
    background = Image.new("RGBA", (size, size), background_rgba)
    background.alpha_composite(fitted)
    return background.convert("RGB")


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if image.mode == "RGBA":
        image.save(path, format="PNG", optimize=True)
    else:
        image.save(path, format="PNG", optimize=True)


def main() -> None:
    source = Image.open(SOURCE)
    cutout = prepare_mascot_cutout(source)

    save_png(to_opaque_icon(cutout, ICON_SIZE, ICON_SCALE, DARK_BG), OUTPUT_DIR / "icon.png")
    save_png(
        fit_on_square(cutout, ICON_SIZE, FOREGROUND_SCALE),
        OUTPUT_DIR / "android-icon-foreground.png",
    )
    save_png(
        to_monochrome(cutout, ICON_SIZE, FOREGROUND_SCALE),
        OUTPUT_DIR / "android-icon-monochrome.png",
    )
    save_png(
        to_opaque_icon(cutout, FAVICON_SIZE, 0.9, LIGHT_BG),
        OUTPUT_DIR / "favicon.png",
    )
    save_png(fit_bobble_main_for_splash(source, SPLASH_SIZE, 0.85), OUTPUT_DIR / "splash-icon.png")

    print("Generated app icons from bobble-main.png")


if __name__ == "__main__":
    main()
