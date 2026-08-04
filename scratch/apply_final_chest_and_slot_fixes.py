with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update triggerChestRewardModal to add 600ms grace period on chest click
old_trigger_code = """    triggerChestRewardModal(starLevel, isBonus) {
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
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');



        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

new_trigger_code = """    triggerChestRewardModal(starLevel, isBonus) {
        this.canClickChest = false;
        setTimeout(() => { this.canClickChest = true; }, 600);

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

if old_trigger_code in content:
    content = content.replace(old_trigger_code, new_trigger_code)
    print('Updated triggerChestRewardModal with 600ms grace period!')

# 2. Update openChestBox to add 500ms grace period on collect button click
old_open_code = """    openChestBox() {
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

new_open_code = """    openChestBox() {
        if (!this.canClickChest) return;
        if (!this.pendingChestReward) return;

        this.canCollectRewards = false;
        setTimeout(() => { this.canCollectRewards = true; }, 500);

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

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');

        this.saveGameProgress();
    }"""

if old_open_code in content:
    content = content.replace(old_open_code, new_open_code)
    print('Updated openChestBox with 500ms collect grace period!')

# 3. Update btnCollectChest listener in initUI to respect canCollectRewards
old_collect_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
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

new_collect_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.onclick = () => {
            if (!this.canCollectRewards) return;
            this.sound.playClick();
            document.getElementById('modal-chest').classList.add('hidden');
            this.startLevel(this.level + 1, false, this.currentMode);
        };"""

if old_collect_bind in content:
    content = content.replace(old_collect_bind, new_collect_bind)
    print('Updated btnCollectChest listener in initUI!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
