with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add wheelRewardTitle & wheelRewardDesc to i18n
wheel_reward_modal_i18n = [
    ('tr: {', 'tr: {\n                wheelRewardTitle: "🎡 ŞANS ÇARKI ÖDÜLÜ! 🎉",\n                wheelRewardDesc: "🏆 Çarktan Çıkan Ödülleriniz:",'),
    ('en: {', 'en: {\n                wheelRewardTitle: "🎡 LUCKY WHEEL REWARD! 🎉",\n                wheelRewardDesc: "🏆 Your Lucky Wheel Rewards:",'),
    ('de: {', 'de: {\n                wheelRewardTitle: "🎡 GLÜCKSRAD-BELOHNUNG! 🎉",\n                wheelRewardDesc: "🏆 Deine Glücksrad-Belohnungen:",'),
    ('fr: {', 'fr: {\n                wheelRewardTitle: "🎡 RÉCOMPENSE ROUE! 🎉",\n                wheelRewardDesc: "🏆 Vos récompenses de la roue:",'),
    ('it: {', 'it: {\n                wheelRewardTitle: "🎡 PREMIO RUOTA DELLA FORTUNA! 🎉",\n                wheelRewardDesc: "🏆 I tuoi premi della ruota:",'),
    ('es: {', 'es: {\n                wheelRewardTitle: "🎡 ¡RECOMPENSA RUEDA! 🎉",\n                wheelRewardDesc: "🏆 Tus recompensas de la rueda:",'),
    ('pt: {', 'pt: {\n                wheelRewardTitle: "🎡 RECOMPENSA RODA! 🎉",\n                wheelRewardDesc: "🏆 Suas recompensas da roda:",')
]

for old, new in wheel_reward_modal_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Clean up openWheelModal
old_open_modal = """    openWheelModal() {
        this.renderWheelCanvas();
        
        // Reset Stages: Show Stage 1 Spinner, Hide Stage 2 Reward
        const spinStage = document.getElementById('wheel-spin-stage');
        const rewardStage = document.getElementById('wheel-reward-stage');
        if (spinStage) spinStage.classList.remove('hidden');
        if (rewardStage) rewardStage.classList.add('hidden');

        const disc = document.getElementById('wheel-disc');
        if (disc) disc.style.transform = 'rotate(0deg)';

        const spins = this.getDailyWheelSpinsCount();
        const statusBadge = document.getElementById('wheel-status-badge');
        const btnSpin = document.getElementById('btn-spin-wheel');
        const txtSpin = document.getElementById('txt-spin-btn');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (statusBadge && btnSpin && txtSpin) {"""

new_open_modal = """    openWheelModal() {
        this.renderWheelCanvas();
        const disc = document.getElementById('wheel-disc');
        if (disc) disc.style.transform = 'rotate(0deg)';

        const spins = this.getDailyWheelSpinsCount();
        const statusBadge = document.getElementById('wheel-status-badge');
        const btnSpin = document.getElementById('btn-spin-wheel');
        const txtSpin = document.getElementById('txt-spin-btn');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (statusBadge && btnSpin && txtSpin) {"""

if old_open_modal in js_content:
    js_content = js_content.replace(old_open_modal, new_open_modal, 1)

