with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update triggerChestRewardModal
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

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

if old_trigger in content:
    content = content.replace(old_trigger, new_trigger)
    print('Updated triggerChestRewardModal!')

# Update openChestBox to delay unhiding btn-collect-chest by 700ms
old_open = """    openChestBox() {
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

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');

        this.saveGameProgress();
    }"""

new_open = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        this.pendingChestReward = null; // Prevent double opening

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

if old_open in content:
    content = content.replace(old_open, new_open)
    print('Updated openChestBox with 700ms delayed collect button unhide!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
