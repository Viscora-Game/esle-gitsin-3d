with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update startLevel to clear chest-reward-list and hide modal-chest
old_start = """    startLevel(lvl, isNewGame = false, mode = 'classic') {
        this.boardTiles = [];
        this.slotTiles = [];

        const boardEl = document.getElementById('board');
        if (boardEl) boardEl.innerHTML = '';

        const slotLayerEl = document.getElementById('slot-tiles-layer');
        if (slotLayerEl) slotLayerEl.innerHTML = '';"""

new_start = """    startLevel(lvl, isNewGame = false, mode = 'classic') {
        this.boardTiles = [];
        this.slotTiles = [];

        const boardEl = document.getElementById('board');
        if (boardEl) boardEl.innerHTML = '';

        const slotLayerEl = document.getElementById('slot-tiles-layer');
        if (slotLayerEl) slotLayerEl.innerHTML = '';

        // Reset & Clear Chest Reward Modal State completely on start of every level
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';
        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.add('hidden');
        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');"""

if old_start in content:
    content = content.replace(old_start, new_start)
    print('Updated startLevel to clear chest-reward-list!')

# 2. Update triggerChestRewardModal for dynamic star-level chest icons and card classes
old_trigger = """    triggerChestRewardModal(starLevel, isBonus) {
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

        const chestCard = document.querySelector('.chest-card');
        const chestBox = document.getElementById('chest-box');

        // Dynamic Chest Appearance based on Star Level (1⭐ to 5⭐)
        let chestIcon = '📦';
        let chestClass = 'chest-star-1';

        if (starLevel === 1) {
            chestIcon = '📦';
            chestClass = 'chest-star-1';
        } else if (starLevel === 2) {
            chestIcon = '🧰';
            chestClass = 'chest-star-2';
        } else if (starLevel === 3) {
            chestIcon = '🪙';
            chestClass = 'chest-star-3';
        } else if (starLevel === 4) {
            chestIcon = '💎';
            chestClass = 'chest-star-4';
        } else if (starLevel >= 5) {
            chestIcon = isBonus ? '🏆' : '👑';
            chestClass = 'chest-star-5';
        }

        if (chestBox) {
            chestBox.innerText = chestIcon;
            chestBox.className = `chest-box ${chestClass}`;
            chestBox.style.display = 'inline-block';
        }

        if (chestCard) {
            chestCard.className = `modal-card chest-card card-star-${starLevel}`;
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
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

if old_trigger in content:
    content = content.replace(old_trigger, new_trigger)
    print('Updated triggerChestRewardModal with star-level chest visuals!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
