with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add Wheel i18n keys for all 7 languages
wheel_i18n_additions = [
    ('tr: {', 'tr: {\n                wheelWidgetTag: "ÇARK",\n                wheelTitle: "🎡 ŞANS ÇARKI 🎁",\n                wheelSubtitle: "Çarkı çevir, sürpriz altın ve yapboz parçaları kazan!",\n                spinBtnFree: "🎯 ÜCRETSİZ ÇEVİR!",\n                spinBtnAd: "📺 REKLAM İZLE & ÇEVİR!",\n                wheelLimitReached: "⚠️ Bugünkü Çark Haklarınız Bitti! (2/2 - Yarın Tekrar Gel 🎁)",\n                wheelStatusFree: "✨ 1 ÜCRETSİZ ÇEVİRME HAKKI",\n                wheelStatusAd: "📺 1 REKLAMLI ÇEVİRME HAKKI",\n                wheelStatusDone: "🔒 BUGÜNKÜ HAKLAR DOLDU (2/2)",'),
    ('en: {', 'en: {\n                wheelWidgetTag: "WHEEL",\n                wheelTitle: "🎡 LUCKY WHEEL 🎁",\n                wheelSubtitle: "Spin the wheel to win gold and puzzle pieces!",\n                spinBtnFree: "🎯 SPIN FOR FREE!",\n                spinBtnAd: "📺 WATCH AD & SPIN!",\n                wheelLimitReached: "⚠️ Daily Wheel Limit Reached! (2/2 - Come Back Tomorrow 🎁)",\n                wheelStatusFree: "✨ 1 FREE SPIN AVAILABLE",\n                wheelStatusAd: "📺 1 REWARDED AD SPIN AVAILABLE",\n                wheelStatusDone: "🔒 DAILY LIMIT REACHED (2/2)",'),
    ('de: {', 'de: {\n                wheelWidgetTag: "RAD",\n                wheelTitle: "🎡 GLÜCKSRAD 🎁",\n                wheelSubtitle: "Drehe das Rad und gewinne Gold & Puzzleteile!",\n                spinBtnFree: "🎯 KOSTENLOS DREHEN!",\n                spinBtnAd: "📺 WERBUNG SEHEN & DREHEN!",\n                wheelLimitReached: "⚠️ Tägliches Rad-Limit erreicht! (2/2 - Morgen wiederkommen 🎁)",\n                wheelStatusFree: "✨ 1 KOSTENLOSE DREHUNG",\n                wheelStatusAd: "📺 1 WERBUNG-DREHUNG VERFÜGBAR",\n                wheelStatusDone: "🔒 TÄGLICHES LIMIT ERREICHT (2/2)",'),
    ('fr: {', 'fr: {\n                wheelWidgetTag: "ROUE",\n                wheelTitle: "🎡 ROUE DE LA FORTUNE 🎁",\n                wheelSubtitle: "Tournez la roue et gagnez de l\'or et des pièces de puzzle!",\n                spinBtnFree: "🎯 TOURNER GRATUITEMENT!",\n                spinBtnAd: "📺 REGARDER PUB & TOURNER!",\n                wheelLimitReached: "⚠️ Limite quotidienne de la roue atteinte! (2/2 - Revenez demain 🎁)",\n                wheelStatusFree: "✨ 1 TOUR GRATUIT DISPONIBLE",\n                wheelStatusAd: "📺 1 TOUR AVEC PUB DISPONIBLE",\n                wheelStatusDone: "🔒 LIMITE ATTEINTE (2/2)",'),
    ('it: {', 'it: {\n                wheelWidgetTag: "RUOTA",\n                wheelTitle: "🎡 RUOTA DELLA FORTUNA 🎁",\n                wheelSubtitle: "Gira la ruota per vincere oro e pezzi di puzzle!",\n                spinBtnFree: "🎯 GIRA GRATIS!",\n                spinBtnAd: "📺 GUARDA PUBBLICITÀ E GIRA!",\n                wheelLimitReached: "⚠️ Limite giornaliero ruota raggiunto! (2/2 - Torna domani 🎁)",\n                wheelStatusFree: "✨ 1 GIRO GRATUITO DISPONIBILE",\n                wheelStatusAd: "📺 1 GIRO CON PUBBLICITÀ DISPONIBILE",\n                wheelStatusDone: "🔒 LIMITE GIORNALIERO RAGGIUNTO (2/2)",'),
    ('es: {', 'es: {\n                wheelWidgetTag: "RUEDA",\n                wheelTitle: "🎡 RUEDA DE LA SUERTE 🎁",\n                wheelSubtitle: "¡Gira la rueda para ganar oro y piezas de puzzle!",\n                spinBtnFree: "🎯 ¡GIRAR GRATIS!",\n                spinBtnAd: "📺 ¡VER ANUNCIO Y GIRAR!",\n                wheelLimitReached: "⚠️ ¡Límite diario de la rueda alcanzado! (2/2 - Vuelve mañana 🎁)",\n                wheelStatusFree: "✨ 1 GIRO GRATIS DISPONIBLE",\n                wheelStatusAd: "📺 1 GIRO CON ANUNCIO DISPONIBLE",\n                wheelStatusDone: "🔒 LÍMITE DIARIO ALCANZADO (2/2)",'),
    ('pt: {', 'pt: {\n                wheelWidgetTag: "RODA",\n                wheelTitle: "🎡 RODA DA SORTE 🎁",\n                wheelSubtitle: "Gire a roda para ganhar ouro e peças de puzzle!",\n                spinBtnFree: "🎯 GIRAR GRÁTIS!",\n                spinBtnAd: "📺 VER ANÚNCIO E GIRAR!",\n                wheelLimitReached: "⚠️ Limite diário da roda atingido! (2/2 - Volte amanhã 🎁)",\n                wheelStatusFree: "✨ 1 GIRO GRÁTIS DISPONÍVEL",\n                wheelStatusAd: "📺 1 GIRO COM ANÚNCIO DISPONÍVEL",\n                wheelStatusDone: "🔒 LIMITE DIÁRIO ATINGIDO (2/2)",')
]

