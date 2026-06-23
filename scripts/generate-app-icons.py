#!/usr/bin/env python3
"""Generate Expo app icons from the Bobble mascot source image."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/images/mascot/mascot-sitting.png"
OUTPUT_DIR = ROOT / "src/assets/images"

ICON_SIZE = 1024
FOREGROUND_SCALE = 0.78
ICON_SCALE = 0.82
FAVICON_SIZE = 48
SPLASH_SIZE = 1024
WHITE_THRESHOLD = 245


def remove_near_white_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if red >= WHITE_THRESHOLD and green >= WHITE_THRESHOLD and blue >= WHITE_THRESHOLD:
                pixels[x, y] = (red, green, blue, 0)

    return rgba


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


def to_opaque_icon(image: Image.Image, size: int, scale: float) -> Image.Image:
    fitted = fit_on_square(image, size, scale)
    background = Image.new("RGBA", (size, size), (255, 255, 255, 255))
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
    cutout = remove_near_white_background(source)

    save_png(to_opaque_icon(cutout, ICON_SIZE, ICON_SCALE), OUTPUT_DIR / "icon.png")
    save_png(
        fit_on_square(cutout, ICON_SIZE, FOREGROUND_SCALE),
        OUTPUT_DIR / "android-icon-foreground.png",
    )
    save_png(
        to_monochrome(cutout, ICON_SIZE, FOREGROUND_SCALE),
        OUTPUT_DIR / "android-icon-monochrome.png",
    )
    save_png(
        to_opaque_icon(cutout, FAVICON_SIZE, 0.9),
        OUTPUT_DIR / "favicon.png",
    )
    save_png(to_opaque_icon(cutout, SPLASH_SIZE, 0.72), OUTPUT_DIR / "splash-icon.png")

    background = Image.new("RGB", (ICON_SIZE, ICON_SIZE), (255, 255, 255))
    save_png(background.convert("RGBA"), OUTPUT_DIR / "android-icon-background.png")

    print("Generated app icons from mascot-sitting.png")


if __name__ == "__main__":
    main()
