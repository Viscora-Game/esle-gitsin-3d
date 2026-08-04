with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_start = """    startLevel(lvl, isNewGame = false, mode = 'classic') {
        this.boardTiles = [];
        this.slotTiles = [];"""

new_start = """    startLevel(lvl, isNewGame = false, mode = 'classic') {
        this.boardTiles = [];
        this.slotTiles = [];

        const boardEl = document.getElementById('board');
        if (boardEl) boardEl.innerHTML = '';

        const slotLayerEl = document.getElementById('slot-tiles-layer');
        if (slotLayerEl) slotLayerEl.innerHTML = '';"""

if old_start in content:
    content = content.replace(old_start, new_start)
    print('Updated startLevel to clear boardEl and slotLayerEl DOM elements!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
