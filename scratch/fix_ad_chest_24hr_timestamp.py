with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

old_ad_chest_clean_methods = """    getDailyAdChestRemaining() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const savedDate = localStorage.getItem('tile_game_ad_chest_date');
            const savedCount = parseInt(localStorage.getItem('tile_game_ad_chest_count') || '0', 10);

            if (savedDate !== todayStr) {
                localStorage.setItem('tile_game_ad_chest_date', todayStr);
                localStorage.setItem('tile_game_ad_chest_count', '0');
                return 3;
            }
            return Math.max(0, 3 - savedCount);
        } catch (e) {
            return 3;
        }
    }

    useDailyAdChestClaim() {
        try {
            const todayStr = new Date().toISOString().slice(0, 10);
            const currentRemaining = this.getDailyAdChestRemaining();
            const usedSoFar = 3 - currentRemaining;
            localStorage.setItem('tile_game_ad_chest_date', todayStr);
            localStorage.setItem('tile_game_ad_chest_count', (usedSoFar + 1).toString());
            this.updateAdWidgetUI();
        } catch (e) {}
    }"""

new_ad_chest_clean_methods = """    getDailyAdChestRemaining() {
        try {
            const resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
            if (resetTime > 0 && Date.now() >= resetTime) {
                localStorage.setItem('tile_game_ad_chest_reset_time', '0');
                localStorage.setItem('tile_game_ad_chest_count', '0');
                return 3;
            }
            const savedCount = parseInt(localStorage.getItem('tile_game_ad_chest_count') || '0', 10);
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
    }"""

if old_ad_chest_clean_methods in js_content:
    js_content = js_content.replace(old_ad_chest_clean_methods, new_ad_chest_clean_methods, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
