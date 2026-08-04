with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add ad keys to this.i18n
dict_updates = [
    ('tr: {', 'tr: {\n                adChestBtn: "📺 REKLAM İZLE & SANDIK KAZAN! 🎁",\n                adReviveBtn: "📺 REKLAM İZLE & +1 SLOT İLE DEVAM ET",'),
    ('en: {', 'en: {\n                adChestBtn: "📺 WATCH AD & WIN CHEST! 🎁",\n                adReviveBtn: "📺 WATCH AD & CONTINUE WITH +1 SLOT",'),
    ('de: {', 'de: {\n                adChestBtn: "📺 WERBUNG SEHEN & TRUHE GEWINNEN! 🎁",\n                adReviveBtn: "📺 WERBUNG SEHEN & MIT +1 SLOT FORTFAHREN",'),
    ('fr: {', 'fr: {\n                adChestBtn: "📺 REGARDER PUB & GAGNER COFFRE! 🎁",\n                adReviveBtn: "📺 REGARDER PUB & CONTINUER AVEC +1 EMPLACEMENT",'),
    ('it: {', 'it: {\n                adChestBtn: "📺 GUARDA PUBBLICITÀ & VINCI BAULE! 🎁",\n                adReviveBtn: "📺 GUARDA PUBBLICITÀ & CONTINUA CON +1 SLOT",'),
    ('es: {', 'es: {\n                adChestBtn: "📺 ¡VER ANUNCIO Y GANAR COFRE! 🎁",\n                adReviveBtn: "📺 VER ANUNCIO Y CONTINUAR CON +1 CASILLA",'),
    ('pt: {', 'pt: {\n                adChestBtn: "📺 VER ANÚNCIO E GANHAR BAÚ! 🎁",\n                adReviveBtn: "📺 VER ANÚNCIO E CONTINUAR COM +1 ESPAÇO",')
]

for old, new in dict_updates:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Add event listeners for btn-menu-ad-chest and btn-ad-revive + showRewardedAd engine
event_listeners_target = "document.getElementById('btn-menu-settings').addEventListener('click', () => document.getElementById('modal-settings').classList.remove('hidden'));"

new_ad_event_listeners = """document.getElementById('btn-menu-settings').addEventListener('click', () => document.getElementById('modal-settings').classList.remove('hidden'));

        // REWARDED AD MENU CHEST CLICK
        const btnAdChest = document.getElementById('btn-menu-ad-chest');
        if (btnAdChest) {
            btnAdChest.addEventListener('click', () => {
                this.sound.playClick();
                this.showRewardedAd(() => {
                    this.showToast('🎁 Reklam Ödülü: Görev Başarılı! Sandık Açılıyor...');
                    this.openChestModal();
                });
            });
        }

        // REWARDED AD DEFEAT REVIVE CLICK (+1 Slot & Remove Defeat)
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

if event_listeners_target in js_content:
    js_content = js_content.replace(event_listeners_target, new_ad_event_listeners, 1)
    print('Added Ad Chest and Defeat Revive event listeners!')

# Add showRewardedAd method implementation
ad_method_code = """    // =========================================================
    // GOOGLE ADMOB REWARDED VIDEO & INTERSTITIAL AD ENGINE
    // =========================================================
    showRewardedAd(onSuccess, onFailure) {
        // Production Check for Google AdMob H5 / Native Android Bridge
        if (window.AndroidAdMob && typeof window.AndroidAdMob.showRewardedAd === 'function') {
            window.AndroidAdMob.showRewardedAd();
            window.onAdMobRewardSuccess = () => { if (onSuccess) onSuccess(); };
            return;
        }

        if (window.google && window.google.afg && typeof window.google.afg.showAd === 'function') {
            window.google.afg.showAd({
                adSlot: 'rewarded',
                onAdDismissed: () => { if (onSuccess) onSuccess(); }
            });
            return;
        }

        // Web Preview / Browser Testing Simulated Rewarded Ad Player (3-Second Interactive Demo)
        const adModal = document.getElementById('modal-ad-player');
        const progressBar = document.getElementById('ad-progress-fill');
        const timerText = document.getElementById('ad-timer-countdown');

        if (!adModal) {
            if (onSuccess) onSuccess();
            return;
        }

        adModal.classList.remove('hidden');
        if (progressBar) progressBar.style.width = '0%';

        let secondsLeft = 3;
        if (timerText) timerText.innerText = `Kalan Süre: ${secondsLeft} sn`;

        const interval = setInterval(() => {
            secondsLeft--;
            const pct = Math.round(((3 - secondsLeft) / 3) * 100);
            if (progressBar) progressBar.style.width = `${pct}%`;
            if (timerText) timerText.innerText = `Kalan Süre: ${secondsLeft} sn`;

            if (secondsLeft <= 0) {
                clearInterval(interval);
                setTimeout(() => {
                    adModal.classList.add('hidden');
                    if (onSuccess) onSuccess();
                }, 300);
            }
        }, 1000);
    }"""

# Insert before end of class
class_end_idx = js_content.rfind("}")
if class_end_idx != -1:
    js_content = js_content[:class_end_idx] + ad_method_code + "\n}\n"
    print('Inserted showRewardedAd engine into TileMatchingGame class!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