for old, new in wheel_i18n_additions:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Add Wheel Controller Methods
wheel_engine_methods = """
    // =========================================================
    // CUTE 3D LUCKY WHEEL ENGINE (85% GOLD / 15% PIECES)
    // =========================================================
    getDailyWheelSpinsCount() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const savedDate = localStorage.getItem('tile_game_wheel_date');
            const savedSpins = parseInt(localStorage.getItem('tile_game_wheel_spins') || '0', 10);

            if (savedDate !== todayStr) {
                localStorage.setItem('tile_game_wheel_date', todayStr);
                localStorage.setItem('tile_game_wheel_spins', '0');
                return 0;
            }
            return savedSpins;
        } catch (e) {
            return 0;
        }
    }

    incrementWheelSpinsCount() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const currentSpins = this.getDailyWheelSpinsCount();
            localStorage.setItem('tile_game_wheel_date', todayStr);
            localStorage.setItem('tile_game_wheel_spins', (currentSpins + 1).toString());
            this.updateWheelWidgetUI();
        } catch (e) {}
    }

    updateWheelWidgetUI() {
        const widgetTag = document.querySelector('.wheel-widget-label');
        const spins = this.getDailyWheelSpinsCount();
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (widgetTag) {
            if (spins === 0) {
                widgetTag.innerText = dict.wheelWidgetTag || 'ÇARK';
                widgetTag.style.background = '#f59e0b';
            } else if (spins === 1) {
                widgetTag.innerText = 'REKLAM';
                widgetTag.style.background = '#8b5cf6';
            } else {
                widgetTag.innerText = dict.adFullTag || 'DOLDU';
                widgetTag.style.background = '#ef4444';
            }
        }
    }

    renderWheelCanvas() {
        const canvas = document.getElementById('wheel-canvas');
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');

        const segments = [
            { text: '10 ALTIN', icon: '🪙', bg: '#f59e0b', color: '#ffffff' },
            { text: '1 PARÇA', icon: '🧩', bg: '#8b5cf6', color: '#ffffff' },
            { text: '15 ALTIN', icon: '🪙', bg: '#3b82f6', color: '#ffffff' },
            { text: '2 PARÇA', icon: '🧩', bg: '#ec4899', color: '#ffffff' },
            { text: '20 ALTIN', icon: '🪙', bg: '#10b981', color: '#ffffff' },
            { text: '25 ALTIN', icon: '🪙', bg: '#f97316', color: '#ffffff' },
            { text: '50 ALTIN', icon: '🪙', bg: '#06b6d4', color: '#ffffff' },
            { text: '3 PARÇA', icon: '🌟', bg: '#eab308', color: '#0f172a' }
        ];

        const numSegs = segments.length;
        const arc = (2 * Math.PI) / numSegs;
        const cx = 140, cy = 140, r = 135;

        ctx.clearRect(0, 0, 280, 280);

        for (let i = 0; i < numSegs; i++) {
            const angle = i * arc;
            ctx.beginPath();
            ctx.fillStyle = segments[i].bg;
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, angle, angle + arc);
            ctx.lineTo(cx, cy);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Render Segment Labels & Icons
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = segments[i].color;
            ctx.font = '900 13px sans-serif';
            ctx.fillText(`${segments[i].icon} ${segments[i].text}`, r - 15, 5);
            ctx.restore();
        }
    }

    openWheelModal() {
        this.renderWheelCanvas();
        const spins = this.getDailyWheelSpinsCount();
        const statusBadge = document.getElementById('wheel-status-badge');
        const btnSpin = document.getElementById('btn-spin-wheel');
        const txtSpin = document.getElementById('txt-spin-btn');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (statusBadge && btnSpin && txtSpin) {
            if (spins === 0) {
                statusBadge.innerText = dict.wheelStatusFree || '✨ 1 ÜCRETSİZ ÇEVİRME HAKKI';
                statusBadge.style.color = '#fbbf24';
                txtSpin.innerText = dict.spinBtnFree || '🎯 ÜCRETSİZ ÇEVİR!';
                btnSpin.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                btnSpin.disabled = false;
            } else if (spins === 1) {
                statusBadge.innerText = dict.wheelStatusAd || '📺 1 REKLAMLI ÇEVİRME HAKKI';
                statusBadge.style.color = '#c084fc';
                txtSpin.innerText = dict.spinBtnAd || '📺 REKLAM İZLE & ÇEVİR!';
                btnSpin.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
                btnSpin.disabled = false;
            } else {
                statusBadge.innerText = dict.wheelStatusDone || '🔒 BUGÜNKÜ HAKLAR DOLDU (2/2)';
                statusBadge.style.color = '#ef4444';
                txtSpin.innerText = 'YARIN GELEBİLİRSİN 🎁';
                btnSpin.style.background = '#475569';
                btnSpin.disabled = true;
            }
        }

        document.getElementById('modal-wheel').classList.remove('hidden');
    }

    rollWheelReward() {
        // 85% Gold / 15% Puzzle Pieces Probability Split
        const isGold = Math.random() < 0.85;

        if (isGold) {
            // Gold internal weighted odds
            const goldRoll = Math.random() * 100;
            let gold = 10;
            let segIdx = 0; // default 10 gold segment

            if (goldRoll <= 32) { gold = 10; segIdx = 0; }
            else if (goldRoll <= 57) { gold = 15; segIdx = 2; }
            else if (goldRoll <= 75) { gold = 20; segIdx = 4; }
            else if (goldRoll <= 85) { gold = 25; segIdx = 5; }
            else if (goldRoll <= 94) { gold = 50; segIdx = 6; }
            else { gold = 100; segIdx = 6; } // 100 Gold hits big 50/100 segment

            return { type: 'gold', amount: gold, segIdx: segIdx };
        } else {
            // Puzzle Piece internal weighted odds
            const pieceRoll = Math.random() * 100;
            let count = 1;
            let segIdx = 1; // default 1 piece segment

            if (pieceRoll <= 70) { count = 1; segIdx = 1; }
            else if (pieceRoll <= 94) { count = 2; segIdx = 3; }
            else { count = 3; segIdx = 7; } // 3 Pieces jackpot

            return { type: 'piece', count: count, segIdx: segIdx };
        }
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

            const reward = this.rollWheelReward();
            const disc = document.getElementById('wheel-disc');
            
            // 8 Segments = 45 deg per segment
            const segAngle = 45;
            // Target angle to land pointer (at top, -90 deg offset)
            const targetRotation = 360 * 5 + (360 - reward.segIdx * segAngle - segAngle / 2);

            if (disc) {
                disc.style.transform = `rotate(${targetRotation}deg)`;
            }

            this.sound.playBoosterChime();

            setTimeout(() => {
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
            }, 4100);
        };

        if (spins === 0) {
            // Free Spin
            executeSpin();
        } else {
            // Rewarded Video Ad Spin
            this.showRewardedAd(() => {
                executeSpin();
            });
        }
    }
"""

