with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Fix getDailyAdChestRemaining & getDailyWheelSpinsCount logic
new_reset_fix_code = """    // =========================================================
    // DAILY AD CHEST LIMIT (3 PER DAY) & PER-LEVEL REVIVE (2 PER LEVEL)
    // =========================================================
    getDailyAdChestRemaining() {
        try {
            const resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
            const savedCount = parseInt(localStorage.getItem('tile_game_ad_chest_count') || '0', 10);

            if (resetTime > 0 && Date.now() >= resetTime) {
                localStorage.setItem('tile_game_ad_chest_reset_time', '0');
                localStorage.setItem('tile_game_ad_chest_count', '0');
                return 3;
            }

            if (savedCount >= 3 && resetTime === 0) {
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                localStorage.setItem('tile_game_ad_chest_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
            }

            return Math.max(0, 3 - savedCount);
        } catch (e) {
            return 3;
        }
    }

    useDailyAdChestClaim() {
        try {
            const currentRemaining = this.getDailyAdChestRemaining();
            const usedSoFar = 3 - currentRemaining;
            const newCount = usedSoFar + 1;
            localStorage.setItem('tile_game_ad_chest_count', newCount.toString());

            if (newCount >= 3) {
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                localStorage.setItem('tile_game_ad_chest_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
            }
            this.updateAdWidgetUI();
        } catch (e) {}
    }

    updateAdWidgetUI() {
        const widgetTag = document.querySelector('.ad-widget-label');
        const remaining = this.getDailyAdChestRemaining();
        let resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
        const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});

        if (widgetTag) {
            if (remaining > 0) {
                widgetTag.innerText = `(${remaining}/3)`;
                widgetTag.style.background = '#10b981';
            } else {
                if (resetTime === 0) {
                    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                    resetTime = Date.now() + TWENTY_FOUR_HOURS_MS;
                    localStorage.setItem('tile_game_ad_chest_reset_time', resetTime.toString());
                }
                const resetRemaining = Math.max(0, resetTime - Date.now());
                const timeStr = this.formatTimeLeft(resetRemaining);
                widgetTag.innerText = timeStr;
                widgetTag.style.background = '#ef4444';
            }
        }
    }

    // =========================================================
    // CUTE 3D LUCKY WHEEL ENGINE WITH 8-HR COOLDOWN & 24-HR RESET
    // =========================================================
    getDailyWheelSpinsCount() {
        try {
            const resetTime = parseInt(localStorage.getItem('tile_game_wheel_reset_time') || '0', 10);
            const savedSpins = parseInt(localStorage.getItem('tile_game_wheel_spins') || '0', 10);

            if (resetTime > 0 && Date.now() >= resetTime) {
                localStorage.setItem('tile_game_wheel_reset_time', '0');
                localStorage.setItem('tile_game_wheel_spins', '0');
                localStorage.setItem('tile_game_wheel_last_spin_time', '0');
                return 0;
            }

            if (savedSpins >= 2 && resetTime === 0) {
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                localStorage.setItem('tile_game_wheel_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
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
            const currentSpins = this.getDailyWheelSpinsCount();
            const newSpins = currentSpins + 1;
            localStorage.setItem('tile_game_wheel_spins', newSpins.toString());
            localStorage.setItem('tile_game_wheel_last_spin_time', Date.now().toString());
            
            if (newSpins >= 2) {
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                localStorage.setItem('tile_game_wheel_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
            }
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
        let wheelResetTime = parseInt(localStorage.getItem('tile_game_wheel_reset_time') || '0', 10);
        const now = Date.now();

        const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
        const cooldownRemaining = Math.max(0, (lastSpinTime + EIGHT_HOURS_MS) - now);

        if (spins === 0) {
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
            if (wheelResetTime === 0 || Date.now() >= wheelResetTime) {
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                wheelResetTime = Date.now() + TWENTY_FOUR_HOURS_MS;
                localStorage.setItem('tile_game_wheel_reset_time', wheelResetTime.toString());
            }
            const resetRemaining = Math.max(0, wheelResetTime - now);
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
    }"""

start_pos = js_content.find("    // =========================================================\n    // DAILY AD CHEST LIMIT (3 PER DAY)")
end_pos = js_content.find("    startWheelTimerLoop() {")

if start_pos != -1 and end_pos != -1:
    js_content = js_content[:start_pos] + new_reset_fix_code + "\n\n" + js_content[end_pos:]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
