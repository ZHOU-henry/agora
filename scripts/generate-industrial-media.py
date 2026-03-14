from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "apps" / "web" / "public" / "media"

WIDTH = 960
HEIGHT = 540


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    ]

    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)

    return ImageFont.load_default()


FONT_TITLE = load_font(26, bold=True)
FONT_BODY = load_font(16)
FONT_META = load_font(13, bold=True)
FONT_TINY = load_font(12)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def wrap_lines(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont | ImageFont.ImageFont,
    max_width: int,
) -> list[str]:
    words = text.split()
    if not words:
        return [""]

    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = f"{current} {word}"
        width = draw.textbbox((0, 0), candidate, font=font)[2]
        if width <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def rounded_box(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill, outline, radius=22, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_gradient(image: Image.Image):
    draw = ImageDraw.Draw(image)
    top = (12, 25, 39)
    bottom = (7, 13, 19)
    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        color = tuple(int(lerp(top[i], bottom[i], t)) for i in range(3))
        draw.line((0, y, WIDTH, y), fill=color)


def draw_factory_floor(draw: ImageDraw.ImageDraw):
    draw.rectangle((0, 320, WIDTH, HEIGHT), fill=(17, 25, 33))
    for x in range(60, WIDTH, 120):
        draw.line((x, 330, x, HEIGHT), fill=(33, 45, 57), width=1)
    for y in range(350, HEIGHT, 48):
        draw.line((0, y, WIDTH, y), fill=(33, 45, 57), width=1)

    rounded_box(
        draw,
        (36, 36, 350, 160),
        fill=(11, 22, 30),
        outline=(58, 110, 128),
        radius=26,
        width=2,
    )
    rounded_box(
        draw,
        (650, 46, 920, 170),
        fill=(11, 22, 30),
        outline=(69, 122, 143),
        radius=26,
        width=2,
    )

    draw.text((58, 56), "INDUSTRIAL QA CELL", fill=(209, 234, 245), font=FONT_TITLE)
    draw.text(
        (58, 92),
        "Robot arm + camera + vision agent + reject gate",
        fill=(139, 191, 210),
        font=FONT_BODY,
    )
    draw.text(
        (58, 118),
        "traditional manufacturing deployment loop",
        fill=(108, 154, 172),
        font=FONT_TINY,
    )

    steps = [
        ("CAMERA", (678, 66, 742, 98), (80, 151, 178)),
        ("VISION AGENT", (752, 66, 850, 98), (52, 190, 152)),
        ("PLC / ROBOT", (678, 110, 780, 142), (224, 151, 70)),
        ("QA CONSOLE", (790, 110, 896, 142), (161, 115, 229)),
    ]

    for label, box, accent in steps:
        rounded_box(draw, box, fill=(16, 30, 41), outline=accent, radius=16, width=2)
        tw = draw.textbbox((0, 0), label, font=FONT_META)[2]
        draw.text((box[0] + (box[2] - box[0] - tw) / 2, box[1] + 8), label, fill=(224, 236, 242), font=FONT_META)

    draw.line((742, 82, 752, 82), fill=(103, 170, 194), width=3)
    draw.line((780, 126, 790, 126), fill=(103, 170, 194), width=3)


def draw_conveyor(draw: ImageDraw.ImageDraw):
    rounded_box(
        draw,
        (120, 360, 760, 420),
        fill=(58, 71, 86),
        outline=(103, 119, 134),
        radius=28,
        width=3,
    )
    draw.rectangle((120, 388, 760, 392), fill=(123, 138, 154))
    for x in range(132, 758, 44):
        draw.line((x, 366, x, 414), fill=(80, 92, 105), width=4)
    draw.rectangle((102, 356, 120, 424), fill=(46, 57, 69))
    draw.rectangle((760, 356, 778, 424), fill=(46, 57, 69))
    draw.text((258, 430), "inspection conveyor", fill=(120, 150, 166), font=FONT_TINY)


def draw_bins(draw: ImageDraw.ImageDraw):
    rounded_box(draw, (800, 318, 900, 402), fill=(37, 53, 61), outline=(160, 176, 185), radius=22, width=2)
    rounded_box(draw, (800, 410, 900, 494), fill=(52, 34, 39), outline=(222, 92, 108), radius=22, width=2)
    draw.text((828, 344), "OK BIN", fill=(190, 220, 201), font=FONT_META)
    draw.text((820, 436), "REJECT", fill=(241, 175, 183), font=FONT_META)


def draw_camera(draw: ImageDraw.ImageDraw, beam_phase: float):
    rounded_box(draw, (272, 200, 372, 262), fill=(22, 37, 49), outline=(108, 168, 191), radius=18, width=2)
    draw.ellipse((292, 214, 352, 250), fill=(18, 74, 102), outline=(159, 218, 238), width=3)
    draw.text((286, 266), "overhead camera", fill=(137, 193, 213), font=FONT_TINY)

    beam_alpha = int(70 + 120 * beam_phase)
    beam = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(beam)
    bdraw.polygon(
        [(300, 260), (344, 260), (404, 390), (240, 390)],
        fill=(61, 190, 233, beam_alpha),
        outline=(114, 218, 244, min(255, beam_alpha + 40)),
    )
    return beam


def draw_part(draw: ImageDraw.ImageDraw, x: float, defect: bool, scanned: bool):
    y = 372
    top = int(y - 26)
    left = int(x - 26)
    right = int(x + 26)
    bottom = int(y + 10)

    fill = (198, 206, 214)
    outline = (93, 106, 118)
    rounded_box(draw, (left, top, right, bottom), fill=fill, outline=outline, radius=10, width=2)
    draw.rectangle((left + 10, top - 8, right - 10, top + 4), fill=(221, 226, 230))

    if defect:
        draw.ellipse((left + 28, top + 6, left + 42, top + 20), fill=(208, 58, 71))
    if scanned:
        draw.rectangle((left - 6, top - 6, right + 6, bottom + 6), outline=(85, 226, 180), width=3)


def draw_robot_arm(draw: ImageDraw.ImageDraw, progress: float):
    base = (670, 360)
    draw.rounded_rectangle((626, 360, 714, 430), radius=18, fill=(39, 49, 61), outline=(123, 137, 153), width=2)
    draw.rectangle((650, 328, 690, 360), fill=(51, 63, 76))

    shoulder = (670, 326)

    start_elbow = (612, 266)
    end_elbow = (706, 248)
    elbow = (
        lerp(start_elbow[0], end_elbow[0], progress),
        lerp(start_elbow[1], end_elbow[1], progress),
    )

    start_grip = (560, 330)
    end_grip = (824, 430)
    grip = (
        lerp(start_grip[0], end_grip[0], progress),
        lerp(start_grip[1], end_grip[1], progress),
    )

    draw.line((shoulder, elbow), fill=(247, 164, 72), width=18)
    draw.line((elbow, grip), fill=(238, 178, 92), width=16)
    draw.ellipse((shoulder[0] - 16, shoulder[1] - 16, shoulder[0] + 16, shoulder[1] + 16), fill=(58, 71, 86))
    draw.ellipse((int(elbow[0] - 14), int(elbow[1] - 14), int(elbow[0] + 14), int(elbow[1] + 14)), fill=(66, 79, 92))

    gx = int(grip[0])
    gy = int(grip[1])
    draw.line((gx - 10, gy - 2, gx - 22, gy + 18), fill=(224, 236, 241), width=4)
    draw.line((gx + 10, gy - 2, gx + 22, gy + 18), fill=(224, 236, 241), width=4)
    draw.text((594, 236), "robot reject arm", fill=(237, 197, 142), font=FONT_TINY)


def draw_status_panel(draw: ImageDraw.ImageDraw, defect_stage: bool, accepted_count: int, rejected_count: int):
    rounded_box(draw, (40, 182, 228, 310), fill=(13, 23, 31), outline=(80, 140, 161), radius=24, width=2)
    draw.text((58, 198), "CELL SIGNAL", fill=(206, 231, 240), font=FONT_META)
    rounded_box(draw, (58, 226, 140, 280), fill=(18, 39, 48), outline=(82, 154, 178), radius=18, width=2)
    draw.rectangle((70, 238, 128, 268), outline=(118, 220, 245), width=2)
    if defect_stage:
        draw.rectangle((90, 246, 118, 264), outline=(255, 115, 126), width=3)
    else:
        draw.rectangle((86, 244, 116, 264), outline=(109, 230, 181), width=3)

    draw.text((152, 230), "vision score", fill=(136, 184, 201), font=FONT_TINY)
    draw.text((152, 248), "0.97" if defect_stage else "0.14", fill=(235, 244, 248), font=FONT_BODY)
    draw.text((152, 272), "reject" if defect_stage else "pass", fill=(246, 176, 181) if defect_stage else (174, 233, 196), font=FONT_META)

    draw.text((58, 292), f"accepted  {accepted_count:02d}", fill=(162, 221, 184), font=FONT_TINY)
    draw.text((140, 292), f"rejected  {rejected_count:02d}", fill=(239, 153, 164), font=FONT_TINY)


def draw_static_map():
    image = Image.new("RGB", (1280, 720), (8, 15, 24))
    draw = ImageDraw.Draw(image)

    for y in range(720):
        t = y / 719
        color = tuple(
            int(lerp(a, b, t))
            for a, b in zip((12, 22, 36), (7, 11, 18))
        )
        draw.line((0, y, 1280, y), fill=color)

    title_font = load_font(34, bold=True)
    body_font = load_font(16)
    small_font = load_font(14, bold=True)

    draw.text((60, 52), "INDUSTRIAL AGENT DEPLOYMENT MAP", fill=(216, 235, 244), font=title_font)
    draw.text(
        (60, 96),
        "factory quality cell with camera input, edge inference, robot rejection, and QA traceability",
        fill=(142, 190, 208),
        font=body_font,
    )

    zones = [
        ("1. CAMERA ARRAY", (60, 170, 300, 390), (77, 157, 188), [
            "line cameras watch every part",
            "lighting is fixed for repeatability",
            "frames stream to local edge box",
        ]),
        ("2. EDGE VISION AGENT", (352, 170, 640, 390), (55, 191, 153), [
            "detects scratches / cracks / contour drift",
            "scores every unit in real time",
            "returns pass / review / reject policy",
        ]),
        ("3. PLC + ROBOT CELL", (698, 170, 980, 390), (236, 171, 87), [
            "robot arm ejects failed parts",
            "PLC keeps cycle timing stable",
            "line keeps running while QA closes loop",
        ]),
        ("4. QA CONSOLE", (1018, 170, 1220, 390), (161, 118, 227), [
            "operator sees defect snapshots",
            "trace log links image to shift and part",
            "reviewer confirms ambiguous cases",
        ]),
    ]

    for title, box, accent, lines in zones:
        rounded_box(draw, box, fill=(13, 23, 31), outline=accent, radius=26, width=3)
        draw.text((box[0] + 18, box[1] + 18), title, fill=(226, 238, 242), font=small_font)
        y = box[1] + 58
        for line in lines:
            wrapped = wrap_lines(draw, line, body_font, box[2] - box[0] - 34)
            for fragment in wrapped:
                draw.text((box[0] + 18, y), fragment, fill=(155, 190, 204), font=body_font)
                y += 28
            y += 10

    draw.line((300, 244, 352, 244), fill=(104, 171, 194), width=4)
    draw.line((640, 244, 698, 244), fill=(104, 171, 194), width=4)
    draw.line((980, 244, 1018, 244), fill=(104, 171, 194), width=4)

    floor_box = (80, 430, 1200, 680)
    rounded_box(draw, floor_box, fill=(16, 26, 34), outline=(58, 92, 110), radius=30, width=3)
    draw.text((110, 454), "SITE LAYOUT", fill=(205, 228, 239), font=small_font)

    draw.rectangle((160, 556, 760, 596), fill=(69, 82, 97), outline=(124, 137, 150), width=2)
    for x in range(180, 760, 56):
        draw.line((x, 558, x, 594), fill=(88, 104, 119), width=4)

    draw.rectangle((380, 484, 458, 528), fill=(23, 42, 54), outline=(112, 189, 216), width=3)
    draw.ellipse((398, 490, 442, 518), fill=(18, 78, 110), outline=(176, 230, 244), width=2)
    draw.text((346, 536), "camera rail", fill=(140, 191, 208), font=FONT_TINY)

    draw.rounded_rectangle((792, 510, 892, 602), radius=22, fill=(43, 55, 65), outline=(126, 140, 158), width=3)
    draw.line((842, 510, 812, 456), fill=(248, 170, 87), width=16)
    draw.line((812, 456, 760, 542), fill=(240, 190, 116), width=14)
    draw.text((742, 616), "reject robot", fill=(241, 201, 150), font=FONT_TINY)

    draw.rounded_rectangle((960, 508, 1084, 584), radius=18, fill=(17, 39, 49), outline=(89, 158, 181), width=3)
    draw.text((984, 522), "edge GPU", fill=(220, 235, 240), font=small_font)
    draw.text((978, 552), "vision agent", fill=(144, 198, 216), font=body_font)

    draw.rounded_rectangle((164, 466, 246, 528), radius=16, fill=(49, 33, 38), outline=(228, 108, 123), width=3)
    draw.text((180, 488), "reject bin", fill=(246, 194, 201), font=FONT_TINY)
    draw.rounded_rectangle((164, 608, 246, 670), radius=16, fill=(33, 49, 38), outline=(125, 201, 161), width=3)
    draw.text((186, 630), "ok bin", fill=(197, 240, 214), font=FONT_TINY)

    return image


def draw_builder_stack():
    image = Image.new("RGB", (1280, 720), (9, 15, 23))
    draw = ImageDraw.Draw(image)
    title_font = load_font(34, bold=True)
    body_font = load_font(16)
    small_font = load_font(14, bold=True)

    for y in range(720):
        t = y / 719
        color = tuple(
            int(lerp(a, b, t))
            for a, b in zip((10, 20, 30), (7, 10, 16))
        )
        draw.line((0, y, 1280, y), fill=color)

    draw.text((60, 48), "BUILDER-SIDE DEPLOYMENT STACK", fill=(222, 236, 242), font=title_font)
    draw.text(
        (60, 92),
        "what an industrial builder actually deploys beyond the agent card",
        fill=(141, 188, 205),
        font=body_font,
    )

    columns = [
        ("SITE INPUTS", (60, 164, 308, 620), (83, 154, 183), [
            "line cameras",
            "PLC tags",
            "SOP / defect taxonomy",
            "operator feedback",
        ]),
        ("AGENT CORE", (360, 164, 640, 620), (59, 194, 155), [
            "vision model adapter",
            "policy and scoring layer",
            "workflow orchestration",
            "trace and audit outputs",
        ]),
        ("FACTORY OUTPUTS", (692, 164, 964, 620), (240, 173, 95), [
            "robot reject command",
            "review queue",
            "shift summary",
            "quality trace log",
        ]),
        ("BUYER VALUE", (1010, 164, 1220, 620), (160, 119, 228), [
            "lower manual inspection load",
            "faster defect closure",
            "higher traceability",
            "clear pilot ROI story",
        ]),
    ]

    for title, box, accent, items in columns:
        rounded_box(draw, box, fill=(13, 22, 30), outline=accent, radius=28, width=3)
        draw.text((box[0] + 20, box[1] + 18), title, fill=(224, 238, 242), font=small_font)
        y = box[1] + 72
        for item in items:
            draw.ellipse((box[0] + 22, y + 6, box[0] + 34, y + 18), fill=accent)
            wrapped = wrap_lines(draw, item, body_font, box[2] - box[0] - 72)
            for index, fragment in enumerate(wrapped):
                draw.text((box[0] + 48, y + index * 24), fragment, fill=(155, 189, 203), font=body_font)
            y += max(58, len(wrapped) * 26 + 18)

    draw.line((308, 390, 360, 390), fill=(106, 170, 193), width=5)
    draw.line((640, 390, 692, 390), fill=(106, 170, 193), width=5)
    draw.line((964, 390, 1010, 390), fill=(106, 170, 193), width=5)

    draw.text((384, 598), "camera input -> agent reasoning -> robot action -> buyer outcome", fill=(136, 181, 197), font=FONT_TINY)
    return image


def draw_scene_frame(frame_index: int, total_frames: int = 16) -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 255))
    draw_gradient(image)
    base = ImageDraw.Draw(image)
    draw_factory_floor(base)
    draw_conveyor(base)
    draw_bins(base)

    cycle = frame_index / total_frames
    scan_intensity = 0.5 + 0.5 * math.sin(cycle * math.pi * 2)

    beam = draw_camera(base, scan_intensity)
    image.alpha_composite(beam)

    ok_x = 160 + (frame_index * 34) % 780
    defect_x = 250 + frame_index * 24
    defect_visible = defect_x < 780
    scanned = 332 <= defect_x <= 430
    defect_stage = 360 <= defect_x <= 620
    removal_progress = 0.0
    if 520 <= defect_x <= 700:
        removal_progress = (defect_x - 520) / 180
    elif defect_x > 700:
        removal_progress = 1.0

    draw_part(base, ok_x, defect=False, scanned=300 <= ok_x <= 400)
    if defect_visible and removal_progress < 0.95:
        draw_part(base, defect_x, defect=True, scanned=scanned)

    draw_robot_arm(base, removal_progress)

    accepted_count = 27 + frame_index // 4
    rejected_count = 1 + min(frame_index // 8, 3)
    draw_status_panel(base, defect_stage, accepted_count, rejected_count)

    footer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    fdraw = ImageDraw.Draw(footer)
    rounded_box(fdraw, (684, 194, 916, 288), fill=(12, 24, 32, 220), outline=(77, 136, 156), radius=24, width=2)
    fdraw.text((702, 212), "LIVE FACTORY LOOP", fill=(208, 229, 238), font=FONT_META)
    if defect_stage:
        fdraw.text((702, 238), "camera flags a scratch", fill=(247, 180, 188), font=FONT_BODY)
        fdraw.text((702, 260), "vision agent triggers reject arm", fill=(244, 219, 168), font=FONT_TINY)
    else:
        fdraw.text((702, 238), "parts stream through inspection", fill=(182, 226, 201), font=FONT_BODY)
        fdraw.text((702, 260), "agent writes trace log and shift stats", fill=(138, 188, 206), font=FONT_TINY)
    image.alpha_composite(footer)

    return image.convert("P", palette=Image.Palette.ADAPTIVE)


def draw_warehouse_frame(frame_index: int, total_frames: int = 18) -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 255))
    draw_gradient(image)
    draw = ImageDraw.Draw(image)

    draw.rectangle((0, 300, WIDTH, HEIGHT), fill=(18, 27, 34))
    for y in range(330, HEIGHT, 42):
        draw.line((0, y, WIDTH, y), fill=(31, 42, 52), width=1)

    rounded_box(draw, (34, 34, 354, 154), fill=(11, 22, 30), outline=(73, 144, 172), radius=24, width=2)
    draw.text((56, 56), "WAREHOUSE AUTOPICKER", fill=(214, 234, 242), font=FONT_TITLE)
    draw.text((56, 92), "AMR + tote lift + aisle picking + WMS loop", fill=(139, 191, 210), font=FONT_BODY)
    draw.text((56, 118), "warehouse deployment flow", fill=(108, 154, 172), font=FONT_TINY)

    rounded_box(draw, (646, 44, 920, 170), fill=(11, 22, 30), outline=(69, 122, 143), radius=26, width=2)
    steps = [
        ("WMS ORDER", (668, 66, 776, 100), (80, 151, 178)),
        ("AUTOPICKER", (784, 66, 900, 100), (52, 190, 152)),
        ("AISLE PICK", (668, 112, 778, 146), (236, 171, 87)),
        ("PACK STATION", (786, 112, 900, 146), (161, 115, 229)),
    ]
    for label, box, accent in steps:
        rounded_box(draw, box, fill=(16, 30, 41), outline=accent, radius=14, width=2)
        tw = draw.textbbox((0, 0), label, font=FONT_META)[2]
        draw.text((box[0] + (box[2] - box[0] - tw) / 2, box[1] + 8), label, fill=(225, 238, 242), font=FONT_META)

    aisle_left = 84
    aisle_right = 876
    rack_top = 176
    rack_bottom = 472

    for x in (92, 732):
        rounded_box(draw, (x, rack_top, x + 138, rack_bottom), fill=(17, 28, 36), outline=(77, 112, 129), radius=18, width=2)
        for shelf_y in range(rack_top + 38, rack_bottom, 68):
            draw.line((x + 12, shelf_y, x + 126, shelf_y), fill=(77, 93, 107), width=3)
            for tote_i in range(2):
                box_x = x + 18 + tote_i * 54
                rounded_box(draw, (box_x, shelf_y - 24, box_x + 42, shelf_y - 2), fill=(70, 99, 119), outline=(110, 154, 175), radius=8, width=2)

    draw.rectangle((246, 446, 706, 462), fill=(66, 81, 93), outline=(110, 127, 143), width=2)
    draw.text((368, 472), "autopicker aisle", fill=(132, 176, 194), font=FONT_TINY)

    progress = frame_index / (total_frames - 1)
    robot_x = int(280 + progress * 230)
    robot_y = 430
    selected_shelf_y = 292
    tote_pick_progress = 0.0
    if 0.3 < progress < 0.7:
        tote_pick_progress = min((progress - 0.3) / 0.22, 1.0)
    elif progress >= 0.7:
        tote_pick_progress = max(1.0 - (progress - 0.7) / 0.16, 0.0)

    rounded_box(draw, (robot_x - 64, robot_y - 34, robot_x + 74, robot_y + 20), fill=(44, 57, 69), outline=(136, 149, 162), radius=20, width=3)
    draw.rectangle((robot_x - 10, robot_y - 122, robot_x + 18, robot_y - 34), fill=(63, 80, 94))
    draw.rectangle((robot_x - 38, robot_y - 22, robot_x - 6, robot_y + 6), fill=(87, 115, 134))
    draw.rectangle((robot_x + 18, robot_y - 22, robot_x + 50, robot_y + 6), fill=(94, 137, 156))

    arm_anchor = (robot_x + 8, robot_y - 118)
    tote_origin = (162, selected_shelf_y - 12)
    tote_target = (robot_x + 34, robot_y - 12)
    moving_tote_x = int(lerp(tote_origin[0], tote_target[0], tote_pick_progress))
    moving_tote_y = int(lerp(tote_origin[1], tote_target[1], tote_pick_progress))

    if tote_pick_progress > 0.02:
        draw.line((arm_anchor[0], arm_anchor[1], moving_tote_x + 20, moving_tote_y + 10), fill=(93, 220, 176), width=5)
    if tote_pick_progress < 0.95:
        rounded_box(draw, (146, selected_shelf_y - 24, 188, selected_shelf_y - 2), fill=(92, 135, 158), outline=(126, 189, 212), radius=8, width=2)
    rounded_box(draw, (moving_tote_x, moving_tote_y, moving_tote_x + 42, moving_tote_y + 22), fill=(95, 139, 164), outline=(145, 205, 223), radius=8, width=2)

    rounded_box(draw, (808, 340, 920, 452), fill=(18, 30, 40), outline=(152, 121, 227), radius=20, width=2)
    draw.text((826, 358), "PACK", fill=(231, 220, 244), font=FONT_META)
    draw.text((826, 382), "station queue", fill=(155, 190, 205), font=FONT_BODY)
    pack_fill = min(max((progress - 0.62) / 0.25, 0.0), 1.0)
    rounded_box(draw, (826, 412, 900, 432), fill=(31, 50, 65), outline=(93, 138, 160), radius=10, width=2)
    draw.rounded_rectangle((828, 414, int(828 + 70 * pack_fill), 430), radius=8, fill=(113, 222, 176))

    rounded_box(draw, (34, 186, 232, 314), fill=(13, 23, 31), outline=(82, 141, 160), radius=22, width=2)
    draw.text((54, 202), "MISSION STATUS", fill=(209, 230, 239), font=FONT_META)
    draw.text((54, 234), f"aisle mission  A-{3 + frame_index % 4}", fill=(143, 191, 209), font=FONT_BODY)
    draw.text((54, 260), f"totes picked  {18 + frame_index // 3}", fill=(175, 233, 196), font=FONT_TINY)
    draw.text((54, 282), f"orders queued {4 + frame_index // 6}", fill=(239, 214, 159), font=FONT_TINY)

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    rounded_box(od, (620, 194, 900, 294), fill=(12, 25, 33, 220), outline=(84, 143, 162), radius=24, width=2)
    od.text((640, 214), "LIVE WAREHOUSE LOOP", fill=(206, 229, 238), font=FONT_META)
    if progress < 0.55:
      od.text((640, 242), "mobile picker moves into aisle", fill=(184, 223, 198), font=FONT_BODY)
      od.text((640, 264), "robotically retrieves tote from rack", fill=(145, 190, 207), font=FONT_TINY)
    else:
      od.text((640, 242), "order tote moves toward pack station", fill=(241, 209, 158), font=FONT_BODY)
      od.text((640, 264), "WMS closes the pick and queues packing", fill=(145, 190, 207), font=FONT_TINY)
    image.alpha_composite(overlay)

    return image.convert("P", palette=Image.Palette.ADAPTIVE)


