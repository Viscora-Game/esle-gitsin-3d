with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

old_settings_def = """        this.settings = {
            volume: 80,
            vibration: true,
            lang: 'tr'
        };"""

new_settings_def = """        this.settings = {
            volume: 80,
            musicVolume: 30,
            bgmTrack: 'carefree',
            vibration: true,
            lang: 'tr'
        };"""

if old_settings_def in js_content:
    js_content = js_content.replace(old_settings_def, new_settings_def, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
