with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Bind chest-box-container click handler in initUI
bind_chest_target = "const chestBox = document.getElementById('chest-box');"
bind_chest_replacement = """const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');"""

if bind_chest_target in content:
    content = content.replace(bind_chest_target, bind_chest_replacement)
    print('Bound chest-box-container!')

# 2. Fix completed badge logic & add watermark preview in renderPuzzleGalleryModal
badge_target = """        const badge = document.getElementById('puzzle-completed-badge');
        if (badge) {
            if (isCompleted) badge.classList.remove('hidden');
            else badge.classList.add('hidden');
        }"""

badge_replacement = """        const badge = document.getElementById('puzzle-completed-badge');
        if (badge) {
            if (placedPieces.length === 12) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }"""

if badge_target in content:
    content = content.replace(badge_target, badge_replacement)
    print('Updated completed badge condition!')

slot_target = """                if (placedPieces.includes(i)) {
                    slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                    slot.style.backgroundSize = '300% 400%';
                    slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;
                } else {
                    slot.innerText = `#${i + 1}`;
                }"""

slot_replacement = """                slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                slot.style.backgroundSize = '300% 400%';
                slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;

                if (placedPieces.includes(i)) {
                    slot.classList.remove('watermark');
                    slot.innerText = '';
                } else {
                    slot.classList.add('watermark');
                    slot.innerText = `#${i + 1}`;
                }"""

if slot_target in content:
    content = content.replace(slot_target, slot_replacement)
    print('Added watermark preview to empty slots!')

# 3. Add deadlock detection methods before processPairMatch
deadlock_methods = """
    // =========================================================
    // DEADLOCK DETECTION & AUTO-SHUFFLE SYSTEM
    // =========================================================

    checkDeadlockAndAutoShuffle() {
        if (this.boardTiles.length === 0) return false;

        const clickableTiles = this.boardTiles.filter(t => !this.isTileCovered(t));

        // Check if any 2 clickable tiles match each other
        for (let i = 0; i < clickableTiles.length; i++) {
            for (let j = i + 1; j < clickableTiles.length; j++) {
                if (clickableTiles[i].type.id === clickableTiles[j].type.id) {
                    return false; // Valid move exists!
                }
            }
        }

        // Check if any clickable tile matches a tile in slot tray
        for (const bTile of clickableTiles) {
            for (const sTile of this.slotTiles) {
                if (bTile.type.id === sTile.type.id) {
                    return false; // Valid move exists!
                }
            }
        }

        // DEADLOCK DETECTED!
        this.showToast('⚡ HAMLE KALMADI! Tahta Otomatik Karıştırılıyor...');
        this.sound.playBoosterChime();
        this.fx.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 40);

        this.autoShuffleBoard();
        return true;
    }

    autoShuffleBoard() {
        if (this.boardTiles.length <= 1) return;

        const types = this.boardTiles.map(t => t.type);
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = types[i];
            types[i] = types[j];
            types[j] = temp;
        }

        this.boardTiles.forEach((tile, idx) => {
            tile.type = types[idx];
            const img = tile.element.querySelector('.tile-character');
            if (img) img.src = tile.type.imgSrc;
            const bg = tile.element.querySelector('.tile-face');
            if (bg) bg.style.background = tile.type.bg || '#ffffff';
        });

        this.updateBoardTileStates();
    }
"""

ppm_idx = content.find('processPairMatch(tileA, tileB)')
if ppm_idx != -1:
    content = content[:ppm_idx] + deadlock_methods + '\n\n    ' + content[ppm_idx:]
    print('Added deadlock detection methods before processPairMatch!')

# Call checkDeadlockAndAutoShuffle in onTileClick after slot placement
click_call_target = "this.checkForMatches();"
click_call_replacement = """this.checkForMatches();
        setTimeout(() => this.checkDeadlockAndAutoShuffle(), 300);"""

if click_call_target in content:
    content = content.replace(click_call_target, click_call_replacement, 1)
    print('Called deadlock check in onTileClick!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
