with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Upgrade Ad Chest daily claim & reset logic in game.js
old_ad_chest_methods = """    getDailyAdChestRemaining() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const savedDate = localStorage.getItem('tile_game_ad_chest_date');
            const savedClaims = parseInt(localStorage.getItem('tile_game_ad_chest_claims') || '0', 10);

            if (savedDate !== todayStr) {
                localStorage.setItem('tile_game_ad_chest_date', todayStr);
                localStorage.setItem('tile_game_ad_chest_claims', '0');
                return 3;
            }
            return Math.max(0, 3 - savedClaims);
        } catch (e) {
            return 3;
        }
    }

    useDailyAdChestClaim() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const remaining = this.getDailyAdChestRemaining();
            const used = 3 - remaining;
            localStorage.setItem('tile_game_ad_chest_date', todayStr);
            localStorage.setItem('tile_game_ad_chest_claims', (used + 1).toString());
            this.updateAdWidgetUI();
        } catch (e) {}
    }"""

new_ad_chest_methods = """    getDailyAdChestRemaining() {
        try {
            const resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
            if (resetTime > 0 && Date.now() >= resetTime) {
                localStorage.setItem('tile_game_ad_chest_reset_time', '0');
                localStorage.setItem('tile_game_ad_chest_claims', '0');
                return 3;
            }
            const savedClaims = parseInt(localStorage.getItem('tile_game_ad_chest_claims') || '0', 10);
            if (savedClaims >= 3 && resetTime === 0) {
                // If 3 claims used but no reset time stored, set 24-hr reset time now
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                localStorage.setItem('tile_game_ad_chest_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
            }
            return Math.max(0, 3 - savedClaims);
        } catch (e) {
            return 3;
        }
    }

    useDailyAdChestClaim() {
        try {
            const remaining = this.getDailyAdChestRemaining();
            const used = 3 - remaining;
            const newUsed = used + 1;
            localStorage.setItem('tile_game_ad_chest_claims', newUsed.toString());
            
            if (newUsed >= 3) {
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                localStorage.setItem('tile_game_ad_chest_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
            }
            this.updateAdWidgetUI();
        } catch (e) {}
    }"""

if old_ad_chest_methods in js_content:
    js_content = js_content.replace(old_ad_chest_methods, new_ad_chest_methods, 1)

# Upgrade updateAdWidgetUI to use 24-hr reset_time countdown
old_update_ad_ui = """    updateAdWidgetUI() {
        const widgetTag = document.querySelector('.ad-widget-label');
        const remaining = this.getDailyAdChestRemaining();
        const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});

        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const resetRemaining = Math.max(0, midnight.getTime() - Date.now());
        const timeStr = this.formatTimeLeft(resetRemaining);

        if (widgetTag) {
            if (remaining > 0) {
                widgetTag.innerText = `(${remaining}/3)`;
                widgetTag.style.background = '#10b981';
            } else {
                widgetTag.innerText = timeStr;
                widgetTag.style.background = '#ef4444';
            }
        }
    }"""

new_update_ad_ui = """    updateAdWidgetUI() {
        const widgetTag = document.querySelector('.ad-widget-label');
        const remaining = this.getDailyAdChestRemaining();
        const resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
        const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});

        if (widgetTag) {
            if (remaining > 0) {
                widgetTag.innerText = `(${remaining}/3)`;
                widgetTag.style.background = '#10b981';
            } else {
                const resetRemaining = Math.max(0, resetTime - Date.now());
                const timeStr = this.formatTimeLeft(resetRemaining);
                widgetTag.innerText = timeStr;
                widgetTag.style.background = '#ef4444';
            }
        }
    }"""

if old_update_ad_ui in js_content:
    js_content = js_content.replace(old_update_ad_ui, new_update_ad_ui, 1)

# Upgrade Wheel reset logic to use full 24-hr reset_time countdown
old_wheel_spins_code = """    getDailyWheelSpinsCount() {
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
    }"""

new_wheel_spins_code = """    getDailyWheelSpinsCount() {
        try {
            const resetTime = parseInt(localStorage.getItem('tile_game_wheel_reset_time') || '0', 10);
            if (resetTime > 0 && Date.now() >= resetTime) {
                localStorage.setItem('tile_game_wheel_reset_time', '0');
                localStorage.setItem('tile_game_wheel_spins', '0');
                localStorage.setItem('tile_game_wheel_last_spin_time', '0');
                return 0;
            }
            const savedSpins = parseInt(localStorage.getItem('tile_game_wheel_spins') || '0', 10);
            return savedSpins;
        } catch (e) {
            return 0;
        }
    }"""

if old_wheel_spins_code in js_content:
    js_content = js_content.replace(old_wheel_spins_code, new_wheel_spins_code, 1)

# Upgrade incrementWheelSpinsCount to set 24-hr reset time on spin 2
old_inc_wheel = """    incrementWheelSpinsCount() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const currentSpins = this.getDailyWheelSpinsCount();
            localStorage.setItem('tile_game_wheel_date', todayStr);
            localStorage.setItem('tile_game_wheel_spins', (currentSpins + 1).toString());
            localStorage.setItem('tile_game_wheel_last_spin_time', Date.now().toString());
            this.updateWheelTimerState();
        } catch (e) {}
    }"""

new_inc_wheel = """    incrementWheelSpinsCount() {
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
    }"""

if old_inc_wheel in js_content:
    js_content = js_content.replace(old_inc_wheel, new_inc_wheel, 1)

# Update updateWheelTimerState 24-hr reset remaining calculation
old_wheel_reset_calc = """        // 24 Hours Midnight Reset Remaining
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const resetRemaining = Math.max(0, midnight.getTime() - now);"""

new_wheel_reset_calc = """        // 24 Hours Full Reset Remaining
        const wheelResetTime = parseInt(localStorage.getItem('tile_game_wheel_reset_time') || '0', 10);
        const resetRemaining = Math.max(0, wheelResetTime - now);"""

if old_wheel_reset_calc in js_content:
    js_content = js_content.replace(old_wheel_reset_calc, new_wheel_reset_calc, 1)

# Update chest limit toast to use ad chest reset time
old_toast_chest = """const midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);
                    const resetRemaining = Math.max(0, midnight.getTime() - Date.now());
                    const timeStr = this.formatTimeLeft(resetRemaining);
                    this.showToast((dict.adChestLimitReached || '⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3 - {time})').replace('{time}', timeStr));"""

new_toast_chest = """const resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
                    const resetRemaining = Math.max(0, resetTime - Date.now());
                    const timeStr = this.formatTimeLeft(resetRemaining);
                    this.showToast((dict.adChestLimitReached || '⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3 - {time})').replace('{time}', timeStr));"""

if old_toast_chest in js_content:
    js_content = js_content.replace(old_toast_chest, new_toast_chest, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
