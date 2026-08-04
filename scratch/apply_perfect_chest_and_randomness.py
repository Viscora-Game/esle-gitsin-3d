with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace openChestBox, getRandomMissingPieceData, and btnCollectChest listener
old_section = """    openChestBox() {
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

        // Hide Stage 1 Button, Unhide Stage 2 Content!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.add('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');
    }"""

new_section = """    openChestBox() {
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
    }

    getRandomMissingPieceData() {
        const missing = [];
        for (const puzzle of this.puzzlesCatalog) {
            const placed = this.placedPuzzlePieces[puzzle.id] || [];
            for (let i = 0; i < 12; i++) {
                if (!placed.includes(i)) {
                    // Check if already in inventory or already pending in current chest reveal
                    const inInv = this.puzzleInventory.some(p => p.puzzleId === puzzle.id && p.pieceIndex === i);
                    const inPending = this.pendingAwardedPieces && this.pendingAwardedPieces.some(p => p.puzzleId === puzzle.id && p.pieceIndex === i);
                    if (!inInv && !inPending) {
                        missing.push({ puzzleId: puzzle.id, puzzleName: puzzle.name, pieceIndex: i });
                    }
                }
            }
        }

        if (missing.length === 0) return null;
        const rIdx = Math.floor(Math.random() * missing.length);
        return missing[rIdx];
    }"""

if old_section in content:
    content = content.replace(old_section, new_section)
    print('Updated openChestBox and getRandomMissingPieceData!')

# Update btnCollectChest listener in initUI
old_collect = """        const btnCollectChest = document.getElementById('btn-collect-chest');
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

new_collect = """        const btnCollectChest = document.getElementById('btn-collect-chest');
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

if old_collect in content:
    content = content.replace(old_collect, new_collect)
    print('Updated btnCollectChest listener for exact displayed piece claiming!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
