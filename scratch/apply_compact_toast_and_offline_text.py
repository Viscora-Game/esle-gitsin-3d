with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace toast-msg CSS with responsive glassmorphism pill style
old_toast_css = """.toast-msg {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: 2px solid #f87171;
    color: #ffffff;
    padding: 10px 22px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 900;
    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.7), 0 0 15px rgba(0, 0, 0, 0.5);
    z-index: 9999 !important;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    white-space: nowrap;
    text-align: center;
}"""

new_toast_css = """.toast-msg {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border: 2px solid #38bdf8;
    color: #f8fafc;
    padding: 10px 18px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 800;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 18px rgba(56, 189, 248, 0.4);
    z-index: 9999 !important;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 88vw;
    width: max-content;
    text-align: center;
    line-height: 1.35;
    word-break: break-word;
}"""

if old_toast_css in css_content:
    css_content = css_content.replace(old_toast_css, new_toast_css, 1)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

# Update offline toast messages in game.js to be short & punchy
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

short_offline_i18n = [
    ('offlineAdMsg: "📡 Çevrimdışısınız! Ödüllü reklam izlemek için internet bağlantısı gerekiyor.",', 'offlineAdMsg: "📡 Çevrimdışısınız! Reklam için internet bekleniyor.",'),
    ('offlineAdMsg: "📡 You are offline! Internet connection required to watch rewarded ads.",', 'offlineAdMsg: "📡 Offline! Internet needed to play ad.",'),
    ('offlineAdMsg: "📡 Du bist offline! Internetverbindung erforderlich, um Belohnungswerbung zu sehen.",', 'offlineAdMsg: "📡 Offline! Internet für Werbung erforderlich.",'),
    ('offlineAdMsg: "📡 Vous êtes hors ligne! Connexion Internet requise pour regarder les publicités.",', 'offlineAdMsg: "📡 Hors ligne! Connexion requise pour la pub.",'),
    ('offlineAdMsg: "📡 Sei offline! Connessione Internet richiesta per guardare gli annunci.",', 'offlineAdMsg: "📡 Offline! Connessione necessaria per l\'annuncio.",'),
    ('offlineAdMsg: "📡 ¡Estás desconectado! Se requiere conexión a Internet para ver anuncios.",', 'offlineAdMsg: "📡 ¡Sin conexión! Se requiere internet para anuncios.",'),
    ('offlineAdMsg: "📡 Você está offline! Conexão com a Internet necessária para ver anúncios.",', 'offlineAdMsg: "📡 Offline! Conexão necessária para o anúncio.",')
]

for old, new in short_offline_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Also update fallback text inside showRewardedAd
old_fallback = "dict.offlineAdMsg || '📡 Çevrimdışısınız! Ödüllü reklam izlemek için internet bağlantısı gerekiyor.'"
new_fallback = "dict.offlineAdMsg || '📡 Çevrimdışısınız! Reklam için internet bekleniyor.'"
if old_fallback in js_content:
    js_content = js_content.replace(old_fallback, new_fallback, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
