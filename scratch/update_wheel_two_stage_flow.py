with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add new i18n keys for wheel reward stage
wheel_stage2_i18n = [
    ('tr: {', 'tr: {\n                wheelWonTitle: "🎉 TEBRİKLER! ÖDÜL KAZANDIN!",\n                wheelPiecesWonText: "{count} Adet Yapboz Parçası Kazandın!",'),
    ('en: {', 'en: {\n                wheelWonTitle: "🎉 CONGRATULATIONS! YOU WON!",\n                wheelPiecesWonText: "{count} Puzzle Piece(s) Won!",'),
    ('de: {', 'de: {\n                wheelWonTitle: "🎉 GLÜCKWUNSCH! GEWONNEN!",\n                wheelPiecesWonText: "{count} Puzzleteil(e) gewonnen!",'),
    ('fr: {', 'fr: {\n                wheelWonTitle: "🎉 FÉLICITATIONS! GAGNÉ!",\n                wheelPiecesWonText: "{count} Pièce(s) de Puzzle Gagnée(s)!",'),
    ('it: {', 'it: {\n                wheelWonTitle: "🎉 CONGRATULAZIONI! HAI VINTO!",\n                wheelPiecesWonText: "{count} Pezzo/i di Puzzle Vinto/i!",'),
    ('es: {', 'es: {\n                wheelWonTitle: "🎉 ¡ENHORABUENA! ¡HAS GANADO!",\n                wheelPiecesWonText: "¡{count} Pieza(s) de Puzzle Ganada(s)!",'),
    ('pt: {', 'pt: {\n                wheelWonTitle: "🎉 PARABÉNS! VOCÊ GANHOU!",\n                wheelPiecesWonText: "{count} Peça(s) de Puzzle Ganha(s)!",')
]

for old, new in wheel_stage2_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Update openWheelModal to reset stages
old_open_modal = """    openWheelModal() {
        this.renderWheelCanvas();
        const spins = this.getDailyWheelSpinsCount();
        const statusBadge = document.getElementById('wheel-status-badge');
        const btnSpin = document.getElementById('btn-spin-wheel');
        const txtSpin = document.getElementById('txt-spin-btn');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (statusBadge && btnSpin && txtSpin) {"""

new_open_modal = """    openWheelModal() {
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

if old_open_modal in js_content:
    js_content = js_content.replace(old_open_modal, new_open_modal, 1)

# Update spinWheelAction to trigger Stage 2 Reward View
old_spin_action = """            setTimeout(() => {
                this.incrementWheelSpinsCount();

                if (reward.type === 'gold') {
                    this.goldCoins += reward.amount;
                    const goldEl = document.getElementById('gold-val');
                    if (goldEl) goldEl.innerText = this.goldCoins;
                    this.fx.triggerSparkles();
                    this.sound.playVictorySound();
                    this.showToast(`🎉 ŞANS ÇARKI ÖDÜLÜ: +${reward.amount} ALTIN KAZANDIN! 🪙`);
                } else {
                    const awardedPieces = [];
                    for (let i = 0; i < reward.count; i++) {
                        const piece = this.awardRandomMissingPuzzlePiece();
                        if (piece) awardedPieces.push(piece);
                    }
                    this.fx.triggerSparkles();
                    this.sound.playVictorySound();
                    this.showToast(`🎉 ŞANS ÇARKI ÖDÜLÜ: ${reward.count} ADET YAPBOZ PARÇASI KAZANDIN! 🧩`);
                }

                this.saveGameProgress();

                setTimeout(() => {
                    document.getElementById('modal-wheel').classList.add('hidden');
                    if (disc) disc.style.transform = 'rotate(0deg)';
                }, 1200);
            }, 4100);"""

new_spin_action = """            setTimeout(() => {
                // Instantly consume spin right & update status/badges
                this.incrementWheelSpinsCount();
                this.pendingWheelReward = reward;

                this.fx.triggerSparkles();
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

if old_spin_action in js_content:
    js_content = js_content.replace(old_spin_action, new_spin_action, 1)

# Add event listener for btn-collect-wheel-reward
old_wheel_listeners = """        const btnSpinWheel = document.getElementById('btn-spin-wheel');
        if (btnSpinWheel) {
            btnSpinWheel.addEventListener('click', () => {
                this.spinWheelAction();
            });
        }"""

new_wheel_listeners = """        const btnSpinWheel = document.getElementById('btn-spin-wheel');
        if (btnSpinWheel) {
            btnSpinWheel.addEventListener('click', () => {
                this.spinWheelAction();
            });
        }

        const btnCollectWheel = document.getElementById('btn-collect-wheel-reward');
        if (btnCollectWheel) {
            btnCollectWheel.addEventListener('click', () => {
                this.sound.playClick();
                if (this.pendingWheelReward) {
                    if (this.pendingWheelReward.type === 'gold') {
                        this.goldCoins += this.pendingWheelReward.amount;
                        const goldEl = document.getElementById('gold-val');
                        if (goldEl) goldEl.innerText = this.goldCoins;
                    } else {
                        for (let i = 0; i < this.pendingWheelReward.count; i++) {
                            this.awardRandomMissingPuzzlePiece();
                        }
                    }
                    this.pendingWheelReward = null;
                    this.saveGameProgress();
                }
                
                // Re-open wheel modal stage 1 to show updated spin limits (1/2 -> 2/2)
                this.openWheelModal();
            });
        }"""

if old_wheel_listeners in js_content:
    js_content = js_content.replace(old_wheel_listeners, new_wheel_listeners, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