if "getDailyWheelSpinsCount" not in js_content:
    insert_before = "    showMainMenuBannerAd() {"
    if insert_before in js_content:
        js_content = js_content.replace(insert_before, wheel_engine_methods + "\n" + insert_before, 1)

# Attach event listeners in initUI
wheel_listeners = """        // LUCKY WHEEL EVENT LISTENERS
        const btnWheel = document.getElementById('btn-menu-wheel');
        if (btnWheel) {
            btnWheel.addEventListener('click', () => {
                this.sound.playClick();
                this.openWheelModal();
            });
        }

        const btnCloseWheel = document.getElementById('btn-close-wheel');
        if (btnCloseWheel) {
            btnCloseWheel.addEventListener('click', () => {
                document.getElementById('modal-wheel').classList.add('hidden');
            });
        }

        const btnSpinWheel = document.getElementById('btn-spin-wheel');
        if (btnSpinWheel) {
            btnSpinWheel.addEventListener('click', () => {
                this.spinWheelAction();
            });
        }"""

if "btn-menu-wheel" not in js_content:
    insert_after_ad_chest = "this.triggerChestRewardModal(stars, false);\n                });\n            });\n        }"
    if insert_after_ad_chest in js_content:
        js_content = js_content.replace(insert_after_ad_chest, insert_after_ad_chest + "\n\n" + wheel_listeners, 1)

# Also update applyLanguage to updateWheelWidgetUI
apply_lang_target = "this.updateAdWidgetUI();"
if apply_lang_target in js_content:
    js_content = js_content.replace(apply_lang_target, "this.updateAdWidgetUI();\n        this.updateWheelWidgetUI();", 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
