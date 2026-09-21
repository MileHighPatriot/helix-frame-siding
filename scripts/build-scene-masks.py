"""Build luminance masks for the locked design scenes.

White alpha marks the pixels a color wash may tint. The camera is locked, so
each plate gets its own field mask and the deck rails are differenced against
the straight cedar deck.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = Path("/opt/cursor/artifacts/assets")
OUT = Path("/workspace/public/media/masks")
PREVIEW = Path("/tmp/scene-mask-previews")


def load(name: str) -> np.ndarray:
    return np.asarray(Image.open(SRC / name).convert("RGB")).astype(np.float32)


def luminance(rgb: np.ndarray) -> np.ndarray:
    return 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]


def saturation(rgb: np.ndarray) -> np.ndarray:
    peak = rgb.max(axis=2)
    floor = rgb.min(axis=2)
    return (peak - floor) / np.maximum(peak, 1)


def largest(mask: np.ndarray, min_size: int = 500) -> np.ndarray:
    labels, count = ndi.label(mask)
    if count == 0:
        return np.zeros(mask.shape, dtype=bool)
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    winner = int(sizes.argmax())
    if sizes[winner] < min_size:
        return np.zeros(mask.shape, dtype=bool)
    return labels == winner


def keep_large(mask: np.ndarray, min_size: int) -> np.ndarray:
    labels, _count = ndi.label(mask)
    sizes = np.bincount(labels.ravel())
    keep = sizes >= min_size
    keep[0] = False
    return keep[labels]


def sky_from_top(rgb: np.ndarray) -> np.ndarray:
    light = luminance(rgb)
    sat = saturation(rgb)
    candidate = (light > 206) & (sat < 0.16)
    labels, _count = ndi.label(candidate)
    touching = np.unique(labels[:8])
    touching = touching[touching > 0]
    if touching.size == 0:
        return np.zeros(light.shape, dtype=bool)
    return np.isin(labels, touching)


def green(rgb: np.ndarray) -> np.ndarray:
    return (rgb[:, :, 1] > rgb[:, :, 0] + 10) & (rgb[:, :, 1] > rgb[:, :, 2] + 8)


def save_mask(path: Path, mask: np.ndarray) -> None:
    alpha = (mask.astype(np.uint8) * 255)
    rgba = np.zeros((*mask.shape, 4), dtype=np.uint8)
    rgba[:, :, 0] = 255
    rgba[:, :, 1] = 255
    rgba[:, :, 2] = 255
    rgba[:, :, 3] = alpha
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(path)


def preview(rgb: np.ndarray, mask: np.ndarray, path: Path) -> None:
    red = np.zeros_like(rgb)
    red[:, :, 0] = 210
    blended = np.where(mask[:, :, None], rgb * 0.4 + red * 0.6, rgb)
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8)).save(path)


def coverage(mask: np.ndarray) -> float:
    return float(mask.mean() * 100)


def siding_masks(name: str) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    rgb = load(name)
    light = luminance(rgb)
    height, width = light.shape
    sky = sky_from_top(rgb)
    dark = (light < 112) & ~sky & ~green(rgb)
    windows = keep_large(dark, 280)
    rows = np.arange(height)[:, None]
    field = (light > 122) & (light < 212) & ~sky & ~windows & ~green(rgb)
    field[int(height * 0.88) :] = False
    field = keep_large(ndi.binary_closing(field, iterations=2), 1800)
    surround = ndi.binary_dilation(windows, iterations=12) & ~ndi.binary_dilation(windows, iterations=2)
    eave = field & ndi.binary_dilation(sky, iterations=8)
    ys, xs = np.where(field)
    corners = np.zeros(field.shape, dtype=bool)
    if xs.size:
        left, right = int(xs.min()), int(xs.max())
        cols = np.arange(width)[None, :]
        corners = field & ((cols < left + 18) | (cols > right - 18))
    trim = (surround | eave | corners) & ~windows & ~sky & (rows < int(height * 0.86))
    trim = keep_large(trim, 40) | (trim & eave)
    field = field & ~ndi.binary_dilation(trim, iterations=1)
    return rgb, field, trim


def deck_boards(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    light = luminance(rgb)
    height, _width = light.shape
    rows = np.arange(height)[:, None]
    red, _green, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    warm = (red > blue + 12) & (red > 90)
    deck = warm & (light > 148) & (rows > height * 0.40) & (rows < height * 0.80) & ~green(rgb)
    boards = largest(ndi.binary_closing(deck, iterations=3), 4000)
    rim = boards & ~ndi.binary_erosion(boards, iterations=9)
    ys, _xs = np.where(boards)
    if ys.size == 0:
        empty = np.zeros(boards.shape, dtype=bool)
        return empty, empty
    midline = (ys.min() + ys.max()) / 2
    fascia = rim & (rows > midline)
    field = boards & ~ndi.binary_dilation(fascia, iterations=1)
    return field, fascia


def diff_mask(base: np.ndarray, other: np.ndarray, threshold: float) -> np.ndarray:
    delta = np.abs(other - base).mean(axis=2) > threshold
    return keep_large(delta, 60)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    stats: list[str] = []

    for path in sorted(SRC.glob("scene-siding-*.png")):
        stem = path.stem.removeprefix("scene-")
        rgb, field, trim = siding_masks(path.name)
        save_mask(OUT / f"{stem}-field.png", field)
        save_mask(OUT / f"{stem}-trim.png", trim)
        stats.append(f"{stem:32} field {coverage(field):5.1f}%  trim {coverage(trim):5.1f}%")
        if stem in {"siding-fc-lap", "siding-wood-batten", "siding-fc-lap-gable"}:
            preview(rgb, field, PREVIEW / f"{stem}-field.jpg")
            preview(rgb, trim, PREVIEW / f"{stem}-trim.jpg")

    cedar = load("scene-deck-straight-cedar.png")
    rail_parts = []
    for kind, threshold, bridge in (("wood", 24, 8), ("metal", 24, 6), ("glass", 16, 14)):
        rail = load(f"scene-deck-rail-{kind}.png")
        changed = np.abs(rail - cedar).mean(axis=2) > threshold
        changed = keep_large(changed, 80)
        solid = ndi.binary_closing(changed, iterations=bridge)
        height = solid.shape[0]
        solid[int(height * 0.80) :] = False
        solid[: int(height * 0.08)] = False
        solid = keep_large(solid, 700)
        save_mask(OUT / f"deck-rail-{kind}.png", solid)
        rail_parts.append(solid)
        stats.append(f"deck-rail-{kind:20} {coverage(solid):5.1f}%")
        if kind in {"wood", "glass"}:
            comp = np.where(solid[:, :, None], rail, cedar)
            Image.fromarray(np.clip(comp, 0, 255).astype(np.uint8)).save(PREVIEW / f"deck-rail-{kind}-comp.jpg")
            preview(cedar, solid, PREVIEW / f"deck-rail-{kind}-mask.jpg")

    rail_zone = np.zeros(cedar.shape[:2], dtype=bool)
    for part in rail_parts:
        rail_zone |= part
    rail_zone = ndi.binary_dilation(rail_zone, iterations=2)

    references: dict[str, tuple[np.ndarray, np.ndarray]] = {}
    for layout in ("straight", "picture"):
        ref = load(f"scene-deck-{layout}-cedar.png")
        references[layout] = deck_boards(ref)

    for path in sorted(SRC.glob("scene-deck-*.png")):
        if "rail" in path.name:
            continue
        stem = path.stem.removeprefix("scene-")
        layout = stem.split("-")[1]
        rgb = load(path.name)
        boards, fascia = deck_boards(rgb)
        if coverage(boards) < 6:
            boards, fascia = references[layout]
        light = luminance(rgb)
        cable = rail_zone & (light < 115) & ~ndi.binary_dilation(boards, iterations=3)
        cable = keep_large(cable, 20)
        cable = ndi.binary_dilation(cable, iterations=1)
        save_mask(OUT / f"{stem}-boards.png", boards)
        save_mask(OUT / f"{stem}-fascia.png", fascia)
        save_mask(OUT / f"{stem}-cable.png", cable)
        stats.append(
            f"{stem:32} boards {coverage(boards):5.1f}%  fascia {coverage(fascia):5.1f}%  cable {coverage(cable):5.1f}%"
        )
        if stem in {"deck-straight-cedar", "deck-picture-hardwood"}:
            preview(rgb, boards, PREVIEW / f"{stem}-boards.jpg")
            preview(rgb, fascia, PREVIEW / f"{stem}-fascia.jpg")
            preview(rgb, cable, PREVIEW / f"{stem}-cable.jpg")

    for path in sorted(SRC.glob("scene-outdoor-*.png")):
        stem = path.stem.removeprefix("scene-")
        rgb = load(path.name)
        light = luminance(rgb)
        red, _g, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
        rows = np.arange(light.shape[0])[:, None]
        timber = (
            (red > rgb[:, :, 1] + 6)
            & (red > blue + 28)
            & (red > 60)
            & (light > 48)
            & (light < 125)
            & (saturation(rgb) > 0.16)
            & ~green(rgb)
            & (rows < light.shape[0] * 0.82)
            & (rows > light.shape[0] * 0.08)
        )
        timber = keep_large(ndi.binary_opening(timber, iterations=1), 350)
        save_mask(OUT / f"{stem}-timber.png", timber)
        stats.append(f"{stem:32} timber {coverage(timber):5.1f}%")
        if stem in {"outdoor-pergola", "outdoor-pavilion-metal", "outdoor-attached-shingle"}:
            preview(rgb, timber, PREVIEW / f"{stem}-timber.jpg")

    flush_metal = load("scene-remodel-flush-metal.png")
    dropped_metal = load("scene-remodel-dropped-metal.png")
    beam = np.abs(dropped_metal - flush_metal).mean(axis=2) > 14
    beam = keep_large(beam, 80)
    beam = ndi.binary_closing(beam, iterations=3)
    beam[int(beam.shape[0] * 0.42) :] = False
    beam = keep_large(beam, 200)

    wood = load("scene-remodel-flush-wood.png")
    metal = load("scene-remodel-flush-metal.png")
    rail = np.abs(wood - metal).mean(axis=2) > 16
    rail = keep_large(rail, 40)
    rail = ndi.binary_closing(rail, iterations=2)
    rail[:, : int(rail.shape[1] * 0.45)] = False

    for beam_name in ("flush", "dropped"):
        for stair in ("wood", "metal"):
            stem = f"remodel-{beam_name}-{stair}"
            rgb = load(f"scene-{stem}.png")
            finish = beam.copy()
            if stair == "wood":
                finish = finish | rail
            save_mask(OUT / f"{stem}-finish.png", finish)
            stats.append(f"{stem:32} finish {coverage(finish):5.1f}%")
            preview(rgb, finish, PREVIEW / f"{stem}-finish.jpg")

    for path in sorted(SRC.glob("scene-addition-*.png")):
        stem = path.stem.removeprefix("scene-")
        rgb = load(path.name)
        light = luminance(rgb)
        height, _width = light.shape
        red, green_ch, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
        sky = sky_from_top(rgb)
        brick = (red > green_ch + 14) & (light < 125) & (saturation(rgb) > 0.14) & (red < 170)
        rows = np.arange(height)[:, None]
        windows = (light < 108) & ~brick & ~sky & (rows < height * 0.78)
        windows = keep_large(windows, 180)
        field = (light > 138) & (light < 214) & (saturation(rgb) < 0.2) & ~sky & ~brick & ~windows & ~green(rgb)
        field[int(height * 0.82) :] = False
        field = largest(ndi.binary_closing(field, iterations=2), 5000)
        save_mask(OUT / f"{stem}-field.png", field)
        stats.append(f"{stem:32} field {coverage(field):5.1f}%")
        if stem in {"addition-one-lap", "addition-two-panel"}:
            preview(rgb, field, PREVIEW / f"{stem}-field.jpg")

    for path in sorted(SRC.glob("scene-framing-*.png")):
        stem = path.stem.removeprefix("scene-")
        rgb = load(path.name)
        light = luminance(rgb)
        height, width = light.shape
        sky = sky_from_top(rgb)
        red, _g, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
        cols = np.arange(width)[None, :]
        brick = (red > blue + 12) & (light < 100) & (cols < width * 0.28)
        lumber = (red > blue + 22) & (red > 80) & (light > 88) & (light < 205) & ~sky & ~brick & ~green(rgb)
        lumber = keep_large(lumber, 250)
        save_mask(OUT / f"{stem}-lumber.png", lumber)
        stats.append(f"{stem:32} lumber {coverage(lumber):5.1f}%")
        if stem in {"framing-sawn-lvl-open", "framing-sawn-lvl-sheathed"}:
            preview(rgb, lumber, PREVIEW / f"{stem}-lumber.jpg")

    print("\n".join(stats))


if __name__ == "__main__":
    main()
