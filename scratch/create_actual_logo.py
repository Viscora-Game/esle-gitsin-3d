from PIL import Image
import os

# Open the actual high-res 3D game logo emblem
src_logo_path = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\images\app_hero_icon.png"
if not os.path.exists(src_logo_path):
    src_logo_path = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\icons\app-icon-512.png"

hero_img = Image.open(src_logo_path).convert("RGBA")

# Create exact 600x400 transparent canvas
canvas_w, canvas_h = 600, 400
canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

# Resize actual game logo to fit nicely within 600x400 (e.g. max 360x360) preserving aspect ratio
max_dim = 360
hero_img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

# Center actual game logo on 600x400 transparent canvas
paste_x = (canvas_w - hero_img.width) // 2
paste_y = (canvas_h - hero_img.height) // 2

canvas.paste(hero_img, (paste_x, paste_y), hero_img)

# Save to Desktop and project folder
dst_desktop = r"c:\Users\Acer\OneDrive\Masaüstü\google_play_games_pc_logo.png"
dst_project = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\google_play_games_pc_logo.png"

canvas.save(dst_desktop, "PNG")
canvas.save(dst_project, "PNG")

print("Successfully created 600x400 logo using your ACTUAL 3D game logo!")
print("Saved to:", dst_desktop)
print("Canvas size:", canvas.size)
