from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

width, height = 600, 400
img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Try loading a nice bold font or fallback
font_title = None
font_sub = None
font_paths = [
    "C:/Windows/Fonts/fredokaone-regular.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/seguiemj.ttf",
    "C:/Windows/Fonts/impact.ttf",
    "C:/Windows/Fonts/arial.ttf"
]

for fp in font_paths:
    if os.path.exists(fp):
        try:
            font_title = ImageFont.truetype(fp, 52)
            font_sub = ImageFont.truetype(fp, 26)
            font_crown = ImageFont.truetype(fp, 72)
            break
        except Exception:
            pass

if not font_title:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()

# 1. Draw glowing aura in background center
aura_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
aura_draw = ImageDraw.Draw(aura_img)
aura_draw.ellipse([150, 100, 450, 300], fill=(251, 191, 36, 60))
aura_img = aura_img.filter(ImageFilter.GaussianBlur(30))
img.paste(aura_img, (0, 0), aura_img)

# Re-initialize draw after paste
draw = ImageDraw.Draw(img)

# 2. Draw Crown Icon or 3D Emblem in upper center
cx, cy = width // 2, height // 2 - 30

# Text "EŞLE GİTSİN!"
title_text = "EŞLE GİTSİN!"
sub_text = "3D MATCHING ADVENTURE"

# Calculate bounding boxes
tb = draw.textbbox((0, 0), title_text, font=font_title)
tw, th = tb[2] - tb[0], tb[3] - tb[1]

sb = draw.textbbox((0, 0), sub_text, font=font_sub)
sw, sh = sb[2] - sb[0], sb[3] - sb[1]

# Title position
tx = (width - tw) // 2
ty = cy - 20

# Draw Shadow / Stroke for Title
stroke_color = (15, 23, 42, 255) # Dark slate
for dx in range(-4, 5):
    for dy in range(-4, 5):
        if dx*dx + dy*dy <= 16:
            draw.text((tx + dx, ty + dy), title_text, font=font_title, fill=stroke_color)

# Draw Main Text in Gold/Amber gradient simulated color
draw.text((tx, ty), title_text, font=font_title, fill=(251, 191, 36, 255))

# Subtitle position
sx = (width - sw) // 2
sy = ty + th + 25

# Draw Shadow & Subtitle Text
for dx in range(-2, 3):
    for dy in range(-2, 3):
        draw.text((sx + dx, sy + dy), sub_text, font=font_sub, fill=(15, 23, 42, 230))

draw.text((sx, sy), sub_text, font=font_sub, fill=(56, 189, 248, 255)) # Cyan badge color

# Crown on top of title
crown_text = "👑"
cb = draw.textbbox((0, 0), crown_text, font=font_sub)
cw = cb[2] - cb[0]
draw.text(((width - cw) // 2, ty - 60), crown_text, font=font_sub, fill=(255, 215, 0, 255))

# Save image
out_desktop = r"c:\Users\Acer\OneDrive\Masaüstü\google_play_games_pc_logo.png"
out_project = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\google_play_games_pc_logo.png"

img.save(out_desktop, "PNG")
img.save(out_project, "PNG")

print("Generated 600x400 transparent PNG logo successfully!")
print("Saved to:", out_desktop)
