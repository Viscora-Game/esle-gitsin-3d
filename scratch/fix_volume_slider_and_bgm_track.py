with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Update bgMusic source to audio/bgm_cute.mp3
js_content = js_content.replace("this.bgMusic = new Audio('audio/bgm_cute.wav');", "this.bgMusic = new Audio('audio/bgm_cute.mp3');")

# 2. Update sw.js cache path back to audio/bgm_cute.mp3
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

sw_content = sw_content.replace("'./audio/bgm_cute.wav'", "'./audio/bgm_cute.mp3'")

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

# 3. Update initBackgroundMusic and updateMusicUI to scale volume dynamically with this.settings.volume
old_music_methods = """    initBackgroundMusic() {
        try {
            if (!this.bgMusic) {
                this.bgMusic = new Audio('audio/bgm_cute.wav');
                this.bgMusic.loop = true;
                this.bgMusic.volume = (this.settings.musicEnabled === false) ? 0 : 0.20;
            }

            if (this.settings.musicEnabled !== false) {
                const playPromise = this.bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Mobile autoplay gesture fallback: start playing smoothly on first user touch/tap!
                        const unlockMusic = () => {
                            if (this.settings.musicEnabled !== false && this.bgMusic && this.bgMusic.paused) {
                                this.bgMusic.play().catch(() => {});
                            }
                            window.removeEventListener('pointerdown', unlockMusic);
                            window.removeEventListener('touchstart', unlockMusic);
                            window.removeEventListener('click', unlockMusic);
                        };
                        window.addEventListener('pointerdown', unlockMusic, { passive: true, once: true });
                        window.addEventListener('touchstart', unlockMusic, { passive: true, once: true });
                        window.addEventListener('click', unlockMusic, { passive: true, once: true });
                    });
                }
            }
            this.updateMusicUI();
        } catch (e) {}
    }

    updateMusicUI() {
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

new_music_methods = """    initBackgroundMusic() {
        try {
            if (!this.bgMusic) {
                this.bgMusic = new Audio('audio/bgm_cute.mp3');
                this.bgMusic.loop = true;
                const volPct = (typeof this.settings.volume === 'number') ? this.settings.volume : 80;
                this.bgMusic.volume = (this.settings.musicEnabled === false) ? 0 : ((volPct / 100) * 0.30);
            }

            if (this.settings.musicEnabled !== false) {
                const playPromise = this.bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Mobile autoplay gesture fallback: start playing smoothly on first user touch/tap!
                        const unlockMusic = () => {
                            if (this.settings.musicEnabled !== false && this.bgMusic && this.bgMusic.paused) {
                                this.bgMusic.play().catch(() => {});
                            }
                            window.removeEventListener('pointerdown', unlockMusic);
                            window.removeEventListener('touchstart', unlockMusic);
                            window.removeEventListener('click', unlockMusic);
                        };
                        window.addEventListener('pointerdown', unlockMusic, { passive: true, once: true });
                        window.addEventListener('touchstart', unlockMusic, { passive: true, once: true });
                        window.addEventListener('click', unlockMusic, { passive: true, once: true });
                    });
                }
            }
            this.updateMusicUI();
        } catch (e) {}
    }

    updateMusicUI() {
        const btnMusic = document.getElementById('btn-toggle-music');
        const txtMusic = document.getElementById('music-btn-text');
        const volPct = (typeof this.settings.volume === 'number') ? this.settings.volume : 80;
        const targetVol = (volPct / 100) * 0.30;

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

if old_music_methods in js_content:
    js_content = js_content.replace(old_music_methods, new_music_methods, 1)

# 4. Connect sliderVol event to updateMusicUI()
old_slider_vol = """        const sliderVol = document.getElementById('slider-volume');
        sliderVol.addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            document.getElementById('vol-val-text').innerText = `${this.settings.volume}%`;
            this.sound.setVolume(this.settings.volume);
        });"""

new_slider_vol = """        const sliderVol = document.getElementById('slider-volume');
        sliderVol.addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            document.getElementById('vol-val-text').innerText = `${this.settings.volume}%`;
            this.sound.setVolume(this.settings.volume);
            this.updateMusicUI();
            this.saveSettings();
        });"""

if old_slider_vol in js_content:
    js_content = js_content.replace(old_slider_vol, new_slider_vol, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
