with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 1. Add Music Setting Row in index.html inside Settings modal
old_vib_setting = """                    <!-- Vibration Setting -->
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="vibLabel">📳 Titreşim</span>
                        </div>
                        <button id="btn-toggle-vib" class="toggle-btn active">
                            <span id="vib-btn-text">AÇIK</span>
                        </button>
                    </div>"""

new_vib_music_setting = """                    <!-- Background Music Setting -->
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="musicLabel">🎵 Arka Plan Müziği</span>
                        </div>
                        <button id="btn-toggle-music" class="toggle-btn active">
                            <span id="music-btn-text">AÇIK</span>
                        </button>
                    </div>

                    <!-- Vibration Setting -->
                    <div class="setting-row">
                        <div class="setting-info">
                            <span class="setting-label" data-i18n="vibLabel">📳 Titreşim</span>
                        </div>
                        <button id="btn-toggle-vib" class="toggle-btn active">
                            <span id="vib-btn-text">AÇIK</span>
                        </button>
                    </div>"""

if old_vib_setting in html_content:
    html_content = html_content.replace(old_vib_setting, new_vib_music_setting, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 2. Add bgm_cute.mp3 to ASSETS_TO_CACHE in sw.js
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

if "'./audio/bgm_cute.mp3'" not in sw_content:
    target_cache_item = "'./favicon.png',"
    sw_content = sw_content.replace(target_cache_item, target_cache_item + "\n  './audio/bgm_cute.mp3',", 1)

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

# 3. Add Background Music Engine & Settings logic in game.js
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add musicLabel i18n keys for 7 languages
music_i18n = [
    ('tr: {', 'tr: {\n                musicLabel: "🎵 Arka Plan Müziği",'),
    ('en: {', 'en: {\n                musicLabel: "🎵 Background Music",'),
    ('de: {', 'de: {\n                musicLabel: "🎵 Hintergrundmusik",'),
    ('fr: {', 'fr: {\n                musicLabel: "🎵 Musique de fond",'),
    ('it: {', 'it: {\n                musicLabel: "🎵 Musica di sottofondo",'),
    ('es: {', 'es: {\n                musicLabel: "🎵 Música de fondo",'),
    ('pt: {', 'pt: {\n                musicLabel: "🎵 Música de fundo",')
]

for old, new in music_i18n:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Add initBackgroundMusic method to game.js
bg_music_methods = """    // =========================================================
    // CUTE BACKGROUND MUSIC ENGINE & MOBILE AUTOPLAY UNLOCKER
    // =========================================================
    initBackgroundMusic() {
        try {
            if (!this.bgMusic) {
                this.bgMusic = new Audio('audio/bgm_cute.mp3');
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

if "initBackgroundMusic()" not in js_content:
    insert_target = "    loadSettings() {"
    idx = js_content.find(insert_target)
    if idx != -1:
        js_content = js_content[:idx] + bg_music_methods + "\n\n" + js_content[idx:]

# Call initBackgroundMusic in constructor/initUI
if "this.initBackgroundMusic();" not in js_content:
    target_init = "this.initUI();"
    js_content = js_content.replace(target_init, target_init + "\n        this.initBackgroundMusic();", 1)

# Add listener for btn-toggle-music in initUI
music_btn_listener = """        const btnMusic = document.getElementById('btn-toggle-music');
        if (btnMusic) {
            btnMusic.addEventListener('click', () => {
                this.settings.musicEnabled = (this.settings.musicEnabled === false) ? true : false;
                this.saveSettings();
                this.updateMusicUI();
            });
        }"""

if "btn-toggle-music" in js_content and "btnMusic.addEventListener" not in js_content:
    target_vib = "const btnVib = document.getElementById('btn-toggle-vib');"
    js_content = js_content.replace(target_vib, music_btn_listener + "\n\n        " + target_vib, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
