with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Upgrade ParticleFX to Object Pooling (Zero-GC Particle Engine)
new_particle_fx = """class ParticleFX {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.poolSize = 200;
        this.pool = [];
        for (let i = 0; i < this.poolSize; i++) {
            this.pool.push({
                x: 0, y: 0, vx: 0, vy: 0, radius: 0, color: '#ffffff', alpha: 0, decay: 0.02, active: false
            });
        }
        this.isAnimating = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
        this.canvas.height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    }

    startAnimationLoop() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    spawnBurst(x, y, count = 24) {
        const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#c084fc', '#ffffff', '#ec4899'];
        let spawned = 0;
        for (let i = 0; i < this.poolSize && spawned < count; i++) {
            const p = this.pool[i];
            if (!p.active) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 2;
                p.x = x;
                p.y = y;
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.radius = Math.random() * 5 + 2;
                p.color = colors[Math.floor(Math.random() * colors.length)];
                p.alpha = 1;
                p.decay = Math.random() * 0.03 + 0.02;
                p.active = true;
                spawned++;
            }
        }
        this.startAnimationLoop();
    }

    spawnConfetti() {
        const colors = ['#fbbf24', '#ef4444', '#10b981', '#38bdf8', '#c084fc', '#f43f5e'];
        let spawned = 0;
        for (let i = 0; i < this.poolSize && spawned < 70; i++) {
            const p = this.pool[i];
            if (!p.active) {
                p.x = Math.random() * (this.canvas ? this.canvas.width : 400);
                p.y = -10;
                p.vx = (Math.random() - 0.5) * 4;
                p.vy = Math.random() * 5 + 3;
                p.radius = Math.random() * 6 + 3;
                p.color = colors[Math.floor(Math.random() * colors.length)];
                p.alpha = 1;
                p.decay = 0.005;
                p.active = true;
                spawned++;
            }
        }
        this.startAnimationLoop();
    }

    animate() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let hasActive = false;
        for (let i = 0; i < this.poolSize; i++) {
            const p = this.pool[i];
            if (!p.active) continue;

            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                p.active = false;
                continue;
            }

            hasActive = true;
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        if (hasActive) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }
}"""

target_start = "class ParticleFX {"
target_end = "class SoundSynth {"

idx_start = js_content.find(target_start)
idx_end = js_content.find(target_end)

if idx_start != -1 and idx_end != -1:
    js_content = js_content[:idx_start] + new_particle_fx + "\n\n" + js_content[idx_end:]

# 2. Upgrade preloadAllTileImages to GPU async decoding (Image.decode)
old_preload_func = """    preloadAllTileImages() {
        const imagePaths = [
            'images/cat.jpg',
            'images/fox.jpg',
            'images/panda.jpg',
            'images/dragon.jpg',
            'images/shiba.jpg',
            'images/unicorn.jpg',
            'images/lion.jpg',
            'images/bunny.jpg',
            'images/owl.jpg',
            'images/red_panda.jpg',
            'images/frog.jpg',
            'images/penguin.jpg'
        ];

        this.preloadedImages = {};
        for (const path of imagePaths) {
            const img = new Image();
            img.src = path;
            this.preloadedImages[path] = img;
        }
    }"""

new_preload_func = """    preloadAllTileImages() {
        const imagePaths = [
            'images/cat.jpg',
            'images/fox.jpg',
            'images/panda.jpg',
            'images/dragon.jpg',
            'images/shiba.jpg',
            'images/unicorn.jpg',
            'images/lion.jpg',
            'images/bunny.jpg',
            'images/owl.jpg',
            'images/red_panda.jpg',
            'images/frog.jpg',
            'images/penguin.jpg'
        ];

        this.preloadedImages = {};
        for (const path of imagePaths) {
            const img = new Image();
            img.src = path;
            if (img.decode) {
                img.decode().catch(() => {});
            }
            this.preloadedImages[path] = img;
        }
    }"""

if old_preload_func in js_content:
    js_content = js_content.replace(old_preload_func, new_preload_func)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# 3. Add GPU acceleration CSS rules to styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

gpu_css_rules = """
/* GPU Acceleration & Performance Optimization Rules */
.card-3d, .card-inner, .board-mat-frame, .tray-slot, .particle-canvas, .modal-content, #wheel-canvas, #wheel-disc {
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}
"""

if "GPU Acceleration & Performance Optimization Rules" not in css_content:
    css_content += "\n" + gpu_css_rules

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
