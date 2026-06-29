#!/usr/bin/env python3
"""Animate Bobble home icon: heart appears smoothly from behind the mascot."""

from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS_DIR = ROOT / "src/assets/images"

FPS = 60
INTRO_DURATION = 1.2
FRAMES = int(FPS * INTRO_DURATION)
SUPERSAMPLE = 2
ALPHA_FLOOR = 24

# Heart emerges from behind the upper-left body
EMERGE_CENTER = (260, 195)
APPEAR_START = 0.08
APPEAR_END = 0.92

MIN_HEART_SIZE = 50
MAX_HEART_SIZE = 5_000
SHADOW_MIN_Y = 350


@dataclass
class HeartLayer:
    sprite: Image.Image
    center_x: float
    center_y: float


def clean_rgba_array(frame: np.ndarray, alpha_floor: int = ALPHA_FLOOR) -> np.ndarray:
    cleaned = frame.copy()
    alpha = cleaned[:, :, 3]
    cleaned[alpha < alpha_floor] = (0, 0, 0, 0)
    return cleaned


def ease_out_cubic(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return 1 - (1 - value) ** 3


def ease_in_out_cubic(value: float) -> float:
    value = max(0.0, min(1.0, value))
    if value < 0.5:
        return 4 * value * value * value
    return 1 - ((-2 * value + 2) ** 3) / 2


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def lerp(start: float, end: float, amount: float) -> float:
    return start + (end - start) * amount


def upscale_image(image: Image.Image, factor: int = SUPERSAMPLE) -> Image.Image:
    width, height = image.size
    return image.resize((width * factor, height * factor), Image.Resampling.LANCZOS)


def downscale_image(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return image.resize(size, Image.Resampling.LANCZOS)


def find_components(mask: np.ndarray, min_size: int = 25) -> list[list[tuple[int, int]]]:
    height, width = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    components: list[list[tuple[int, int]]] = []
    ys_all, xs_all = np.where(mask)

    for y, x in zip(ys_all, xs_all):
        if visited[y, x]:
            continue

        stack = [(y, x)]
        coords: list[tuple[int, int]] = []
        visited[y, x] = True

        while stack:
            cy, cx = stack.pop()
            coords.append((cy, cx))
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < height and 0 <= nx < width and mask[ny, nx] and not visited[ny, nx]:
                    visited[ny, nx] = True
                    stack.append((ny, nx))

        if len(coords) >= min_size:
            components.append(coords)

    return components


def split_layers(arr: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Keep the main bobble blob intact; only detach the floating heart pieces."""
    alpha = arr[:, :, 3]
    visible = alpha > 40
    components = find_components(visible, min_size=MIN_HEART_SIZE)

    if not components:
        raise ValueError("No visible content found in bobble-home-tab.png")

    components.sort(key=len, reverse=True)

    mascot_mask = np.zeros_like(visible, dtype=bool)
    heart_mask = np.zeros_like(visible, dtype=bool)

    for y, x in components[0]:
        mascot_mask[y, x] = True

    for component in components[1:]:
        if len(component) > MAX_HEART_SIZE:
            continue

        ys = [coord[0] for coord in component]
        xs = [coord[1] for coord in component]
        center_y = sum(ys) / len(ys)
        center_x = sum(xs) / len(ys)

        if center_y >= SHADOW_MIN_Y:
            for y, x in component:
                mascot_mask[y, x] = True
            continue

        if center_y < 200 and center_x < 250:
            for y, x in component:
                heart_mask[y, x] = True

    if not heart_mask.any():
        raise ValueError("No detached heart pixels found in bobble-home-tab.png")

    return mascot_mask, heart_mask


def extract_mascot_layer(image: Image.Image, mascot_mask: np.ndarray) -> Image.Image:
    arr = np.array(image.convert("RGBA"))
    layer = np.zeros_like(arr)
    layer[mascot_mask] = arr[mascot_mask]
    return Image.fromarray(layer, "RGBA")


def extract_heart_layer(image: Image.Image, heart_mask: np.ndarray) -> HeartLayer:
    arr = np.array(image.convert("RGBA"))
    ys, xs = np.where(heart_mask)

    x1, x2 = int(xs.min()), int(xs.max())
    y1, y2 = int(ys.min()), int(ys.max())

    sprite_arr = np.zeros((y2 - y1 + 1, x2 - x1 + 1, 4), dtype=np.uint8)
    for y, x in zip(ys, xs):
        sprite_arr[y - y1, x - x1] = arr[y, x]

    return HeartLayer(
        sprite=Image.fromarray(sprite_arr, "RGBA"),
        center_x=(x1 + x2) / 2,
        center_y=(y1 + y2) / 2,
    )


def heart_progress(frame_index: int) -> tuple[float, float]:
    time = frame_index / FRAMES

    if time <= APPEAR_START:
        return 0.0, 0.0

    progress = clamp((time - APPEAR_START) / (APPEAR_END - APPEAR_START))
    spread = ease_in_out_cubic(progress)
    opacity = ease_out_cubic(progress)
    return spread, opacity


def render_frame(
    mascot_layer: Image.Image,
    heart: HeartLayer,
    frame_index: int,
    canvas_size: tuple[int, int],
    *,
    emerge_center: tuple[float, float],
) -> Image.Image:
    width, height = canvas_size
    frame = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    spread, opacity = heart_progress(frame_index)
    emerge_x, emerge_y = emerge_center

    if spread > 0 and opacity > 0:
        scale = lerp(0.25, 1.0, spread)
        current_x = lerp(emerge_x, heart.center_x, spread)
        current_y = lerp(emerge_y, heart.center_y, spread)

        sprite = heart.sprite
        sprite_width, sprite_height = sprite.size
        scaled_width = max(2, round(sprite_width * scale))
        scaled_height = max(2, round(sprite_height * scale))
        scaled = sprite.resize((scaled_width, scaled_height), Image.Resampling.LANCZOS)

        if opacity < 0.999:
            scaled_arr = np.array(scaled)
            scaled_arr[:, :, 3] = (scaled_arr[:, :, 3].astype(np.float32) * opacity).astype(np.uint8)
            scaled = Image.fromarray(scaled_arr, "RGBA")

        x = round(current_x - scaled_width / 2)
        y = round(current_y - scaled_height / 2)
        frame.alpha_composite(scaled, (x, y))

    frame.alpha_composite(mascot_layer, (0, 0))
    return frame


def save_animated_webp(frames: list[Image.Image], output_path: Path) -> None:
    duration_ms = int(1000 / FPS)
    frames[0].save(
        output_path,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=duration_ms,
        loop=1,
        lossless=True,
        method=6,
    )


def save_animated_gif(frames: list[Image.Image], output_path: Path) -> None:
    duration_ms = int(1000 / FPS)
    rgba_frames = [frame.convert("RGBA") for frame in frames]
    width, height = rgba_frames[0].size

    combined = Image.new("RGBA", (width, height * len(rgba_frames)))
    for index, frame in enumerate(rgba_frames):
        combined.paste(frame, (0, index * height))

    palette_image = combined.convert("RGB").quantize(
        colors=256,
        method=Image.Quantize.MEDIANCUT,
        dither=Image.Dither.NONE,
    )
    palette = palette_image.getpalette()

    gif_frames: list[Image.Image] = []
    for frame in rgba_frames:
        rgb = frame.convert("RGB").quantize(
            palette=palette_image,
            dither=Image.Dither.NONE,
        )
        alpha = frame.getchannel("A")
        rgb.putalpha(alpha)
        gif_frames.append(rgb.convert("P", palette=palette, colors=256))

    gif_frames[0].save(
        output_path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=duration_ms,
        loop=0,
        transparency=0,
        disposal=2,
        optimize=False,
    )


def animate_home(
    input_path: Path,
    output_webp: Path,
    output_gif: Path,
    output_mp4: Path,
    output_mascot: Path,
) -> None:
    if not input_path.exists():
        raise FileNotFoundError(f"{input_path} not found.")

    source_arr = np.array(Image.open(input_path).convert("RGBA"))
    image = Image.fromarray(source_arr, "RGBA")
    output_size = image.size

    mascot_mask, heart_mask = split_layers(source_arr)
    mascot_layer = extract_mascot_layer(image, mascot_mask)
    heart = extract_heart_layer(image, heart_mask)

    scale = SUPERSAMPLE
    emerge_hi = (EMERGE_CENTER[0] * scale, EMERGE_CENTER[1] * scale)
    mascot_hi = upscale_image(mascot_layer)
    heart_hi = HeartLayer(
        sprite=upscale_image(heart.sprite),
        center_x=heart.center_x * scale,
        center_y=heart.center_y * scale,
    )

    frame_images: list[Image.Image] = []
    frame_arrays: list[np.ndarray] = []

    for frame_index in range(FRAMES):
        frame_hi = render_frame(
            mascot_hi,
            heart_hi,
            frame_index,
            (mascot_hi.width, mascot_hi.height),
            emerge_center=emerge_hi,
        )
        frame = downscale_image(frame_hi, output_size)
        cleaned = clean_rgba_array(np.array(frame))
        frame_images.append(Image.fromarray(cleaned, "RGBA"))
        frame_arrays.append(cleaned)

    output_webp.parent.mkdir(parents=True, exist_ok=True)
    mascot_layer.save(output_mascot)
    save_animated_webp(frame_images, output_webp)
    save_animated_gif(frame_images, output_gif)
    imageio.mimsave(output_mp4, frame_arrays, fps=FPS, codec="libx264", quality=8)


def main() -> None:
    input_path = ASSETS_DIR / "bobble-home-tab.png"
    output_webp = ASSETS_DIR / "bobble-home-tab-animated.webp"
    output_gif = ASSETS_DIR / "bobble-home-tab-animated.gif"
    output_mp4 = ASSETS_DIR / "bobble-home-tab-animated.mp4"
    output_mascot = ASSETS_DIR / "bobble-home-tab-mascot.png"

    animate_home(input_path, output_webp, output_gif, output_mp4, output_mascot)
    print("Done!")
    print("Saved:", output_mascot)
    print("Saved:", output_webp)
    print("Saved:", output_gif)
    print("Saved:", output_mp4)


if __name__ == "__main__":
    main()
