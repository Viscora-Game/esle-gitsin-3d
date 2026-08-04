with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Clean up initUI settings sliders in game.js
old_settings_block = """        // Settings Controls
        const sliderVol = document.getElementById('slider-volume');
        sliderVol.addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            document.getElementById('vol-val-text').innerText = `${this.settings.volume}%`;
            this.sound.setVolume(this.settings.volume);
        // Background Music Volume Slider
        const sliderMusic = document.getElementById('slider-music');
        if (sliderMusic) {
            sliderMusic.addEventListener('input', (e) => {
                this.settings.musicVolume = parseInt(e.target.value);
                this.updateMusicUI();
                this.saveSettings();
            });
        }
            this.updateMusicUI();
            this.saveSettings();
        });"""

new_settings_block = """        // Settings Controls - Sound Effects Volume Slider
        const sliderVol = document.getElementById('slider-volume');
        if (sliderVol) {
            sliderVol.addEventListener('input', (e) => {
                this.settings.volume = parseInt(e.target.value);
                const txtVolVal = document.getElementById('vol-val-text');
                if (txtVolVal) txtVolVal.innerText = `${this.settings.volume}%`;
                this.sound.setVolume(this.settings.volume);
                this.saveSettings();
            });
        }

        // Settings Controls - Background Music Volume Slider
        const sliderMusic = document.getElementById('slider-music');
        if (sliderMusic) {
            sliderMusic.addEventListener('input', (e) => {
                this.settings.musicVolume = parseInt(e.target.value);
                this.updateMusicUI();
                this.saveSettings();
            });
        }"""

if old_settings_block in js_content:
    js_content = js_content.replace(old_settings_block, new_settings_block, 1)

# 2. Upgrade updateMusicUI to not reset active slider and use clear 0.25 max volume scaling
old_update_music_ui = """    updateMusicUI() {
        const sliderMusic = document.getElementById('slider-music');
        const txtMusicVal = document.getElementById('music-val-text');
        const mVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;

        if (sliderMusic) sliderMusic.value = mVol;
        if (txtMusicVal) txtMusicVal.innerText = `${mVol}%`;

        if (this.bgMusic) {
            // Softer base music scaling (0.15 max volume at 100% slider, 0.045 at default 30% slider)
            const targetVol = (mVol / 100) * 0.05;
            this.bgMusic.volume = targetVol;
            if (mVol > 0) {
                if (this.bgMusic.paused) this.bgMusic.play().catch(() => {});
            } else {
                this.bgMusic.pause();
            }
        }
    }"""

new_update_music_ui = """    updateMusicUI() {
        const sliderMusic = document.getElementById('slider-music');
        const txtMusicVal = document.getElementById('music-val-text');
        const mVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;

        if (sliderMusic && document.activeElement !== sliderMusic) {
            sliderMusic.value = mVol;
        }
        if (txtMusicVal) {
            txtMusicVal.innerText = `${mVol}%`;
        }

        if (this.bgMusic) {
            // Clear, audible volume scaling (0.25 max volume at 100% slider, 0.075 at 30% default slider)
            const targetVol = (mVol / 100) * 0.25;
            this.bgMusic.volume = targetVol;
            if (mVol > 0) {
                if (this.bgMusic.paused) this.bgMusic.play().catch(() => {});
            } else {
                this.bgMusic.pause();
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
