with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Add preloadAllTileImages method in game.js constructor/init
preloader_method = """    preloadAllTileImages() {
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

if "preloadAllTileImages" not in js_content:
    insert_pos = js_content.find("    initUI() {")
    if insert_pos != -1:
        js_content = js_content[:insert_pos] + preloader_method + "\n\n" + js_content[insert_pos:]

# Call preloadAllTileImages in initUI
init_ui_call_target = "this.updateMainMenuButtons();"
if init_ui_call_target in js_content and "preloadAllTileImages" in js_content:
    js_content = js_content.replace(init_ui_call_target, "this.preloadAllTileImages();\n        " + init_ui_call_target, 1)

# 2. Fix btn-hud-home listener to hide level views & prevent background reflow glitch
old_home_click = """        document.getElementById('btn-hud-home').addEventListener('click', () => {
            this.stopTimer();
            this.saveGameProgress();
            this.updateMainMenuButtons();
            this.startWheelTimerLoop();
            document.getElementById('main-menu').classList.remove('hidden');
            this.showMainMenuBannerAd();
        });"""

new_home_click = """        document.getElementById('btn-hud-home').addEventListener('click', () => {
            this.sound.playClick();
            this.stopTimer();
            this.saveGameProgress();
            this.updateMainMenuButtons();
            this.startWheelTimerLoop();

            // Hide level play view & overlays
            const gameView = document.getElementById('game-view');
            if (gameView) gameView.classList.add('hidden');

            const boardEl = document.getElementById('game-board');
            if (boardEl) boardEl.innerHTML = '';

            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
            }

            // Smooth particle FX resize to prevent background flash
            if (this.fx && typeof this.fx.resize === 'function') {
                this.fx.resize();
            }

            this.showMainMenuBannerAd();
        });"""

if old_home_click in js_content:
    js_content = js_content.replace(old_home_click, new_home_click, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# 3. Add all 12 images to ASSETS_TO_CACHE in sw.js
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

old_sw_cache = """const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './manifest.json',
  './favicon.ico',
  './favicon.png'
];"""

new_sw_cache = """const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './manifest.json',
  './favicon.ico',
  './favicon.png',
  './images/cat.jpg',
  './images/fox.jpg',
  './images/panda.jpg',
  './images/dragon.jpg',
  './images/shiba.jpg',
  './images/unicorn.jpg',
  './images/lion.jpg',
  './images/bunny.jpg',
  './images/owl.jpg',
  './images/red_panda.jpg',
  './images/frog.jpg',
  './images/penguin.jpg'
];"""

if old_sw_cache in sw_content:
    sw_content = sw_content.replace(old_sw_cache, new_sw_cache, 1)

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