def draw_warehouse_map():
    image = Image.new("RGB", (1280, 720), (8, 15, 24))
    draw = ImageDraw.Draw(image)
    for y in range(720):
        t = y / 719
        color = tuple(int(lerp(a, b, t)) for a, b in zip((11, 20, 32), (7, 11, 18)))
        draw.line((0, y, 1280, y), fill=color)

    title_font = load_font(34, bold=True)
    body_font = load_font(16)
    small_font = load_font(14, bold=True)

    draw.text((60, 48), "WAREHOUSE AI AGENT DEPLOYMENT MAP", fill=(220, 236, 242), font=title_font)
    draw.text((60, 92), "autopicker robot in aisle, tote retrieval, WMS missioning, and pack-station closure", fill=(142, 189, 206), font=body_font)

    cards = [
        ("1. WMS / MISSIONING", (60, 168, 314, 356), (79, 151, 183), [
            "orders create aisle pick missions",
            "robot gets tote and route assignment",
            "exceptions route back to operator",
        ]),
        ("2. AUTOPICKER ROBOT", (354, 168, 636, 356), (59, 194, 155), [
            "mobile robot navigates standard aisles",
            "retrieves storage totes",
            "builds order tote on-board",
        ]),
        ("3. PACK STATION", (676, 168, 938, 356), (238, 171, 92), [
            "finished order tote enters packing queue",
            "workers or downstream automation close order",
            "trace log connects tote to mission",
        ]),
        ("4. BUYER VALUE", (978, 168, 1220, 356), (161, 118, 228), [
            "lower picking labor",
            "faster replenishment",
            "less fixed infrastructure",
        ]),
    ]

    for title, box, accent, lines in cards:
        rounded_box(draw, box, fill=(13, 23, 31), outline=accent, radius=26, width=3)
        draw.text((box[0] + 18, box[1] + 18), title, fill=(226, 238, 242), font=small_font)
        y = box[1] + 58
        for line in lines:
            wrapped = wrap_lines(draw, line, body_font, box[2] - box[0] - 34)
            for fragment in wrapped:
                draw.text((box[0] + 18, y), fragment, fill=(155, 190, 204), font=body_font)
                y += 28
            y += 10

    draw.line((314, 260, 354, 260), fill=(109, 173, 194), width=4)
    draw.line((636, 260, 676, 260), fill=(109, 173, 194), width=4)
    draw.line((938, 260, 978, 260), fill=(109, 173, 194), width=4)

    rounded_box(draw, (86, 416, 1194, 670), fill=(16, 26, 34), outline=(58, 92, 110), radius=30, width=3)
    draw.text((112, 440), "AISLE LAYOUT", fill=(205, 229, 239), font=small_font)

    for x in (170, 990):
        rounded_box(draw, (x, 474, x + 110, 638), fill=(18, 29, 37), outline=(82, 116, 132), radius=18, width=2)
        for shelf_y in range(510, 624, 40):
            draw.line((x + 10, shelf_y, x + 100, shelf_y), fill=(74, 92, 106), width=3)

    draw.rectangle((280, 552, 930, 572), fill=(67, 82, 97), outline=(120, 134, 148), width=2)
    robot_x = 598
    rounded_box(draw, (robot_x - 62, 520, robot_x + 62, 590), fill=(43, 57, 68), outline=(134, 149, 163), radius=22, width=3)
    draw.rectangle((robot_x - 8, 454, robot_x + 16, 520), fill=(63, 80, 94))
    draw.rectangle((robot_x - 36, 536, robot_x - 8, 566), fill=(87, 116, 136))
    draw.rectangle((robot_x + 18, 536, robot_x + 46, 566), fill=(98, 140, 159))
    draw.text((548, 610), "mobile autopicker", fill=(167, 228, 192), font=FONT_TINY)

    rounded_box(draw, (1042, 506, 1166, 582), fill=(18, 30, 40), outline=(153, 120, 225), radius=18, width=3)
    draw.text((1072, 520), "pack", fill=(226, 221, 242), font=small_font)
    draw.text((1060, 550), "queue station", fill=(149, 191, 209), font=body_font)

    return image


