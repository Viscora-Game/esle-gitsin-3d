with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace openChestBox and add checkIfPieceOwned + rollAnyPuzzlePiece helper methods
old_open_box = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        this.pendingAwardedPieces = [];

        if (reward.gold > 0) {
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        if (reward.pieces > 0) {
            for (let i = 0; i < reward.pieces; i++) {
                const piece = this.getRandomMissingPieceData();
                if (piece) {
                    this.pendingAwardedPieces.push(piece);
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${piece.puzzleName} (#${piece.pieceIndex + 1})</span>`;
                    if (rewardListEl) rewardListEl.appendChild(item);
                }
            }
        }

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

new_open_box = """    openChestBox() {
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
    }

    rollAnyPuzzlePiece() {
        const puzzle = this.puzzlesCatalog[Math.floor(Math.random() * this.puzzlesCatalog.length)];
        const pieceIdx = Math.floor(Math.random() * 12);
        return { puzzleId: puzzle.id, puzzleName: puzzle.name, pieceIndex: pieceIdx };
    }

    checkIfPieceOwned(puzzleId, pieceIdx) {
        const placed = this.placedPuzzlePieces[puzzleId] || [];
        if (placed.includes(pieceIdx)) return true;
        const inInv = this.puzzleInventory.some(p => p.puzzleId === puzzleId && p.pieceIndex === pieceIdx);
        if (inInv) return true;
        const inPending = this.pendingAwardedPieces && this.pendingAwardedPieces.some(p => p.puzzleId === puzzleId && p.pieceIndex === pieceIdx);
        if (inPending) return true;
        return false;
    }"""

if old_open_box in content:
    content = content.replace(old_open_box, new_open_box)
    print('Updated openChestBox for duplicate 50 gold conversion!')

# Update btnCollectChest listener in initUI for pendingTotalGoldReward
old_collect = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.onclick = () => {
                try { this.sound.playClick(); } catch (e) {}
                
                // Claim exact displayed rewards when clicking Envantere Ekle ve Devam Et!
                if (this.pendingChestReward) {
                    const reward = this.pendingChestReward;
                    if (reward.gold > 0) {
                        this.goldCoins += reward.gold;
                    }
                    if (this.pendingAwardedPieces && this.pendingAwardedPieces.length > 0) {
                        for (const piece of this.pendingAwardedPieces) {
                            this.puzzleInventory.push({
                                id: `piece_${Date.now()}_${Math.random()}`,
                                puzzleId: piece.puzzleId,
                                puzzleName: piece.puzzleName,
                                pieceIndex: piece.pieceIndex
                            });
                        }
                    }
                    const goldEl = document.getElementById('gold-val');
                    if (goldEl) goldEl.innerText = this.goldCoins;

                    this.pendingChestReward = null;
                    this.pendingAwardedPieces = null;
                    this.saveGameProgress();
                }

                const modalChest = document.getElementById('modal-chest');
                if (modalChest) modalChest.classList.add('hidden');
                this.startLevel(this.level + 1, false, this.currentMode);
            };
        }"""

new_collect = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.onclick = () => {
                try { this.sound.playClick(); } catch (e) {}
                
                // Claim exact displayed rewards when clicking Envantere Ekle ve Devam Et!
                if (this.pendingChestReward) {
                    if (this.pendingTotalGoldReward > 0) {
                        this.goldCoins += this.pendingTotalGoldReward;
                    }
                    if (this.pendingAwardedPieces && this.pendingAwardedPieces.length > 0) {
                        for (const piece of this.pendingAwardedPieces) {
                            this.puzzleInventory.push({
                                id: `piece_${Date.now()}_${Math.random()}`,
                                puzzleId: piece.puzzleId,
                                puzzleName: piece.puzzleName,
                                pieceIndex: piece.pieceIndex
                            });
                        }
                    }
                    const goldEl = document.getElementById('gold-val');
                    if (goldEl) goldEl.innerText = this.goldCoins;

                    this.pendingChestReward = null;
                    this.pendingAwardedPieces = null;
                    this.pendingTotalGoldReward = 0;
                    this.saveGameProgress();
                }

                const modalChest = document.getElementById('modal-chest');
                if (modalChest) modalChest.classList.add('hidden');
                this.startLevel(this.level + 1, false, this.currentMode);
            };
        }"""

if old_collect in content:
    content = content.replace(old_collect, new_collect)
    print('Updated btnCollectChest listener for pendingTotalGoldReward!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
