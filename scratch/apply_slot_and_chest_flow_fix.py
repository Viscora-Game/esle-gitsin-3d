with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Update button text in index.html
old_btn_html = '<button id="btn-collect-chest" class="btn-primary">ÖDÜLLERİ AL & SONRAKİ BÖLÜM ▶</button>'
new_btn_html = '<button id="btn-collect-chest" class="btn-primary collect-btn">ENVANTERE EKLE VE DEVAM ET ▶</button>'

if old_btn_html in html_content:
    html_content = html_content.replace(old_btn_html, new_btn_html)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print('Updated btn-collect-chest text in index.html!')

with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Update rearrangeSlotTiles to use boundingClientRect of slot markers
old_rearrange = """        const trayW = 410;
        const standard5Capacity = 5;
        const spacing = 82;
        const startX = 7;

        for (let i = 0; i < total; i++) {
            const tile = this.slotTiles[i];

            if (i < 5) {
                // Bottom Tray 5 Standard Slots (100% Centered inside Slot Marker Frames!)
                const targetX = startX + (i * spacing);
                const targetY = 10;

                tile.element.style.transition = 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
                tile.element.style.left = `${targetX}px`;
                tile.element.style.top = `${targetY}px`;
                tile.element.style.zIndex = 200 + i;
            } else {
                // 6th Emergency Tile positioned EXACTLY CENTERED DIRECTLY ABOVE CENTER SLOT #3 (Index 2)!
                const centerX = startX + (2 * spacing);
                const centerY = 10 - 105;

                this.extraSlotWasUsed = true;

                tile.element.style.transition = 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
                tile.element.style.left = `${centerX}px`;
                tile.element.style.top = `${centerY}px`;
                tile.element.style.zIndex = 600;
            }
        }"""

new_rearrange = """        const trayBg = document.getElementById('slot-tray-bg');
        const markers = document.querySelectorAll('.slot-marker');
        let trayRect = null;
        if (trayBg && trayBg.getBoundingClientRect) {
            trayRect = trayBg.getBoundingClientRect();
        }

        const fallbackSpacing = 82;
        const fallbackStartX = 7;

        for (let i = 0; i < total; i++) {
            const tile = this.slotTiles[i];

            if (i < 5) {
                let targetX, targetY;
                if (trayRect && markers[i] && markers[i].getBoundingClientRect) {
                    const mRect = markers[i].getBoundingClientRect();
                    targetX = mRect.left - trayRect.left;
                    targetY = mRect.top - trayRect.top;
                } else {
                    targetX = fallbackStartX + (i * fallbackSpacing);
                    targetY = 10;
                }

                tile.element.style.transition = 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
                tile.element.style.left = `${targetX}px`;
                tile.element.style.top = `${targetY}px`;
                tile.element.style.zIndex = 200 + i;
            } else {
                let centerX, centerY;
                if (trayRect && markers[2] && markers[2].getBoundingClientRect) {
                    const mRect = markers[2].getBoundingClientRect();
                    centerX = mRect.left - trayRect.left;
                    centerY = (mRect.top - trayRect.top) - 105;
                } else {
                    centerX = fallbackStartX + (2 * fallbackSpacing);
                    centerY = 10 - 105;
                }

                this.extraSlotWasUsed = true;

                tile.element.style.transition = 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
                tile.element.style.left = `${centerX}px`;
                tile.element.style.top = `${centerY}px`;
                tile.element.style.zIndex = 600;
            }
        }"""

if old_rearrange in js_content:
    js_content = js_content.replace(old_rearrange, new_rearrange)
    print('Updated rearrangeSlotTiles to use boundingClientRect for 100% pixel alignment!')

# 2. Update openChestBox to build reward list without adding gold yet
old_open_box = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        if (reward.gold > 0) {
            this.goldCoins += reward.gold;
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        if (reward.pieces > 0) {
            for (let i = 0; i < reward.pieces; i++) {
                const addedPiece = this.awardRandomMissingPuzzlePiece();
                if (addedPiece && rewardListEl) {
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${addedPiece.puzzleName} (#${addedPiece.pieceIndex + 1})</span>`;
                    rewardListEl.appendChild(item);
                }
            }
        }

        const goldEl = document.getElementById('gold-val');
        if (goldEl) goldEl.innerText = this.goldCoins;

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '🎁';

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');

        this.saveGameProgress();
    }"""

new_open_box = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        if (reward.gold > 0) {
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        if (reward.pieces > 0) {
            this.pendingPiecesToAward = reward.pieces;
            const missingSample = this.getPreviewMissingPieces(reward.pieces);
            for (const p of missingSample) {
                const item = document.createElement('div');
                item.className = 'chest-reward-item';
                item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${p.puzzleName} (#${p.pieceIndex + 1})</span>`;
                if (rewardListEl) rewardListEl.appendChild(item);
            }
        }

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');
    }

    getPreviewMissingPieces(count) {
        const list = [];
        for (const puzzle of this.puzzlesCatalog) {
            const placed = this.placedPuzzlePieces[puzzle.id] || [];
            for (let i = 0; i < 12; i++) {
                if (!placed.includes(i)) {
                    const inInv = this.puzzleInventory.some(p => p.puzzleId === puzzle.id && p.pieceIndex === i);
                    if (!inInv) {
                        list.push({ puzzleId: puzzle.id, puzzleName: puzzle.name, pieceIndex: i });
                        if (list.length >= count) return list;
                    }
                }
            }
        }
        return list;
    }"""

if old_open_box in js_content:
    js_content = js_content.replace(old_open_box, new_open_box)
    print('Updated openChestBox!')

# Update btnCollectChest event listener in initUI to award rewards and advance
old_collect_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.addEventListener('click', () => {
            document.getElementById('modal-chest').classList.add('hidden');
            this.startLevel(this.level + 1, false, this.currentMode);
        });"""

new_collect_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.addEventListener('click', () => {
            if (this.pendingChestReward) {
                const reward = this.pendingChestReward;
                if (reward.gold > 0) {
                    this.goldCoins += reward.gold;
                }
                if (reward.pieces > 0) {
                    for (let i = 0; i < reward.pieces; i++) {
                        this.awardRandomMissingPuzzlePiece();
                    }
                }
                const goldEl = document.getElementById('gold-val');
                if (goldEl) goldEl.innerText = this.goldCoins;

                this.pendingChestReward = null;
                this.saveGameProgress();
            }

            this.sound.playClick();
            document.getElementById('modal-chest').classList.add('hidden');
            this.startLevel(this.level + 1, false, this.currentMode);
        });"""

if old_collect_bind in js_content:
    js_content = js_content.replace(old_collect_bind, new_collect_bind)
    print('Updated btnCollectChest listener to claim rewards and advance!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
