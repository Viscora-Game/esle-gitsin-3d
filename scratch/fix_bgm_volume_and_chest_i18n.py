with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Lower default musicVolume in constructor from 30 to 12
old_constructor_vol = "musicVolume: 30,"
new_constructor_vol = "musicVolume: 12,"
if old_constructor_vol in js_content:
    js_content = js_content.replace(old_constructor_vol, new_constructor_vol)

# 2. Adjust BGM volume multiplier from 0.25 to 0.08 in updateMusicUI & initBackgroundMusic
old_vol_mult_1 = "this.bgMusic.volume = (this.settings.musicVolume / 100) * 0.25;"
new_vol_mult_1 = "this.bgMusic.volume = (this.settings.musicVolume / 100) * 0.08;"
js_content = js_content.replace(old_vol_mult_1, new_vol_mult_1)

old_vol_mult_2 = "this.bgMusic.volume = (vol / 100) * 0.25;"
new_vol_mult_2 = "this.bgMusic.volume = (vol / 100) * 0.08;"
js_content = js_content.replace(old_vol_mult_2, new_vol_mult_2)

# 3. Fix hardcoded Turkish strings in triggerChestRewardModal (lines 3440 & 3450)
old_chest_gold_line = "item.innerHTML = `<span class=\"reward-icon\">🪙</span><span class=\"reward-val\">+${reward.gold} ALTIN</span>`;"
new_chest_gold_line = """const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            const goldTxt = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', reward.gold);
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">${goldTxt}</span>`;"""

if old_chest_gold_line in js_content:
    js_content = js_content.replace(old_chest_gold_line, new_chest_gold_line)

old_chest_desc_line = "if (descEl) descEl.innerText = '🏆 Sandıktan Çıkan Ödülleriniz:';"
new_chest_desc_line = """const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        if (descEl) descEl.innerText = dict.chestRewardsDesc || '🏆 Sandıktan Çıkan Ödülleriniz:';"""

if old_chest_desc_line in js_content:
    js_content = js_content.replace(old_chest_desc_line, new_chest_desc_line)

# 4. Fix hardcoded Turkish string in line 4218 (wheel/chest duplicate conversion reward modal)
old_dup_gold_line = "item.innerHTML = `<div class=\"reward-icon\">🪙</div><div class=\"reward-text\">+50 ALTIN <span class=\"dup-note\">${dupMsg}</span></div>`;"
new_dup_gold_line = """const gText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', 50);
                            item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">${gText} <span class="dup-note">${dupMsg}</span></div>`;"""

if old_dup_gold_line in js_content:
    js_content = js_content.replace(old_dup_gold_line, new_dup_gold_line)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
