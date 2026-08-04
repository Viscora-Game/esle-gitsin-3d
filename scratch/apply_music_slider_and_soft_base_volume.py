with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace button toggle with dedicated slider for Music Volume in index.html
old_music_toggle = """                    <!-- Background Music Setting -->
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="musicLabel">🎵 Arka Plan Müziği</span>
                        </div>
                        <button id="btn-toggle-music" class="toggle-btn active">
                            <span id="music-btn-text">AÇIK</span>
                        </button>
                    </div>"""

new_music_slider = """                    <!-- Background Music Volume Slider Setting -->
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="musicLabel">🎵 Müzik Sesi</span>
                            <span id="music-val-text" class="setting-val">30%</span>
                        </div>
                        <input type="range" id="slider-music" min="0" max="100" value="30" class="setting-slider">
                    </div>"""

if old_music_toggle in html_content:
    html_content = html_content.replace(old_music_toggle, new_music_slider, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Update game.js logic to use slider-music and softer default base volume (0.15 max)
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Update musicLabel i18n
music_i18n = [
    ('tr: {', 'tr: {\n                musicLabel: "🎵 Müzik Sesi",'),
    ('en: {', 'en: {\n                musicLabel: "🎵 Music Volume",'),
    ('de: {', 'de: {\n                musicLabel: "🎵 Musiklautstärke",'),
    ('fr: {', 'fr: {\n                musicLabel: "🎵 Volume Musique",'),
    ('it: {', 'it: {\n                musicLabel: "🎵 Volume Musica",'),
    ('es: {', 'es: {\n                musicLabel: "🎵 Volumen Música",'),
    ('pt: {', 'pt: {\n                musicLabel: "🎵 Volume Música",')
]

for old, new in music_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Upgrade updateMusicUI & initBackgroundMusic in game.js
old_music_methods = """    initBackgroundMusic() {
        try {
            const trackPath = this.getBGMTrackPath();
            if (!this.bgMusic) {
                this.bgMusic = new Audio(trackPath);
                this.bgMusic.loop = true;
            }

            if (this.settings.musicEnabled !== false) {
                const playPromise = this.bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
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

new_music_methods = """    initBackgroundMusic() {
        try {
            const trackPath = this.getBGMTrackPath();
            if (!this.bgMusic) {
                this.bgMusic = new Audio(trackPath);
                this.bgMusic.loop = true;
            }

            const mVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;
            if (mVol > 0) {
                const playPromise = this.bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        const unlockMusic = () => {
                            const curMVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;
                            if (curMVol > 0 && this.bgMusic && this.bgMusic.paused) {
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
        const sliderMusic = document.getElementById('slider-music');
        const txtMusicVal = document.getElementById('music-val-text');
        const mVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;

        if (sliderMusic) sliderMusic.value = mVol;
        if (txtMusicVal) txtMusicVal.innerText = `${mVol}%`;

        if (this.bgMusic) {
            // Softer base music scaling (0.15 max volume at 100% slider, 0.045 at default 30% slider)
            const targetVol = (mVol / 100) * 0.15;
            this.bgMusic.volume = targetVol;
            if (mVol > 0) {
                if (this.bgMusic.paused) this.bgMusic.play().catch(() => {});
            } else {
                this.bgMusic.pause();
            }
        }
    }"""

if old_music_methods in js_content:
    js_content = js_content.replace(old_music_methods, new_music_methods, 1)

# Add listener for slider-music in initUI
music_slider_listener = """        // Background Music Volume Slider
        const sliderMusic = document.getElementById('slider-music');
        if (sliderMusic) {
            sliderMusic.addEventListener('input', (e) => {
                this.settings.musicVolume = parseInt(e.target.value);
                this.updateMusicUI();
                this.saveSettings();
            });
        }"""

if "btn-toggle-music" in js_content:
    js_content = js_content.replace("const btnMusic = document.getElementById('btn-toggle-music');", "const sliderMusicOld = document.getElementById('slider-music');", 1)

if "slider-music" in html_content and "sliderMusic.addEventListener('input'" not in js_content:
    target_vol = "this.sound.setVolume(this.settings.volume);"
    js_content = js_content.replace(target_vol, target_vol + "\n" + music_slider_listener, 1)

# Also update loadSettings to set default musicVolume = 30
if "this.settings.musicVolume" not in js_content:
    target_load = "volume: 80,"
    js_content = js_content.replace(target_load, target_load + "\n                musicVolume: 30,", 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
