with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

restored_wheel_methods = """    getWheelSegments() {
        const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
        const pasLabel = dict.pasText || 'PAS ❌';

        return [
            { id: 'pas_1', type: 'pas', text: pasLabel, icon: '💨', prob: 5, bg: '#64748b', color: '#ffffff' },
            { id: 'gold_10', type: 'gold', amount: 10, text: '10 ALTIN', icon: '🪙', prob: 28, bg: '#f59e0b', color: '#ffffff' },
            { id: 'piece_1', type: 'piece', count: 1, text: '1 PARÇA', icon: '🧩', prob: 10, bg: '#8b5cf6', color: '#ffffff' },
            { id: 'gold_15', type: 'gold', amount: 15, text: '15 ALTIN', icon: '🪙', prob: 20, bg: '#3b82f6', color: '#ffffff' },
            { id: 'piece_2', type: 'piece', count: 2, text: '2 PARÇA', icon: '🧩', prob: 4, bg: '#ec4899', color: '#ffffff' },
            { id: 'gold_20', type: 'gold', amount: 20, text: '20 ALTIN', icon: '🪙', prob: 14, bg: '#10b981', color: '#ffffff' },
            { id: 'pas_2', type: 'pas', text: pasLabel, icon: '💨', prob: 5, bg: '#475569', color: '#ffffff' },
            { id: 'gold_25', type: 'gold', amount: 25, text: '25 ALTIN', icon: '🪙', prob: 8, bg: '#f97316', color: '#ffffff' },
            { id: 'gold_50', type: 'gold', amount: 50, text: '50 ALTIN', icon: '🪙', prob: 4, bg: '#06b6d4', color: '#ffffff' },
            { id: 'piece_3', type: 'piece', count: 3, text: '3 PARÇA', icon: '🌟', prob: 2, bg: '#eab308', color: '#0f172a' }
        ];
    }

    renderWheelCanvas() {
        const canvas = document.getElementById('wheel-canvas');
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');

        const segments = this.getWheelSegments();
        const cx = 140, cy = 140, r = 135;

        ctx.clearRect(0, 0, 280, 280);

        let currentAngle = 0;
        for (let i = 0; i < segments.length; i++) {
            const segAngle = (segments[i].prob / 100) * (2 * Math.PI);
            const startAngle = currentAngle;
            const endAngle = currentAngle + segAngle;

            ctx.beginPath();
            ctx.fillStyle = segments[i].bg;
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, endAngle);
            ctx.lineTo(cx, cy);
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Render Segment Labels & Icons
            const midAngle = startAngle + segAngle / 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(midAngle);
            ctx.textAlign = 'right';
            ctx.fillStyle = segments[i].color;
            ctx.font = '900 12px sans-serif';

            const degrees = (segments[i].prob / 100) * 360;
            if (degrees < 12) {
                ctx.font = '900 9px sans-serif';
            } else if (degrees < 20) {
                ctx.font = '900 10.5px sans-serif';
            }

            ctx.fillText(`${segments[i].icon} ${segments[i].text}`, r - 12, 4);
            ctx.restore();

            currentAngle = endAngle;
        }
    }

    openWheelModal() {
        this.renderWheelCanvas();
        const disc = document.getElementById('wheel-disc');
        if (disc) disc.style.transform = 'rotate(0deg)';

        this.updateWheelTimerState();
        const modalWheel = document.getElementById('modal-wheel');
        if (modalWheel) modalWheel.classList.remove('hidden');
    }

    rollWheelReward() {
        const segments = this.getWheelSegments();
        const rand = Math.random() * 100;
        let cumulative = 0;

        for (let i = 0; i < segments.length; i++) {
            cumulative += segments[i].prob;
            if (rand <= cumulative) {
                return { seg: segments[i], segIndex: i };
            }
        }
        return { seg: segments[0], segIndex: 0 };
    }

    spinWheelAction() {
        const spins = this.getDailyWheelSpinsCount();
        if (spins >= 2) {
            this.sound.playLockThud();
            const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            this.showToast(dict.wheelLimitReached || '⚠️ Bugünkü Çark Haklarınız Bitti! (2/2)');
            return;
        }

        const executeSpin = () => {
            const btnSpin = document.getElementById('btn-spin-wheel');
            if (btnSpin) btnSpin.disabled = true;

            const roll = this.rollWheelReward();
            const selectedSeg = roll.seg;
            const segIndex = roll.segIndex;
            const segments = this.getWheelSegments();

            let cumulativeAngleDeg = 0;
            for (let i = 0; i < segIndex; i++) {
                cumulativeAngleDeg += (segments[i].prob / 100) * 360;
            }
            const segSliceDeg = (selectedSeg.prob / 100) * 360;
            const midAngleDeg = cumulativeAngleDeg + (segSliceDeg / 2);

            let degreesToTarget = 270 - midAngleDeg;
            while (degreesToTarget < 0) degreesToTarget += 360;

            const targetRotationDeg = (360 * 5) + degreesToTarget;

            const disc = document.getElementById('wheel-disc');
            if (disc) {
                disc.style.transform = `rotate(${targetRotationDeg}deg)`;
            }

            this.sound.playBoosterChime();

            setTimeout(() => {
                this.incrementWheelSpinsCount();

                if (this.fx && typeof this.fx.spawnConfetti === 'function') {
                    this.fx.spawnConfetti();
                }
                this.sound.playVictorySound();

                const modalWheel = document.getElementById('modal-wheel');
                if (modalWheel) modalWheel.classList.add('hidden');

                this.triggerWheelRewardModal(selectedSeg);
            }, 4100);
        };

        if (spins === 0) {
            executeSpin();
        } else {
            this.showRewardedAd(() => {
                executeSpin();
            });
        }
    }

    triggerWheelRewardModal(seg) {
        const modalChest = document.getElementById('modal-chest');
        const starDisp = document.getElementById('chest-star-display');
        const titleEl = document.getElementById('chest-modal-title');
        const descEl = document.getElementById('chest-modal-desc');
        const btnOpenChest = document.getElementById('btn-open-chest');
        const rewardContent = document.getElementById('chest-reward-content');
        const rewardListEl = document.getElementById('chest-reward-list');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (seg.type === 'pas') {
            if (starDisp) starDisp.innerText = '💨 ❌ 💨';
            if (titleEl) titleEl.innerText = dict.pasWonTitle || '💨 PAS GEÇTİN!';
            if (descEl) descEl.innerText = dict.pasWonDesc || 'Bu çevirmede şansın yaver gitmedi, tekrar dene!';
            this.pendingChestReward = { gold: 0, pieces: [] };
        } else if (seg.type === 'gold') {
            if (starDisp) starDisp.innerText = '🎡 🪙 🎡';
            if (titleEl) titleEl.innerText = dict.wheelRewardTitle || '🎡 ŞANS ÇARKI ÖDÜLÜ! 🎉';
            if (descEl) descEl.innerText = dict.wheelRewardDesc || '🏆 Çarktan Çıkan Ödülleriniz:';
            this.pendingChestReward = { gold: seg.amount, pieces: [] };
        } else {
            if (starDisp) starDisp.innerText = '🎡 🧩 🎡';
            if (titleEl) titleEl.innerText = dict.wheelRewardTitle || '🎡 ŞANS ÇARKI ÖDÜLÜ! 🎉';
            if (descEl) descEl.innerText = dict.wheelRewardDesc || '🏆 Çarktan Çıkan Ödülleriniz:';
            
            const awardedPieces = [];
            for (let i = 0; i < seg.count; i++) {
                const piece = this.awardRandomMissingPuzzlePiece();
                if (piece) awardedPieces.push(piece);
            }
            this.pendingChestReward = { gold: 0, pieces: awardedPieces };
        }

        if (btnOpenChest) {
            btnOpenChest.style.display = 'none';
            btnOpenChest.classList.add('hidden');
        }

        this.hasOpenedChestThisLevel = false;

        if (rewardListEl) {
            rewardListEl.innerHTML = '';

            if (seg.type === 'pas') {
                const item = document.createElement('div');
                item.className = 'chest-reward-item reward-gold';
                item.style.borderColor = '#64748b';
                item.innerHTML = `<div class="reward-icon">💨</div><div class="reward-text">${dict.pasWonTitle || 'PAS GEÇTİN!'}</div>`;
                rewardListEl.appendChild(item);
            } else {
                if (this.pendingChestReward.gold > 0) {
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item reward-gold';
                    const goldText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', this.pendingChestReward.gold);
                    item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">${goldText}</div>`;
                    rewardListEl.appendChild(item);
                }

                if (this.pendingChestReward.pieces && this.pendingChestReward.pieces.length > 0) {
                    for (const piece of this.pendingChestReward.pieces) {
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
        }

        if (rewardContent) rewardContent.classList.remove('hidden');
        if (modalChest) modalChest.classList.remove('hidden');
    }
"""

start_pos = js_content.find("    getWheelSegments() {")
if start_pos == -1:
    start_pos = js_content.find("    renderWheelCanvas() {")

end_pos = js_content.find("    showMainMenuBannerAd() {")

if start_pos != -1 and end_pos != -1:
    js_content = js_content[:start_pos] + restored_wheel_methods + "\n\n" + js_content[end_pos:]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
