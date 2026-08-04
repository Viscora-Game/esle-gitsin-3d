with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update triggerChestRewardModal to reset hasOpenedChestThisLevel and btn-open-chest state
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
        if (descEl) descEl.innerText = 'Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!';

        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        // Show Stage 1 Button, Hide Stage 2 Content completely!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.remove('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

new_trigger = """    triggerChestRewardModal(starLevel, isBonus) {
        this.hasOpenedChestThisLevel = false;

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
        if (descEl) descEl.innerText = 'Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!';

        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        // Reset Stage 1 Button: Visible, Enabled, Clickable!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) {
            btnOpenChest.style.display = 'inline-block';
            btnOpenChest.classList.remove('hidden');
            btnOpenChest.disabled = false;
            btnOpenChest.style.pointerEvents = 'auto';
        }

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

if old_trigger in content:
    content = content.replace(old_trigger, new_trigger)
    print('Updated triggerChestRewardModal for single click reset!')

# 2. Update openChestBox to strictly enforce single click per level
old_open = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        this.pendingAwardedPieces = [];
        let totalGold = reward.gold || 0;

        if (reward.pieces > 0) {
            for (let i = 0; i < reward.pieces; i++) {
                const pieceData = this.rollAnyPuzzlePiece();
                const isOwned = this.checkIfPieceOwned(pieceData.puzzleId, pieceData.pieceIndex);

                if (isOwned) {
                    // AUTOMATIC 50 GOLD CONVERSION FOR DUPLICATE PUZZLE PIECES!
                    totalGold += 50;
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+50 ALTIN <br><small style="font-size:10px; color:#fbbf24;">(Varolan ${pieceData.puzzleName} #${pieceData.pieceIndex + 1} Dönüştü!)</small></span>`;
                    if (rewardListEl) rewardListEl.appendChild(item);
                } else {
                    this.pendingAwardedPieces.push(pieceData);
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${pieceData.puzzleName} (#${pieceData.pieceIndex + 1})</span>`;
                    if (rewardListEl) rewardListEl.appendChild(item);
                }
            }
        }

        if (reward.gold > 0) {
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        this.pendingTotalGoldReward = totalGold;

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = '🏆 Sandıktan Çıkan Ödülleriniz:';

        // Hide Stage 1 Button, Unhide Stage 2 Content!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.add('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');
    }"""

new_open = """    openChestBox() {
        if (this.hasOpenedChestThisLevel) return;
        if (!this.pendingChestReward) return;

        this.hasOpenedChestThisLevel = true;

        // Immediately disable and vanish Stage 1 "ÖDÜLLERİ AL" Button completely!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) {
            btnOpenChest.disabled = true;
            btnOpenChest.style.pointerEvents = 'none';
            btnOpenChest.style.display = 'none';
            btnOpenChest.classList.add('hidden');
        }

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        this.pendingAwardedPieces = [];
        let totalGold = reward.gold || 0;

        if (reward.pieces > 0) {
            for (let i = 0; i < reward.pieces; i++) {
                const pieceData = this.rollAnyPuzzlePiece();
                const isOwned = this.checkIfPieceOwned(pieceData.puzzleId, pieceData.pieceIndex);

                if (isOwned) {
                    // AUTOMATIC 50 GOLD CONVERSION FOR DUPLICATE PUZZLE PIECES!
                    totalGold += 50;
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+50 ALTIN <br><small style="font-size:10px; color:#fbbf24;">(Varolan ${pieceData.puzzleName} #${pieceData.pieceIndex + 1} Dönüştü!)</small></span>`;
                    if (rewardListEl) rewardListEl.appendChild(item);
                } else {
                    this.pendingAwardedPieces.push(pieceData);
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${pieceData.puzzleName} (#${pieceData.pieceIndex + 1})</span>`;
                    if (rewardListEl) rewardListEl.appendChild(item);
                }
            }
        }

        if (reward.gold > 0) {
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        this.pendingTotalGoldReward = totalGold;

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = '🏆 Sandıktan Çıkan Ödülleriniz:';

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');
    }"""

if old_open in content:
    content = content.replace(old_open, new_open)
    print('Updated openChestBox for strict single click vanishing button!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
