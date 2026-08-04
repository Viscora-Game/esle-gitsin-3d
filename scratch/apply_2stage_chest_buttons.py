with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update initUI listeners for btn-open-chest and btn-collect-chest
old_init_binds = """        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.addEventListener('click', () => this.openChestBox());

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.onclick = () => {
                try { this.sound.playClick(); } catch (e) {}
                const modalChest = document.getElementById('modal-chest');
                if (modalChest) modalChest.classList.add('hidden');
                this.startLevel(this.level + 1, false, this.currentMode);
            };
        }"""

new_init_binds = """        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.addEventListener('click', () => this.openChestBox());

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.addEventListener('click', () => this.openChestBox());

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.onclick = () => {
                try { this.sound.playClick(); } catch (e) {}
                
                // Claim rewards when clicking Envantere Ekle ve Devam Et!
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

                const modalChest = document.getElementById('modal-chest');
                if (modalChest) modalChest.classList.add('hidden');
                this.startLevel(this.level + 1, false, this.currentMode);
            };
        }"""

if old_init_binds in content:
    content = content.replace(old_init_binds, new_init_binds)
    print('Updated initUI button bindings for 2-stage chest!')

# 2. Update triggerChestRewardModal
old_trigger = """    triggerChestRewardModal(starLevel, isBonus) {
        const starsText = '⭐️'.repeat(starLevel);
        const starDisp = document.getElementById('chest-star-display');
        if (starDisp) starDisp.innerText = starsText;

        const titleEl = document.getElementById('chest-modal-title');
        if (titleEl) {
            if (isBonus) {
                titleEl.innerText = `🏆 BONUS ${starLevel} YILDIZLI SANDIK! 🎁`;
            } else {
                titleEl.innerText = `${starLevel} YILDIZLI SANDIK! 🎁`;
            }
        }

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = 'Sandığı açmak için kutuya dokunun!';

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.onclick = () => this.openChestBox();
        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.onclick = () => this.openChestBox();
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

new_trigger = """    triggerChestRewardModal(starLevel, isBonus) {
        const starsText = '⭐️'.repeat(starLevel);
        const starDisp = document.getElementById('chest-star-display');
        if (starDisp) starDisp.innerText = starsText;

        const titleEl = document.getElementById('chest-modal-title');
        if (titleEl) {
            if (isBonus) {
                titleEl.innerText = `🏆 BONUS ${starLevel} YILDIZLI SANDIK! 🎁`;
            } else {
                titleEl.innerText = `${starLevel} YILDIZLI SANDIK! 🎁`;
            }
        }

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = 'Bölüm Başarısı! Ödüllerinizi görmek için ÖDÜLLERİ AL butonuna basın!';

        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.remove('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

if old_trigger in content:
    content = content.replace(old_trigger, new_trigger)
    print('Updated triggerChestRewardModal for Stage 1!')

# 3. Update openChestBox to preview rewards without claiming until Stage 2 button press
old_open = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        this.pendingChestReward = null; // Clear so it only opens once

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

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = '🏆 Ödülleriniz Kazandı! Envantere eklemek için aşağıdaki butona basın:';

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');

        // Delay unhiding collect button by 700ms to eliminate touch-through click skips!
        setTimeout(() => {
            const btnCollectChest = document.getElementById('btn-collect-chest');
            if (btnCollectChest) btnCollectChest.classList.remove('hidden');
        }, 700);

        this.saveGameProgress();
    }"""

new_open = """    openChestBox() {
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
            const samplePieces = this.getPreviewMissingPieces(reward.pieces);
            for (const p of samplePieces) {
                const item = document.createElement('div');
                item.className = 'chest-reward-item';
                item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${p.puzzleName} (#${p.pieceIndex + 1})</span>`;
                if (rewardListEl) rewardListEl.appendChild(item);
            }
        }

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = '🏆 Sandıktan Çıkan Ödülleriniz:';

        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.add('hidden');

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

if old_open in content:
    content = content.replace(old_open, new_open)
    print('Updated openChestBox for Stage 2!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
