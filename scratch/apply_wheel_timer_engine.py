with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add timer i18n keys for all 7 languages
timer_i18n = [
    ('tr: {', 'tr: {\n                wheelAdCooldownTag: "⏳ REKLAMLI ÇEVİRME: {time}",\n                wheelResetTag: "⏳ YARIN GEL: {time}",\n                wheelAdCooldownBadge: "⏳ 8 SAATLİK REKLAM SOĞUMA SÜRESİ: {time}",\n                wheelResetBadge: "⏳ 24 SAATLİK YENİLENME SÜRESİ: {time}",'),
    ('en: {', 'en: {\n                wheelAdCooldownTag: "⏳ AD SPIN IN: {time}",\n                wheelResetTag: "⏳ BACK IN: {time}",\n                wheelAdCooldownBadge: "⏳ 8-HOUR AD COOLDOWN: {time}",\n                wheelResetBadge: "⏳ 24-HOUR RESET TIMER: {time}",'),
    ('de: {', 'de: {\n                wheelAdCooldownTag: "⏳ WERBUNG IN: {time}",\n                wheelResetTag: "⏳ MORGEN WIEDER: {time}",\n                wheelAdCooldownBadge: "⏳ 8-STUNDEN-WERBEPAUSE: {time}",\n                wheelResetBadge: "⏳ 24-STUNDEN-NEUSTART: {time}",'),
    ('fr: {', 'fr: {\n                wheelAdCooldownTag: "⏳ PUB DANS: {time}",\n                wheelResetTag: "⏳ REVENEZ DANS: {time}",\n                wheelAdCooldownBadge: "⏳ PAUSE PUB 8H: {time}",\n                wheelResetBadge: "⏳ RECHARGE EN 24H: {time}",'),
    ('it: {', 'it: {\n                wheelAdCooldownTag: "⏳ PUBBLICITÀ TRA: {time}",\n                wheelResetTag: "⏳ TORNA TRA: {time}",\n                wheelAdCooldownBadge: "⏳ PAUSA PUBBLICITÀ 8 ORE: {time}",\n                wheelResetBadge: "⏳ REIMPOSTAZIONE 24 ORE: {time}",'),
    ('es: {', 'es: {\n                wheelAdCooldownTag: "⏳ ANUNCIO EN: {time}",\n                wheelResetTag: "⏳ VUELVE EN: {time}",\n                wheelAdCooldownBadge: "⏳ ESPERA DE 8 HORAS: {time}",\n                wheelResetBadge: "⏳ REINICIO EN 24 HORAS: {time}",'),
    ('pt: {', 'pt: {\n                wheelAdCooldownTag: "⏳ ANÚNCIO EM: {time}",\n                wheelResetTag: "⏳ VOLTE EM: {time}",\n                wheelAdCooldownBadge: "⏳ INTERVALO DE 8 HORAS: {time}",\n                wheelResetBadge: "⏳ REINÍCIO EM 24 HORAS: {time}",')
]

for old, new in timer_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Upgrade Wheel Timer Methods
old_wheel_methods = """    getDailyWheelSpinsCount() {
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
    }"""

