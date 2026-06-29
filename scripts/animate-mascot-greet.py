#!/usr/bin/env python3
"""Animate Bobble greet mascot: fixed mascot with a party-popper confetti burst."""

from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MASCOT_DIR = ROOT / "src/assets/images/mascot"

FPS = 60
DURATION = 2.4
FRAMES = int(FPS * DURATION)
SUPERSAMPLE = 2
ALPHA_FLOOR = 32

# Confetti pop behind the mascot head
POP_CENTER = (430, 200)
POP_START = 0.12
POP_END = 0.58
POP_FADE_START = 1.85
POP_STAGGER = 0.45

MIN_CONFETTI_SIZE = 80
MAX_CONFETTI_SIZE = 20_000


@dataclass
class ConfettiParticle:
    sprite: Image.Image
    center_x: float
    center_y: float
    delay: float


def clean_rgba_array(frame: np.ndarray, alpha_floor: int = ALPHA_FLOOR) -> np.ndarray:
    cleaned = frame.copy()
    alpha = cleaned[:, :, 3]
    cleaned[alpha < alpha_floor] = (0, 0, 0, 0)
    return cleaned


def ease_out_back(value: float) -> float:
    value = max(0.0, min(1.0, value))
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (value - 1) ** 3 + c1 * (value - 1) ** 2