def draw_maintenance_frame(frame_index: int, total_frames: int = 18) -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 255))
    draw_gradient(image)
    draw = ImageDraw.Draw(image)

    draw.rectangle((0, 302, WIDTH, HEIGHT), fill=(17, 26, 33))
    for x in range(60, WIDTH, 110):
        draw.line((x, 302, x, HEIGHT), fill=(28, 42, 52), width=1)

    rounded_box(draw, (34, 34, 360, 154), fill=(11, 22, 30), outline=(73, 144, 172), radius=24, width=2)
    draw.text((56, 56), "INSPECTION ROBOT LOOP", fill=(214, 234, 242), font=FONT_TITLE)
    draw.text((56, 92), "patrol robot + thermal scan + maintenance agent", fill=(139, 191, 210), font=FONT_BODY)
    draw.text((56, 118), "predictive maintenance field scene", fill=(108, 154, 172), font=FONT_TINY)

    rounded_box(draw, (646, 44, 920, 170), fill=(11, 22, 30), outline=(69, 122, 143), radius=26, width=2)
    steps = [
        ("ROUTE", (668, 66, 750, 100), (80, 151, 178)),
        ("THERMAL", (760, 66, 850, 100), (236, 171, 87)),
        ("AGENT", (668, 112, 748, 146), (52, 190, 152)),
        ("WORK ORDER", (758, 112, 900, 146), (161, 115, 229)),
    ]
    for label, box, accent in steps:
        rounded_box(draw, box, fill=(16, 30, 41), outline=accent, radius=14, width=2)
        tw = draw.textbbox((0, 0), label, font=FONT_META)[2]
        draw.text((box[0] + (box[2] - box[0] - tw) / 2, box[1] + 8), label, fill=(225, 238, 242), font=FONT_META)

    # plant assets
    draw.rectangle((500, 312, 516, 478), fill=(59, 73, 85))
    draw.rectangle((534, 312, 550, 478), fill=(59, 73, 85))
    draw.line((508, 326, 542, 326), fill=(110, 129, 143), width=8)
    draw.line((508, 404, 542, 404), fill=(110, 129, 143), width=8)
    draw.ellipse((470, 360, 522, 412), fill=(61, 76, 89), outline=(129, 147, 159), width=3)
    draw.ellipse((528, 360, 580, 412), fill=(61, 76, 89), outline=(129, 147, 159), width=3)
    draw.text((468, 486), "pump skid", fill=(142, 188, 206), font=FONT_TINY)

    progress = frame_index / (total_frames - 1)
    rover_x = int(150 + progress * 250)
    rover_y = 430

    rounded_box(draw, (rover_x - 52, rover_y - 28, rover_x + 52, rover_y + 18), fill=(45, 57, 68), outline=(134, 149, 163), radius=18, width=3)
    draw.rectangle((rover_x - 4, rover_y - 90, rover_x + 14, rover_y - 28), fill=(66, 81, 94))
    draw.rectangle((rover_x - 24, rover_y - 108, rover_x + 34, rover_y - 90), fill=(22, 41, 53), outline=(117, 194, 220), width=3)
    draw.ellipse((rover_x - 10, rover_y - 104, rover_x + 20, rover_y - 86), fill=(23, 81, 109), outline=(180, 231, 244), width=2)
    draw.text((96, 474), "inspection rover", fill=(141, 189, 208), font=FONT_TINY)

    beam = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    bd = ImageDraw.Draw(beam)
    scan_target_x = int(490 + math.sin(progress * math.pi) * 50)
    bd.polygon(
        [(rover_x + 12, rover_y - 98), (rover_x + 32, rover_y - 98), (scan_target_x + 24, 380), (scan_target_x - 12, 380)],
        fill=(255, 130, 87, 90),
        outline=(255, 197, 154, 140),
    )
    image.alpha_composite(beam)

    hotspot = progress > 0.45
    if hotspot:
        draw.ellipse((498, 368, 548, 418), fill=(138, 44, 35), outline=(251, 117, 98), width=4)
        draw.ellipse((506, 376, 540, 410), fill=(224, 87, 57))
    else:
        draw.ellipse((498, 368, 548, 418), fill=(74, 88, 101), outline=(145, 157, 166), width=3)

    rounded_box(draw, (34, 184, 240, 320), fill=(12, 23, 31), outline=(80, 141, 160), radius=22, width=2)
    draw.text((54, 202), "ASSET HEALTH", fill=(208, 231, 239), font=FONT_META)
    draw.text((54, 232), f"temp     {'96C' if hotspot else '68C'}", fill=(246, 187, 163) if hotspot else (169, 230, 194), font=FONT_BODY)
    draw.text((54, 260), f"vibration {'high' if hotspot else 'stable'}", fill=(246, 187, 163) if hotspot else (169, 230, 194), font=FONT_BODY)
    draw.text((54, 288), f"agent    {'open work order' if hotspot else 'continue patrol'}", fill=(143, 190, 208), font=FONT_TINY)

    rounded_box(draw, (682, 334, 914, 458), fill=(12, 24, 32), outline=(92, 143, 163), radius=22, width=2)
    draw.text((702, 352), "MAINTENANCE AGENT", fill=(208, 231, 239), font=FONT_META)
    if hotspot:
        draw.text((702, 382), "bearing hotspot detected", fill=(248, 174, 164), font=FONT_BODY)
        draw.text((702, 406), "work order WO-218 opened", fill=(233, 219, 170), font=FONT_TINY)
        draw.text((702, 426), "route technician before failure", fill=(143, 190, 208), font=FONT_TINY)
    else:
        draw.text((702, 382), "robot continues patrol route", fill=(178, 226, 196), font=FONT_BODY)
        draw.text((702, 406), "no intervention required", fill=(143, 190, 208), font=FONT_TINY)

    return image.convert("P", palette=Image.Palette.ADAPTIVE)


