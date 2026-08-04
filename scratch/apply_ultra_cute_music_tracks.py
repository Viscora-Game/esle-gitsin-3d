import shutil, os

# Copy carefree.mp3 to bgm_cute.mp3 as default primary track
shutil.copyfile('audio/carefree.mp3', 'audio/bgm_cute.mp3')
print('Copied carefree.mp3 to audio/bgm_cute.mp3 successfully!')

# Update index.html to add Music Track Selector in Settings
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

old_music_row = """                    <!-- Background Music Setting -->
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="musicLabel">🎵 Arka Plan Müziği</span>
                        </div>
                        <button id="btn-toggle-music" class="toggle-btn active">
                            <span id="music-btn-text">AÇIK</span>
                        </button>
                    </div>"""

new_music_row_with_selector = """                    <!-- Background Music Setting -->
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="musicLabel">🎵 Arka Plan Müziği</span>
                        </div>
                        <button id="btn-toggle-music" class="toggle-btn active">
                            <span id="music-btn-text">AÇIK</span>
                        </button>
                    </div>

                    <!-- Music Song Track Selector -->
                    <div class="setting-row setting-row-lang">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="trackLabel">🎶 Müzik Seçimi</span>
                        </div>
                        <div class="lang-grid-selector">
                            <button id="btn-track-carefree" class="lang-btn active">🌸 Carefree</button>
                            <button id="btn-track-duck" class="lang-btn">🦆 Ördekçik</button>
                            <button id="btn-track-monkeys" class="lang-btn">🐒 Marimba</button>
                        </div>
                    </div>"""

if old_music_row in html_content:
    html_content = html_content.replace(old_music_row, new_music_row_with_selector, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Update sw.js ASSETS_TO_CACHE
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

sw_tracks = [
    "'./audio/bgm_cute.mp3'",
    "'./audio/carefree.mp3'",
    "'./audio/fluffing_a_duck.mp3'",
    "'./audio/monkeys.mp3'"
]

if "'./audio/carefree.mp3'" not in sw_content:
    sw_content = sw_content.replace("'./audio/bgm_cute.mp3'", ",\n  ".join(sw_tracks), 1)

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

# Update game.js logic to support selectable tracks
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add trackLabel i18n keys for 7 languages
track_i18n = [
    ('tr: {', 'tr: {\n                trackLabel: "🎶 Müzik Seçimi",'),
    ('en: {', 'en: {\n                trackLabel: "🎶 Music Track",'),
    ('de: {', 'de: {\n                trackLabel: "🎶 Musikwahl",'),
    ('fr: {', 'fr: {\n                trackLabel: "🎶 Choix Musique",'),
    ('it: {', 'it: {\n                trackLabel: "🎶 Traccia Musica",'),
    ('es: {', 'es: {\n                trackLabel: "🎶 Selección Música",'),
    ('pt: {', 'pt: {\n                trackLabel: "🎶 Escolha Música",')
]

for old, new in track_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Upgrade initBackgroundMusic & add setBGMTrack in game.js
old_bg_music_code = """    initBackgroundMusic() {
        try {
            if (!this.bgMusic) {
                this.bgMusic = new Audio('audio/bgm_cute.mp3');
                this.bgMusic.loop = true;
                const volPct = (typeof this.settings.volume === 'number') ? this.settings.volume : 80;
                this.bgMusic.volume = (this.settings.musicEnabled === false) ? 0 : ((volPct / 100) * 0.35);
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
    }"""

new_bg_music_code = """    getBGMTrackPath() {
        const track = (this.settings && this.settings.bgmTrack) ? this.settings.bgmTrack : 'carefree';
        if (track === 'fluffing_a_duck') return 'audio/fluffing_a_duck.mp3';
        if (track === 'monkeys') return 'audio/monkeys.mp3';
        return 'audio/carefree.mp3';
    }

    setBGMTrack(trackName) {
        this.settings.bgmTrack = trackName;
        this.saveSettings();

        const newPath = this.getBGMTrackPath();
        if (this.bgMusic) {
            this.bgMusic.pause();
        }
        this.bgMusic = new Audio(newPath);
        this.bgMusic.loop = true;
        this.updateMusicUI();
    }

    initBackgroundMusic() {
        try {
            const trackPath = this.getBGMTrackPath();
            if (!this.bgMusic) {
                this.bgMusic = new Audio(trackPath);
                this.bgMusic.loop = true;
                const volPct = (typeof this.settings.volume === 'number') ? this.settings.volume : 80;
                this.bgMusic.volume = (this.settings.musicEnabled === false) ? 0 : ((volPct / 100) * 0.35);
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
    }"""

if old_bg_music_code in js_content:
    js_content = js_content.replace(old_bg_music_code, new_bg_music_code, 1)

# Add song track button listeners in game.js initUI
track_listeners = """        // Background Music Track Selector Listeners
        const btnCarefree = document.getElementById('btn-track-carefree');
        const btnDuck = document.getElementById('btn-track-duck');
        const btnMonkeys = document.getElementById('btn-track-monkeys');

        const updateTrackBtnsUI = () => {
            const current = this.settings.bgmTrack || 'carefree';
            if (btnCarefree) btnCarefree.classList.toggle('active', current === 'carefree');
            if (btnDuck) btnDuck.classList.toggle('active', current === 'fluffing_a_duck');
            if (btnMonkeys) btnMonkeys.classList.toggle('active', current === 'monkeys');
        };

        if (btnCarefree) {
            btnCarefree.addEventListener('click', () => {
                this.setBGMTrack('carefree');
                updateTrackBtnsUI();
            });
        }
        if (btnDuck) {
            btnDuck.addEventListener('click', () => {
                this.setBGMTrack('fluffing_a_duck');
                updateTrackBtnsUI();
            });
        }
        if (btnMonkeys) {
            btnMonkeys.addEventListener('click', () => {
                this.setBGMTrack('monkeys');
                updateTrackBtnsUI();
            });
        }
        updateTrackBtnsUI();"""

if "btn-track-carefree" in html_content and "btn-track-carefree" not in js_content:
    target = "const btnMusic = document.getElementById('btn-toggle-music');"
    js_content = js_content.replace(target, track_listeners + "\n\n        " + target, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