def ease_out_cubic(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return 1 - (1 - value) ** 3


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


def split_mascot_and_confetti(arr: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Keep the main mascot blob intact; treat detached pieces as confetti."""
    alpha = arr[:, :, 3]
    visible = alpha > 40
    components = find_components(visible, min_size=MIN_CONFETTI_SIZE)

    if not components:
        raise ValueError("No visible mascot content found.")

    components.sort(key=len, reverse=True)

    mascot_mask = np.zeros_like(visible, dtype=bool)
    for y, x in components[0]:
        mascot_mask[y, x] = True

    confetti_mask = np.zeros_like(visible, dtype=bool)
    for component in components[1:]:
        if len(component) > MAX_CONFETTI_SIZE:
            continue
        for y, x in component:
            confetti_mask[y, x] = True

    return mascot_mask, confetti_mask


def extract_mascot_layer(image: Image.Image, mascot_mask: np.ndarray) -> Image.Image:
    arr = np.array(image.convert("RGBA"))
    layer = np.zeros_like(arr)
    layer[mascot_mask] = arr[mascot_mask]
    return Image.fromarray(layer, "RGBA")


def extract_confetti_particles(image: Image.Image, confetti_mask: np.ndarray) -> list[ConfettiParticle]:
    arr = np.array(image.convert("RGBA"))
    particles: list[ConfettiParticle] = []

    for index, coords in enumerate(find_components(confetti_mask, min_size=MIN_CONFETTI_SIZE)):
        ys = [coord[0] for coord in coords]
        xs = [coord[1] for coord in coords]
        x1, x2 = min(xs), max(xs)
        y1, y2 = min(ys), max(ys)

        sprite_arr = np.zeros((y2 - y1 + 1, x2 - x1 + 1, 4), dtype=np.uint8)
        for y, x in coords:
            sprite_arr[y - y1, x - x1] = arr[y, x]

        delay = (index % 7) / 7 * POP_STAGGER
        particles.append(
            ConfettiParticle(
                sprite=Image.fromarray(sprite_arr, "RGBA"),
                center_x=(x1 + x2) / 2,
                center_y=(y1 + y2) / 2,
                delay=delay,
            )
        )

    return particles


def pop_progress(frame_index: int, delay: float) -> tuple[float, float]:
    time = frame_index / FRAMES

    if time <= POP_START + delay:
        return 0.0, 0.0

    progress = (time - POP_START - delay) / (POP_END - POP_START)
    spread = clamp(progress)
    opacity = clamp(progress * 2.2)

    if time > POP_FADE_START:
        fade = clamp((time - POP_FADE_START) / (DURATION - POP_FADE_START))
        opacity *= 1 - ease_out_cubic(fade)

    return spread, opacity


def render_confetti(
    canvas: Image.Image,
    particles: list[ConfettiParticle],
    frame_index: int,
    *,
    pop_center: tuple[float, float],
) -> None:
    pop_x, pop_y = pop_center

    for particle in particles:
        spread, opacity = pop_progress(frame_index, particle.delay)
        if spread <= 0 or opacity <= 0:
            continue

        scale = lerp(0.1, 1.0, ease_out_back(spread))
        spread_eased = ease_out_cubic(spread)
        current_x = lerp(pop_x, particle.center_x, spread_eased)
        current_y = lerp(pop_y, particle.center_y, spread_eased)

        sprite = particle.sprite
        width, height = sprite.size
        scaled_width = max(2, round(width * scale))
        scaled_height = max(2, round(height * scale))
        scaled = sprite.resize((scaled_width, scaled_height), Image.Resampling.LANCZOS)

        if opacity < 0.999:
            scaled_arr = np.array(scaled)
            scaled_arr[:, :, 3] = (scaled_arr[:, :, 3].astype(np.float32) * opacity).astype(np.uint8)
            scaled = Image.fromarray(scaled_arr, "RGBA")

        x = round(current_x - scaled_width / 2)
        y = round(current_y - scaled_height / 2)
        canvas.alpha_composite(scaled, (x, y))


def render_frame(
    mascot_layer: Image.Image,
    particles: list[ConfettiParticle],
    frame_index: int,
    canvas_size: tuple[int, int],
    *,
    pop_center: tuple[float, float],
) -> Image.Image:
    width, height = canvas_size
    frame = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    render_confetti(frame, particles, frame_index, pop_center=pop_center)
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
        loop=0,
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


def animate_greet(
    input_path: Path,
    output_webp: Path,
    output_gif: Path,
    output_mp4: Path,
) -> None:
    if not input_path.exists():
        raise FileNotFoundError(
            f"{input_path} not found.\nAvailable files: {sorted(p.name for p in MASCOT_DIR.iterdir())}"
        )

    source_arr = np.array(Image.open(input_path).convert("RGBA"))
    image = Image.fromarray(source_arr, "RGBA")
    output_size = image.size

    mascot_mask, confetti_mask = split_mascot_and_confetti(source_arr)
    mascot_layer = extract_mascot_layer(image, mascot_mask)
    particles = extract_confetti_particles(image, confetti_mask)

    if not particles:
        raise ValueError("No confetti particles detected in bobble-greet.png")

    scale = SUPERSAMPLE
    pop_center_hi = (POP_CENTER[0] * scale, POP_CENTER[1] * scale)
    mascot_hi = upscale_image(mascot_layer)
    particles_hi = [
        ConfettiParticle(
            sprite=upscale_image(particle.sprite),
            center_x=particle.center_x * scale,
            center_y=particle.center_y * scale,
            delay=particle.delay,
        )
        for particle in particles
    ]

    frame_images: list[Image.Image] = []
    frame_arrays: list[np.ndarray] = []

    for frame_index in range(FRAMES):
        frame_hi = render_frame(
            mascot_hi,
            particles_hi,
            frame_index,
            (mascot_hi.width, mascot_hi.height),
            pop_center=pop_center_hi,
        )
        frame = downscale_image(frame_hi, output_size)
        cleaned = clean_rgba_array(np.array(frame))
        frame_images.append(Image.fromarray(cleaned, "RGBA"))
        frame_arrays.append(cleaned)

    output_webp.parent.mkdir(parents=True, exist_ok=True)
    output_gif.parent.mkdir(parents=True, exist_ok=True)
    output_mp4.parent.mkdir(parents=True, exist_ok=True)

    save_animated_webp(frame_images, output_webp)
    save_animated_gif(frame_images, output_gif)
    imageio.mimsave(output_mp4, frame_arrays, fps=FPS, codec="libx264", quality=8)


def main() -> None:
    input_path = MASCOT_DIR / "bobble-greet.png"
    output_webp = MASCOT_DIR / "bobble-greet-animated.webp"
    output_gif = MASCOT_DIR / "bobble-greet-animated.gif"
    output_mp4 = MASCOT_DIR / "bobble-greet-animated.mp4"

    animate_greet(input_path, output_webp, output_gif, output_mp4)
    print("Done!")
    print("Saved:", output_webp)
    print("Saved:", output_gif)
    print("Saved:", output_mp4)


if __name__ == "__main__":
    main()
