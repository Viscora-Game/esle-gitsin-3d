with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

banner_i18n = [
    ('tr: {', 'tr: {\n                adBannerBadge: "SPONSORLU",'),
    ('en: {', 'en: {\n                adBannerBadge: "SPONSORED",'),
    ('de: {', 'de: {\n                adBannerBadge: "GESPONSERT",'),
    ('fr: {', 'fr: {\n                adBannerBadge: "SPONSORISÉ",'),
    ('it: {', 'it: {\n                adBannerBadge: "SPONSORIZZATO",'),
    ('es: {', 'es: {\n                adBannerBadge: "PATROCINADO",'),
    ('pt: {', 'pt: {\n                adBannerBadge: "PATROCINADO",')
]

for old, new in banner_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

banner_methods = """
    // =========================================================
    // MAIN MENU EXCLUSIVE ADMOB BANNER AD CONTROLLER
    // =========================================================
    showMainMenuBannerAd() {
        const bannerContainer = document.getElementById('main-menu-ad-banner');
        if (bannerContainer) bannerContainer.classList.remove('hidden');

        // Native Android / H5 AdMob Bridge Integration
        if (window.AndroidAdMob && typeof window.AndroidAdMob.showBannerAd === 'function') {
            window.AndroidAdMob.showBannerAd();
        }
    }

    hideMainMenuBannerAd() {
        const bannerContainer = document.getElementById('main-menu-ad-banner');
        if (bannerContainer) bannerContainer.classList.add('hidden');

        // Native Android / H5 AdMob Bridge Integration
        if (window.AndroidAdMob && typeof window.AndroidAdMob.hideBannerAd === 'function') {
            window.AndroidAdMob.hideBannerAd();
        }
    }
"""

if "showMainMenuBannerAd" not in js_content:
    insert_before = "    showRewardedAd(onSuccess, onFailure) {"
    if insert_before in js_content:
        js_content = js_content.replace(insert_before, banner_methods + "\n" + insert_before, 1)

# Ensure startLevel calls hideMainMenuBannerAd()
start_lvl_target = "startLevel(lvl, isNewGame = false, mode = 'classic') {"
if start_lvl_target in js_content:
    js_content = js_content.replace(start_lvl_target, start_lvl_target + "\n        this.hideMainMenuBannerAd();", 1)

# Ensure returning home calls showMainMenuBannerAd()
home_btn_target = "document.getElementById('main-menu').classList.remove('hidden');"
if home_btn_target in js_content:
    js_content = js_content.replace(home_btn_target, home_btn_target + "\n            this.showMainMenuBannerAd();")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
