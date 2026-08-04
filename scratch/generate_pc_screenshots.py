from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

out_dir_desktop = r"c:\Users\Acer\OneDrive\Masaüstü\pc_screenshots"
os.makedirs(out_dir_desktop, exist_ok=True)

width, height = 1080, 1920 # 9:16 Aspect Ratio

# Helper to create background gradient
def create_gradient_bg(w, h, color1, color2):
    img = Image.new("RGB", (w, h))
    draw = ImageDraw.Draw(img)
    for y in range(h):
        r = int(color1[0] + (color2[0] - color1[0]) * (y / h))
        g = int(color1[1] + (color2[1] - color1[1]) * (y / h))
        b = int(color1[2] + (color2[2] - color1[2]) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img

# Load font helper
def get_fonts():
    font_paths = [
        "C:/Windows/Fonts/fredokaone-regular.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/seguiemj.ttf",
        "C:/Windows/Fonts/arial.ttf"
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                f_title = ImageFont.truetype(fp, 56)
                f_sub = ImageFont.truetype(fp, 32)
                f_btn = ImageFont.truetype(fp, 38)
                return f_title, f_sub, f_btn
            except Exception:
                pass
    return ImageFont.load_default(), ImageFont.load_default(), ImageFont.load_default()

font_title, font_sub, font_btn = get_fonts()

# -------------------------------------------------------------
# SCREENSHOT 1: Main Menu Screen
# -------------------------------------------------------------
s1 = create_gradient_bg(width, height, (30, 27, 75), (15, 23, 42))
d1 = ImageDraw.Draw(s1)

# Add Logo Emblem
logo_path = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\images\app_hero_icon.png"
if os.path.exists(logo_path):
    logo_img = Image.open(logo_path).convert("RGBA")
    logo_img = logo_img.resize((320, 320), Image.Resampling.LANCZOS)
    s1.paste(logo_img, (width//2 - 160, 260), logo_img)

# Title & Subtitle
d1.text((width//2 - 240, 620), "EŞLE GİTSİN! 3D", font=font_title, fill=(251, 191, 36))
d1.text((width//2 - 190, 695), "Eşleme ve Zeka Macerası", font=font_sub, fill=(226, 232, 240))

# Buttons
btn_y = 820
buttons = [
    ("🎮 KLASİK MOD (SEVİYE 30)", (245, 158, 11)),
    ("⏱️ ZAMANA KARŞI MOD (SEVİYE 15)", (225, 29, 72)),
    ("📖 YAPBOZ GÜNLÜĞÜ", (194, 65, 12)),
    ("⚙️ AYARLAR", (51, 65, 85))
]

for text, color in buttons:
    # draw button rounded rect
    d1.rounded_rectangle([140, btn_y, width - 140, btn_y + 110], radius=24, fill=color, outline=(255, 255, 255), width=3)
    tb = d1.textbbox((0, 0), text, font=font_btn)
    tw = tb[2] - tb[0]
    d1.text((width//2 - tw//2, btn_y + 32), text, font=font_btn, fill=(255, 255, 255))
    btn_y += 150

s1.save(os.path.join(out_dir_desktop, "pc_screenshot_1_main_menu.jpg"), quality=95)

# -------------------------------------------------------------
# SCREENSHOT 2: Classic Game Board (Heart Mahjong Formation)
# -------------------------------------------------------------
s2 = create_gradient_bg(width, height, (6, 78, 59), (1, 20, 14))
d2 = ImageDraw.Draw(s2)

# HUD Bar at top
d2.rounded_rectangle([40, 80, width - 40, 200], radius=20, fill=(15, 23, 42, 220), outline=(251, 191, 36), width=2)
d2.text((80, 115), "SEVİYE 30", font=font_sub, fill=(255, 255, 255))
d2.text((400, 115), "SKOR 8700", font=font_sub, fill=(251, 191, 36))
d2.text((740, 115), "ALTIN 🪙 65", font=font_sub, fill=(56, 189, 248))

# Booster Bar
d2.rounded_rectangle([70, 230, 360, 310], radius=16, fill=(245, 158, 11))
d2.text((100, 252), "💡 İPUCU (300)", font=font_sub, fill=(255, 255, 255))

d2.rounded_rectangle([390, 230, 680, 310], radius=16, fill=(56, 189, 248))
d2.text((410, 252), "🚨 +1 SLOT (1000)", font=font_sub, fill=(255, 255, 255))

d2.rounded_rectangle([710, 230, 1000, 310], radius=16, fill=(168, 85, 247))
d2.text((730, 252), "🔀 KARIŞTIR (5000)", font=font_sub, fill=(255, 255, 255))

# Draw Mahjong Heart Formation Tiles in Center
char_files = ['dragon.jpg', 'cat.jpg', 'fox.jpg', 'unicorn.jpg', 'lion.jpg', 'panda.jpg']
tile_positions = [
    (width//2 - 240, 550), (width//2, 550), (width//2 + 240, 550),
    (width//2 - 360, 720), (width//2 - 120, 720), (width//2 + 120, 720), (width//2 + 360, 720),
    (width//2 - 240, 890), (width//2, 890), (width//2 + 240, 890),
    (width//2 - 120, 1060), (width//2 + 120, 1060),
    (width//2, 1230)
]

for idx, (tx, ty) in enumerate(tile_positions):
    cfile = char_files[idx % len(char_files)]
    cpath = os.path.join(r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\images", cfile)
    if os.path.exists(cpath):
        timg = Image.open(cpath).resize((130, 130), Image.Resampling.LANCZOS)
        card_frame = Image.new("RGB", (160, 200), (255, 255, 255))
        card_draw = ImageDraw.Draw(card_frame)
        card_frame.paste(timg, (15, 15))
        card_draw.rectangle([0, 0, 159, 199], outline=(203, 213, 225), width=3)
        s2.paste(card_frame, (tx - 80, ty - 100))

# Bottom Slot Tray
d2.rounded_rectangle([80, 1600, width - 80, 1800], radius=30, fill=(15, 23, 42), outline=(245, 158, 11), width=4)
for i in range(5):
    sx = 130 + i * 170
    d2.rounded_rectangle([sx, 1630, sx + 140, 1770], radius=16, outline=(255, 255, 255, 100), width=2)

s2.save(os.path.join(out_dir_desktop, "pc_screenshot_2_classic_game.jpg"), quality=95)

# -------------------------------------------------------------
# SCREENSHOT 3: Time Trial Game Mode
# -------------------------------------------------------------
s3 = create_gradient_bg(width, height, (30, 58, 138), (6, 9, 19))
d3 = ImageDraw.Draw(s3)

# HUD Bar with Timer
d3.rounded_rectangle([40, 80, width - 40, 200], radius=20, fill=(15, 23, 42, 220), outline=(225, 29, 72), width=3)
d3.text((80, 115), "SEVİYE 15", font=font_sub, fill=(255, 255, 255))
d3.text((360, 115), "⏱️ 45s", font=font_title, fill=(225, 29, 72))
d3.text((740, 115), "SKOR 12400", font=font_sub, fill=(251, 191, 36))

# Center Cards
for idx, (tx, ty) in enumerate(tile_positions[:10]):
    cfile = char_files[idx % len(char_files)]
    cpath = os.path.join(r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\images", cfile)
    if os.path.exists(cpath):
        timg = Image.open(cpath).resize((130, 130), Image.Resampling.LANCZOS)
        card_frame = Image.new("RGB", (160, 200), (255, 255, 255))
        card_draw = ImageDraw.Draw(card_frame)
        card_frame.paste(timg, (15, 15))
        card_draw.rectangle([0, 0, 159, 199], outline=(203, 213, 225), width=3)
        s3.paste(card_frame, (tx - 80, ty - 100))

# Bottom Slot Tray
d3.rounded_rectangle([80, 1600, width - 80, 1800], radius=30, fill=(15, 23, 42), outline=(225, 29, 72), width=4)
for i in range(5):
    sx = 130 + i * 170
    d3.rounded_rectangle([sx, 1630, sx + 140, 1770], radius=16, outline=(255, 255, 255, 100), width=2)

s3.save(os.path.join(out_dir_desktop, "pc_screenshot_3_timetrial_game.jpg"), quality=95)

# -------------------------------------------------------------
# SCREENSHOT 4: Puzzle Journal Modal
# -------------------------------------------------------------
s4 = create_gradient_bg(width, height, (30, 27, 75), (15, 23, 42))
d4 = ImageDraw.Draw(s4)

# Modal Card Frame
d4.rounded_rectangle([60, 200, width - 60, 1720], radius=36, fill=(15, 23, 42), outline=(251, 191, 36), width=4)

# Header
d4.text((width//2 - 210, 250), "📖 YAPBOZ GÜNLÜĞÜ", font=font_title, fill=(251, 191, 36))
d4.rounded_rectangle([width//2 - 120, 340, width//2 + 120, 400], radius=20, fill=(245, 158, 11))
d4.text((width//2 - 80, 352), "🪙 65 ALTIN", font=font_sub, fill=(255, 255, 255))

# Character tabs
tabs = ["🐱 Kedi", "🦊 Tilki", "🐼 Panda", "🐲 Ejderha"]
for i, t in enumerate(tabs):
    tx = 90 + i * 225
    color = (245, 158, 11) if i == 0 else (51, 65, 85)
    d4.rounded_rectangle([tx, 440, tx + 210, 510], radius=16, fill=color)
    d4.text((tx + 30, 458), t, font=font_sub, fill=(255, 255, 255))

# Big Puzzle Jigsaw Frame (3x4 grid)
jigsaw_y = 560
for r in range(4):
    for c in range(3):
        jx = 160 + c * 260
        jy = jigsaw_y + r * 220
        d4.rounded_rectangle([jx, jy, jx + 230, jy + 200], radius=16, fill=(30, 41, 59), outline=(148, 163, 184), width=2)
        d4.text((jx + 90, jy + 80), f"#{r*3+c+1}", font=font_sub, fill=(148, 163, 184))

# Buy Piece Button
d4.rounded_rectangle([180, 1540, width - 180, 1660], radius=28, fill=(16, 185, 129), outline=(255, 255, 255), width=3)
d4.text((width//2 - 200, 1582), "🧩 1 PARÇA AL (100 🪙)", font=font_btn, fill=(255, 255, 255))

s4.save(os.path.join(out_dir_desktop, "pc_screenshot_4_puzzle_journal.jpg"), quality=95)

# -------------------------------------------------------------
# SCREENSHOT 5: Lucky Wheel Modal
# -------------------------------------------------------------
s5 = create_gradient_bg(width, height, (30, 27, 75), (15, 23, 42))
d5 = ImageDraw.Draw(s5)

d5.rounded_rectangle([60, 250, width - 60, 1670], radius=36, fill=(15, 23, 42), outline=(251, 191, 36), width=4)
d5.text((width//2 - 200, 300), "🎡 ŞANS ÇARKI 🎁", font=font_title, fill=(251, 191, 36))

# Wheel Disc Representation
wheel_cx, wheel_cy, wheel_r = width//2, 850, 380
d5.ellipse([wheel_cx - wheel_r, wheel_cy - wheel_r, wheel_cx + wheel_r, wheel_cy + wheel_r], fill=(245, 158, 11), outline=(255, 255, 255), width=6)
d5.ellipse([wheel_cx - 80, wheel_cy - 80, wheel_cx + 80, wheel_cy + 80], fill=(15, 23, 42), outline=(251, 191, 36), width=4)
d5.text((wheel_cx - 30, wheel_cy - 20), "🎯", font=font_title, fill=(255, 255, 255))

# Spin Button
d5.rounded_rectangle([180, 1450, width - 180, 1570], radius=28, fill=(245, 158, 11), outline=(255, 255, 255), width=3)
d5.text((width//2 - 160, 1492), "🎯 ÜCRETSİZ ÇEVİR!", font=font_btn, fill=(255, 255, 255))

s5.save(os.path.join(out_dir_desktop, "pc_screenshot_5_lucky_wheel.jpg"), quality=95)

# -------------------------------------------------------------
# SCREENSHOT 6: Victory Modal & Reward Chest
# -------------------------------------------------------------
s6 = create_gradient_bg(width, height, (6, 78, 59), (1, 20, 14))
d6 = ImageDraw.Draw(s6)

d6.rounded_rectangle([80, 350, width - 80, 1550], radius=36, fill=(15, 23, 42), outline=(251, 191, 36), width=4)
d6.text((width//2 - 180, 420), "🎉 TEBRİKLER! 🎉", font=font_title, fill=(251, 191, 36))
d6.text((width//2 - 250, 510), "Bölümü Başarıyla Tamamladınız!", font=font_sub, fill=(226, 232, 240))

# Stars
d6.text((width//2 - 160, 620), "⭐ ⭐ ⭐", font=font_title, fill=(251, 191, 36))

# Chest Gift Icon
d6.text((width//2 - 60, 820), "🎁", font=ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 120) if os.path.exists("C:/Windows/Fonts/seguiemj.ttf") else font_title, fill=(251, 191, 36))

# Reward details
d6.text((width//2 - 140, 1080), "+500 SKOR", font=font_btn, fill=(251, 191, 36))
d6.text((width//2 - 140, 1160), "+25 ALTIN 🪙", font=font_btn, fill=(56, 189, 248))
d6.text((width//2 - 180, 1240), "+1 YAPBOZ PARÇASI 🧩", font=font_btn, fill=(168, 85, 247))

# Next Level Button
d6.rounded_rectangle([160, 1380, width - 160, 1490], radius=28, fill=(16, 185, 129), outline=(255, 255, 255), width=3)
d6.text((width//2 - 150, 1418), "SONRAKİ BÖLÜM ➔", font=font_btn, fill=(255, 255, 255))

s6.save(os.path.join(out_dir_desktop, "pc_screenshot_6_victory_chest.jpg"), quality=95)

print("Generated 6 high-res (1080x1920 9:16) PC Screenshots successfully in:", out_dir_desktop)
