with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Add <link rel="preload"> tags for all 12 images inside <head>
image_preloads = """    <!-- Instant Asset Preloader for 0ms Asset Loading -->
    <link rel="preload" as="image" href="images/cat.jpg">
    <link rel="preload" as="image" href="images/fox.jpg">
    <link rel="preload" as="image" href="images/panda.jpg">
    <link rel="preload" as="image" href="images/dragon.jpg">
    <link rel="preload" as="image" href="images/shiba.jpg">
    <link rel="preload" as="image" href="images/unicorn.jpg">
    <link rel="preload" as="image" href="images/lion.jpg">
    <link rel="preload" as="image" href="images/bunny.jpg">
    <link rel="preload" as="image" href="images/owl.jpg">
    <link rel="preload" as="image" href="images/red_panda.jpg">
    <link rel="preload" as="image" href="images/frog.jpg">
    <link rel="preload" as="image" href="images/penguin.jpg">
"""

if 'rel="preload" as="image" href="images/cat.jpg"' not in html_content:
    head_target = '<link rel="manifest" href="manifest.json?v=3">'
    if head_target in html_content:
        html_content = html_content.replace(head_target, head_target + "\n\n" + image_preloads, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Update ParticleFX in game.js to pause animation loop when idle
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

new_particle_fx = """class ParticleFX {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
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
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.03 + 0.02
            });
        }
        this.startAnimationLoop();
    }

    spawnConfetti() {
        const colors = ['#fbbf24', '#ef4444', '#10b981', '#38bdf8', '#c084fc', '#f43f5e'];
        for (let i = 0; i < 70; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas ? this.canvas.width : 400),
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 5 + 3,
                radius: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.005
            });
        }
        this.startAnimationLoop();
    }

    animate() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}"""

old_particle_fx_start = "class ParticleFX {"
old_particle_fx_end = "class TileMatchingGame {"
start_idx = js_content.find(old_particle_fx_start)
end_idx = js_content.find(old_particle_fx_end)

if start_idx != -1 and end_idx != -1:
    js_content = js_content[:start_idx] + new_particle_fx + "\n\n" + js_content[end_idx:]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
