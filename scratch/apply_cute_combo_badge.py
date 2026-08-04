with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace flame red combo-badge with Cute Candy Pink/Gold Sparkle Badge
old_combo_css = """.combo-badge {
    position: absolute;
    top: 105px;
    right: 16px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #ffffff;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 900;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6);
    z-index: 1500;
    pointer-events: none;
    animation: comboPulse 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition: opacity 0.3s ease;
}

.combo-badge.hidden {
    opacity: 0;
    pointer-events: none;
}

@keyframes comboPulse {
    0% { transform: scale(0.5); }
    50% { transform: scale(1.25); }
    100% { transform: scale(1); }
}"""

new_combo_css = """.combo-badge {
    position: absolute;
    top: 105px;
    right: 16px;
    background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
    color: #ffffff;
    padding: 6px 14px;
    border-radius: 20px;
    border: 2px solid #ffffff;
    font-size: 13px;
    font-weight: 900;
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5), 0 0 12px rgba(245, 158, 11, 0.4);
    z-index: 1500;
    pointer-events: none;
    animation: cuteComboPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition: opacity 0.3s ease;
}

.combo-badge.hidden {
    opacity: 0;
    pointer-events: none;
}

@keyframes cuteComboPop {
    0% { transform: scale(0.3) rotate(-6deg); opacity: 0; }
    60% { transform: scale(1.18) rotate(3deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
}"""

if old_combo_css in css_content:
    css_content = css_content.replace(old_combo_css, new_combo_css, 1)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

# Now update game.js logic to use cute combo titles
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add combo i18n keys for all 7 languages
combo_i18n = [
    ('tr: {', 'tr: {\n                combo2x: "✨ HARİKA UYUM!",\n                combo3x: "💖 MUHTEŞEM EŞLEŞME!",\n                combo4x: "🌟 SÜPER COMBO!",\n                combo5x: "🌈 EFSANEVİ EŞLEŞME!",'),
    ('en: {', 'en: {\n                combo2x: "✨ SWEET MATCH!",\n                combo3x: "💖 WONDERFUL!",\n                combo4x: "🌟 SUPER COMBO!",\n                combo5x: "🌈 LEGENDARY MATCH!",'),
    ('de: {', 'de: {\n                combo2x: "✨ SÜSSES MATCH!",\n                combo3x: "💖 WUNDERBAR!",\n                combo4x: "🌟 SUPER COMBO!",\n                combo5x: "🌈 LEGENDÄR!",'),
    ('fr: {', 'fr: {\n                combo2x: "✨ ADORABLE COMBO!",\n                combo3x: "💖 MAGNIFIQUE!",\n                combo4x: "🌟 SUPER MATCH!",\n                combo5x: "🌈 LÉGENDAIRE!",'),
    ('it: {', 'it: {\n                combo2x: "✨ MERAVIGLIOSO!",\n                combo3x: "💖 ADORABILE!",\n                combo4x: "🌟 SUPER COMBO!",\n                combo5x: "🌈 LEGENDARIO!",'),
    ('es: {', 'es: {\n                combo2x: "✨ ¡DULCE COMBO!",\n                combo3x: "💖 ¡MAGNÍFICO!",\n                combo4x: "🌟 ¡SÚPER PAREJA!",\n                combo5x: "🌈 ¡LEYENDARIO!",'),
    ('pt: {', 'pt: {\n                combo2x: "✨ COMBINAÇÃO DOCE!",\n                combo3x: "💖 MARAVILHOSO!",\n                combo4x: "🌟 SUPER COMBO!",\n                combo5x: "🌈 LENDÁRIO!",')
]

for old, new in combo_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Replace showComboBadge call in match logic
old_combo_call = """        if (this.comboCount >= 2) {
            this.showComboBadge(`🔥 ${this.comboCount}x COMBO! (+${points})`);
        }"""

new_combo_call = """        if (this.comboCount >= 2) {
            const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
            let title = dict.combo2x || '✨ HARİKA UYUM!';
            if (this.comboCount === 3) title = dict.combo3x || '💖 MUHTEŞEM EŞLEŞME!';
            else if (this.comboCount === 4) title = dict.combo4x || '🌟 SÜPER COMBO!';
            else if (this.comboCount >= 5) title = dict.combo5x || '🌈 EFSANEVİ EŞLEŞME!';
            
            this.showComboBadge(`${title} (+${points})`);
        }"""

if old_combo_call in js_content:
    js_content = js_content.replace(old_combo_call, new_combo_call, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
