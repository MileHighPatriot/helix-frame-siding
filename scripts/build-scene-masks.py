"""Build a solid alpha mask for every design scene.

Each mask is the real surface for that photo: wall, boards, members, or trim.
Openings, sky, plants, brick, and the ground stay out. Grooves inside a
surface are filled so a color covers the whole board or course.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "media"
OUT = SRC / "masks"

WIDTH = 1280
HEIGHT = 720


def load(name: str) -> np.ndarray:
    return np.asarray(Image.open(SRC / name).convert("RGB"))


def luminance(rgb: np.ndarray) -> np.ndarray:
    return 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]


def saturation(rgb: np.ndarray) -> np.ndarray:
    peak = rgb.max(axis=2)
    floor = rgb.min(axis=2)
    return (peak - floor) / np.maximum(peak, 1)


def blank() -> np.ndarray:
    return np.zeros((HEIGHT, WIDTH), dtype=bool)


def raster(shapes: list[list[tuple[int, int]]]) -> np.ndarray:
    mask = blank()
    image = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(image)
    for shape in shapes:
        if len(shape) == 4 and all(isinstance(point, tuple) for point in shape):
            draw.polygon(shape, fill=1)
        else:
            draw.polygon(shape, fill=1)
    return np.asarray(image, dtype=bool)


def rect(x0: int, y0: int, x1: int, y1: int) -> list[tuple[int, int]]:
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]


def band(start: tuple[int, int], end: tuple[int, int], width: float, outward: int) -> list[tuple[int, int]]:
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    length = max((dx * dx + dy * dy) ** 0.5, 1)
    if outward < 0:
        nx, ny = -dy / length, dx / length
    else:
        nx, ny = dy / length, -dx / length
    ox, oy = nx * width, ny * width
    return [
        start,
        end,
        (int(end[0] + ox), int(end[1] + oy)),
        (int(start[0] + ox), int(start[1] + oy)),
    ]


def dilate(mask: np.ndarray, pixels: int) -> np.ndarray:
    if pixels <= 0:
        return mask
    return ndi.binary_dilation(mask, iterations=pixels)


def erode(mask: np.ndarray, pixels: int) -> np.ndarray:
    if pixels <= 0:
        return mask
    return ndi.binary_erosion(mask, iterations=pixels)


def keep_large(mask: np.ndarray, min_size: int) -> np.ndarray:
    labels, _count = ndi.label(mask)
    if labels.max() == 0:
        return blank()
    sizes = np.bincount(labels.ravel())
    keep = sizes >= min_size
    keep[0] = False
    return keep[labels]


def fill_small_holes(mask: np.ndarray, max_hole: int) -> np.ndarray:
    holes = ~mask
    labels, count = ndi.label(holes)
    if count == 0:
        return mask
    sizes = np.bincount(labels.ravel())
    edge = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    drop = sizes <= max_hole
    drop[0] = False
    drop[edge] = False
    return mask | drop[labels]


def vegetation(rgb: np.ndarray) -> np.ndarray:
    red, green, blue = rgb[:, :, 0].astype(int), rgb[:, :, 1].astype(int), rgb[:, :, 2].astype(int)
    return (green > red + 12) & (green > blue + 8)


def cut_dark(rgb: np.ndarray, region: np.ndarray, limit: int = 68, min_size: int = 180, pad: int = 3) -> np.ndarray:
    dark = region & (luminance(rgb) < limit)
    openings = keep_large(dark, min_size)
    return region & ~dilate(openings, pad)


def grow_surface(region: np.ndarray, rgb: np.ndarray) -> np.ndarray:
    """Fill lap grooves and board gaps that sit inside the surface, not windows."""
    planted = dilate(vegetation(rgb), 1)
    opened = cut_dark(rgb, region & ~planted)
    return fill_small_holes(opened, 2200) & ~planted


def feather(mask: np.ndarray) -> np.ndarray:
    core = erode(mask, 1)
    alpha = np.zeros(mask.shape, dtype=np.uint8)
    alpha[mask] = 170
    alpha[core] = 255
    return alpha


def save_mask(path: Path, mask: np.ndarray) -> None:
    alpha = feather(mask)
    rgba = np.zeros((HEIGHT, WIDTH, 4), dtype=np.uint8)
    rgba[:, :, 0] = 255
    rgba[:, :, 1] = 255
    rgba[:, :, 2] = 255
    rgba[:, :, 3] = alpha
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(path)


def coverage(mask: np.ndarray) -> float:
    return float(mask.mean() * 100)


# The siding house is one camera. Every profile and gable variant shares it.
GABLE_PEAK = (648, 96)
GABLE_LEFT = (324, 230)
GABLE_RIGHT = (988, 230)
SIDING_WALL = rect(128, 322, 1216, 596)
SIDING_WINDOWS = [
    rect(310, 326, 384, 486),
    rect(388, 326, 462, 486),
    rect(734, 326, 812, 486),
    rect(816, 326, 888, 486),
]
SIDING_DOOR = rect(1030, 368, 1130, 598)
SIDING_CORNERS = [rect(108, 322, 152, 596), rect(1170, 322, 1238, 596)]
SIDING_FASCIA = rect(120, 274, 1230, 320)


def siding_parts(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    gable = raster([[GABLE_PEAK, GABLE_LEFT, GABLE_RIGHT]])
    wall = raster([SIDING_WALL])
    windows = raster(SIDING_WINDOWS)
    door = raster([SIDING_DOOR])
    openings = dilate(windows | door, 2)
    casing = dilate(windows | door, 16) & ~openings & wall
    corners = raster(SIDING_CORNERS) & wall
    fascia_box = raster([SIDING_FASCIA])
    light = luminance(rgb)
    sat = saturation(rgb)
    fascia = fascia_box & (light > 145) & (sat < 0.2) & ~vegetation(rgb)
    left_rake = raster([band(GABLE_PEAK, GABLE_LEFT, 36, -1)])
    right_rake = raster([band(GABLE_PEAK, GABLE_RIGHT, 36, 1)])
    rake = (left_rake | right_rake) & ~gable & (light > 120) & (light < 230)
    trim = (casing | corners | fascia | rake) & ~openings & ~vegetation(rgb)
    field = grow_surface((gable | wall) & ~openings & ~trim, rgb)
    trim = trim & ~field
    return field, trim


# Deck camera. The walking surface is one trapezoid on every board and layout.
DECK_BOARDS = [(340, 348), (980, 344), (1136, 548), (150, 550)]
DECK_POSTS = [
    rect(424, 300, 460, 552),
    rect(638, 300, 676, 552),
    rect(828, 300, 872, 552),
]
DECK_FASCIA = rect(146, 552, 1140, 584)
DECK_RAIL = [(340, 292), (1000, 288), (1060, 430), (270, 434)]


def thin_dark(light: np.ndarray, zone: np.ndarray, level: float = 12) -> np.ndarray:
    """Dark wires, balusters, and rails. Flat shade and the view through them drop out."""
    vertical = ndi.grey_closing(light, size=(1, 13)) - light
    horizontal = ndi.grey_closing(light, size=(13, 1)) - light
    members = zone & ((vertical > level) | (horizontal > level)) & (light < 185)
    thick = ndi.binary_opening(members, structure=np.ones((8, 8), dtype=bool))
    members = members & ~thick
    return dilate(members, 1) & zone


def deck_parts(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    boards = raster([DECK_BOARDS])
    posts = raster(DECK_POSTS)
    fascia = raster([DECK_FASCIA])
    boards = grow_surface(boards & ~posts & ~fascia, rgb)
    fascia = fascia & ~vegetation(rgb) & (luminance(rgb) > 110)
    rail = raster([DECK_RAIL]) & ~boards
    red = rgb[:, :, 0].astype(int)
    green = rgb[:, :, 1].astype(int)
    cables = thin_dark(luminance(rgb), rail, 18)
    cables = cables & ~dilate(posts, 1) & ~boards & ~fascia & (red < green + 8)
    return boards, fascia, cables


def rail_members(variant: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    zone = (raster([DECK_RAIL]) | raster(DECK_POSTS)) & ~raster([DECK_BOARDS])
    members = thin_dark(luminance(variant), zone, 14)
    members = members & ~vegetation(variant)
    return members, zone


# One seed on the new siding. The box keeps the old house, the sky, and the yard out.
ADDITION_BOX = {
    "one": (460, 170, 1140, 620),
    "two": (440, 100, 1180, 640),
}

def addition_field(rgb: np.ndarray, stories: str) -> np.ndarray:
    x0, y0, x1, y1 = ADDITION_BOX[stories]
    region = blank()
    region[y0:y1, x0:x1] = True
    light = luminance(rgb)
    red = rgb[:, :, 0].astype(int)
    green = rgb[:, :, 1].astype(int)
    brick = (red > green + 22) & (light < 150)
    candidate = region & (light > 96) & (light < 228) & ~brick
    closed = ndi.binary_closing(candidate, structure=np.ones((17, 1), dtype=bool))
    wall = blank()
    for x in range(x0, x1):
        ys = np.where(closed[:, x])[0]
        if ys.size < 20:
            continue
        start = int(ys[0])
        prev = int(ys[0])
        best = (0, 0, 0)
        for y in list(ys[1:]) + [10**9]:
            if y > prev + 2:
                if prev - start > best[2]:
                    best = (start, prev, prev - start)
                start = int(y)
            prev = int(y)
        if best[2] > 50:
            wall[best[0] : best[1] + 1, x] = True
    wall = ndi.binary_dilation(wall, structure=np.ones((1, 201), dtype=bool))
    wall = wall & region & (light < 228) & ~brick
    core = ndi.binary_erosion(wall, iterations=4)
    labels, _count = ndi.label(core)
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    if sizes.max():
        wall = ndi.binary_dilation(labels == int(sizes.argmax()), iterations=4) & region & ~brick
    rows = np.arange(HEIGHT)[:, None]
    roof = (light < 110) & (rows < y0 + 150)
    ground = rows > y1 - 36
    dark = dilate(keep_large(region & (light < 80), 70), 1)
    return wall & ~dark & ~roof & ~ground & ~vegetation(rgb)


def framing_lumber(rgb: np.ndarray, open_rgb: np.ndarray | None) -> np.ndarray:
    light = luminance(rgb)
    lumber = blank()
    # Studs sit on a regular layout. Skip a bay that is open sky.
    for center in range(302, 1120, 54):
        if light[200:460, center].mean() > 185:
            continue
        lumber[168:500, center - 6 : center + 7] = True
    lumber[150:178, 280:1100] = True
    lumber[470:505, 280:1120] = True
    lumber[145:175, 480:980] = True
    if open_rgb is not None:
        added = np.abs(rgb.astype(int) - open_rgb.astype(int)).mean(axis=2) > 22
        panels = ndi.binary_closing(added, iterations=2)
        panels[:145] = False
        panels[530:] = False
        panels[:, :250] = False
        panels = keep_large(panels, 400)
        opening = keep_large((light < 80) & panels, 500)
        lumber = lumber | (panels & ~dilate(opening, 2))
    lumber[545:] = False
    return lumber & ~vegetation(rgb)


def outdoor_timber(rgb: np.ndarray) -> np.ndarray:
    """Posts, beams, and rafters. Brick, windows, roof planes, and the patio stay out."""
    red = rgb[:, :, 0].astype(int)
    green = rgb[:, :, 1].astype(int)
    blue = rgb[:, :, 2].astype(int)
    wood = (red > 150) & (green > 110) & (blue > 70) & (red > blue + 28)
    wood[530:] = False
    wood[:90] = False
    fraction = wood[160:500].mean(axis=0)
    columns = fraction > 0.45
    labels, _count = ndi.label(columns)
    members = blank()
    post_span: list[tuple[int, int]] = []
    for label in range(1, int(labels.max()) + 1):
        xs = np.where(labels == label)[0]
        if xs.size < 10 or xs.size > 48:
            continue
        left, right = int(xs.min()), int(xs.max())
        if not 250 <= (left + right) // 2 <= 1050:
            continue
        members[150:505, left - 1 : right + 2] = True
        post_span.append((left, right))
    if post_span:
        left = min(span[0] for span in post_span)
        right = max(span[1] for span in post_span)
        members[90:210, left:right] |= wood[90:210, left:right]
    members[510:] = False
    return members & ~vegetation(rgb)


def remodel_finish(beam: str, stair: str, cache: dict[str, np.ndarray]) -> np.ndarray:
    flush = cache["flush-metal"]
    dropped = cache["dropped-metal"]
    changed = np.abs(dropped.astype(int) - flush.astype(int)).mean(axis=2) > 16
    changed = keep_large(changed, 80)
    beam_mask = ndi.binary_closing(changed, iterations=2)
    beam_mask[int(HEIGHT * 0.28) :] = False
    row_frac = beam_mask.mean(axis=1)
    if row_frac.max() > 0:
        strong = row_frac > max(0.05, float(row_frac.max()) * 0.4)
        beam_mask = beam_mask & strong[:, None]
        beam_mask = dilate(beam_mask, 2)
        beam_mask = ndi.binary_closing(beam_mask, structure=np.ones((5, 21), dtype=bool))
        beam_mask[int(HEIGHT * 0.30) :] = False
    if beam == "dropped":
        beam_mask = dilate(beam_mask, 6)
        beam_mask[int(HEIGHT * 0.36) :] = False
    finish = keep_large(beam_mask, 150)
    if stair == "wood":
        rail = np.abs(cache["flush-wood"].astype(int) - cache["flush-metal"].astype(int)).mean(axis=2) > 18
        rail = keep_large(rail, 30)
        rail[:, : int(WIDTH * 0.58)] = False
        rail[: int(HEIGHT * 0.18)] = False
        rail = ndi.binary_closing(rail, structure=np.ones((7, 3), dtype=bool))
        finish = finish | rail
    return finish & ~vegetation(cache["flush-wood"])


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    stats: list[str] = []

    for path in sorted(SRC.glob("scene-siding-*.png")):
        stem = path.stem.removeprefix("scene-")
        field, trim = siding_parts(load(path.name))
        save_mask(OUT / f"{stem}-field.png", field)
        save_mask(OUT / f"{stem}-trim.png", trim)
        stats.append(f"{stem:32} field {coverage(field):5.1f}%  trim {coverage(trim):5.1f}%")

    for kind in ("wood", "metal", "glass"):
        members, zone = rail_members(load(f"scene-deck-rail-{kind}.png"))
        save_mask(OUT / f"deck-rail-{kind}.png", members)
        save_mask(OUT / f"deck-rail-{kind}-zone.png", zone)
        stats.append(f"deck-rail-{kind:24} members {coverage(members):5.1f}%  zone {coverage(zone):5.1f}%")

    for path in sorted(SRC.glob("scene-deck-*.png")):
        if "rail" in path.name:
            continue
        stem = path.stem.removeprefix("scene-")
        boards, fascia, cables = deck_parts(load(path.name))
        save_mask(OUT / f"{stem}-boards.png", boards)
        save_mask(OUT / f"{stem}-fascia.png", fascia)
        save_mask(OUT / f"{stem}-cable.png", cables)
        stats.append(
            f"{stem:32} boards {coverage(boards):5.1f}%  fascia {coverage(fascia):5.1f}%  cable {coverage(cables):5.1f}%"
        )

    for path in sorted(SRC.glob("scene-outdoor-*.png")):
        stem = path.stem.removeprefix("scene-")
        timber = outdoor_timber(load(path.name))
        save_mask(OUT / f"{stem}-timber.png", timber)
        stats.append(f"{stem:32} timber {coverage(timber):5.1f}%")

    cache = {
        "flush-metal": load("scene-remodel-flush-metal.png"),
        "dropped-metal": load("scene-remodel-dropped-metal.png"),
        "flush-wood": load("scene-remodel-flush-wood.png"),
    }
    for beam in ("flush", "dropped"):
        for stair in ("wood", "metal"):
            stem = f"remodel-{beam}-{stair}"
            finish = remodel_finish(beam, stair, cache)
            save_mask(OUT / f"{stem}-finish.png", finish)
            stats.append(f"{stem:32} finish {coverage(finish):5.1f}%")

    for path in sorted(SRC.glob("scene-addition-*.png")):
        stem = path.stem.removeprefix("scene-")
        stories = "two" if "-two-" in stem else "one"
        field = addition_field(load(path.name), stories)
        save_mask(OUT / f"{stem}-field.png", field)
        stats.append(f"{stem:32} field {coverage(field):5.1f}%")

    for path in sorted(SRC.glob("scene-framing-*.png")):
        stem = path.stem.removeprefix("scene-")
        open_rgb = None
        if stem.endswith("-sheathed"):
            open_rgb = load(path.name.replace("-sheathed.png", "-open.png"))
        lumber = framing_lumber(load(path.name), open_rgb)
        save_mask(OUT / f"{stem}-lumber.png", lumber)
        stats.append(f"{stem:32} lumber {coverage(lumber):5.1f}%")

    print("\n".join(stats))


if __name__ == "__main__":
    main()