new_wheel_methods = """    // =========================================================
    // CUTE 3D LUCKY WHEEL ENGINE WITH 8-HR COOLDOWN & 24-HR RESET
    // =========================================================
    getDailyWheelSpinsCount() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const savedDate = localStorage.getItem('tile_game_wheel_date');
            const savedSpins = parseInt(localStorage.getItem('tile_game_wheel_spins') || '0', 10);

            if (savedDate !== todayStr) {
                localStorage.setItem('tile_game_wheel_date', todayStr);
                localStorage.setItem('tile_game_wheel_spins', '0');
                localStorage.setItem('tile_game_wheel_last_spin_time', '0');
                return 0;
            }
            return savedSpins;
        } catch (e) {
            return 0;
        }
    }

    getLastWheelSpinTime() {
        try {
            return parseInt(localStorage.getItem('tile_game_wheel_last_spin_time') || '0', 10);
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
            localStorage.setItem('tile_game_wheel_last_spin_time', Date.now().toString());
            this.updateWheelTimerState();
        } catch (e) {}
    }

    formatTimeLeft(ms) {
        if (ms <= 0) return '00:00:00';
        const totalSecs = Math.floor(ms / 1000);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateWheelTimerState() {
        const widgetTag = document.querySelector('.wheel-widget-label');
        const statusBadge = document.getElementById('wheel-status-badge');
        const btnSpin = document.getElementById('btn-spin-wheel');
        const txtSpin = document.getElementById('txt-spin-btn');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        const spins = this.getDailyWheelSpinsCount();
        const lastSpinTime = this.getLastWheelSpinTime();
        const now = Date.now();

        // 8 Hours Cooldown = 8 * 60 * 60 * 1000 = 28,800,000 ms
        const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
        const cooldownRemaining = Math.max(0, (lastSpinTime + EIGHT_HOURS_MS) - now);

        // 24 Hours Midnight Reset Remaining
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const resetRemaining = Math.max(0, midnight.getTime() - now);

        if (spins === 0) {
            // Spin 0: Free Spin Ready
            if (widgetTag) {
                widgetTag.innerText = dict.wheelWidgetTag || 'ÇARK';
                widgetTag.style.background = '#f59e0b';
            }
            if (statusBadge && txtSpin && btnSpin) {
                statusBadge.innerText = dict.wheelStatusFree || '✨ 1 ÜCRETSİZ ÇEVİRME HAKKI';
                statusBadge.style.color = '#fbbf24';
                txtSpin.innerText = dict.spinBtnFree || '🎯 ÜCRETSİZ ÇEVİR!';
                btnSpin.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                btnSpin.disabled = false;
            }
        } else if (spins === 1) {
            // Spin 1: Free spin used, check 8-hour ad cooldown
            if (cooldownRemaining > 0) {
                const timeStr = this.formatTimeLeft(cooldownRemaining);
                if (widgetTag) {
                    widgetTag.innerText = timeStr;
                    widgetTag.style.background = '#8b5cf6';
                }
                if (statusBadge && txtSpin && btnSpin) {
                    statusBadge.innerText = (dict.wheelAdCooldownBadge || '⏳ 8 SAATLİK REKLAM SOĞUMA SÜRESİ: {time}').replace('{time}', timeStr);
                    statusBadge.style.color = '#c084fc';
                    txtSpin.innerText = (dict.wheelAdCooldownTag || '⏳ REKLAMLI ÇEVİRME: {time}').replace('{time}', timeStr);
                    btnSpin.style.background = '#475569';
                    btnSpin.disabled = true;
                }
            } else {
                // 8 Hours Cooldown Passed! Ad Spin Unlocked!
                if (widgetTag) {
                    widgetTag.innerText = 'REKLAM';
                    widgetTag.style.background = '#8b5cf6';
                }
                if (statusBadge && txtSpin && btnSpin) {
                    statusBadge.innerText = dict.wheelStatusAd || '📺 1 REKLAMLI ÇEVİRME HAKKI';
                    statusBadge.style.color = '#c084fc';
                    txtSpin.innerText = dict.spinBtnAd || '📺 REKLAM İZLE & ÇEVİR!';
                    btnSpin.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
                    btnSpin.disabled = false;
                }
            }
        } else {
            // Spin 2: All spins done today, 24-hour midnight reset countdown
            const timeStr = this.formatTimeLeft(resetRemaining);
            if (widgetTag) {
                widgetTag.innerText = dict.adFullTag || 'DOLDU';
                widgetTag.style.background = '#ef4444';
            }
            if (statusBadge && txtSpin && btnSpin) {
                statusBadge.innerText = (dict.wheelResetBadge || '⏳ 24 SAATLİK YENİLENME SÜRESİ: {time}').replace('{time}', timeStr);
                statusBadge.style.color = '#ef4444';
                txtSpin.innerText = (dict.wheelResetTag || '⏳ YARIN GEL: {time}').replace('{time}', timeStr);
                btnSpin.style.background = '#475569';
                btnSpin.disabled = true;
            }
        }
    }

    startWheelTimerLoop() {
        if (this.wheelTimerInterval) clearInterval(this.wheelTimerInterval);
        this.updateWheelTimerState();
        this.wheelTimerInterval = setInterval(() => {
            this.updateWheelTimerState();
        }, 1000);
    }"""

if old_wheel_methods in js_content:
    js_content = js_content.replace(old_wheel_methods, new_wheel_methods, 1)

# Update openWheelModal to call updateWheelTimerState
old_open_modal = """    openWheelModal() {
        this.renderWheelCanvas();
        const disc = document.getElementById('wheel-disc');
        if (disc) disc.style.transform = 'rotate(0deg)';

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
    }"""

new_open_modal = """    openWheelModal() {
        this.renderWheelCanvas();
        const disc = document.getElementById('wheel-disc');
        if (disc) disc.style.transform = 'rotate(0deg)';

        this.updateWheelTimerState();
        document.getElementById('modal-wheel').classList.remove('hidden');
    }"""

if old_open_modal in js_content:
    js_content = js_content.replace(old_open_modal, new_open_modal, 1)

# Ensure startWheelTimerLoop is called during initUI and applyLanguage
apply_lang_target = "this.updateWheelWidgetUI();"
if apply_lang_target in js_content:
    js_content = js_content.replace(apply_lang_target, "this.updateWheelTimerState();")

init_ui_target = "this.updateMainMenuButtons();"
if init_ui_target in js_content:
    js_content = js_content.replace(init_ui_target, "this.updateMainMenuButtons();\n        this.startWheelTimerLoop();")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