# Add triggerWheelRewardModal method
trigger_wheel_reward_method = """
    triggerWheelRewardModal(reward) {
        const modalChest = document.getElementById('modal-chest');
        const starDisp = document.getElementById('chest-star-display');
        const titleEl = document.getElementById('chest-modal-title');
        const descEl = document.getElementById('chest-modal-desc');
        const btnOpenChest = document.getElementById('btn-open-chest');
        const rewardContent = document.getElementById('chest-reward-content');
        const rewardListEl = document.getElementById('chest-reward-list');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (starDisp) starDisp.innerText = '🎡 🌟 🎡';
        if (titleEl) titleEl.innerText = dict.wheelRewardTitle || '🎡 ŞANS ÇARKI ÖDÜLÜ! 🎉';
        if (descEl) descEl.innerText = dict.wheelRewardDesc || '🏆 Çarktan Çıkan Ödülleriniz:';

        // Hide Stage 1 button directly and open Stage 2 reward list!
        if (btnOpenChest) {
            btnOpenChest.style.display = 'none';
            btnOpenChest.classList.add('hidden');
        }

        const awardedPieces = [];
        let goldReward = 0;

        if (reward.type === 'gold') {
            goldReward = reward.amount;
        } else {
            for (let i = 0; i < reward.count; i++) {
                const piece = this.awardRandomMissingPuzzlePiece();
                if (piece) awardedPieces.push(piece);
            }
        }

        this.pendingChestReward = { gold: goldReward, pieces: awardedPieces };
        this.hasOpenedChestThisLevel = false;

        if (rewardListEl) {
            rewardListEl.innerHTML = '';
            
            if (goldReward > 0) {
                const item = document.createElement('div');
                item.className = 'chest-reward-item reward-gold';
                const goldText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', goldReward);
                item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">${goldText}</div>`;
                rewardListEl.appendChild(item);
            }

            if (awardedPieces.length > 0) {
                for (const piece of awardedPieces) {
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item reward-piece';
                    const localizedName = this.getPuzzleName(piece.puzzleId);
                    if (piece.isDuplicate) {
                        const dupMsg = (dict.duplicatePieceConverted || '(Varolan {name} #{idx} Dönüştü!)').replace('{name}', localizedName).replace('{idx}', piece.pieceIndex + 1);
                        item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">+50 ALTIN <span class="dup-note">${dupMsg}</span></div>`;
                    } else {
                        const pieceMsg = (dict.puzzlePieceEarned || '{name} Parçası #{idx}').replace('{name}', localizedName).replace('{idx}', piece.pieceIndex + 1);
                        item.innerHTML = `<div class="reward-icon">🧩</div><div class="reward-text">${pieceMsg}</div>`;
                    }
                    rewardListEl.appendChild(item);
                }
            }
        }

        if (rewardContent) rewardContent.classList.remove('hidden');
        if (modalChest) modalChest.classList.remove('hidden');
    }
"""

if "triggerWheelRewardModal" not in js_content:
    insert_before = "    rollWheelReward() {"
    if insert_before in js_content:
        js_content = js_content.replace(insert_before, trigger_wheel_reward_method + "\n" + insert_before, 1)

# Update spinWheelAction timeout to close wheel modal & call triggerWheelRewardModal
old_spin_timeout = """            setTimeout(() => {
                // Instantly consume spin right & update status/badges
                this.incrementWheelSpinsCount();
                this.pendingWheelReward = reward;

                if (this.fx && typeof this.fx.spawnConfetti === 'function') {
                    this.fx.spawnConfetti();
                }
                this.sound.playVictorySound();

                // Transition to Stage 2: Reward Announcement View
                const spinStage = document.getElementById('wheel-spin-stage');
                const rewardStage = document.getElementById('wheel-reward-stage');
                const rewardIcon = document.getElementById('wheel-reward-icon');
                const rewardDetail = document.getElementById('wheel-reward-detail');
                const dict = this.i18n[this.settings.lang] || this.i18n.tr;

                if (spinStage) spinStage.classList.add('hidden');
                if (rewardStage) rewardStage.classList.remove('hidden');

                if (reward.type === 'gold') {
                    if (rewardIcon) rewardIcon.innerText = '🪙';
                    if (rewardDetail) rewardDetail.innerText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', reward.amount);
                } else {
                    if (rewardIcon) rewardIcon.innerText = '🧩';
                    if (rewardDetail) rewardDetail.innerText = (dict.wheelPiecesWonText || '{count} Adet Yapboz Parçası Kazandın!').replace('{count}', reward.count);
                }
            }, 4100);"""

new_spin_timeout = """            setTimeout(() => {
                // Instantly consume spin right & update status/badges
                this.incrementWheelSpinsCount();

                if (this.fx && typeof this.fx.spawnConfetti === 'function') {
                    this.fx.spawnConfetti();
                }
                this.sound.playVictorySound();

                // Close wheel modal completely & pop up the standard 3D Reward Modal!
                const modalWheel = document.getElementById('modal-wheel');
                if (modalWheel) modalWheel.classList.add('hidden');

                this.triggerWheelRewardModal(reward);
            }, 4100);"""

if old_spin_timeout in js_content:
    js_content = js_content.replace(old_spin_timeout, new_spin_timeout, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
