with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

old_update_music_ui = """    updateMusicUI() {
        const btnMusic = document.getElementById('btn-toggle-music');
        const txtMusic = document.getElementById('music-btn-text');
        if (btnMusic && txtMusic) {
            if (this.settings.musicEnabled !== false) {
                btnMusic.classList.add('active');
                txtMusic.innerText = 'AÇIK';
                if (this.bgMusic) {
                    this.bgMusic.volume = 0.20;
                    if (this.bgMusic.paused) this.bgMusic.play().catch(() => {});
                }
            } else {
                btnMusic.classList.remove('active');
                txtMusic.innerText = 'KAPALI';
                if (this.bgMusic) {
                    this.bgMusic.pause();
                }
            }
        }
    }"""

new_update_music_ui = """    updateMusicUI() {
        const btnMusic = document.getElementById('btn-toggle-music');
        const txtMusic = document.getElementById('music-btn-text');
        const volPct = (typeof this.settings.volume === 'number') ? this.settings.volume : 80;
        const targetVol = (volPct / 100) * 0.35;

        if (btnMusic && txtMusic) {
            if (this.settings.musicEnabled !== false) {
                btnMusic.classList.add('active');
                txtMusic.innerText = 'AÇIK';
                if (this.bgMusic) {
                    this.bgMusic.volume = targetVol;
                    if (this.bgMusic.paused) this.bgMusic.play().catch(() => {});
                }
            } else {
                btnMusic.classList.remove('active');
                txtMusic.innerText = 'KAPALI';
                if (this.bgMusic) {
                    this.bgMusic.volume = 0;
                    this.bgMusic.pause();
                }
            }
        }
    }"""

if old_update_music_ui in js_content:
    js_content = js_content.replace(old_update_music_ui, new_update_music_ui, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
