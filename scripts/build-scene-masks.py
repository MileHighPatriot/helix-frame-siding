"""Build alpha masks for the locked design scenes.

A mask is white only where that control's color should land. Vegetation, sky,
brick, and the ground stay out. The wall, deck, or lumber region is filled
solid so the color covers the whole surface.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = Path("/workspace/public/media")
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


def keep_large(mask: np.ndarray, min_size: int) -> np.ndarray:
    labels, _count = ndi.label(mask)
    if labels.max() == 0:
        return np.zeros(mask.shape, dtype=bool)
    sizes = np.bincount(labels.ravel())
    keep = sizes >= min_size
    keep[0] = False
    return keep[labels]


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


def sky_mask(rgb: np.ndarray) -> np.ndarray:
    light = luminance(rgb)
    sat = saturation(rgb)
    candidate = (light > 208) & (sat < 0.14)
    labels, _count = ndi.label(candidate)
    touching = np.unique(labels[:6])
    touching = touching[touching > 0]
    sky = np.isin(labels, touching) if touching.size else np.zeros(light.shape, dtype=bool)
    return ndi.binary_dilation(sky, iterations=2)


def save_mask(path: Path, mask: np.ndarray) -> None:
    alpha = mask.astype(np.uint8) * 255
    rgba = np.zeros((*mask.shape, 4), dtype=np.uint8)
    rgba[:, :, 0] = 255
    rgba[:, :, 1] = 255
    rgba[:, :, 2] = 255
    rgba[:, :, 3] = alpha
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(path)


def coverage(mask: np.ndarray) -> float:
    return float(mask.mean() * 100)


def median_color(rgb: np.ndarray, selector: np.ndarray) -> np.ndarray:
    chosen = rgb[selector]
    if chosen.shape[0] < 80:
        return np.median(rgb.reshape(-1, 3), axis=0)
    return np.median(chosen, axis=0)


def chroma_distance(rgb: np.ndarray, median: np.ndarray) -> np.ndarray:
    light = np.maximum(luminance(rgb)[:, :, None], 1)
    median_light = max(float(luminance(median.reshape(1, 1, 3))[0, 0]), 1)
    chroma = rgb / light
    return np.linalg.norm(chroma - (median / median_light), axis=2)


def siding_masks(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    height, width = rgb.shape[:2]
    light = luminance(rgb)
    sky = sky_mask(rgb)
    rows = np.arange(height)[:, None]
    cols = np.arange(width)[None, :]
    red, green, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    sample = (rows > height * 0.45) & (rows < height * 0.72) & (cols > width * 0.34) & (cols < width * 0.70)
    sample = sample & (light > 120) & (light < 210)
    median = median_color(rgb, sample)
    distance = chroma_distance(rgb, median)
    # Shrubs and the tree sit under the last siding course. Cut them before the color grows.
    ground = rows > int(height * 0.825)
    plants = ((green > red + 8) & (green > blue + 6)) | ((rows > height * 0.80) & (distance > 0.11) & (light < 150))
    plants = ndi.binary_dilation(plants, iterations=1)
    windows = keep_large((light < 92) & (distance > 0.04) & (rows < height * 0.80), 180)
    windows = ndi.binary_dilation(windows, iterations=2)
    field = (distance < 0.085) & (light > 108) & (light < 216) & ~sky & ~ground & ~plants & ~windows
    # Bridge lap grooves and batten shadows, then knock the openings back out.
    field = ndi.binary_closing(field, structure=np.ones((3, 9), dtype=bool))
    field = ndi.binary_closing(field, iterations=4)
    field = field & ~sky & ~ground & ~plants & ~windows
    field = keep_large(field, 2000)
    filled = ndi.binary_fill_holes(field)
    gaps = filled & ~field & (light > 125) & (light < 215) & (distance < 0.12) & ~plants & ~ground & ~sky
    field = keep_large(field | gaps, 2000)
    ring = ndi.binary_dilation(windows, iterations=7) & ~ndi.binary_dilation(windows, iterations=2)
    _ys, xs = np.where(field)
    corners = np.zeros(field.shape, dtype=bool)
    eave = np.zeros(field.shape, dtype=bool)
    if xs.size:
        left, right = int(xs.min()), int(xs.max())
        corners = field & ((cols < left + 14) | (cols > right - 14))
        eave = field & ndi.binary_dilation(sky, iterations=4)
    trim = (ring | corners | eave) & ~sky & ~ground & ~plants & ~windows
    trim = keep_large(trim, 40)
    field = field & ~ndi.binary_dilation(trim, iterations=1)
    return field, trim


def deck_masks(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    height, width = rgb.shape[:2]
    light = luminance(rgb)
    rows = np.arange(height)[:, None]
    cols = np.arange(width)[None, :]
    red, green, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    plants = (green > red + 8) & (green > blue + 6)
    sample = (rows > height * 0.56) & (rows < height * 0.70) & (cols > width * 0.40) & (cols < width * 0.64)
    sample = sample & (light > 155)
    median = median_color(rgb, sample)
    distance = chroma_distance(rgb, median)
    band = (rows > height * 0.50) & (rows < height * 0.83)
    grown = (distance < 0.04) & band & (light > 140) & ~plants
    for _step in range(14):
        grown = ndi.binary_dilation(grown, iterations=1) & (distance < 0.09) & band & (light > 120) & ~plants
    boards = largest(ndi.binary_closing(grown, iterations=3), 2000)
    if boards.sum() < 1000:
        empty = np.zeros(boards.shape, dtype=bool)
        return empty, empty
    # Fill the walking surface between the near and far board in each column. Grass stays below that span.
    present = boards.any(axis=0)
    index = np.arange(height)[:, None]
    top = np.argmax(boards, axis=0)
    bottom_row = height - 1 - np.argmax(boards[::-1], axis=0)
    span = (index >= top) & (index <= bottom_row) & present
    boards = boards | (span & (distance < 0.12) & (light > 118) & band & ~plants)
    boards = largest(ndi.binary_closing(boards, iterations=2), 2000)
    fascia = np.zeros(boards.shape, dtype=bool)
    column_bottom = np.full(width, -1)
    for x in range(width):
        column = np.where(boards[:, x])[0]
        if column.size:
            column_bottom[x] = int(column.max())
    for x in np.where(column_bottom >= 0)[0]:
        start = max(0, int(column_bottom[x]) - 11)
        fascia[start : int(column_bottom[x]) + 1, x] = True
    fascia = fascia & boards
    return boards & ~fascia, fascia


def timber_mask(rgb: np.ndarray) -> np.ndarray:
    height, width = rgb.shape[:2]
    light = luminance(rgb)
    sat = saturation(rgb)
    rows = np.arange(height)[:, None]
    red, green, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    plants = ((green > red + 6) & (green > blue + 8)) | (rows > height * 0.78)
    warm = (red > blue + 14) & (light > 45) & (light < 165) & (sat > 0.10) & ~plants
    sample = warm & (rows > height * 0.22) & (rows < height * 0.62)
    median = median_color(rgb, sample)
    distance = chroma_distance(rgb, median)
    timber = (distance < 0.08) & warm & (rows > height * 0.06) & (rows < height * 0.74)
    timber = ndi.binary_closing(timber, structure=np.ones((7, 5), dtype=bool))
    timber = timber & ~plants & (rows < height * 0.76)
    return keep_large(timber, 200)


def addition_mask(rgb: np.ndarray) -> np.ndarray:
    height, width = rgb.shape[:2]
    light = luminance(rgb)
    sat = saturation(rgb)
    sky = sky_mask(rgb)
    rows = np.arange(height)[:, None]
    cols = np.arange(width)[None, :]
    red, green, _blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    brick = (red > green + 12) & (sat > 0.12) & (light < 150)
    sample = (cols > width * 0.60) & (cols < width * 0.82) & (rows > height * 0.42) & (rows < height * 0.70)
    sample = sample & (light > 150) & (light < 210) & ~brick & ~sky
    median = median_color(rgb, sample)
    distance = chroma_distance(rgb, median)
    wall_light = float(np.median(light[sample])) if int(sample.sum()) > 50 else 170.0
    ground = rows > int(height * 0.80)
    too_bright = light > wall_light + 28
    windows = keep_large((light < wall_light - 50) & (distance > 0.04) & ~brick, 80)
    windows = ndi.binary_dilation(windows, iterations=1)
    field = (distance < 0.055) & (light > wall_light - 45) & (light < wall_light + 22)
    field = field & ~sky & ~brick & ~ground & ~too_bright & ~windows
    field = ndi.binary_closing(field, iterations=5)
    field = largest(field & ~sky & ~brick & ~ground & ~too_bright & ~windows, 2000)
    filled = ndi.binary_fill_holes(field)
    gaps = filled & ~field & (light > wall_light - 40) & (light < wall_light + 18) & ~brick & ~sky
    return (field | gaps) & ~sky & ~brick & ~ground & ~windows


def framing_mask(rgb: np.ndarray, open_rgb: np.ndarray | None = None) -> np.ndarray:
    height, width = rgb.shape[:2]
    light = luminance(rgb)
    sky = sky_mask(rgb)
    rows = np.arange(height)[:, None]
    cols = np.arange(width)[None, :]
    red, green, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    # The foreground under the sill is dirt, the same hue as the lumber. Keep it out.
    dirt = rows > height * 0.70
    warm = (red > blue + 8) & (light > 75) & (light < 215) & ~sky & ~dirt
    sample = warm & (rows > height * 0.30) & (rows < height * 0.58) & (cols > width * 0.35) & (cols < width * 0.70)
    median = median_color(rgb, sample)
    distance = chroma_distance(rgb, median)
    brick = (red > green + 8) & (light < 120) & (cols < width * 0.28) & (distance > 0.05)
    lumber = (distance < 0.065) & warm & ~brick
    lumber = ndi.binary_dilation(lumber, iterations=1) & (distance < 0.095) & warm & ~brick
    # Close along studs and along plates without bridging the open bays.
    lumber = ndi.binary_closing(lumber, structure=np.ones((11, 3), dtype=bool))
    lumber = ndi.binary_closing(lumber, structure=np.ones((3, 9), dtype=bool))
    if open_rgb is not None:
        # Sheathing is the part of the wall that is not in the open-stud plate.
        added = np.abs(rgb - open_rgb).mean(axis=2) > 16
        added = ndi.binary_closing(added, iterations=2)
        added = keep_large(added, 200) & ~dirt & ~sky
        lumber = lumber | added
    lumber = lumber & ~sky & ~brick & ~dirt
    return keep_large(lumber, 180)


def remodel_masks(beam_name: str, stair: str, cache: dict[str, np.ndarray]) -> np.ndarray:
    flush = cache["flush-metal"]
    dropped = cache["dropped-metal"]
    changed = np.abs(dropped - flush).mean(axis=2) > 14
    changed = keep_large(changed, 80)
    beam = ndi.binary_closing(changed, iterations=2)
    height = beam.shape[0]
    beam[int(height * 0.34) :] = False
    # Keep the rows that actually hold the beam, not the whole ceiling.
    row_frac = beam.mean(axis=1)
    if row_frac.max() > 0:
        strong = row_frac > max(0.08, row_frac.max() * 0.45)
        beam = beam & strong[:, None]
        beam = ndi.binary_dilation(beam, iterations=2)
        beam = ndi.binary_closing(beam, structure=np.ones((3, 31), dtype=bool))
        beam[int(height * 0.36) :] = False
    beam = keep_large(beam, 150)
    finish = beam
    if stair == "wood":
        wood = cache["flush-wood"]
        metal = cache["flush-metal"]
        rail = np.abs(wood - metal).mean(axis=2) > 16
        rail = keep_large(rail, 40)
        rail = ndi.binary_closing(rail, iterations=2)
        rail[:, : int(rail.shape[1] * 0.55)] = False
        rail[: int(rail.shape[0] * 0.12)] = False
        finish = finish | rail
    return finish


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    stats: list[str] = []

    for path in sorted(SRC.glob("scene-siding-*.png")):
        stem = path.stem.removeprefix("scene-")
        rgb = load(path.name)
        field, trim = siding_masks(rgb)
        save_mask(OUT / f"{stem}-field.png", field)
        save_mask(OUT / f"{stem}-trim.png", trim)
        stats.append(f"{stem:32} field {coverage(field):5.1f}%  trim {coverage(trim):5.1f}%")

    references: dict[str, tuple[np.ndarray, np.ndarray]] = {}
    for layout in ("straight", "picture"):
        references[layout] = deck_masks(load(f"scene-deck-{layout}-cedar.png"))

    cedar = load("scene-deck-straight-cedar.png")
    for kind, threshold, bridge in (("wood", 24, 7), ("metal", 24, 5), ("glass", 16, 8)):
        rail = load(f"scene-deck-rail-{kind}.png")
        changed = np.abs(rail - cedar).mean(axis=2) > threshold
        changed = keep_large(changed, 70)
        solid = ndi.binary_closing(changed, iterations=bridge)
        height = solid.shape[0]
        solid[int(height * 0.80) :] = False
        solid[: int(height * 0.10)] = False
        # Drop broad areas that are really the house or the deck boards.
        light = luminance(rail)
        solid = solid & (light < 165)
        solid = keep_large(solid, 500)
        save_mask(OUT / f"deck-rail-{kind}.png", solid)
        stats.append(f"deck-rail-{kind:24} {coverage(solid):5.1f}%")

    for path in sorted(SRC.glob("scene-deck-*.png")):
        if "rail" in path.name:
            continue
        stem = path.stem.removeprefix("scene-")
        layout = stem.split("-")[1]
        rgb = load(path.name)
        boards, fascia = deck_masks(rgb)
        if coverage(boards) < 6:
            boards, fascia = references[layout]
        light = luminance(rgb)
        rail_zone = np.zeros(light.shape, dtype=bool)
        for kind in ("wood", "metal"):
            zone = np.asarray(Image.open(OUT / f"deck-rail-{kind}.png").split()[-1]) > 128
            rail_zone |= zone
        cable = rail_zone & (light < 120) & ~ndi.binary_dilation(boards, iterations=2)
        cable = ndi.binary_dilation(keep_large(cable, 15), iterations=1)
        save_mask(OUT / f"{stem}-boards.png", boards)
        save_mask(OUT / f"{stem}-fascia.png", fascia)
        save_mask(OUT / f"{stem}-cable.png", cable)
        stats.append(
            f"{stem:32} boards {coverage(boards):5.1f}%  fascia {coverage(fascia):5.1f}%  cable {coverage(cable):5.1f}%"
        )

    for path in sorted(SRC.glob("scene-outdoor-*.png")):
        stem = path.stem.removeprefix("scene-")
        timber = timber_mask(load(path.name))
        save_mask(OUT / f"{stem}-timber.png", timber)
        stats.append(f"{stem:32} timber {coverage(timber):5.1f}%")

    cache = {
        "flush-metal": load("scene-remodel-flush-metal.png"),
        "dropped-metal": load("scene-remodel-dropped-metal.png"),
        "flush-wood": load("scene-remodel-flush-wood.png"),
    }
    for beam_name in ("flush", "dropped"):
        for stair in ("wood", "metal"):
            stem = f"remodel-{beam_name}-{stair}"
            finish = remodel_masks(beam_name, stair, cache)
            save_mask(OUT / f"{stem}-finish.png", finish)
            stats.append(f"{stem:32} finish {coverage(finish):5.1f}%")

    for path in sorted(SRC.glob("scene-addition-*.png")):
        stem = path.stem.removeprefix("scene-")
        field = addition_mask(load(path.name))
        save_mask(OUT / f"{stem}-field.png", field)
        stats.append(f"{stem:32} field {coverage(field):5.1f}%")

    for path in sorted(SRC.glob("scene-framing-*.png")):
        stem = path.stem.removeprefix("scene-")
        open_rgb = None
        if stem.endswith("-sheathed"):
            open_rgb = load(path.name.replace("-sheathed.png", "-open.png"))
        lumber = framing_mask(load(path.name), open_rgb)
        save_mask(OUT / f"{stem}-lumber.png", lumber)
        stats.append(f"{stem:32} lumber {coverage(lumber):5.1f}%")

    print("\n".join(stats))


if __name__ == "__main__":
    main()
