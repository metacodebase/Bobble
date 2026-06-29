#!/usr/bin/env python3
"""Animate waveform bars in a Bobble mascot PNG and export loopable WebP/GIF."""

from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MASCOT_DIR = ROOT / "src/assets/images/mascot"

# Waveform crop box tuned for bobble-voice.png (860x730).
LEFT = 540
RIGHT = 820
TOP = 170
BOTTOM = 470

FPS = 60
DURATION = 2.0
FRAMES = int(FPS * DURATION)
SUPERSAMPLE = 2
ALPHA_FLOOR = 48
HAZE_ALPHA_MAX = 92

# Waveform motion tuning
MIN_BAR_SCALE = 0.28
MAX_BAR_SCALE = 1.35
WAVE_CYCLES = 3.6
BAR_PHASE_STEP = 0.85


def clean_rgba_array(frame: np.ndarray, alpha_floor: int = ALPHA_FLOOR) -> np.ndarray:
    """Drop faint fringe pixels that show up as noisy dots on light backgrounds."""
    cleaned = frame.copy()
    alpha = cleaned[:, :, 3]
    cleaned[alpha < alpha_floor] = (0, 0, 0, 0)

    rgb = cleaned[:, :, :3]
    alpha = cleaned[:, :, 3]
    haze = (
        (alpha >= alpha_floor)
        & (alpha < HAZE_ALPHA_MAX)
        & (rgb[:, :, 0] > 110)
        & (rgb[:, :, 2] > 110)
        & (rgb[:, :, 1] > 70)
    )
    cleaned[haze] = (0, 0, 0, 0)
    return cleaned


def upscale_image(image: Image.Image, factor: int = SUPERSAMPLE) -> Image.Image:
    width, height = image.size
    return image.resize(
        (width * factor, height * factor),
        Image.Resampling.LANCZOS,
    )


def downscale_image(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return image.resize(size, Image.Resampling.LANCZOS)


def bar_scale_at(frame_index: int, bar_index: int) -> float:
    """Continuous sine easing for smooth vertical motion."""
    time = frame_index / FRAMES
    phase = bar_index * BAR_PHASE_STEP
    wave = (math.sin(2 * math.pi * WAVE_CYCLES * time + phase) + 1) / 2
    return MIN_BAR_SCALE + (MAX_BAR_SCALE - MIN_BAR_SCALE) * wave


def render_frame(
    base: Image.Image,
    crop: Image.Image,
    groups: list[tuple[int, int]],
    frame_index: int,
    *,
    left: int,
    top: int,
) -> Image.Image:
    frame = base.copy()

    for bar_index, (x1, x2) in enumerate(groups):
        scale = bar_scale_at(frame_index, bar_index)

        bar = crop.crop((x1, 0, x2 + 1, crop.height))
        bbox = bar.getbbox()
        if bbox is None:
            continue

        bar = bar.crop(bbox)
        bar_width, bar_height = bar.size
        scaled_height = bar_height * scale
        new_height = max(SUPERSAMPLE * 4, round(scaled_height))
        resized = bar.resize((bar_width, new_height), Image.Resampling.LANCZOS)

        x = left + x1
        y = round(top + bbox[1] + (bar_height - scaled_height) / 2)
        frame.alpha_composite(resized, (x, y))

    return frame


def clear_waveform_region(
    base: Image.Image,
    left: int,
    top: int,
    right: int,
    bottom: int,
) -> None:
    """Remove the static waveform so animated bars do not stack on top of it."""
    clear = Image.new("RGBA", (right - left, bottom - top), (0, 0, 0, 0))
    base.paste(clear, (left, top), clear)


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
    """Fallback export with a shared palette and no dithering."""
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


def animate_waveform(
    input_path: Path,
    output_webp: Path,
    output_gif: Path,
    output_mp4: Path,
) -> None:
    if not input_path.exists():
        raise FileNotFoundError(
            f"{input_path} not found.\nAvailable files: {sorted(p.name for p in MASCOT_DIR.iterdir())}"
        )

    source = clean_rgba_array(np.array(Image.open(input_path).convert("RGBA")))
    img = Image.fromarray(source, "RGBA")
    output_size = img.size

    img_hi = upscale_image(img)
    scale = SUPERSAMPLE
    left_hi = LEFT * scale
    top_hi = TOP * scale
    right_hi = RIGHT * scale
    bottom_hi = BOTTOM * scale

    crop_hi = img_hi.crop((left_hi, top_hi, right_hi, bottom_hi))
    crop_np = np.array(crop_hi)
    alpha = crop_np[:, :, 3]

    cols = np.where(alpha.max(axis=0) > 20)[0]
    if len(cols) == 0:
        raise ValueError(
            "No waveform bars detected. Check LEFT, RIGHT, TOP and BOTTOM coordinates."
        )

    groups: list[tuple[int, int]] = []
    start = cols[0]
    for index in range(1, len(cols)):
        if cols[index] != cols[index - 1] + 1:
            groups.append((start, cols[index - 1]))
            start = cols[index]
    groups.append((start, cols[-1]))

    base_hi = img_hi.copy()
    clear_waveform_region(base_hi, left_hi, top_hi, right_hi, bottom_hi)

    frame_images: list[Image.Image] = []
    frame_arrays: list[np.ndarray] = []

    for frame_index in range(FRAMES):
        frame_hi = render_frame(
            base_hi,
            crop_hi,
            groups,
            frame_index,
            left=left_hi,
            top=top_hi,
        )
        frame = downscale_image(frame_hi, output_size)
        cleaned = clean_rgba_array(np.array(frame))
        frame_images.append(Image.fromarray(cleaned, "RGBA"))
        frame_arrays.append(cleaned)

    frame_height, frame_width = frame_arrays[0].shape[:2]
    padded_width = math.ceil(frame_width / 16) * 16
    padded_height = math.ceil(frame_height / 16) * 16

    mp4_arrays = frame_arrays
    if padded_width != frame_width or padded_height != frame_height:
        mp4_arrays = []
        for frame_array in frame_arrays:
            padded_array = np.zeros((padded_height, padded_width, 4), dtype=frame_array.dtype)
            padded_array[:frame_height, :frame_width] = frame_array
            mp4_arrays.append(padded_array)

    output_webp.parent.mkdir(parents=True, exist_ok=True)
    output_gif.parent.mkdir(parents=True, exist_ok=True)
    output_mp4.parent.mkdir(parents=True, exist_ok=True)

    save_animated_webp(frame_images, output_webp)
    save_animated_gif(frame_images, output_gif)
    imageio.mimsave(output_mp4, mp4_arrays, fps=FPS, codec="libx264", quality=8)


def main() -> None:
    input_path = MASCOT_DIR / "bobble-voice.png"
    output_webp = MASCOT_DIR / "bobble-voice-animated.webp"
    output_gif = MASCOT_DIR / "bobble-voice-animated.gif"
    output_mp4 = MASCOT_DIR / "bobble-voice-animated.mp4"

    animate_waveform(input_path, output_webp, output_gif, output_mp4)
    print("Done!")
    print("Saved:", output_webp)
    print("Saved:", output_gif)
    print("Saved:", output_mp4)


if __name__ == "__main__":
    main()
