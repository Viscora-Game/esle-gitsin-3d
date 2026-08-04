with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Upgrade SoundSynth with low-latency AudioContext & instant resume
new_sound_synth = """class SoundSynth {
    constructor() {
        this.ctx = null;
        this.masterVolume = 0.8;
        this.setupAudioUnlocker();
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx({ latencyHint: 'interactive' });
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {}
    }

    setupAudioUnlocker() {
        const unlock = () => {
            this.init();
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('pointerdown', unlock, { passive: true, once: true });
            window.addEventListener('touchstart', unlock, { passive: true, once: true });
            window.addEventListener('click', unlock, { passive: true, once: true });
            window.addEventListener('keydown', unlock, { passive: true, once: true });
        }
    }

    setVolume(volPct) {
        this.masterVolume = Math.max(0, Math.min(1, volPct / 100));
    }

    playClick() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

        gain.gain.setValueAtTime(0.35 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playTick() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

        gain.gain.setValueAtTime(0.25 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playLockThud() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.14);

        gain.gain.setValueAtTime(0.45 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
    }

    playHintChime() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const notes = [659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.3 * this.masterVolume, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.2);
        });
    }

    playBoosterChime() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50, 1567.98];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.35 * this.masterVolume, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.22);
        });
    }

    playMatchSound(combo = 1) {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const baseFreq = 523.25 * Math.pow(1.06, combo);
        const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);

            gain.gain.setValueAtTime(0.35 * this.masterVolume, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.04 + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.18);
        });
    }

    playVictorySound() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.4 * this.masterVolume, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.35);
        });
    }

    playDefeatSound() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;
        const now = this.ctx.currentTime;

        const notes = [400, 350, 300, 250];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);

            gain.gain.setValueAtTime(0.4 * this.masterVolume, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.25);
        });
    }
}"""

old_sound_start = "class SoundSynth {"
old_sound_end = "class ParticleFX {"
start_idx = js_content.find(old_sound_start)
end_idx = js_content.find(old_sound_end)

if start_idx != -1 and end_idx != -1:
    js_content = js_content[:start_idx] + new_sound_synth + "\n\n" + js_content[end_idx:]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