def draw_maintenance_stack():
    image = Image.new("RGB", (1280, 720), (8, 15, 24))
    draw = ImageDraw.Draw(image)
    for y in range(720):
        t = y / 719
        color = tuple(int(lerp(a, b, t)) for a, b in zip((11, 20, 32), (7, 11, 18)))
        draw.line((0, y, 1280, y), fill=color)

    title_font = load_font(34, bold=True)
    body_font = load_font(16)
    small_font = load_font(14, bold=True)

    draw.text((60, 48), "MAINTENANCE AGENT DEPLOYMENT STACK", fill=(220, 236, 242), font=title_font)
    draw.text((60, 92), "inspection robot, sensor stream, maintenance reasoning, and work-order closure", fill=(142, 189, 206), font=body_font)

    blocks = [
        ("FIELD INPUTS", (60, 164, 308, 620), (77, 157, 188), [
            "thermal camera frames",
            "vibration and current sensors",
            "mission route and site map",
            "operator escalation rules",
        ]),
        ("MAINTENANCE AGENT", (360, 164, 642, 620), (59, 194, 155), [
            "anomaly scoring",
            "copilot explanation layer",
            "failure probability update",
            "recommended next action",
        ]),
        ("PLANT ACTIONS", (694, 164, 970, 620), (238, 171, 92), [
            "open work order",
            "send technician mission",
            "update asset twin",
            "record inspection evidence",
        ]),
        ("BUYER IMPACT", (1014, 164, 1220, 620), (161, 118, 228), [
            "less unplanned downtime",
            "safer hazardous inspections",
            "faster root-cause triage",
            "clear maintenance audit trail",
        ]),
    ]

    for title, box, accent, items in blocks:
        rounded_box(draw, box, fill=(13, 23, 31), outline=accent, radius=28, width=3)
        draw.text((box[0] + 20, box[1] + 18), title, fill=(224, 238, 242), font=small_font)
        y = box[1] + 72
        for item in items:
            draw.ellipse((box[0] + 22, y + 6, box[0] + 34, y + 18), fill=accent)
            wrapped = wrap_lines(draw, item, body_font, box[2] - box[0] - 72)
            for index, fragment in enumerate(wrapped):
                draw.text((box[0] + 48, y + index * 24), fragment, fill=(155, 189, 203), font=body_font)
            y += max(58, len(wrapped) * 26 + 18)

    draw.line((308, 390, 360, 390), fill=(106, 170, 193), width=5)
    draw.line((642, 390, 694, 390), fill=(106, 170, 193), width=5)
    draw.line((970, 390, 1014, 390), fill=(106, 170, 193), width=5)

    draw.text((392, 598), "robot patrol -> sensor evidence -> agent reasoning -> work-order execution", fill=(136, 181, 197), font=FONT_TINY)
    return image


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    frames = [draw_scene_frame(index) for index in range(16)]
    gif_path = OUT_DIR / "industrial-quality-cell-flow.gif"
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=110,
        loop=0,
        disposal=2,
    )

    still_path = OUT_DIR / "industrial-quality-cell-still.png"
    frames[9].convert("RGBA").save(still_path)

    deployment_map_path = OUT_DIR / "industrial-quality-deployment-map.png"
    draw_static_map().save(deployment_map_path)

    builder_stack_path = OUT_DIR / "industrial-quality-builder-stack.png"
    draw_builder_stack().save(builder_stack_path)

    warehouse_frames = [draw_warehouse_frame(index) for index in range(18)]
    warehouse_gif_path = OUT_DIR / "warehouse-autopicker-flow.gif"
    warehouse_frames[0].save(
        warehouse_gif_path,
        save_all=True,
        append_images=warehouse_frames[1:],
        duration=110,
        loop=0,
        disposal=2,
    )

    warehouse_map_path = OUT_DIR / "warehouse-autopicker-map.png"
    draw_warehouse_map().save(warehouse_map_path)

    maintenance_frames = [draw_maintenance_frame(index) for index in range(18)]
    maintenance_gif_path = OUT_DIR / "maintenance-patrol-flow.gif"
    maintenance_frames[0].save(
        maintenance_gif_path,
        save_all=True,
        append_images=maintenance_frames[1:],
        duration=110,
        loop=0,
        disposal=2,
    )

    maintenance_stack_path = OUT_DIR / "maintenance-agent-stack.png"
    draw_maintenance_stack().save(maintenance_stack_path)

    print("generated", gif_path)
    print("generated", still_path)
    print("generated", deployment_map_path)
    print("generated", builder_stack_path)
    print("generated", warehouse_gif_path)
    print("generated", warehouse_map_path)
    print("generated", maintenance_gif_path)
    print("generated", maintenance_stack_path)


if __name__ == "__main__":
    main()
