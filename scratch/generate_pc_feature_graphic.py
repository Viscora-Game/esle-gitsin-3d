from PIL import Image, ImageDraw, ImageFilter
import os
import math

width, height = 1920, 1080 # 16:9 Aspect Ratio
bg_img = Image.new("RGB", (width, height), (15, 23, 42))
draw = ImageDraw.Draw(bg_img)

# 1. Create a stunning radial gradient background (deep indigo/purple/emerald cosmic space)
for y in range(height):
    for x in range(0, width, 4): # step for performance
        # radial distance from center
        dx = (x - width/2) / (width/2)
        dy = (y - height/2) / (height/2)
        dist = math.sqrt(dx*dx + dy*dy)
        
        # Color interpolation
        r = int(30 * (1 - dist*0.5) + 15 * dist)
        g = int(27 * (1 - dist*0.7) + 10 * dist)
        b = int(75 * (1 - dist*0.4) + 30 * dist)
        
        # Add subtle green/emerald glow near center
        if dist < 0.6:
            g = min(255, g + int(45 * (1 - dist/0.6)))
            r = min(255, r + int(20 * (1 - dist/0.6)))

        draw.rectangle([x, y, x+4, y+1], fill=(r, g, b))

# 2. Add glowing central aura
aura = Image.new("RGBA", (width, height), (0, 0, 0, 0))
aura_draw = ImageDraw.Draw(aura)
aura_draw.ellipse([width//2 - 450, height//2 - 350, width//2 + 450, height//2 + 350], fill=(251, 191, 36, 45))
aura_draw.ellipse([width//2 - 250, height//2 - 200, width//2 + 250, height//2 + 200], fill=(56, 189, 248, 60))
aura = aura.filter(ImageFilter.GaussianBlur(80))
bg_img.paste(aura, (0, 0), aura)

# 3. Arrange 3D animal character cards floating across the 16:9 stage
char_files = [
    'cat.jpg', 'fox.jpg', 'panda.jpg', 'dragon.jpg',
    'shiba.jpg', 'unicorn.jpg', 'lion.jpg', 'bunny.jpg'
]

positions = [
    (width//2 - 380, height//2 - 120, 210, -12),
    (width//2 - 130, height//2 - 160, 240, -4),
    (width//2 + 130, height//2 - 160, 240, 5),
    (width//2 + 380, height//2 - 120, 210, 14),
    (width//2 - 580, height//2 + 40, 170, -18),
    (width//2 - 250, height//2 + 100, 190, -8),
    (width//2 + 250, height//2 + 100, 190, 8),
    (width//2 + 580, height//2 + 40, 170, 16)
]

for idx, (cx, cy, sz, rot) in enumerate(positions):
    char_file = char_files[idx % len(char_files)]
    path = os.path.join(r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\images", char_file)
    if not os.path.exists(path):
        continue

    char_img = Image.open(path).convert("RGBA")
    
    # Create 3D Card Tile frame
    tile = Image.new("RGBA", (sz, int(sz * 1.25)), (255, 255, 255, 255))
    tile_draw = ImageDraw.Draw(tile)
    
    # Rounded corners & border styling
    inner_sz = int(sz * 0.84)
    char_resized = char_img.resize((inner_sz, inner_sz), Image.Resampling.LANCZOS)
    
    # Paste image into card frame
    px = (sz - inner_sz) // 2
    py = int(sz * 0.1)
    tile.paste(char_resized, (px, py), char_resized)
    
    # Add subtle gold inner border around card
    tile_draw.rectangle([2, 2, sz-3, int(sz*1.25)-3], outline=(251, 191, 36, 255), width=3)
    
    # Rotate card
    tile_rot = tile.rotate(rot, expand=True, resample=Image.Resampling.BICUBIC)
    
    # Create drop shadow for 3D depth
    shadow = Image.new("RGBA", tile_rot.size, (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(shadow)
    sh_draw.rectangle([0, 0, tile_rot.width, tile_rot.height], fill=(0, 0, 0, 140))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    
    tx = cx - tile_rot.width // 2
    ty = cy - tile_rot.height // 2
    
    # Paste shadow and tile
    bg_img.paste(shadow, (tx + 8, ty + 12), shadow)
    bg_img.paste(tile_rot, (tx, ty), tile_rot)

# Save to Desktop and project directory
dst_desktop = r"c:\Users\Acer\OneDrive\Masaüstü\pc_feature_graphic_16x9.jpg"
dst_project = r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\pc_feature_graphic_16x9.jpg"

bg_img.save(dst_desktop, "JPEG", quality=95)
bg_img.save(dst_project, "JPEG", quality=95)

print("Generated 1920x1080 (16:9) Text-Free PC Feature Graphic successfully!")
print("Saved to:", dst_desktop)
print("Dimensions:", bg_img.size)
