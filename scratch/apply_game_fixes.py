import sys

with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update bind for chest box container
chest_bind_target = "const chestBox = document.getElementById('chest-box');"
chest_bind_replacement = """const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');"""

if chest_bind_target in content:
    content = content.replace(chest_bind_target, chest_bind_replacement)
    print('Bound chest-box-container click handler!')

# 2. Update renderPuzzleGalleryModal to handle watermark preview & badge fix
badge_fix_target = """        const badge = document.getElementById('puzzle-completed-badge');
        if (badge) {
            if (isCompleted) badge.classList.remove('hidden');
            else badge.classList.add('hidden');
        }"""

badge_fix_replacement = """        const badge = document.getElementById('puzzle-completed-badge');
        if (badge) {
            if (placedPieces.length === 12) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }"""

if badge_fix_target in content:
    content = content.replace(badge_fix_target, badge_fix_replacement)
    print('Updated badge fix condition!')

# Watermark preview in slots
slot_render_target = """                if (placedPieces.includes(i)) {
                    slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                    slot.style.backgroundSize = '300% 400%';
                    slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;
                } else {
                    slot.innerText = `#${i + 1}`;
                }"""

slot_render_replacement = """                slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                slot.style.backgroundSize = '300% 400%';
                slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;

                if (placedPieces.includes(i)) {
                    slot.classList.remove('watermark');
                    slot.innerText = '';
                } else {
                    slot.classList.add('watermark');
                    slot.innerText = `#${i + 1}`;
                }"""

if slot_render_target in content:
    content = content.replace(slot_render_target, slot_render_replacement)
    print('Added watermark preview to empty jigsaw slots!')

# 3. Add deadlock detection method to TileMatchingGame class
deadlock_method = """
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

        // Auto Shuffle board tiles
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

# Insert deadlock_method before processPairMatch
process_pair_idx = content.find('processPairMatch(')
if process_pair_idx != -1:
    content = content[:process_pair_idx] + deadlock_method + '\n\n    ' + content[process_pair_idx:]
    print('Added deadlock detection & auto shuffle methods!')

# Trigger deadlock check inside processPairMatch after match removal
deadlock_trigger_target = "this.checkForMatches();"
deadlock_trigger_replacement = """this.checkForMatches();
                this.checkDeadlockAndAutoShuffle();"""

if deadlock_trigger_target in content:
    content = content.replace(deadlock_trigger_target, deadlock_trigger_replacement, 1)
    print('Triggered deadlock check inside processPairMatch!')

# Trigger deadlock check inside onTileClick after slot insertion
slot_click_target = "this.rearrangeSlotTiles();"
slot_click_replacement = """this.rearrangeSlotTiles();
        this.checkDeadlockAndAutoShuffle();"""

if slot_click_target in content:
    content = content.replace(slot_click_target, slot_click_replacement, 1)
    print('Triggered deadlock check inside onTileClick!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
