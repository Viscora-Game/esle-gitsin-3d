with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add daily ad chest methods and update updateAdWidgetUI, checkDailyAdReset
ad_limit_methods = """
    // =========================================================
    // DAILY AD CHEST LIMIT (3 PER DAY) & PER-LEVEL REVIVE (2 PER LEVEL)
    // =========================================================
    getDailyAdChestRemaining() {
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
    }

    updateAdWidgetUI() {
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
    }
"""

# Find where to place ad_limit_methods inside TileMatchingGame class
if "getDailyAdChestRemaining" not in js_content:
    insert_before = "    showRewardedAd(onSuccess, onFailure) {"
    if insert_before in js_content:
        js_content = js_content.replace(insert_before, ad_limit_methods + "\n" + insert_before, 1)

# Update applyLanguage to call updateAdWidgetUI()
apply_lang_target = "this.updateVibBtnUI();"
if apply_lang_target in js_content:
    js_content = js_content.replace(apply_lang_target, "this.updateVibBtnUI();\n        this.updateAdWidgetUI();", 1)

# Update startLevel to reset levelAdReviveCount
start_lvl_target = "startLevel(levelNum = 1, forceReset = false, mode = 'classic') {"
if start_lvl_target in js_content:
    js_content = js_content.replace(start_lvl_target, start_lvl_target + "\n        this.levelAdReviveCount = 0;", 1)

# Update btn-menu-ad-chest click handler to enforce 3-per-day limit
old_ad_chest_click = """        // REWARDED AD MAIN MENU FLOATING CHEST WIDGET CLICK
        const btnAdChest = document.getElementById('btn-menu-ad-chest');
        if (btnAdChest) {
            btnAdChest.addEventListener('click', () => {
                this.sound.playClick();
                this.showRewardedAd(() => {
                    this.showToast('🎁 Reklam Ödülü: Görev Başarılı! Sandık Açılıyor...');
                    const stars = this.rollChestStarRating(false);
                    this.triggerChestRewardModal(stars, false);
                });
            });
        }"""

new_ad_chest_click = """        // REWARDED AD MAIN MENU FLOATING CHEST WIDGET CLICK (DAILY LIMIT 3)
        const btnAdChest = document.getElementById('btn-menu-ad-chest');
        if (btnAdChest) {
            btnAdChest.addEventListener('click', () => {
                const remaining = this.getDailyAdChestRemaining();
                if (remaining <= 0) {
                    this.sound.playLockThud();
                    btnAdChest.classList.add('shaking');
                    setTimeout(() => btnAdChest.classList.remove('shaking'), 250);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    this.showToast(dict.adChestLimitReached || '⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3)');
                    return;
                }

                this.sound.playClick();
                this.showRewardedAd(() => {
                    this.useDailyAdChestClaim();
                    this.showToast('🎁 Reklam Ödülü: Görev Başarılı! Sandık Açılıyor...');
                    const stars = this.rollChestStarRating(false);
                    this.triggerChestRewardModal(stars, false);
                });
            });
        }"""

if old_ad_chest_click in js_content:
    js_content = js_content.replace(old_ad_chest_click, new_ad_chest_click, 1)

# Update btn-ad-revive click handler and defeat modal rendering to enforce max 2 per level limit
old_ad_revive_click = """        // REWARDED AD DEFEAT REVIVE CLICK (+1 Slot & Remove Defeat)
        const btnAdRevive = document.getElementById('btn-ad-revive');
        if (btnAdRevive) {
            btnAdRevive.addEventListener('click', () => {
                this.sound.playClick();
                this.showRewardedAd(() => {
                    this.sound.playBoosterChime();
                    document.getElementById('modal-gameover').classList.add('hidden');
                    
                    // Unlock emergency 6th slot and give +1 slot capacity
                    this.maxSlotCapacity = 6;
                    const floatSlot = document.getElementById('floating-extra-slot');
                    if (floatSlot) floatSlot.classList.remove('hidden');

                    this.showToast('🚨 Canlı Hak Kullanıldı! +1 Acil Slot Açıldı!');
                    this.checkDeadlockAndMatch();
                });
            });
        }"""

