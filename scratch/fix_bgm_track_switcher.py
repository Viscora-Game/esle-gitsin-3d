with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

bgm_methods = """    getBGMTrackPath() {
        const track = (this.settings && this.settings.bgmTrack) ? this.settings.bgmTrack : 'carefree';
        if (track === 'fluffing_a_duck') return 'audio/fluffing_a_duck.mp3';
        if (track === 'monkeys') return 'audio/monkeys.mp3';
        return 'audio/carefree.mp3';
    }

    setBGMTrack(trackName) {
        if (!this.settings) this.settings = {};
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

old_target = "    initBackgroundMusic() {"
idx = js_content.find(old_target)
end_idx = js_content.find("updateMusicUI() {", idx)

if idx != -1 and end_idx != -1:
    js_content = js_content[:idx] + bgm_methods + "\n\n    " + js_content[end_idx:]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
