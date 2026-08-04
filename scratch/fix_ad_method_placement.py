with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove showRewardedAd from outside class
outer_code = """// Initialize Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new TileMatchingGame();
    // =========================================================
    // GOOGLE ADMOB REWARDED VIDEO & INTERSTITIAL AD ENGINE
    // =========================================================
    showRewardedAd(onSuccess, onFailure) {"""

fixed_code = """    // =========================================================
    // GOOGLE ADMOB REWARDED VIDEO & INTERSTITIAL AD ENGINE
    // =========================================================
    showRewardedAd(onSuccess, onFailure) {"""

content = content.replace(outer_code, fixed_code)

# Make sure DOMContentLoaded init is at the very bottom outside class
content += "\n\n// Initialize Game on DOM Load\nwindow.addEventListener('DOMContentLoaded', () => {\n    window.gameInstance = new TileMatchingGame();\n});\n"

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
