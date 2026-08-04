with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Update updateAdWidgetUI to include live 24-hour reset countdown format
old_ad_widget_ui = """    updateAdWidgetUI() {
        const widgetTag = document.querySelector('.ad-widget-label');
        const remaining = this.getDailyAdChestRemaining();
        const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});

        if (widgetTag) {
            if (remaining > 0) {
                widgetTag.innerText = `(${remaining}/3)`;
                widgetTag.style.background = '#10b981';
            } else {
                widgetTag.innerText = dict.adFullTag || 'DOLDU';
                widgetTag.style.background = '#ef4444';
            }
        }
    }"""

new_ad_widget_ui = """    updateAdWidgetUI() {
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

if old_ad_widget_ui in js_content:
    js_content = js_content.replace(old_ad_widget_ui, new_ad_widget_ui, 1)

# Ensure updateAdWidgetUI is called in updateWheelTimerState
if "this.updateAdWidgetUI();" not in js_content:
    update_wheel_state_target = "updateWheelTimerState() {"
    if update_wheel_state_target in js_content:
        js_content = js_content.replace(update_wheel_state_target, update_wheel_state_target + "\n        this.updateAdWidgetUI();", 1)

# Update adChestLimitReached message to include live countdown
old_chest_limit_toast = "this.showToast(dict.adChestLimitReached || '⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3)');"
new_chest_limit_toast = """const midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);
                    const resetRemaining = Math.max(0, midnight.getTime() - Date.now());
                    const timeStr = this.formatTimeLeft(resetRemaining);
                    this.showToast((dict.adChestLimitReached || '⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3 - {time})').replace('{time}', timeStr));"""

if old_chest_limit_toast in js_content:
    js_content = js_content.replace(old_chest_limit_toast, new_chest_limit_toast, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
