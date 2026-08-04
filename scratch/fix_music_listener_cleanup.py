with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

old_block = """        const sliderMusicOld = document.getElementById('slider-music');
        if (btnMusic) {
            btnMusic.addEventListener('click', () => {
                this.settings.musicEnabled = (this.settings.musicEnabled === false) ? true : false;
                this.saveSettings();
                this.updateMusicUI();
            });
        }"""

if old_block in js_content:
    js_content = js_content.replace(old_block, "", 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