new_ad_revive_click = """        // REWARDED AD DEFEAT REVIVE CLICK (MAX 2 PER LEVEL)
        const btnAdRevive = document.getElementById('btn-ad-revive');
        if (btnAdRevive) {
            btnAdRevive.addEventListener('click', () => {
                if (this.levelAdReviveCount >= 2) {
                    this.sound.playLockThud();
                    btnAdRevive.classList.add('shaking');
                    setTimeout(() => btnAdRevive.classList.remove('shaking'), 250);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    this.showToast(dict.adReviveLimitReached || '⚠️ Bu Bölümdeki Reklamla Devam Etme Hakkınız Bitti! (2/2)');
                    return;
                }

                this.sound.playClick();
                this.showRewardedAd(() => {
                    this.sound.playBoosterChime();
                    this.levelAdReviveCount = (this.levelAdReviveCount || 0) + 1;
                    document.getElementById('modal-gameover').classList.add('hidden');
                    
                    // Revive 1: Unlock emergency 6th slot
                    // Revive 2: Clear 1 non-matching slot tile from tray for extra breathing room
                    this.maxSlotCapacity = 6;
                    const floatSlot = document.getElementById('floating-extra-slot');
                    if (floatSlot) floatSlot.classList.remove('hidden');

                    if (this.levelAdReviveCount >= 2 && this.slotTiles.length > 0) {
                        const removedTile = this.slotTiles.pop();
                        if (removedTile && removedTile.element) {
                            removedTile.element.remove();
                        }
                    }

                    const remainingRevives = Math.max(0, 2 - this.levelAdReviveCount);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    this.showToast(`🚨 ${dict.reviveUsedToast || 'Canlı Hak Kullanıldı! +1 Acil Slot Açıldı!'} (${this.levelAdReviveCount}/2)`);
                    this.checkDeadlockAndMatch();
                });
            });
        }"""

if old_ad_revive_click in js_content:
    js_content = js_content.replace(old_ad_revive_click, new_ad_revive_click, 1)

# Also update defeat modal trigger to update btn-ad-revive text and visibility
defeat_modal_trigger = "document.getElementById('modal-gameover').classList.remove('hidden');"
defeat_modal_update = """document.getElementById('modal-gameover').classList.remove('hidden');
            const btnAdRevive = document.getElementById('btn-ad-revive');
            if (btnAdRevive) {
                const count = this.levelAdReviveCount || 0;
                const remaining = Math.max(0, 2 - count);
                const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                if (remaining > 0) {
                    btnAdRevive.style.display = 'block';
                    btnAdRevive.querySelector('span').innerText = `📺 ${dict.adReviveBtn || 'REKLAM İZLE & DEVAM ET'} (${remaining}/2 HAK)`;
                } else {
                    btnAdRevive.style.display = 'none';
                }
            }"""

if defeat_modal_trigger in js_content:
    js_content = js_content.replace(defeat_modal_trigger, defeat_modal_update)

# Add dictionary entries for new ad limit keys across all 7 languages
i18n_additions = [
    ('tr: {', 'tr: {\n                adFullTag: "DOLDU",\n                adChestLimitReached: "⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3 - Yarın Tekrar Gel 🎁)",\n                adReviveLimitReached: "⚠️ Bu Bölümdeki Reklamla Devam Etme Hakkınız Bitti! (2/2)",\n                reviveUsedToast: "Canlı Hak Kullanıldı!",'),
    ('en: {', 'en: {\n                adFullTag: "FULL",\n                adChestLimitReached: "⚠️ Daily Free Ad Chest Limit Reached! (0/3 - Come Back Tomorrow 🎁)",\n                adReviveLimitReached: "⚠️ Max Level Revives Reached! (2/2)",\n                reviveUsedToast: "Revive Used!",'),
    ('de: {', 'de: {\n                adFullTag: "VOLL",\n                adChestLimitReached: "⚠️ Tägliches Gratis-Truhen-Limit erreicht! (0/3 - Morgen wiederkommen 🎁)",\n                adReviveLimitReached: "⚠️ Max. Reaktivierungen in diesem Level erreicht! (2/2)",\n                reviveUsedToast: "Reaktivierung genutzt!",'),
    ('fr: {', 'fr: {\n                adFullTag: "PLEIN",\n                adChestLimitReached: "⚠️ Limite quotidienne de coffres gratuits atteinte! (0/3 - Revenez demain 🎁)",\n                adReviveLimitReached: "⚠️ Limite de réanimations par niveau atteinte! (2/2)",\n                reviveUsedToast: "Réanimation utilisée!",'),
    ('it: {', 'it: {\n                adFullTag: "PIENO",\n                adChestLimitReached: "⚠️ Limite giornaliero bauli gratis raggiunto! (0/3 - Torna domani 🎁)",\n                adReviveLimitReached: "⚠️ Limite di riattivazioni per livello raggiunto! (2/2)",\n                reviveUsedToast: "Riattivazione usata!",'),
    ('es: {', 'es: {\n                adFullTag: "LLENO",\n                adChestLimitReached: "⚠️ ¡Límite diario de cofres gratis alcanzado! (0/3 - Vuelve mañana 🎁)",\n                adReviveLimitReached: "⚠️ ¡Límite de reanimaciones por nivel alcanzado! (2/2)",\n                reviveUsedToast: "¡Reanimación usada!",'),
    ('pt: {', 'pt: {\n                adFullTag: "CHEIO",\n                adChestLimitReached: "⚠️ Limite diário de baús grátis atingido! (0/3 - Volte amanhã 🎁)",\n                adReviveLimitReached: "⚠️ Limite de reativações por nível atingido! (2/2)",\n                reviveUsedToast: "Reativação usada!",')
]

for old, new in i18n_additions:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
