const FORMATION_GRIDS = {
    HEART: [
        '  **   **  ',
        ' **** **** ',
        '********** ',
        ' ********* ',
        '  *******  ',
        '   *****   ',
        '    ***    ',
        '     **    '
    ],
    HOURGLASS: [
        '******',
        ' **** ',
        '  **  ',
        '  **  ',
        ' **** ',
        '******'
    ],
    STAR: [
        '    **   ',
        '   ****  ',
        '******** ',
        ' ******  ',
        ' **  **  ',
        '**    ** '
    ],
    CASTLE: [
        '***   ***',
        '***   ***',
        '*********',
        '*********',
        '***   ***'
    ],
    FLOWER: [
        '  ****  ',
        ' ****** ',
        '********',
        ' ****** ',
        '  ****  '
    ],
    SHIELD: [
        '******',
        '******',
        '******',
        ' **** ',
        ' **** ',
        '  **  '
    ],
    DIAMOND: [
        '   **   ',
        '  ****  ',
        ' ****** ',
        '********',
        ' ****** ',
        '  ****  ',
        '   **   '
    ],
    HELIX: [
        '***   ',
        ' ***  ',
        '  *** ',
        '  *** ',
        ' ***  ',
        '***   '
    ],
    TWIN_PEAKS: [
        '  *     *  ',
        ' ***   *** ',
        '****   ****'
    ],
    ROYAL_PYRAMID: [
        '  **  ',
        ' **** ',
        '******',
        '******'
    ]
};

/**
 * Tile Club / GamoVation Style Mobile Stack Tile Pairing Game Engine
 * Features:
 * - INTERACTIVE CHARACTER-GUIDED TUTORIAL STORYBOOK (4-Step Guided Story with Foxi, Pandi, Unika, Leo!).
 * - AUTOMATIC FIRST LAUNCH TRIGGER & REPLAYABLE FROM SETTINGS ("📖 NASIL OYNANIR?").
 * - PRO 2-ROW RICH & SPACIOUS TOP HUD BAR: High readability, large icons and booster pill buttons!
 * - STRICT TIMER CONTROL: Timer badge is 100% HIDDEN in Classic Mode, and clean fitted in Time Trial Mode!
 * - RESPONSIVE MAIN MENU BUTTON LEVEL STRINGS: Scaled text prevents text overflow no matter how high the level number is!
 * - SHUFFLE BOARD BOOSTER (🔀 Karıştır - 5000 Score Base, 2x cost increase on each use!).
 * - MODE-SPECIFIC RESET CONFIRMATION DIALOG: Asks WHICH mode to reset (Classic, Time Trial, or Both!).
 * - 10 ULTRA-AESTHETIC PERFECTLY CENTERED 3D MAHJONG FORMATIONS.
 * - DEFEAT PENALTY MECHANIC: On retry, cancels earned level points & applies -2000 score penalty (Cap at min 0).
 */

class SoundSynth {
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

        gain.gain.setValueAtTime(0.85 * this.masterVolume, now);
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

        gain.gain.setValueAtTime(0.80 * this.masterVolume, now);
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

        gain.gain.setValueAtTime(0.80 * this.masterVolume, now);
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

            gain.gain.setValueAtTime(0.70 * this.masterVolume, now + idx * 0.05);
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

            gain.gain.setValueAtTime(0.85 * this.masterVolume, now + idx * 0.05);
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

            gain.gain.setValueAtTime(0.85 * this.masterVolume, now + idx * 0.04);
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

            gain.gain.setValueAtTime(0.90 * this.masterVolume, now + idx * 0.08);
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

            gain.gain.setValueAtTime(0.90 * this.masterVolume, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.25);
        });
    }
}



class ParticleFX {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.poolSize = 200;
        this.pool = [];
        for (let i = 0; i < this.poolSize; i++) {
            this.pool.push({
                x: 0, y: 0, vx: 0, vy: 0, radius: 0, color: '#ffffff', alpha: 0, decay: 0.02, active: false
            });
        }
        this.isAnimating = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
        this.canvas.height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    }

    startAnimationLoop() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }

    spawnBurst(x, y, count = 24) {
        const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#c084fc', '#ffffff', '#ec4899'];
        let spawned = 0;
        for (let i = 0; i < this.poolSize && spawned < count; i++) {
            const p = this.pool[i];
            if (!p.active) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 2;
                p.x = x;
                p.y = y;
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.radius = Math.random() * 5 + 2;
                p.color = colors[Math.floor(Math.random() * colors.length)];
                p.alpha = 1;
                p.decay = Math.random() * 0.03 + 0.02;
                p.active = true;
                spawned++;
            }
        }
        this.startAnimationLoop();
    }

    spawnConfetti() {
        const colors = ['#fbbf24', '#ef4444', '#10b981', '#38bdf8', '#c084fc', '#f43f5e'];
        let spawned = 0;
        for (let i = 0; i < this.poolSize && spawned < 70; i++) {
            const p = this.pool[i];
            if (!p.active) {
                p.x = Math.random() * (this.canvas ? this.canvas.width : 400);
                p.y = -10;
                p.vx = (Math.random() - 0.5) * 4;
                p.vy = Math.random() * 5 + 3;
                p.radius = Math.random() * 6 + 3;
                p.color = colors[Math.floor(Math.random() * colors.length)];
                p.alpha = 1;
                p.decay = 0.005;
                p.active = true;
                spawned++;
            }
        }
        this.startAnimationLoop();
    }

    animate() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let hasActive = false;
        for (let i = 0; i < this.poolSize; i++) {
            const p = this.pool[i];
            if (!p.active) continue;

            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                p.active = false;
                continue;
            }

            hasActive = true;
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        if (hasActive) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }
}

/**
 * Pure WebAudio Background Music Player
 * Plays looping BGM via WebAudio AudioBufferSourceNode instead of HTML5 Audio elements.
 * Completely suppresses Android System Media Notifications (YouTube-style scrub bar / notification cards).
 */
class WebAudioBGMPlayer {
    constructor(soundSynth) {
        this.synth = soundSynth;
        this.currentTrackPath = null;
        this.bufferMap = {};
        this.source = null;
        this.gainNode = null;
        this.volume = 0.3;
        this.isPlaying = false;
    }

    async loadTrackBuffer(trackPath) {
        if (this.bufferMap[trackPath]) {
            return this.bufferMap[trackPath];
        }
        try {
            const res = await fetch(trackPath);
            const arrayBuf = await res.arrayBuffer();
            this.synth.init();
            if (!this.synth.ctx) return null;
            const decoded = await this.synth.ctx.decodeAudioData(arrayBuf);
            this.bufferMap[trackPath] = decoded;
            return decoded;
        } catch (e) {
            return null;
        }
    }

    async play(trackPath, volPct = 35) {
        if (this.isPlaying && this.currentTrackPath === trackPath) {
            this.setVolume(volPct);
            return;
        }
        this.currentTrackPath = trackPath;
        this.volume = Math.max(0, Math.min(1, volPct / 100)) * 0.5;

        if (this.volume <= 0) {
            this.stop();
            return;
        }

        this.synth.init();
        const ctx = this.synth.ctx;
        if (!ctx) return;

        if (ctx.state === 'suspended') {
            try { await ctx.resume(); } catch (e) {}
        }

        const buf = await this.loadTrackBuffer(trackPath);
        if (!buf || this.currentTrackPath !== trackPath) return;

        try {
            this.stop();
            this.source = ctx.createBufferSource();
            this.source.buffer = buf;
            this.source.loop = true;

            this.gainNode = ctx.createGain();
            this.gainNode.gain.value = this.volume;

            this.source.connect(this.gainNode);
            this.gainNode.connect(ctx.destination);

            this.source.start(0);
            this.isPlaying = true;
        } catch (e) {}
    }

    setVolume(volPct) {
        this.volume = Math.max(0, Math.min(1, volPct / 100)) * 0.5;
        if (this.gainNode && this.synth && this.synth.ctx) {
            try {
                this.gainNode.gain.setValueAtTime(this.volume, this.synth.ctx.currentTime);
            } catch (e) {}
        }
    }

    stop() {
        if (this.source) {
            try {
                this.source.stop(0);
                this.source.disconnect();
            } catch (e) {}
            this.source = null;
        }
        this.isPlaying = false;
    }
}

class TileMatchingGame {
        getLocalizedPuzzleName(puzzleId) {
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        if (dict.puzzles && dict.puzzles[puzzleId]) {
            return dict.puzzles[puzzleId];
        }
        if (this.puzzles) {
            const p = this.puzzles.find(x => x.id === puzzleId);
            if (p) return p.name;
        }
        return puzzleId;
    }

    getWheelSliceLabel(slice) {
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        if (slice.type === 'gold') {
            return `${slice.amount} ${dict.goldLabel || 'ALTIN'}`;
        } else if (slice.type === 'piece') {
            const pWord = slice.count > 1 ? (dict.piecesWord || 'PARÇA') : (dict.pieceWord || 'PARÇA');
            return `${slice.count} ${pWord}`;
        } else {
            return dict.pasText || 'PAS ❌';
        }
    }

    updateResponsiveCardSizing() {
        try {
            const rawW = window.innerWidth || document.documentElement.clientWidth || 380;
            const rawH = window.innerHeight || document.documentElement.clientHeight || 600;

            // ALWAYS enforce portrait orientation bounds (screenW is smaller dimension, screenH is larger dimension)
            const screenW = Math.min(rawW, rawH);
            const screenH = Math.max(rawW, rawH);
            
            const widthScale = screenW / 410;
            const heightScale = screenH / 740;
            const scaleFactor = Math.min(1, Math.max(0.58, Math.min(widthScale, heightScale)));

            this.cardW = Math.round(68 * scaleFactor);
            this.cardH = Math.round(88 * scaleFactor);
            document.documentElement.style.setProperty('--card-w', this.cardW + 'px');
            document.documentElement.style.setProperty('--card-h', this.cardH + 'px');
            const trayW = Math.round((this.cardW + 12) * 5 + 24);
            document.documentElement.style.setProperty('--tray-w', trayW + 'px');
            document.documentElement.style.setProperty('--tray-h', (this.cardH + 18) + 'px');
        } catch (e) {}
    }

    constructor() {
        try {
            // Lock Web Screen Orientation strictly to Portrait mode
            if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
                window.screen.orientation.lock('portrait').catch(() => {});
            }

            this.updateResponsiveCardSizing();

        this.maxSlotCapacity = 5;
        this.hasTemporaryExtraSlot = false;
        this.extraSlotWasUsed = false;

        // Dynamic In-Level Cost System (%100 Cost Increase / x2 on each use in same level)
        this.baseHintCost = 300;
        this.baseSlotCost = 3000;
        this.baseShuffleCost = 5000;

        this.hintCost = 300;
        this.slotCost = 3000;
        this.shuffleCost = 5000;

        // Active Game Mode State: 'classic' vs 'timetrial'
        this.currentMode = 'classic';

        // Dual Independent Saved Progress
        this.classicProgress = { level: 1, score: 0 };
        this.timeTrialProgress = { level: 1, score: 0 };

        // Current Active Level & Score
        this.level = 1;
        this.score = 0;
        this.levelStartScore = 0;

        // Time Trial Countdown Timer State
        this.timerInterval = null;
        this.remainingSeconds = 0;

        // Tutorial Slide State
        this.currentTutStep = 0;
        this.tutorialSlides = [
            {
                avatar: 'images/fox.jpg',
                name: 'FOXİ (Kozmik Tilki)',
                title: 'EŞLE GİTSİN! 3D\'YE HOŞ GELDİN 🦊',
                body: 'Tahtadaki kilitli olmayan (üstü açık) 2 aynı kartı tepsine aktararak eşleştir! 5 slotlu tepsi dolmadan tüm kartları temizle ve bölümleri geç!'
            },
            {
                avatar: 'images/panda.jpg',
                name: 'PANDİ (Sevimli Panda)',
                title: '🎮 İKİ FARKLI OYUN MODU',
                body: '• KLASİK MOD: Süre stresi olmadan rahatça bulmaca çöz.\n• ZAMANA KARŞI MOD: Zamana karşı yarış! Süre dolmadan tüm kartları hızlıca eşleştir!'
            },
            {
                avatar: 'images/unicorn.jpg',
                name: 'UNİKA (Büyülü Tekboynuz)',
                title: '💡 GÜÇLÜ JOKER BİRİMLERİ',
                body: '• İPUCU (300 Puan): Açık 2 eşleşen kartı parlatır.\n• +1 SLOT (1000 Puan): Tepsiye acil 6. slot açar.\n• KARIŞTIR (5000 Puan): Tahtadaki kartları harmanlar!'
            },
            {
                avatar: 'images/lion.jpg',
                name: 'LEO (Kral Aslan)',
                title: '⚙️ AYARLAR VE SIFIRLAMA',
                body: 'Ayarlardan ses, titreşim ve dili değiştirebilir, bu rehberi tekrar açabilir veya istediğin modu baştan sıfırlayabilirsin. Bol şans!'
            }
        ];

        // 22 Character Types
                // Gold & Puzzle Gallery Data State
        this.goldCoins = 0;
        this.puzzleInventory = [];
        this.placedPuzzlePieces = {};
        this.activePuzzleId = 'cat';
        this.pendingChestReward = null;

        // 12-Piece Puzzles Catalog
        this.puzzlesCatalog = [
            { id: 'cat', name: 'Pamuk Kedi 🐱', imgSrc: 'images/cat.jpg' },
            { id: 'fox', name: 'Sevimli Tilki 🦊', imgSrc: 'images/fox.jpg' },
            { id: 'panda', name: 'Tombul Panda 🐼', imgSrc: 'images/panda.jpg' },
            { id: 'dragon', name: 'Deniz Ejderhası 🐲', imgSrc: 'images/dragon.jpg' },
            { id: 'shiba', name: 'Shiba Inu 🐶', imgSrc: 'images/shiba.jpg' },
            { id: 'unicorn', name: 'Büyülü Tekboynuz 🦄', imgSrc: 'images/unicorn.jpg' },
            { id: 'lion', name: 'Kral Aslan 🦁', imgSrc: 'images/lion.jpg' },
            { id: 'bunny', name: 'Sihirli Tavşan 🐰', imgSrc: 'images/bunny.jpg' },
            { id: 'owl', name: 'Bilge Baykuş 🦉', imgSrc: 'images/owl.jpg' },
            { id: 'red_panda', name: 'Kızıl Panda 🐾', imgSrc: 'images/red_panda.jpg' },
            { id: 'frog', name: 'Prens Kurbağa 🐸', imgSrc: 'images/frog.jpg' },
            { id: 'penguin', name: 'Kutup Pengueni 🐧', imgSrc: 'images/penguin.jpg' }
        ];

        this.types = [
            { id: 'fox', name: 'Sevimli Tilki', bg: '#fff7ed', imgSrc: 'images/fox.jpg' },
            { id: 'cat', name: 'Pamuk Kedi', bg: '#fbf7ff', imgSrc: 'images/cat.jpg' },
            { id: 'panda', name: 'Tombul Panda', bg: '#f8fafc', imgSrc: 'images/panda.jpg' },
            { id: 'dragon', name: 'Deniz Ejderhası', bg: '#f0f9ff', imgSrc: 'images/dragon.jpg' },
            { id: 'shiba', name: 'Shiba Inu', bg: '#fefce8', imgSrc: 'images/shiba.jpg' },
            { id: 'unicorn', name: 'Büyülü Tekboynuz', bg: '#fae8ff', imgSrc: 'images/unicorn.jpg' },
            { id: 'lion', name: 'Kral Aslan', bg: '#fffbebf', imgSrc: 'images/lion.jpg' },
            { id: 'bunny', name: 'Sihirli Tavşan', bg: '#fdf2f8', imgSrc: 'images/bunny.jpg' },
            { id: 'owl', name: 'Bilge Baykuş', bg: '#f1f5f9', imgSrc: 'images/owl.jpg' },
            { id: 'red_panda', name: 'Kızıl Panda', bg: '#fff2e6', imgSrc: 'images/red_panda.jpg' },
            { id: 'frog', name: 'Prens Kurbağa', bg: '#ecfdf5', imgSrc: 'images/frog.jpg' },
            { id: 'penguin', name: 'Kutup Pengueni', bg: '#f0f9ff', imgSrc: 'images/penguin.jpg' }
        ];

        // Ultra-HD Rich Level Table Themes & High-Luminance Stage Backdrops per Section
        this.bgThemes = [
            'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0l20 20-20 20L0 20zM20 4L4 20l16 16 16-16z\' fill=\'%23ffffff\' fill-opacity=\'0.12\'/%3E%3Cpath d=\'M20 10l10 10-10 10-10-10z\' fill=\'%23fbbf24\' fill-opacity=\'0.08\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #10b981 0%, #059669 45%, #047857 75%, #065f46 100%)',
            'url("data:image/svg+xml,%3Csvg width=\'36\' height=\'36\' viewBox=\'0 0 36 36\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M18 0l18 10.392v20.785L18 41.569 0 31.177V10.392z\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1.2\' stroke-opacity=\'0.14\'/%3E%3Cpath d=\'M18 6l9 5.196v10.392L18 26.785l-9-5.196V11.196z\' fill=\'%2338bdf8\' fill-opacity=\'0.08\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #60a5fa 0%, #3b82f6 45%, #1d4ed8 75%, #1e40af 100%)',
            'url("data:image/svg+xml,%3Csvg width=\'44\' height=\'44\' viewBox=\'0 0 44 44\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'22\' cy=\'22\' r=\'18\' stroke=\'%23ffffff\' stroke-width=\'1.4\' stroke-opacity=\'0.14\' fill=\'none\'/%3E%3Cpath d=\'M22 4L4 22l18 18 18-18z\' fill=\'%23fbbf24\' fill-opacity=\'0.08\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #f43f5e 0%, #e11d48 45%, #be123c 75%, #9f1239 100%)',
            'url("data:image/svg+xml,%3Csvg width=\'36\' height=\'36\' viewBox=\'0 0 36 36\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'18\' cy=\'18\' r=\'12\' stroke=\'%23c084fc\' stroke-width=\'1.2\' stroke-opacity=\'0.15\' fill=\'none\'/%3E%3Ccircle cx=\'18\' cy=\'6\' r=\'12\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.1\' fill=\'none\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #c084fc 0%, #a855f7 45%, #7e22ce 75%, #6b21a8 100%)',
            'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\'/%3E%3Cpath d=\'M20 0L40 20 20 40 0 20z\' fill=\'%23fef08a\' fill-opacity=\'0.12\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'4\' fill=\'%23f59e0b\' fill-opacity=\'0.15\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #fbbf24 0%, #f59e0b 45%, #d97706 75%, #92400e 100%)',
            'url("data:image/svg+xml,%3Csvg width=\'36\' height=\'36\' viewBox=\'0 0 36 36\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 18 Q9 9, 18 18 T36 18\' stroke=\'%23ffffff\' stroke-width=\'1.5\' stroke-opacity=\'0.14\' fill=\'none\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #38bdf8 0%, #06b6d4 45%, #0e7490 75%, #155e75 100%)',
            'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0l20 20-20 20L0 20z\' fill=\'%23ffffff\' fill-opacity=\'0.12\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #f472b6 0%, #ec4899 45%, #be185d 75%, #9d174d 100%)',
            'url("data:image/svg+xml,%3Csvg width=\'36\' height=\'36\' viewBox=\'0 0 36 36\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'18\' cy=\'18\' r=\'10\' stroke=\'%23818cf8\' stroke-width=\'1.4\' stroke-opacity=\'0.15\' fill=\'none\'/%3E%3C/svg%3E"), radial-gradient(circle at 50% 40%, #818cf8 0%, #6366f1 45%, #4338ca 75%, #3730a3 100%)'
        ];

        // 10 Rich Symmetrical Mahjong Formations Pool!
        this.formations = [
            'HOURGLASS', 'H_LETTER', 'HEART', 'CIRCLE', 'TRIANGLE', 'FLOWER', 'DIAMOND', 'HELIX', 'TWIN_PEAKS', 'S_LETTER', 'ROYAL_PYRAMID', 'STAR'
        ];

        // Settings State
        this.settings = {
            volume: 80,
            musicVolume: 35,
            bgmTrack: 'carefree',
            vibration: true,
            lang: 'tr'
        };

        // Full 7-Language i18n Translations Dictionary (TR, EN, DE, FR, IT, ES, PT)
        // Full 7-Language Global Localization Engine (TR, EN, DE, FR, IT, ES, PT)
        this.i18n = {
            tr: {
                tabSwitchedMsg: "{name} sekmesine geçildi! Tekrar dokunarak yerleştirebilirsiniz.",
                wrongTabMsg: "Lütfen parçayı ait olduğu karakter sekmesine yerleştirin!",

                trackCarefree: "🌸 Carefree",
                trackDuck: "🦆 Ördekçik",
                trackMarimba: "🐒 Marimba",
                pieceWord: "PARÇA",
                piecesWord: "PARÇA",
                pageWord: "Sayfa",
                emptyInventoryMsg: "Envanterinizde henüz yerleştirilmemiş parça yok. Sandık açarak veya Altın ile parça kazanabilirsiniz!",
                puzzles: {
                    cat: "Pamuk Kedi 😻",
                    fox: "Sevimli Tilki 🦊",
                    panda: "Tatlı Panda 🐼",
                    dragon: "Büyülü Ejderha 🐲",
                    shiba: "Neşeli Shiba 🐶",
                    unicorn: "Işıltılı Tekboynuz 🦄",
                    lion: "Cesur Aslan 🦁",
                    bunny: "Sevimli Tavşan 🐰",
                    owl: "Bilge Baykuş 🦉",
                    red_panda: "Kızıl Panda 🐾",
                    frog: "Neşeli Kurbağa 🐸",
                    penguin: "Sevimli Penguen 🐧"
                },

                musicLabel: "🎵 Müzik Sesi",
                trackLabel: "🎶 Müzik Seçimi",
                combo2x: "✨ HARİKA UYUM!",
                combo3x: "💖 MUHTEŞEM EŞLEŞME!",
                combo4x: "🌟 SÜPER COMBO!",
                combo5x: "🌈 EFSANEVİ EŞLEŞME!",
                offlineAdMsg: "📡 Çevrimdışısınız! Reklam için internet bekleniyor.",
                pasText: "PAS ❌",
                pasWonTitle: "💨 PAS GEÇTİN!",
                pasWonDesc: "Bu çevirmede şansın yaver gitmedi, tekrar dene!",
                wheelAdCooldownTag: "⏳ REKLAMLI ÇEVİRME: {time}",
                wheelResetTag: "⏳ YARIN GEL: {time}",
                wheelAdCooldownBadge: "⏳ 8 SAATLİK REKLAM SOĞUMA SÜRESİ: {time}",
                wheelResetBadge: "⏳ 24 SAATLİK YENİLENME SÜRESİ: {time}",
                wheelRewardTitle: "🎡 ŞANS ÇARKI ÖDÜLÜ! 🎉",
                wheelRewardDesc: "🏆 Çarktan Çıkan Ödülleriniz:",
                wheelWonTitle: "🎉 TEBRİKLER! ÖDÜL KAZANDIN!",
                wheelPiecesWonText: "{count} Adet Yapboz Parçası Kazandın!",
                wheelWidgetTag: "ÇARK",
                wheelTitle: "🎡 ŞANS ÇARKI 🎁",
                wheelSubtitle: "Çarkı çevir, sürpriz altın ve yapboz parçaları kazan!",
                spinBtnFree: "🎯 ÜCRETSİZ ÇEVİR!",
                spinBtnAd: "📺 REKLAM İZLE & ÇEVİR!",
                wheelLimitReached: "⚠️ Bugünkü Çark Haklarınız Bitti! (2/2 - Yarın Tekrar Gel 🎁)",
                wheelStatusFree: "✨ 1 ÜCRETSİZ ÇEVİRME HAKKI",
                wheelStatusAd: "📺 1 REKLAMLI ÇEVİRME HAKKI",
                wheelStatusDone: "🔒 BUGÜNKÜ HAKLAR DOLDU (2/2)",
                adBannerBadge: "SPONSORLU",
                chestStarTitle: "{stars} YILDIZLI SANDIK! 🎁",
                bonusChestStarTitle: "🏆 BONUS {stars} YILDIZLI SANDIK! 🎁",
                chestInitialDesc: "Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!",
                chestGoldRewardText: "+{gold} ALTIN",
                duplicatePieceConverted: "✨ (Varolan {name} Parçası #{idx} 50 Altına Dönüştü! 🪙)",
                puzzlePieceEarned: "{name} Parçası #{idx}",
                adFullTag: "DOLDU",
                adChestLimitReached: "⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3 - Yarın Tekrar Gel 🎁)",
                adReviveLimitReached: "⚠️ Bu Bölümdeki Reklamla Devam Etme Hakkınız Bitti! (2/2)",
                reviveUsedToast: "Canlı Hak Kullanıldı!",
                adWidgetTag: "ÜCRETSİZ",
                adChestBtn: "📺 REKLAM İZLE & SANDIK KAZAN! 🎁",
                adReviveBtn: "📺 REKLAM İZLE & +1 SLOT İLE DEVAM ET",
                gameTitle: "EŞLE GİTSİN! 3D",
                menuSubtitle: "Eşleme ve Zeka Macerası",
                play: "OYNA",
                classicBtnText: "🎮 KLASİK MOD (SEVİYE {lvl})",
                timetrialBtnText: "⏱️ ZAMANA KARŞI MOD (SEVİYE {lvl})",
                journalBtnText: "📖 YAPBOZ GÜNLÜĞÜ",
                howToPlayBtnText: "📖 NASIL OYNANIR? (REHBER)",
                newGameBtn: "🔄 SIFIRLA VE YENİ OYUN BAŞLAT",
                settingsTitle: "⚙️ AYARLAR",
                volLabel: "🔊 Ses Düzeyi",
                vibLabel: "📳 Titreşim",
                langLabel: "🌐 Dil Desteği",
                saveBtn: "KAYDET VE KAPAT",
                levelLabel: "SEVİYE",
                hintLabel: "İPUCU",
                slotBtnLabel: "+1 SLOT",
                shuffleBtnLabel: "KARIŞTIR",
                scoreLabel: "SKOR",
                goldLabel: "ALTIN",
                victoryTitle: "TEBRİKLER!",
                victoryDesc: "Bölümdeki tüm kartları başarıyla eşleştirdiniz!",
                nextLevelBtn: "SONRAKİ BÖLÜM",
                defeatTitle: "SLOT DOLDU!",
                defeatDesc: "Tepside boş alan kalmadı ve eşleşen kart bulunamadı.",
                timeUpTitle: "SÜRE BİTTİ!",
                timeUpDesc: "Zamana karşı yarışta süre doldu!",
                penaltyText: "CEZA: -2000 Puan",
                retryBtn: "TEKRAR DENE (-2000 PUAN)",
                vibOn: "AÇIK",
                vibOff: "KAPALI",
                noScoreHint: "Yetersiz Skor! ({cost} Puan Gerekli)",
                noScoreSlot: "Yetersiz Skor! ({cost} Puan Gerekli)",
                noScoreShuffle: "Yetersiz Skor! ({cost} Puan Gerekli)",
                noHint: "Şu an açık eşleşen kart bulunamadı!",
                slotAdded: "Ortadaki Slot Üstüne Acil Yuva Açıldı! 🚨",
                shuffledMsg: "Tahtadaki Kartlar Karıştırıldı! 🔀",
                deadlockMsg: "Eşleşecek kart kalmadı, tahta otomatik karıştırıldı! 🔀",
                chestTitle: "ÖDÜL SANDIĞI! 🎁",
                chestDesc: "Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!",
                chestOpenBtn: "🎁 ÖDÜLLERİ AL",
                chestCollectBtn: "▶ ENVANTERE EKLE VE DEVAM ET",
                chestRewardsDesc: "🏆 Sandıktan Çıkan Ödülleriniz:",
                buyPieceBtn: "🧩 1 Parça Al",
                buyPieceCostTag: "🪙 100 Altın",
                prevPageBtn: "◀ ÖNCEKİ SAYFA",
                nextPageBtn: "SONRAKİ SAYFA ▶",
                completedBadge: "TAMAMLANDI! 🌟",
                forceUpdateBtn: "⚡ CANLI GÜNCELLEMEYİ YÜKLE (v5.6.0)",
                resetModalTitle: "🔄 HANGİ MOD SIFIRLANSIN?",
                resetModalDesc: "Sıfırlamak istediğiniz oyun modunu seçin:",
                resetClassicBtn: "🎮 KLASİK MODU SIFIRLA",
                resetTimeTrialBtn: "⏱️ ZAMANA KARŞI MODU SIFIRLA",
                resetBothBtn: "💥 HER İKİ MODU DA SIFIRLA",
                emergencySlotTitle: "🚨 ACİL SLOT",
                inventoryTitle: "📦 ENVANTER (Parçaları Tahtaya Sürükleyin veya Dokunun):",
                prevBtn: "⬅️ GERİ",
                nextBtn: "İLERİ ➡️",
                pageIndicator: "Sayfa {current} / {total}",
                insufficientGold: "⚠️ Yetersiz Altın! (100 Altın Gerekli 🪙)",
                allPiecesCollected: "🏆 Tüm Bulmaca Parçaları Zaten Toplandı!",
                pieceBought: "🎉 1 Parça Alındı: {name} (#{idx})!",
                wrongSlotMsg: "❌ Yanlış Yuva! Bu parça #{idx} numaralı yuvaya aittir. Envantere geri döndü.",
                puzzleCompleted: "🏆 TEBRİKLER! {name} BULMACASI TAMAMLANDI!"
            },
            en: {
                tabSwitchedMsg: "Switched to {name} tab! Tap again to place piece.",
                wrongTabMsg: "Please place the piece in its correct character tab!",

                trackCarefree: "🌸 Carefree",
                trackDuck: "🦆 Little Duck",
                trackMarimba: "🐒 Marimba",
                pieceWord: "PIECE",
                piecesWord: "PIECES",
                pageWord: "Page",
                emptyInventoryMsg: "No unplaced pieces in your inventory. Win pieces from chests or buy with Gold!",
                puzzles: {
                cat: "Fluffy Cat 😻",
                fox: "Cute Fox 🦊",
                panda: "Sweet Panda 🐼",
                dragon: "Magic Dragon 🐲",
                shiba: "Happy Shiba 🐶",
                unicorn: "Sparkly Unicorn 🦄",
                lion: "Brave Lion 🦁",
                bunny: "Cute Bunny 🐰",
                owl: "Wise Owl 🦉",
                red_panda: "Red Panda 🐾",
                frog: "Happy Frog 🐸",
                penguin: "Cute Penguin 🐧"
                },

                musicLabel: "🎵 Music Volume",
                trackLabel: "🎶 Music Track",
                combo2x: "✨ SWEET MATCH!",
                combo3x: "💖 WONDERFUL!",
                combo4x: "🌟 SUPER COMBO!",
                combo5x: "🌈 LEGENDARY MATCH!",
                offlineAdMsg: "📡 Offline! Internet needed to play ad.",
                pasText: "MISS ❌",
                pasWonTitle: "💨 BAD LUCK!",
                pasWonDesc: "No prize this time, try your luck again!",
                wheelAdCooldownTag: "⏳ AD SPIN IN: {time}",
                wheelResetTag: "⏳ BACK IN: {time}",
                wheelAdCooldownBadge: "⏳ 8-HOUR AD COOLDOWN: {time}",
                wheelResetBadge: "⏳ 24-HOUR RESET TIMER: {time}",
                wheelRewardTitle: "🎡 LUCKY WHEEL REWARD! 🎉",
                wheelRewardDesc: "🏆 Your Lucky Wheel Rewards:",
                wheelWonTitle: "🎉 CONGRATULATIONS! YOU WON!",
                wheelPiecesWonText: "{count} Puzzle Piece(s) Won!",
                wheelWidgetTag: "WHEEL",
                wheelTitle: "🎡 LUCKY WHEEL 🎁",
                wheelSubtitle: "Spin the wheel to win gold and puzzle pieces!",
                spinBtnFree: "🎯 SPIN FOR FREE!",
                spinBtnAd: "📺 WATCH AD & SPIN!",
                wheelLimitReached: "⚠️ Daily Wheel Limit Reached! (2/2 - Come Back Tomorrow 🎁)",
                wheelStatusFree: "✨ 1 FREE SPIN AVAILABLE",
                wheelStatusAd: "📺 1 REWARDED AD SPIN AVAILABLE",
                wheelStatusDone: "🔒 DAILY LIMIT REACHED (2/2)",
                adBannerBadge: "SPONSORED",
                chestStarTitle: "{stars}-STAR CHEST! 🎁",
                bonusChestStarTitle: "🏆 BONUS {stars}-STAR CHEST! 🎁",
                chestInitialDesc: "Level Complete! Press OPEN CHEST below to see your rewards!",
                chestGoldRewardText: "+{gold} GOLD",
                duplicatePieceConverted: "(Owned {name} #{idx} Converted!)",
                puzzlePieceEarned: "{name} Piece #{idx}",
                adFullTag: "FULL",
                adChestLimitReached: "⚠️ Daily Free Ad Chest Limit Reached! (0/3 - Come Back Tomorrow 🎁)",
                adReviveLimitReached: "⚠️ Max Level Revives Reached! (2/2)",
                reviveUsedToast: "Revive Used!",
                adWidgetTag: "FREE",
                adChestBtn: "📺 WATCH AD & WIN CHEST! 🎁",
                adReviveBtn: "📺 WATCH AD & CONTINUE WITH +1 SLOT",
                gameTitle: "MATCH & GO! 3D",
                menuSubtitle: "Tile Matching & Logic Adventure",
                play: "PLAY",
                classicBtnText: "🎮 CLASSIC MODE (LEVEL {lvl})",
                timetrialBtnText: "⏱️ TIME TRIAL MODE (LEVEL {lvl})",
                journalBtnText: "📖 PUZZLE JOURNAL",
                howToPlayBtnText: "📖 HOW TO PLAY (GUIDE)",
                newGameBtn: "🔄 RESET & START NEW GAME",
                settingsTitle: "⚙️ SETTINGS",
                volLabel: "🔊 Sound Volume",
                vibLabel: "📳 Vibration",
                langLabel: "🌐 Language",
                saveBtn: "SAVE & CLOSE",
                levelLabel: "LEVEL",
                hintLabel: "HINT",
                slotBtnLabel: "+1 SLOT",
                shuffleBtnLabel: "SHUFFLE",
                scoreLabel: "SCORE",
                goldLabel: "GOLD",
                victoryTitle: "VICTORY!",
                victoryDesc: "You matched all tiles on the board!",
                nextLevelBtn: "NEXT LEVEL",
                defeatTitle: "SLOT FULL!",
                defeatDesc: "No empty slot available and no pairs found.",
                timeUpTitle: "TIME'S UP!",
                timeUpDesc: "Time ran out in the time trial!",
                penaltyText: "PENALTY: -2000 Points",
                retryBtn: "RETRY (-2000 PTS)",
                vibOn: "ON",
                vibOff: "OFF",
                noScoreHint: "Not Enough Score! ({cost} Pts Needed)",
                noScoreSlot: "Not Enough Score! ({cost} Pts Needed)",
                noScoreShuffle: "Not Enough Score! ({cost} Pts Needed)",
                noHint: "No open matching tiles available!",
                slotAdded: "Emergency Slot Unlocked Above Center! 🚨",
                shuffledMsg: "Board Tiles Shuffled! 🔀",
                deadlockMsg: "No pairs left, board auto-shuffled! 🔀",
                chestTitle: "REWARD CHEST! 🎁",
                chestDesc: "Level Complete! Click OPEN CHEST to view rewards!",
                chestOpenBtn: "🎁 OPEN CHEST",
                chestCollectBtn: "▶ COLLECT & CONTINUE",
                chestRewardsDesc: "🏆 Your Revealed Chest Rewards:",
                buyPieceBtn: "🧩 Buy 1 Piece",
                buyPieceCostTag: "🪙 100 Gold",
                prevPageBtn: "◀ PREVIOUS PAGE",
                nextPageBtn: "NEXT PAGE ▶",
                completedBadge: "COMPLETED! 🌟",
                forceUpdateBtn: "⚡ INSTALL LIVE UPDATE (v5.6.0)",
                resetModalTitle: "🔄 RESET WHICH MODE?",
                resetModalDesc: "Select game mode to reset progress:",
                resetClassicBtn: "🎮 RESET CLASSIC MODE",
                resetTimeTrialBtn: "⏱️ RESET TIME TRIAL MODE",
                resetBothBtn: "💥 RESET BOTH MODES",
                emergencySlotTitle: "🚨 EMERGENCY SLOT",
                inventoryTitle: "📦 INVENTORY (Drag or Tap Pieces to Place):",
                prevBtn: "⬅️ BACK",
                nextBtn: "NEXT ➡️",
                pageIndicator: "Page {current} / {total}",
                insufficientGold: "⚠️ Not Enough Gold! (100 Gold Needed 🪙)",
                allPiecesCollected: "🏆 All Puzzle Pieces Already Collected!",
                pieceBought: "🎉 1 Piece Bought: {name} (#{idx})!",
                wrongSlotMsg: "❌ Wrong Slot! This piece belongs to slot #{idx}. Returned to inventory.",
                puzzleCompleted: "🏆 CONGRATS! {name} PUZZLE COMPLETED!"
            },
            de: {
                tabSwitchedMsg: "Zum Tab {name} gewechselt! Zum Platzieren erneut tippen.",
                wrongTabMsg: "Bitte platziere das Teil im richtigen Charakter-Tab!",

                trackCarefree: "🌸 Carefree",
                trackDuck: "🦆 Entchen",
                trackMarimba: "🐒 Marimba",
                pieceWord: "TEIL",
                piecesWord: "TEILE",
                pageWord: "Seite",
                emptyInventoryMsg: "Keine platzierten Teile im Inventar. Gewinne Teile aus Truhen oder kaufe mit Gold!",
                puzzles: {
                cat: "Flauschige Katze 😻",
                fox: "Süßer Fuchs 🦊",
                panda: "Süßer Panda 🐼",
                dragon: "Zauberdrache 🐲",
                shiba: "Fröhlicher Shiba 🐶",
                unicorn: "Glitzer-Einhorn 🦄",
                lion: "Tapferer Löwe 🦁",
                bunny: "Süßes Hase 🐰",
                owl: "Weise Eule 🦉",
                red_panda: "Roter Panda 🐾",
                frog: "Fröhlicher Frosch 🐸",
                penguin: "Süßer Pinguin 🐧"
                },

                musicLabel: "🎵 Musiklautstärke",
                trackLabel: "🎶 Musikwahl",
                combo2x: "✨ SÜSSES MATCH!",
                combo3x: "💖 WUNDERBAR!",
                combo4x: "🌟 SUPER COMBO!",
                combo5x: "🌈 LEGENDÄR!",
                offlineAdMsg: "📡 Offline! Internet für Werbung erforderlich.",
                pasText: "NIETE ❌",
                pasWonTitle: "💨 PECH GEHABT!",
                pasWonDesc: "Diesmal kein Gewinn, versuche es nochmal!",
                wheelAdCooldownTag: "⏳ WERBUNG IN: {time}",
                wheelResetTag: "⏳ MORGEN WIEDER: {time}",
                wheelAdCooldownBadge: "⏳ 8-STUNDEN-WERBEPAUSE: {time}",
                wheelResetBadge: "⏳ 24-STUNDEN-NEUSTART: {time}",
                wheelRewardTitle: "🎡 GLÜCKSRAD-BELOHNUNG! 🎉",
                wheelRewardDesc: "🏆 Deine Glücksrad-Belohnungen:",
                wheelWonTitle: "🎉 GLÜCKWUNSCH! GEWONNEN!",
                wheelPiecesWonText: "{count} Puzzleteil(e) gewonnen!",
                wheelWidgetTag: "RAD",
                wheelTitle: "🎡 GLÜCKSRAD 🎁",
                wheelSubtitle: "Drehe das Rad und gewinne Gold & Puzzleteile!",
                spinBtnFree: "🎯 KOSTENLOS DREHEN!",
                spinBtnAd: "📺 WERBUNG SEHEN & DREHEN!",
                wheelLimitReached: "⚠️ Tägliches Rad-Limit erreicht! (2/2 - Morgen wiederkommen 🎁)",
                wheelStatusFree: "✨ 1 KOSTENLOSE DREHUNG",
                wheelStatusAd: "📺 1 WERBUNG-DREHUNG VERFÜGBAR",
                wheelStatusDone: "🔒 TÄGLICHES LIMIT ERREICHT (2/2)",
                adBannerBadge: "GESPONSERT",
                chestStarTitle: "{stars}-STERNE TRUHE! 🎁",
                bonusChestStarTitle: "🏆 BONUS {stars}-STERNE TRUHE! 🎁",
                chestInitialDesc: "Level geschafft! Klicke unten auf TRUHE ÖFFNEN!",
                chestGoldRewardText: "+{gold} GOLD",
                duplicatePieceConverted: "(Bereits vorhanden: {name} #{idx} umgewandelt!)",
                puzzlePieceEarned: "{name} Teil #{idx}",
                adFullTag: "VOLL",
                adChestLimitReached: "⚠️ Tägliches Gratis-Truhen-Limit erreicht! (0/3 - Morgen wiederkommen 🎁)",
                adReviveLimitReached: "⚠️ Max. Reaktivierungen in diesem Level erreicht! (2/2)",
                reviveUsedToast: "Reaktivierung genutzt!",
                adWidgetTag: "GRATIS",
                adChestBtn: "📺 WERBUNG SEHEN & TRUHE GEWINNEN! 🎁",
                adReviveBtn: "📺 WERBUNG SEHEN & MIT +1 SLOT FORTFAHREN",
                gameTitle: "MATCH & GO! 3D",
                menuSubtitle: "Kachel-Matching & Logikabenteuer",
                play: "SPIELEN",
                classicBtnText: "🎮 KLASSISCH (LEVEL {lvl})",
                timetrialBtnText: "⏱️ ZEITRENNEN (LEVEL {lvl})",
                journalBtnText: "📖 PUZZLE-TAGEBUCH",
                howToPlayBtnText: "📖 ANLEITUNG (HILFE)",
                newGameBtn: "🔄 NEUES SPIEL STARTEN",
                settingsTitle: "⚙️ EINSTELLUNGEN",
                volLabel: "🔊 Lautstärke",
                vibLabel: "📳 Vibration",
                langLabel: "🌐 Sprache",
                saveBtn: "SPEICHERN & SCHLIESSEN",
                levelLabel: "LEVEL",
                hintLabel: "HINWEIS",
                slotBtnLabel: "+1 SLOT",
                shuffleBtnLabel: "MISCHEN",
                scoreLabel: "PUNKTE",
                goldLabel: "GOLD",
                victoryTitle: "SIEG!",
                victoryDesc: "Du hast alle Kacheln erfolgreich kombiniert!",
                nextLevelBtn: "NÄCHSTES LEVEL",
                defeatTitle: "SLOT VOLL!",
                defeatDesc: "Kein Platz mehr auf der Ablage vorhanden.",
                timeUpTitle: "ZEIT ABGELAUFEN!",
                timeUpDesc: "Die Zeit ist im Zeitrennen abgelaufen!",
                penaltyText: "STRAFE: -2000 Punkte",
                retryBtn: "ERNEUT VERSUCHEN (-2000 PKT)",
                vibOn: "AN",
                vibOff: "AUS",
                noScoreHint: "Nicht genug Punkte! ({cost} benötigt)",
                noScoreSlot: "Nicht genug Punkte! ({cost} benötigt)",
                noScoreShuffle: "Nicht genug Punkte! ({cost} benötigt)",
                noHint: "Keine passenden Kacheln verfügbar!",
                slotAdded: "Zusatz-Slot über der Mitte freigeschaltet! 🚨",
                shuffledMsg: "Kacheln gemischt! 🔀",
                deadlockMsg: "Keine Paare übrig, Kacheln neu gemischt! 🔀",
                chestTitle: "BELOHNUNGSTRUHE! 🎁",
                chestDesc: "Level geschafft! Klicke auf ÖFFNEN für Belohnungen!",
                chestOpenBtn: "🎁 TRUHE ÖFFNEN",
                chestCollectBtn: "▶ EINSAMMELN & WEITER",
                chestRewardsDesc: "🏆 Deine Truhen-Belohnungen:",
                buyPieceBtn: "🧩 1 Teil kaufen",
                buyPieceCostTag: "🪙 100 Gold",
                prevPageBtn: "◀ VORHERIGE SEITE",
                nextPageBtn: "NÄCHSTE SEITE ▶",
                completedBadge: "ABGESCHLOSSEN! 🌟",
                forceUpdateBtn: "⚡ LIVE-UPDATE INSTALLIEREN (v5.6.0)",
                resetModalTitle: "🔄 WELCHEN MODUS ZURÜCKSETZEN?",
                resetModalDesc: "Wähle den Spielmodus zum Zurücksetzen:",
                resetClassicBtn: "🎮 KLASSISCHEN MODUS ZURÜCKSETZEN",
                resetTimeTrialBtn: "⏱️ ZEITRENNEN ZURÜCKSETZEN",
                resetBothBtn: "💥 BEIDE MODI ZURÜCKSETZEN",
                emergencySlotTitle: "🚨 NOTFALL-SLOT",
                inventoryTitle: "📦 INVENTAR (Teile auf das Brett ziehen):",
                prevBtn: "⬅️ ZURÜCK",
                nextBtn: "WEITER ➡️",
                pageIndicator: "Seite {current} / {total}",
                insufficientGold: "⚠️ Nicht genug Gold! (100 Gold benötigt 🪙)",
                allPiecesCollected: "🏆 Alle Puzzleteile bereits gesammelt!",
                pieceBought: "🎉 1 Teil gekauft: {name} (#{idx})!",
                wrongSlotMsg: "❌ Falscher Slot! Dieses Teil gehört zu Slot #{idx}.",
                puzzleCompleted: "🏆 GLÜCKWUNSCH! {name} PUZZLE VOLLSTÄNDIG!"
            },
            fr: {
                tabSwitchedMsg: "Onglet {name} ouvert! Touchez à nouveau pour placer la pièce.",
                wrongTabMsg: "Veuillez placer la pièce dans l'onglet de personnage correspondant!",

                trackCarefree: "🌸 Carefree",
                trackDuck: "🦆 Caneton",
                trackMarimba: "🐒 Marimba",
                pieceWord: "PIÈCE",
                piecesWord: "PIÈCES",
                pageWord: "Page",
                emptyInventoryMsg: "Aucune pièce non placée dans votre inventaire. Gagnez des pièces dans les coffres ou achetez avec de l'Or!",
                puzzles: {
                cat: "Chat Doux 😻",
                fox: "Mignon Renard 🦊",
                panda: "Doux Panda 🐼",
                dragon: "Dragon Magique 🐲",
                shiba: "Shiba Joyeux 🐶",
                unicorn: "Licorne Étincelante 🦄",
                lion: "Brave Lion 🦁",
                bunny: "Mignon Lapin 🐰",
                owl: "Chouette Sage 🦉",
                red_panda: "Panda Roux 🐾",
                frog: "Grenouille Joyeuse 🐸",
                penguin: "Mignon Pingouin 🐧"
                },

                musicLabel: "🎵 Volume Musique",
                trackLabel: "🎶 Choix Musique",
                combo2x: "✨ ADORABLE COMBO!",
                combo3x: "💖 MAGNIFIQUE!",
                combo4x: "🌟 SUPER MATCH!",
                combo5x: "🌈 LÉGENDAIRE!",
                offlineAdMsg: "📡 Hors ligne! Connexion requise pour la pub.",
                pasText: "PERDU ❌",
                pasWonTitle: "💨 PAS DE CHANCE!",
                pasWonDesc: "Pas de lot cette fois, réessayez!",
                wheelAdCooldownTag: "⏳ PUB DANS: {time}",
                wheelResetTag: "⏳ REVENEZ DANS: {time}",
                wheelAdCooldownBadge: "⏳ PAUSE PUB 8H: {time}",
                wheelResetBadge: "⏳ RECHARGE EN 24H: {time}",
                wheelRewardTitle: "🎡 RÉCOMPENSE ROUE! 🎉",
                wheelRewardDesc: "🏆 Vos récompenses de la roue:",
                wheelWonTitle: "🎉 FÉLICITATIONS! GAGNÉ!",
                wheelPiecesWonText: "{count} Pièce(s) de Puzzle Gagnée(s)!",
                wheelWidgetTag: "ROUE",
                wheelTitle: "🎡 ROUE DE LA FORTUNE 🎁",
                wheelSubtitle: "Tournez la roue et gagnez de l'or et des pièces de puzzle!",
                spinBtnFree: "🎯 TOURNER GRATUITEMENT!",
                spinBtnAd: "📺 REGARDER PUB & TOURNER!",
                wheelLimitReached: "⚠️ Limite quotidienne de la roue atteinte! (2/2 - Revenez demain 🎁)",
                wheelStatusFree: "✨ 1 TOUR GRATUIT DISPONIBLE",
                wheelStatusAd: "📺 1 TOUR AVEC PUB DISPONIBLE",
                wheelStatusDone: "🔒 LIMITE ATTEINTE (2/2)",
                adBannerBadge: "SPONSORISÉ",
                chestStarTitle: "COFFRE {stars} ÉTOILE(S)! 🎁",
                bonusChestStarTitle: "🏆 COFFRE BONUS {stars} ÉTOILE(S)! 🎁",
                chestInitialDesc: "Niveau Réussi! Cliquez sur OUVRIR LE COFFRE ci-dessous!",
                chestGoldRewardText: "+{gold} OR",
                duplicatePieceConverted: "({name} #{idx} déjà possédé converti!)",
                puzzlePieceEarned: "Pièce {name} #{idx}",
                adFullTag: "PLEIN",
                adChestLimitReached: "⚠️ Limite quotidienne de coffres gratuits atteinte! (0/3 - Revenez demain 🎁)",
                adReviveLimitReached: "⚠️ Limite de réanimations par niveau atteinte! (2/2)",
                reviveUsedToast: "Réanimation utilisée!",
                adWidgetTag: "GRATUIT",
                adChestBtn: "📺 REGARDER PUB & GAGNER COFFRE! 🎁",
                adReviveBtn: "📺 REGARDER PUB & CONTINUER AVEC +1 EMPLACEMENT",
                gameTitle: "MATCH & GO! 3D",
                menuSubtitle: "Aventure de Réflexion & Cartes",
                play: "JOUER",
                classicBtnText: "🎮 MODE CLASSIQUE (NIVEAU {lvl})",
                timetrialBtnText: "⏱️ CONTRE-LA-MONTRE (NIVEAU {lvl})",
                journalBtnText: "📖 JOURNAL DE PUZZLE",
                howToPlayBtnText: "📖 COMMENT JOUER (GUIDE)",
                newGameBtn: "🔄 NOUVELLE PARTIE",
                settingsTitle: "⚙️ PARAMÈTRES",
                volLabel: "🔊 Volume du son",
                vibLabel: "📳 Vibration",
                langLabel: "🌐 Langue",
                saveBtn: "SAUVEGARDER & FERMER",
                levelLabel: "NIVEAU",
                hintLabel: "INDICE",
                slotBtnLabel: "+1 EMPLACEMENT",
                shuffleBtnLabel: "MÉLANGER",
                scoreLabel: "SCORE",
                goldLabel: "OR",
                victoryTitle: "VICTOIRE!",
                victoryDesc: "Vous avez associé toutes les cartes avec succès!",
                nextLevelBtn: "NIVEAU SUIVANT",
                defeatTitle: "EMPLACEMENT PLEIN!",
                defeatDesc: "Plus d'espace disponible sur le plateau.",
                timeUpTitle: "TEMPS ÉCOULÉ!",
                timeUpDesc: "Le temps s'est écoulé dans le contre-la-montre!",
                penaltyText: "PÉNALITÉ: -2000 Points",
                retryBtn: "RÉESSAYER (-2000 PTS)",
                vibOn: "ACTIVÉ",
                vibOff: "DÉSACTIVÉ",
                noScoreHint: "Score insuffisant! ({cost} pts requis)",
                noScoreSlot: "Score insuffisant! ({cost} pts requis)",
                noScoreShuffle: "Score insuffisant! ({cost} pts requis)",
                noHint: "Aucune carte identique disponible!",
                slotAdded: "Emplacement d'urgence débloqué! 🚨",
                shuffledMsg: "Cartes mélangées! 🔀",
                deadlockMsg: "Plus de paires, cartes mélangées! 🔀",
                chestTitle: "COFFRE AUX TRÉSORS! 🎁",
                chestDesc: "Niveau Réussi! Cliquez sur OUVRIR LE COFFRE!",
                chestOpenBtn: "🎁 OUVRIR LE COFFRE",
                chestCollectBtn: "▶ COLLECTER & CONTINUER",
                chestRewardsDesc: "🏆 Vos Récompenses du Coffre:",
                buyPieceBtn: "🧩 Acheter 1 pièce",
                buyPieceCostTag: "🪙 100 Or",
                prevPageBtn: "◀ PAGE PRÉCÉDENTE",
                nextPageBtn: "PAGE SUIVANTE ▶",
                completedBadge: "TERMINÉ! 🌟",
                forceUpdateBtn: "⚡ INSTALLER MISE À JOUR (v5.6.0)",
                resetModalTitle: "🔄 RÉINITIALISER QUEL MODE?",
                resetModalDesc: "Sélectionnez le mode à réinitialiser:",
                resetClassicBtn: "🎮 RÉINIT. CLASSIQUE",
                resetTimeTrialBtn: "⏱️ RÉINIT. CONTRE-LA-MONTRE",
                resetBothBtn: "💥 RÉINITIALISER LES DEUX",
                emergencySlotTitle: "🚨 EMPLACEMENT D'URGENCE",
                inventoryTitle: "📦 INVENTAIRE (Glissez ou touchez les pièces):",
                prevBtn: "⬅️ RETOUR",
                nextBtn: "SUIVANT ➡️",
                pageIndicator: "Page {current} / {total}",
                insufficientGold: "⚠️ Or insuffisant! (100 Or requis 🪙)",
                allPiecesCollected: "🏆 Toutes les pièces sont déjà collectées!",
                pieceBought: "🎉 1 pièce achetée: {name} (#{idx})!",
                wrongSlotMsg: "❌ Mauvais emplacement! Cette pièce appartient à #{idx}.",
                puzzleCompleted: "🏆 BRAVO! PUZZLE {name} COMPLÉTÉ!"
            },
            it: {
                tabSwitchedMsg: "Passato alla scheda {name}! Tocca di nuovo per posizionare.",
                wrongTabMsg: "Inserisci il pezzo nella scheda del personaggio corretta!",

                trackCarefree: "🌸 Carefree",
                trackDuck: "🦆 Paperotto",
                trackMarimba: "🐒 Marimba",
                pieceWord: "PEZZO",
                piecesWord: "PEZZI",
                pageWord: "Pagina",
                emptyInventoryMsg: "Nessun pezzo non posizionato nell'inventario. Vinci pezzi dai bauli o acquista con Oro!",
                puzzles: {
                cat: "Gatto Soffice 😻",
                fox: "Volpe Carina 🦊",
                panda: "Panda Dolce 🐼",
                dragon: "Drago Magico 🐲",
                shiba: "Shiba Felice 🐶",
                unicorn: "Unicorno Brillante 🦄",
                lion: "Leone Coraggioso 🦁",
                bunny: "Coniglietto Carino 🐰",
                owl: "Gufo Saggio 🦉",
                red_panda: "Panda Rosso 🐾",
                frog: "Rana Felice 🐸",
                penguin: "Pinguino Carino 🐧"
                },

                musicLabel: "🎵 Volume Musica",
                trackLabel: "🎶 Traccia Musica",
                combo2x: "✨ MERAVIGLIOSO!",
                combo3x: "💖 ADORABILE!",
                combo4x: "🌟 SUPER COMBO!",
                combo5x: "🌈 LEGENDARIO!",
                offlineAdMsg: "📡 Offline! Connessione necessaria per l'annuncio.",
                pasText: "PASSA ❌",
                pasWonTitle: "💨 PECCATO!",
                pasWonDesc: "Nessun premio questa volta, riprova!",
                wheelAdCooldownTag: "⏳ PUBBLICITÀ TRA: {time}",
                wheelResetTag: "⏳ TORNA TRA: {time}",
                wheelAdCooldownBadge: "⏳ PAUSA PUBBLICITÀ 8 ORE: {time}",
                wheelResetBadge: "⏳ REIMPOSTAZIONE 24 ORE: {time}",
                wheelRewardTitle: "🎡 PREMIO RUOTA DELLA FORTUNA! 🎉",
                wheelRewardDesc: "🏆 I tuoi premi della ruota:",
                wheelWonTitle: "🎉 CONGRATULAZIONI! HAI VINTO!",
                wheelPiecesWonText: "{count} Pezzo/i di Puzzle Vinto/i!",
                wheelWidgetTag: "RUOTA",
                wheelTitle: "🎡 RUOTA DELLA FORTUNA 🎁",
                wheelSubtitle: "Gira la ruota per vincere oro e pezzi di puzzle!",
                spinBtnFree: "🎯 GIRA GRATIS!",
                spinBtnAd: "📺 GUARDA PUBBLICITÀ E GIRA!",
                wheelLimitReached: "⚠️ Limite giornaliero ruota raggiunto! (2/2 - Torna domani 🎁)",
                wheelStatusFree: "✨ 1 GIRO GRATUITO DISPONIBILE",
                wheelStatusAd: "📺 1 GIRO CON PUBBLICITÀ DISPONIBILE",
                wheelStatusDone: "🔒 LIMITE GIORNALIERO RAGGIUNTO (2/2)",
                adBannerBadge: "SPONSORIZZATO",
                chestStarTitle: "BAULE A {stars} STELLE! 🎁",
                bonusChestStarTitle: "🏆 BAULE BONUS A {stars} STELLE! 🎁",
                chestInitialDesc: "Livello Completato! Clicca APRI IL BAULE qui sotto!",
                chestGoldRewardText: "+{gold} ORO",
                duplicatePieceConverted: "({name} #{idx} già posseduto convertito!)",
                puzzlePieceEarned: "Pezzo {name} #{idx}",
                adFullTag: "PIENO",
                adChestLimitReached: "⚠️ Limite giornaliero bauli gratis raggiunto! (0/3 - Torna domani 🎁)",
                adReviveLimitReached: "⚠️ Limite di riattivazioni per livello raggiunto! (2/2)",
                reviveUsedToast: "Riattivazione usata!",
                adWidgetTag: "GRATIS",
                adChestBtn: "📺 GUARDA PUBBLICITÀ & VINCI BAULE! 🎁",
                adReviveBtn: "📺 GUARDA PUBBLICITÀ & CONTINUA CON +1 SLOT",
                gameTitle: "MATCH & GO! 3D",
                menuSubtitle: "Avventura di Abbinamento & Logica",
                play: "GIOCA",
                classicBtnText: "🎮 MODALITÀ CLASSICA (LIVELLO {lvl})",
                timetrialBtnText: "⏱️ CRONOMETRO (LIVELLO {lvl})",
                journalBtnText: "📖 DIARIO DI PUZZLE",
                howToPlayBtnText: "📖 COME GIOCARE (GUIDA)",
                newGameBtn: "🔄 NUOVA PARTITA",
                settingsTitle: "⚙️ IMPOSTAZIONI",
                volLabel: "🔊 Volume Audio",
                vibLabel: "📳 Vibrazione",
                langLabel: "🌐 Lingua",
                saveBtn: "SALVA & CHIUDI",
                levelLabel: "LIVELLO",
                hintLabel: "SUGGERIM.",
                slotBtnLabel: "+1 SLOT",
                shuffleBtnLabel: "MESCOLA",
                scoreLabel: "PUNTI",
                goldLabel: "ORO",
                victoryTitle: "VITTORIA!",
                victoryDesc: "Hai abbinato tutte le tessere con successo!",
                nextLevelBtn: "PROSSIMO LIVELLO",
                defeatTitle: "SLOT PIENO!",
                defeatDesc: "Nessuno spazio rimasto nel supporto.",
                timeUpTitle: "TEMPO SCADUTO!",
                timeUpDesc: "Il tempo è scaduto nella modalità cronometro!",
                penaltyText: "PENALITÀ: -2000 Punti",
                retryBtn: "RIPROVA (-2000 PT)",
                vibOn: "ATTIVO",
                vibOff: "DISATTIVO",
                noScoreHint: "Punteggio insufficiente! ({cost} pt richiesti)",
                noScoreSlot: "Punteggio insufficiente! ({cost} pt richiesti)",
                noScoreShuffle: "Punteggio insufficiente! ({cost} pt richiesti)",
                noHint: "Nessuna tessera abbinabile!",
                slotAdded: "Slot di emergenza sbloccato! 🚨",
                shuffledMsg: "Tessere mescolate! 🔀",
                deadlockMsg: "Nessuna coppia rimasta, tessere rimescolate! 🔀",
                chestTitle: "BAULE DEL TESORO! 🎁",
                chestDesc: "Livello Completato! Clicca APRI IL BAULE!",
                chestOpenBtn: "🎁 APRI IL BAULE",
                chestCollectBtn: "▶ RISCATTA & CONTINUA",
                chestRewardsDesc: "🏆 I Tuoi Premi del Baule:",
                buyPieceBtn: "🧩 Compra 1 Pezzo",
                buyPieceCostTag: "🪙 100 Oro",
                prevPageBtn: "◀ PAGINA PRECEDENTE",
                nextPageBtn: "PAGINA SUCCESSIVA ▶",
                completedBadge: "COMPLETATO! 🌟",
                forceUpdateBtn: "⚡ INSTALLA AGGIORNAMENTO (v5.6.0)",
                resetModalTitle: "🔄 RESETTA QUALE MODALITÀ?",
                resetModalDesc: "Seleziona la modalità da resettare:",
                resetClassicBtn: "🎮 RESETTA CLASSICA",
                resetTimeTrialBtn: "⏱️ RESETTA CRONOMETRO",
                resetBothBtn: "💥 RESETTA ENTRAMBE",
                emergencySlotTitle: "🚨 SLOT DI EMERGENZA",
                inventoryTitle: "📦 INVENTARIO (Trascina o tocca i pezzi):",
                prevBtn: "⬅️ INDIETRO",
                nextBtn: "AVANTI ➡️",
                pageIndicator: "Pagina {current} / {total}",
                insufficientGold: "⚠️ Oro insufficiente! (100 Oro richiesti 🪙)",
                allPiecesCollected: "🏆 Tutti i pezzi del puzzle già raccolti!",
                pieceBought: "🎉 1 Pezzo Acquistato: {name} (#{idx})!",
                wrongSlotMsg: "❌ Slot Errato! Questo pezzo appartiene allo slot #{idx}.",
                puzzleCompleted: "🏆 COMPLIMENTI! PUZZLE {name} COMPLETATO!"
            },
            es: {
                musicLabel: "🎵 Volumen Música",
                trackLabel: "🎶 Selección Música",
                combo2x: "✨ ¡DULCE COMBO!",
                combo3x: "💖 ¡MAGNÍFICO!",
                combo4x: "🌟 ¡SÚPER PAREJA!",
                combo5x: "🌈 ¡LEYENDARIO!",
                offlineAdMsg: "📡 ¡Sin conexión! Se requiere internet para anuncios.",
                pasText: "PASO ❌",
                pasWonTitle: "💨 ¡MALA SUERTE!",
                pasWonDesc: "¡Sin premio esta vez, inténtalo de nuevo!",
                wheelAdCooldownTag: "⏳ ANUNCIO EN: {time}",
                wheelResetTag: "⏳ VUELVE EN: {time}",
                wheelAdCooldownBadge: "⏳ ESPERA DE 8 HORAS: {time}",
                wheelResetBadge: "⏳ REINICIO EN 24 HORAS: {time}",
                wheelRewardTitle: "🎡 ¡RECOMPENSA RUEDA! 🎉",
                wheelRewardDesc: "🏆 Tus recompensas de la rueda:",
                wheelWonTitle: "🎉 ¡ENHORABUENA! ¡HAS GANADO!",
                wheelPiecesWonText: "¡{count} Pieza(s) de Puzzle Ganada(s)!",
                wheelWidgetTag: "RUEDA",
                wheelTitle: "🎡 RUEDA DE LA SUERTE 🎁",
                wheelSubtitle: "¡Gira la rueda para ganar oro y piezas de puzzle!",
                spinBtnFree: "🎯 ¡GIRAR GRATIS!",
                spinBtnAd: "📺 ¡VER ANUNCIO Y GIRAR!",
                wheelLimitReached: "⚠️ ¡Límite diario de la rueda alcanzado! (2/2 - Vuelve mañana 🎁)",
                wheelStatusFree: "✨ 1 GIRO GRATIS DISPONIBLE",
                wheelStatusAd: "📺 1 GIRO CON ANUNCIO DISPONIBLE",
                wheelStatusDone: "🔒 LÍMITE DIARIO ALCANZADO (2/2)",
                adBannerBadge: "PATROCINADO",
                chestStarTitle: "¡COFRE DE {stars} ESTRELLAS! 🎁",
                bonusChestStarTitle: "🏆 ¡COFRE BONUS DE {stars} ESTRELLAS! 🎁",
                chestInitialDesc: "¡Nivel Completado! Pulsa ABRIR COFRE abajo para ver tus recompensas.",
                chestGoldRewardText: "+{gold} ORO",
                duplicatePieceConverted: "(¡{name} #{idx} poseído convertido!)",
                puzzlePieceEarned: "Pieza {name} #{idx}",
                adFullTag: "LLENO",
                adChestLimitReached: "⚠️ ¡Límite diario de cofres gratis alcanzado! (0/3 - Vuelve mañana 🎁)",
                adReviveLimitReached: "⚠️ ¡Máximo de reanimaciones por nivel alcanzado! (2/2)",
                reviveUsedToast: "¡Reanimación Usada!",
                adWidgetTag: "GRATIS",
                adChestBtn: "📺 ¡VER ANUNCIO Y GANAR COFRE! 🎁",
                adReviveBtn: "📺 ¡VER ANUNCIO Y CONTINUAR CON +1 SLOT!",
                gameTitle: "MATCH & GO! 3D",
                menuSubtitle: "Aventura de Lógica y Parejas",
                play: "JUGAR",
                classicBtnText: "🎮 MODO CLÁSICO (NIVEL {lvl})",
                timetrialBtnText: "⏱️ MODO CONTRARELOJ (NIVEL {lvl})",
                journalBtnText: "📖 DIARIO DE PUZZLE",
                howToPlayBtnText: "📖 CÓMO JUGAR (GUÍA)",
                newGameBtn: "🔄 REINICIAR Y NUEVO JUEGO",
                settingsTitle: "⚙️ AJUSTES",
                volLabel: "🔊 Volumen Sonido",
                vibLabel: "📳 Vibración",
                langLabel: "🌐 Idioma",
                saveBtn: "GUARDAR Y CERRAR",
                levelLabel: "NIVEL",
                hintLabel: "PISTA",
                slotBtnLabel: "+1 SLOT",
                shuffleBtnLabel: "MEZCLAR",
                scoreLabel: "PUNTOS",
                goldLabel: "ORO",
                victoryTitle: "¡VICTORIA!",
                victoryDesc: "¡Has emparejado todas las fichas con éxito!",
                nextLevelBtn: "SIGUIENTE NIVEL",
                defeatTitle: "¡SLOT LLENO!",
                defeatDesc: "No queda espacio libre en el soporte.",
                timeUpTitle: "¡TIEMPO AGOTADO!",
                timeUpDesc: "¡Se agotó el tiempo en el modo contrareloj!",
                penaltyText: "PENALIZACIÓN: -2000 Puntos",
                retryBtn: "REINTENTAR (-2000 PTS)",
                vibOn: "ACTIVADO",
                vibOff: "DESACTIVADO",
                noScoreHint: "¡Puntos insuficientes! ({cost} pts requeridos)",
                noScoreSlot: "¡Puntos insuficientes! ({cost} pts requeridos)",
                noScoreShuffle: "¡Puntos insuficientes! ({cost} pts requeridos)",
                noHint: "¡No hay fichas iguales disponibles!",
                slotAdded: "¡Slot de emergencia desbloqueado! 🚨",
                shuffledMsg: "¡Fichas mezcladas! 🔀",
                deadlockMsg: "Sin parejas restantes, ¡fichas mezcladas! 🔀",
                chestTitle: "¡COFRE DE RECOMPENSA! 🎁",
                chestDesc: "¡Nivel Completado! Haz clic en ABRIR COFRE.",
                chestOpenBtn: "🎁 ABRIR COFRE",
                chestCollectBtn: "▶ RECOGER Y CONTINUAR",
                chestRewardsDesc: "🏆 Tus Recompensas del Cofre:",
                buyPieceBtn: "🧩 Comprar 1 pieza",
                buyPieceCostTag: "🪙 100 Oro",
                prevPageBtn: "◀ PÁGINA ANTERIOR",
                nextPageBtn: "PÁGINA SIGUIENTE ▶",
                completedBadge: "¡COMPLETADO! 🌟",
                forceUpdateBtn: "⚡ INSTALAR ACTUALIZACIÓN (v5.6.0)",
                resetModalTitle: "🔄 ¿REINICIAR QUÉ MODO?",
                resetModalDesc: "Selecciona el modo para reiniciar progreso:",
                resetClassicBtn: "🎮 REINICIAR MODO CLÁSICO",
                resetTimeTrialBtn: "⏱️ REINICIAR CONTRARELOJ",
                resetBothBtn: "💥 REINICIAR AMBOS MODOS",
                emergencySlotTitle: "🚨 SLOT DE EMERGENCIA",
                inventoryTitle: "📦 INVENTARIO (Arrastra o toca las piezas):",
                prevBtn: "⬅️ ATRÁS",
                nextBtn: "SIGUIENTE ➡️",
                pageIndicator: "Página {current} / {total}",
                insufficientGold: "⚠️ ¡Oro insuficiente! (100 Oro requeridos 🪙)",
                allPiecesCollected: "🏆 ¡Todas las piezas de puzzle ya fueron recogidas!",
                pieceBought: "🎉 1 pieza comprada: {name} (#{idx})!",
                wrongSlotMsg: "❌ ¡Slot Incorrecto! Esta pieza pertenece al slot #{idx}.",
                puzzleCompleted: "🏆 ¡ENHORABUENA! PUZZLE {name} COMPLETADO!"
            },
            pt: {
                tabSwitchedMsg: "Mudado para a aba {name}! Toque novamente para colocar.",
                wrongTabMsg: "Por favor, coloque a peça na aba de personagem correta!",

                trackCarefree: "🌸 Carefree",
                trackDuck: "🦆 Patinho",
                trackMarimba: "🐒 Marimba",
                pieceWord: "PEÇA",
                piecesWord: "PEÇAS",
                pageWord: "Página",
                emptyInventoryMsg: "Nenhuma peça não colocada em seu inventário. Ganhe peças em baús ou compre com Ouro!",
                puzzles: {
                cat: "Gato Fofo 😻",
                fox: "Raposa Fofa 🦊",
                panda: "Panda Fofo 🐼",
                dragon: "Dragão Mágico 🐲",
                shiba: "Shiba Alegre 🐶",
                unicorn: "Unicórnio Brilhante 🦄",
                lion: "Leão Valente 🦁",
                bunny: "Coelhinho Fofo 🐰",
                owl: "Coruja Sábia 🦉",
                red_panda: "Panda Vermelho 🐾",
                frog: "Sapo Alegre 🐸",
                penguin: "Pinguim Fofo 🐧"
                },

                musicLabel: "🎵 Volume Música",
                trackLabel: "🎶 Escolha Música",
                combo2x: "✨ COMBO FOFO!",
                combo3x: "💖 INCRÍVEL!",
                combo4x: "🌟 SUPER COMBO!",
                combo5x: "🌈 LENDÁRIO!",
                offlineAdMsg: "📡 Offline! Conexão necessária para o anúncio.",
                pasText: "PASSOU ❌",
                pasWonTitle: "💨 QUE AZAR!",
                pasWonDesc: "Sem prêmio desta vez, tente novamente!",
                wheelAdCooldownTag: "⏳ ANÚNCIO EM: {time}",
                wheelResetTag: "⏳ VOLTE EM: {time}",
                wheelAdCooldownBadge: "⏳ PAUSA DE ANÚNCIO DE 8H: {time}",
                wheelResetBadge: "⏳ REINÍCIO EM 24H: {time}",
                wheelRewardTitle: "🎡 PRÊMIO DA ROLETA! 🎉",
                wheelRewardDesc: "🏆 Seus prêmios da roleta:",
                wheelWonTitle: "🎉 PARABÉNS! VOCÊ GANHOU!",
                wheelPiecesWonText: "{count} Peça(s) de Puzzle Ganha(s)!",
                wheelWidgetTag: "ROLETA",
                wheelTitle: "🎡 ROLETA DA SORTE 🎁",
                wheelSubtitle: "Gire a roleta para ganhar ouro e peças de puzzle!",
                spinBtnFree: "🎯 GIRAR GRÁTIS!",
                spinBtnAd: "📺 ASSISTIR ANÚNCIO E GIRAR!",
                wheelLimitReached: "⚠️ Limite diário da roleta atingido! (2/2 - Volte amanhã 🎁)",
                wheelStatusFree: "✨ 1 GIRO GRÁTIS DISPONÍVEL",
                wheelStatusAd: "📺 1 GIRO COM ANÚNCIO DISPONÍVEL",
                wheelStatusDone: "🔒 LIMITE DIÁRIO ATINGIDO (2/2)",
                adBannerBadge: "PATROCINADO",
                chestStarTitle: "BAÚ DE {stars} ESTRELAS! 🎁",
                bonusChestStarTitle: "🏆 BAÚ BÔNUS DE {stars} ESTRELAS! 🎁",
                chestInitialDesc: "Fase Concluída! Clique em ABRIR BAÚ abaixo!",
                chestGoldRewardText: "+{gold} OURO",
                duplicatePieceConverted: "({name} #{idx} já possuído convertido!)",
                puzzlePieceEarned: "Peça {name} #{idx}",
                adFullTag: "CHEIO",
                adChestLimitReached: "⚠️ Limite diário de baús grátis atingido! (0/3 - Volte amanhã 🎁)",
                adReviveLimitReached: "⚠️ Limite de reanimações na fase atingido! (2/2)",
                reviveUsedToast: "Reanimação Usada!",
                adWidgetTag: "GRÁTIS",
                adChestBtn: "📺 ASSISTIR ANÚNCIO & GANHAR BAÚ! 🎁",
                adReviveBtn: "📺 ASSISTIR ANÚNCIO & CONTINUAR COM +1 SLOT",
                gameTitle: "MATCH & GO! 3D",
                menuSubtitle: "Aventura de Lógica e Peças",
                play: "JOGAR",
                classicBtnText: "🎮 MODO CLÁSSICO (NÍVEL {lvl})",
                timetrialBtnText: "⏱️ CONTRA O TEMPO (NÍVEL {lvl})",
                journalBtnText: "📖 DIÁRIO DE PUZZLE",
                howToPlayBtnText: "📖 COMO JOGAR (GUIA)",
                newGameBtn: "🔄 REINICIAR E NOVO JOGO",
                settingsTitle: "⚙️ CONFIGURAÇÕES",
                volLabel: "🔊 Volume de Som",
                vibLabel: "📳 Vibração",
                langLabel: "🌐 Idioma",
                saveBtn: "SALVAR E FECHAR",
                levelLabel: "NÍVEL",
                hintLabel: "DICA",
                slotBtnLabel: "+1 SLOT",
                shuffleBtnLabel: "EMBARALHAR",
                scoreLabel: "PONTOS",
                goldLabel: "OURO",
                victoryTitle: "VITÓRIA!",
                victoryDesc: "Você combinou todas as peças com sucesso!",
                nextLevelBtn: "PRÓXIMO NÍVEL",
                defeatTitle: "SLOT CHEIO!",
                defeatDesc: "Nenhum espaço disponível no suporte.",
                timeUpTitle: "TEMPO ESGOTADO!",
                timeUpDesc: "O tempo acabou no modo contra o tempo!",
                penaltyText: "PENALIDADE: -2000 Pontos",
                retryBtn: "TENTAR NOVAMENTE (-2000 PTS)",
                vibOn: "LIGADO",
                vibOff: "DESLIGADO",
                noScoreHint: "Pontos insuficientes! ({cost} pts necessários)",
                noScoreSlot: "Pontos insuficientes! ({cost} pts necessários)",
                noScoreShuffle: "Pontos insuficientes! ({cost} pts necessários)",
                noHint: "Nenhuma peça combinável disponível!",
                slotAdded: "Slot de emergência desbloqueado! 🚨",
                shuffledMsg: "Peças embaralhadas! 🔀",
                deadlockMsg: "Sem pares restantes, peças embaralhadas! 🔀",
                chestTitle: "BAÚ DE RECOMPENSA! 🎁",
                chestDesc: "Fase Concluída! Clique em ABRIR BAÚ!",
                chestOpenBtn: "🎁 ABRIR BAÚ",
                chestCollectBtn: "▶ COLETAR E CONTINUAR",
                chestRewardsDesc: "🏆 Suas Recompensas do Baú:",
                buyPieceBtn: "🧩 Comprar 1 peça",
                buyPieceCostTag: "🪙 100 Ouro",
                prevPageBtn: "◀ PÁGINA ANTERIOR",
                nextPageBtn: "PRÓXIMA PÁGINA ▶",
                completedBadge: "CONCLUÍDO! 🌟",
                forceUpdateBtn: "⚡ INSTALAR ATUALIZAÇÃO (v5.6.0)",
                resetModalTitle: "🔄 REINICIAR QUAL MODO?",
                resetModalDesc: "Selecione o modo para reiniciar progresso:",
                resetClassicBtn: "🎮 REINICIAR MODO CLÁSSICO",
                resetTimeTrialBtn: "⏱️ REINICIAR CONTRA O TEMPO",
                resetBothBtn: "💥 REINICIAR AMBOS OS MODOS",
                emergencySlotTitle: "🚨 SLOT DE EMERGÊNCIA",
                inventoryTitle: "📦 INVENTÁRIO (Arraste ou toque nas peças):",
                prevBtn: "⬅️ VOLTAR",
                nextBtn: "PRÓXIMO ➡️",
                pageIndicator: "Página {current} / {total}",
                insufficientGold: "⚠️ Ouro insuficiente! (100 Ouro necessários 🪙)",
                allPiecesCollected: "🏆 Todas as peças de puzzle já coletadas!",
                pieceBought: "🎉 1 peça comprada: {name} (#{idx})!",
                wrongSlotMsg: "❌ Slot Incorreto! Esta peça pertence ao slot #{idx}.",
                puzzleCompleted: "🏆 PARABÉNS! PUZZLE {name} CONCLUÍDO!"
            }
        };

        // Combo Multiplier System
        this.comboCount = 1;
        this.lastMatchTime = 0;
        this.comboTimer = null;

        this.boardTiles = [];
        this.slotTiles = [];
        this.hintHighlights = [];

        this.sound = new SoundSynth();
        this.fx = new ParticleFX('fx-canvas');

        this.loadSettings();
        this.loadGameProgress();
        this.loadPlayerProfile();
        this.loadCloudLeaderboardCache();
        this.syncCloudLeaderboard(); // Auto-push pre-existing local scores to cloud DB on startup!
        this.initUI();
        this.initBackgroundMusic();
        this.checkFirstTimeTutorial();
        this.checkFirstTimeRegistration();
        } catch (e) {
            console.error('[EsleGitsin3D] Init error:', e);
            document.querySelectorAll('.modal-overlay').forEach(el => {
                el.classList.add('hidden');
                el.style.display = 'none';
                el.style.pointerEvents = 'none';
            });
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
                mainMenu.style.display = 'flex';
                mainMenu.style.pointerEvents = 'auto';
                mainMenu.style.opacity = '1';
            }
        }
    }

    loadGameProgress() {
        try {
            let savedClassic = localStorage.getItem('tile_game_classic');
            if (!savedClassic) savedClassic = localStorage.getItem('tile_game_classic_backup');
            
            if (savedClassic) {
                const parsed = JSON.parse(savedClassic);
                if (parsed && typeof parsed.level === 'number' && parsed.level > 0) {
                    if (parsed.level > 1 && (!parsed.score || parsed.score < (parsed.level - 1) * 1000)) {
                        parsed.score = (parsed.level - 1) * 2000;
                    }
                    this.classicProgress = parsed;
                }
            }

            let savedTimeTrial = localStorage.getItem('tile_game_timetrial');
            if (!savedTimeTrial) savedTimeTrial = localStorage.getItem('tile_game_timetrial_backup');
            
            if (savedTimeTrial) {
                const parsed = JSON.parse(savedTimeTrial);
                if (parsed && typeof parsed.level === 'number' && parsed.level > 0) {
                    if (parsed.level > 1 && (!parsed.score || parsed.score < (parsed.level - 1) * 1000)) {
                        parsed.score = (parsed.level - 1) * 2500;
                    }
                    this.timeTrialProgress = parsed;
                }
            }
        
            let savedPuzzleData = localStorage.getItem('tile_game_puzzle_data');
            if (!savedPuzzleData) savedPuzzleData = localStorage.getItem('tile_game_puzzle_data_backup');
            if (savedPuzzleData) {
                const pData = JSON.parse(savedPuzzleData);
                if (pData) {
                    this.goldCoins = pData.goldCoins || 0;
                    this.puzzleInventory = pData.puzzleInventory || [];
                    this.placedPuzzlePieces = pData.placedPuzzlePieces || {};
                }
            }
            const goldEl = document.getElementById('gold-val');
            if (goldEl) goldEl.innerText = this.goldCoins;
        } catch (e) {}
    }

    saveGameProgress(isVictoryUnlock = false) {
        try {
            const puzzleData = {
                goldCoins: this.goldCoins,
                puzzleInventory: this.puzzleInventory,
                placedPuzzlePieces: this.placedPuzzlePieces
            };
            const jsonPuzzleStr = JSON.stringify(puzzleData);
            localStorage.setItem('tile_game_puzzle_data', jsonPuzzleStr);
            localStorage.setItem('tile_game_puzzle_data_backup', jsonPuzzleStr);
            const goldEl = document.getElementById('gold-val');
            if (goldEl) goldEl.innerText = this.goldCoins;

            if (this.level && this.level >= 1) {
                const targetSaveLevel = isVictoryUnlock ? (this.level + 1) : this.level;

                if (this.currentMode === 'classic') {
                    const currentHighest = (this.classicProgress && typeof this.classicProgress.level === 'number') ? this.classicProgress.level : 1;
                    const safeLevel = Math.max(currentHighest, targetSaveLevel);
                    const baseMinScore = (safeLevel > 1) ? (safeLevel - 1) * 2000 : 0;
                    
                    // Support real-time score penalties (e.g. 45,000 -> 43,000) while enforcing non-negative & level floor
                    const safeScore = (typeof this.score === 'number') ? Math.max(baseMinScore, Math.max(0, this.score)) : Math.max((this.classicProgress && this.classicProgress.score) || 0, baseMinScore);
                    
                    const data = {
                        level: safeLevel,
                        score: safeScore,
                        timestamp: Date.now()
                    };

                    this.classicProgress = data;
                    const jsonStr = JSON.stringify(data);
                    localStorage.setItem('tile_game_classic', jsonStr);
                    localStorage.setItem('tile_game_classic_backup', jsonStr);
                } else {
                    const currentHighest = (this.timeTrialProgress && typeof this.timeTrialProgress.level === 'number') ? this.timeTrialProgress.level : 1;
                    const safeLevel = Math.max(currentHighest, targetSaveLevel);
                    const baseMinScore = (safeLevel > 1) ? (safeLevel - 1) * 2500 : 0;

                    // Support real-time score penalties (e.g. 45,000 -> 43,000) while enforcing non-negative & level floor
                    const safeScore = (typeof this.score === 'number') ? Math.max(baseMinScore, Math.max(0, this.score)) : Math.max((this.timeTrialProgress && this.timeTrialProgress.score) || 0, baseMinScore);

                    const data = {
                        level: safeLevel,
                        score: safeScore,
                        timestamp: Date.now()
                    };

                    this.timeTrialProgress = data;
                    const jsonStr = JSON.stringify(data);
                    localStorage.setItem('tile_game_timetrial', jsonStr);
                    localStorage.setItem('tile_game_timetrial_backup', jsonStr);
                }
            }

            // Sync scores to live cloud database unconditionally!
            this.syncCloudLeaderboard();
        } catch (e) {}
    }

    resetClassicProgress() {
        try {
            localStorage.removeItem('tile_game_classic');
            localStorage.removeItem('tile_game_classic_backup');
        } catch (e) {}
        this.classicProgress = { level: 1, score: 0 };
    }

    resetTimeTrialProgress() {
        try {
            localStorage.removeItem('tile_game_timetrial');
            localStorage.removeItem('tile_game_timetrial_backup');
        } catch (e) {}
        this.timeTrialProgress = { level: 1, score: 0 };
    }

    checkFirstTimeTutorial() {
        try {
            const seen = localStorage.getItem('tile_game_tutorial_seen');
            if (!seen) {
                setTimeout(() => this.openTutorial(0), 400);
            }
        } catch (e) {}
    }

    openTutorial(startStep = 0) {
        this.currentTutStep = startStep;
        this.renderTutorialStep();
        document.getElementById('modal-tutorial').classList.remove('hidden');
    }

    getTutorialSlides() {
        const lang = (this.settings && this.settings.lang) ? this.settings.lang : "tr";
        const slides = {
            tr: [
                { avatar: "images/fox.jpg", name: "FOXİ (Kozmik Tilki)", title: "EŞLE GİTSİN! 3D'YE HOŞ GELDİN 🦊", body: "Tahtadaki kilitli olmayan (üstü açık) 2 aynı kartı tepsine aktararak eşleştir! 5 slotlu tepsi dolmadan tüm kartları temizle ve bölümleri geç!" },
                { avatar: "images/panda.jpg", name: "PANDİ (Sevimli Panda)", title: "🎮 İKİ FARKLI OYUN MODU", body: "• KLASİK MOD: Süre stresi olmadan rahatça bulmaca çöz.\n• ZAMANA KARŞI MOD: Zamana karşı yarış! Süre dolmadan tüm kartları hızlıca eşleştir!" },
                { avatar: "images/unicorn.jpg", name: "UNİKA (Büyülü Tekboynuz)", title: "💡 GÜÇLÜ JOKER BİRİMLERİ", body: "• İPUCU (300 Puan): Açık 2 eşleşen kartı parlatır.\n• +1 SLOT (1000 Puan): Tepsiye acil 6. slot açar.\n• KARIŞTIR (5000 Puan): Tahtadaki kartları harmanlar!" },
                { avatar: "images/lion.jpg", name: "LEO (Kral Aslan)", title: "⚙️ AYARLAR VE SIFIRLAMA", body: "Ayarlardan ses, titreşim ve dili değiştirebilir, bu rehberi tekrar açabilir veya istediğin modu baştan sıfırlayabilirsin. Bol şans!" }
            ],
            en: [
                { avatar: "images/fox.jpg", name: "FOXI (Cosmic Fox)", title: "WELCOME TO MATCH & GO! 3D 🦊", body: "Match 2 open identical tiles by tapping them to send to tray! Clear all tiles before the 5-slot tray fills up!" },
                { avatar: "images/panda.jpg", name: "PANDI (Cute Panda)", title: "🎮 TWO EXCITING GAME MODES", body: "• CLASSIC MODE: Relax and solve puzzles without time limits.\n• TIME TRIAL MODE: Race against time! Match all tiles before the clock runs out!" },
                { avatar: "images/unicorn.jpg", name: "UNIKA (Magical Unicorn)", title: "💡 POWERFUL BOOSTERS", body: "• HINT (300 Pts): Highlights 2 open matching tiles.\n• +1 SLOT (1000 Pts): Opens an emergency 6th slot.\n• SHUFFLE (5000 Pts): Shuffles all tiles on the board!" },
                { avatar: "images/lion.jpg", name: "LEO (King Lion)", title: "⚙️ SETTINGS & RESET", body: "Customize volume, vibration, and language from settings, replay this guide, or reset your game progress. Good luck!" }
            ],
            de: [
                { avatar: "images/fox.jpg", name: "FOXI (Kosmischer Fuchs)", title: "WILLKOMMEN BEI MATCH & GO! 3D 🦊", body: "Kombiniere 2 gleiche offene Kacheln! Räume das Brett ab, bevor die 5 Ablageplätze voll sind!" },
                { avatar: "images/panda.jpg", name: "PANDI (Süßer Panda)", title: "🎮 ZWEI SPIELMODI", body: "• KLASSISCH: Entspanntes Rätseln ohne Zeitdruck.\n• ZEITRENNEN: Rennen gegen die Zeit! Kombiniere schnell alle Kacheln!" },
                { avatar: "images/unicorn.jpg", name: "UNIKA (Zauber-Einhorn)", title: "💡 STARKE BOOSTER", body: "• HINWEIS (300 Pkt): Hebt 2 passende Kacheln hervor.\n• +1 SLOT (1000 Pkt): Öffnet einen Notfall-Slot.\n• MISCHEN (5000 Pkt): Mischt alle Kacheln neu!" },
                { avatar: "images/lion.jpg", name: "LEO (König Löwe)", title: "⚙️ EINSTELLUNGEN & RESET", body: "Passe Lautstärke, Vibration und Sprache an, öffne diese Anleitung oder setze den Fortschritt zurück. Viel Glück!" }
            ],
            fr: [
                { avatar: "images/fox.jpg", name: "FOXI (Renard Cosmique)", title: "BIENVENUE SUR MATCH & GO! 3D 🦊", body: "Associez 2 cartes identiques ouvertes! Videz le plateau avant que le support à 5 emplacements ne se remplisse!" },
                { avatar: "images/panda.jpg", name: "PANDI (Panda Mignon)", title: "🎮 DEUX MODES DE JEU", body: "• CLASSIQUE: Résolvez des puzzles sans limite de temps.\n• CONTRE-LA-MONTRE: Course contre le montre! Associez rapidement!" },
                { avatar: "images/unicorn.jpg", name: "UNIKA (Licorne Magique)", title: "💡 POWER-UPS PUISSANTS", body: "• INDICE (300 Pts): Illumine 2 cartes identiques.\n• +1 EMPLACEMENT (1000 Pts): Ouvre un 6e emplacement d'urgence.\n• MÉLANGER (5000 Pts): Mélange toutes les cartes!" },
                { avatar: "images/lion.jpg", name: "LEO (Roi Lion)", title: "⚙️ PARAMÈTRES & RÉINITIALISATION", body: "Ajustez le son, les vibrations et la langue, rejouez ce guide ou réinitialisez votre progression. Bonne chance!" }
            ],
            it: [
                { avatar: "images/fox.jpg", name: "FOXI (Volpe Cosmica)", title: "BENVENUTO SU MATCH & GO! 3D 🦊", body: "Abbina 2 tessere uguali scoperte! Sgombra il tabellone prima che lo slot da 5 si riempia!" },
                { avatar: "images/panda.jpg", name: "PANDI (Panda Tenero)", title: "🎮 DUE MODALITÀ DI GIOCO", body: "• CLASSICA: Risolvi i puzzle senza limiti di tempo.\n• CRONOMETRO: Corsa contro il tempo! Abbina prima che scada il tempo!" },
                { avatar: "images/unicorn.jpg", name: "UNIKA (Unicorno Magico)", title: "💡 POTENTI POTENZIAMENTI", body: "• SUGGERIMENTO (300 Pt): Evidenzia 2 tessere uguali.\n• +1 SLOT (1000 Pt): Apre un 6° slot di emergenza.\n• MESCOLA (5000 Pt): Rimescola tutte le tessere!" },
                { avatar: "images/lion.jpg", name: "LEO (Re Leone)", title: "⚙️ IMPOSTAZIONI & RESET", body: "Personalizza audio, vibrazione e lingua, rileggi questa guida o resetta la partita. Buona fortuna!" }
            ],
            es: [
                { avatar: "images/fox.jpg", name: "FOXI (Zorro Cósmico)", title: "¡BIENVENIDO A MATCH & GO! 3D 🦊", body: "¡Empareja 2 fichas iguales destapadas! ¡Limpia el tablero antes de que se llene el soporte de 5 casillas!" },
                { avatar: "images/panda.jpg", name: "PANDI (Panda Lindo)", title: "🎮 DOS MODOS DE JUEGO", body: "• CLÁSICO: Resuelve puzzles sin límite de tiempo.\n• CONTRARELOJ: ¡Carrera contra el tiempo! ¡Empareja rápido!" },
                { avatar: "images/unicorn.jpg", name: "UNIKA (Unicornio Mágico)", title: "💡 POTENTES POTENCIADORES", body: "• PISTA (300 Pts): Resalta 2 fichas iguales.\n• +1 CASILLA (1000 Pts): Abre una 6ª casilla de emergencia.\n• MEZCLAR (5000 Pts): ¡Mezcla las fichas del tablero!" },
                { avatar: "images/lion.jpg", name: "LEO (Rey León)", title: "⚙️ AJUSTES Y REINICIO", body: "Ajusta el volumen, vibración e idioma, vuelve a leer esta guía o reinicia tu progreso. ¡Buena suerte!" }
            ],
            pt: [
                { avatar: "images/fox.jpg", name: "FOXI (Raposa Cósmica)", title: "BEM-VINDO AO MATCH & GO! 3D 🦊", body: "Combine 2 peças iguais abertas! Limpe o tabuleiro antes que o suporte de 5 espaços fique cheio!" },
                { avatar: "images/panda.jpg", name: "PANDI (Panda Fofo)", title: "🎮 DOIS MODOS DE JOGO", body: "• CLÁSSICO: Resolva puzzles sem limite de tempo.\n• CONTRA-RELÓGIO: Corrida contra o tempo! Combine tudo rapidamente!" },
                { avatar: "images/unicorn.jpg", name: "UNIKA (Unicórnio Mágico)", title: "💡 PODEROSOS BOOSTERS", body: "• DICA (300 Pts): Destaca 2 peças iguais abertas.\n• +1 ESPAÇO (1000 Pts): Abre um 6º espaço de emergência.\n• EMBARALHAR (5000 Pts): Embaralha todas as peças!" },
                { avatar: "images/lion.jpg", name: "LEO (Rei Leão)", title: "⚙️ CONFIGURAÇÕES E RESET", body: "Ajuste volume, vibração e idioma, reveja este guia ou reinicie o seu progresso. Boa sorte!" }
            ]
        };
        return slides[lang] || slides.tr;
    }

    renderTutorialStep() {
        const slides = this.getTutorialSlides();
        const slide = slides[this.currentTutStep];
        if (!slide) return;

        const avatarImg = document.getElementById('tut-avatar-img');
        if (avatarImg) avatarImg.src = slide.avatar;

        const nameBadge = document.getElementById('tut-badge-name');
        if (nameBadge) nameBadge.innerText = slide.name;

        const titleEl = document.getElementById('tut-title');
        if (titleEl) titleEl.innerText = slide.title;

        const bodyEl = document.getElementById('tut-body');
        if (bodyEl) bodyEl.innerText = slide.body;

        const dots = document.querySelectorAll('.tut-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === this.currentTutStep);
        });

        const btnPrev = document.getElementById('btn-tut-prev');
        if (btnPrev) btnPrev.classList.toggle('hidden', this.currentTutStep === 0);

        const btnNext = document.getElementById('btn-tut-next');
        if (btnNext) {
            const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            if (this.currentTutStep === slides.length - 1) {
                btnNext.innerText = dict.play || 'START GAME 🚀';
            } else {
                btnNext.innerText = dict.nextBtn || 'NEXT ➡️';
            }
        }
    }

    preloadAllTileImages() {
        const imagePaths = [
            'images/cat.jpg',
            'images/fox.jpg',
            'images/panda.jpg',
            'images/dragon.jpg',
            'images/shiba.jpg',
            'images/unicorn.jpg',
            'images/lion.jpg',
            'images/bunny.jpg',
            'images/owl.jpg',
            'images/red_panda.jpg',
            'images/frog.jpg',
            'images/penguin.jpg'
        ];

        this.preloadedImages = {};
        for (const path of imagePaths) {
            const img = new Image();
            img.src = path;
            if (img.decode) {
                img.decode().catch(() => {});
            }
            this.preloadedImages[path] = img;
        }
    }

    setupPageVisibilityManager() {
        const handleVisibility = () => {
            if (document.hidden) {
                this.pauseAppAudio();
            } else {
                this.resumeAppAudio();
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('blur', () => this.pauseAppAudio());
        window.addEventListener('focus', () => this.resumeAppAudio());
        window.addEventListener('pagehide', () => this.pauseAppAudio());
        window.addEventListener('pageshow', () => this.resumeAppAudio());

        const requestFullscreenIfPossible = () => {
            try {
                if (!document.fullscreenElement) {
                    const el = document.documentElement;
                    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
                    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen().catch(() => {});
                }
            } catch (e) {}
        };
        document.addEventListener('pointerdown', requestFullscreenIfPossible, { once: true });
        document.addEventListener('touchstart', requestFullscreenIfPossible, { once: true });
    }

    pauseAppAudio() {
        this.isAppPaused = true;
        if (this.sound && this.sound.ctx && this.sound.ctx.state === 'running') {
            this.sound.ctx.suspend().catch(() => {});
        }
    }

    resumeAppAudio() {
        this.isAppPaused = false;
        if (this.sound && this.sound.ctx && this.sound.ctx.state === 'suspended') {
            this.sound.ctx.resume().catch(() => {});
        }
    }

    setupStudioIntro() {
        const introStage = document.getElementById('cybercore-intro-stage');
        if (!introStage) return;

        this.introActive = true;

        let audioPlayed = false;
        const playChime = () => {
            if (audioPlayed) return;
            audioPlayed = true;
            try {
                const audioEl = document.getElementById('cybercore-intro-audio');
                if (audioEl) {
                    audioEl.currentTime = 0;
                    audioEl.volume = 1.0;
                    audioEl.play().catch(() => {
                        const fallback = new Audio('audio/cybercore_sound_2_hollywood.wav');
                        fallback.volume = 1.0;
                        fallback.play().catch(() => {});
                    });
                } else {
                    const fallback = new Audio('audio/cybercore_sound_2_hollywood.wav');
                    fallback.volume = 1.0;
                    fallback.play().catch(() => {});
                }
            } catch (e) {
                console.warn('Intro audio notice:', e);
            }
        };

        // Play Hollywood intro chime on exact visual paint of intro stage (never before screen appears!)
        requestAnimationFrame(() => {
            playChime();
        });

        const dismiss = () => {
            if (!this.introActive) return;
            this.introActive = false;
            introStage.classList.add('intro-hidden');
            introStage.style.opacity = '0';
            introStage.style.pointerEvents = 'none';
            setTimeout(() => {
                introStage.style.display = 'none';
                if (introStage && introStage.parentNode) {
                    introStage.parentNode.removeChild(introStage);
                }
            }, 500);
        };

        introStage.addEventListener('click', dismiss, { once: true });
        introStage.addEventListener('touchstart', dismiss, { once: true });

        // Smooth cinematic presentation (2200ms auto-dismiss)
        setTimeout(dismiss, 2200);
    }

    initUI() {
        this.setupStudioIntro();
        this.preloadAllTileImages();
        this.updateMainMenuButtons();
        this.startWheelTimerLoop();
        this.setupPageVisibilityManager();

        // Anti-Zoom & Layout Recalculation Listeners
        window.addEventListener('resize', () => {
            this.updateResponsiveCardSizing();
            this.rearrangeSlotTiles();
        });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateResponsiveCardSizing();
                this.rearrangeSlotTiles();
            }, 200);
        });

        // Block multi-touch pinch zoom & double-tap zoom 100%
        document.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

        // TUTORIAL EVENTS
        document.getElementById('btn-close-tutorial').addEventListener('click', () => {
            document.getElementById('modal-tutorial').classList.add('hidden');
            try { localStorage.setItem('tile_game_tutorial_seen', 'true'); } catch (e) {}
        });

        document.getElementById('btn-tut-prev').addEventListener('click', () => {
            if (this.currentTutStep > 0) {
                this.currentTutStep--;
                this.sound.playClick();
                this.renderTutorialStep();
            }
        });

        document.getElementById('btn-tut-next').addEventListener('click', () => {
            if (this.currentTutStep < this.tutorialSlides.length - 1) {
                this.currentTutStep++;
                this.sound.playClick();
                this.renderTutorialStep();
            } else {
                document.getElementById('modal-tutorial').classList.add('hidden');
                try { localStorage.setItem('tile_game_tutorial_seen', 'true'); } catch (e) {}
                this.sound.playVictorySound();
            }
        });

        document.querySelectorAll('.tut-dot').forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                this.currentTutStep = idx;
                this.sound.playClick();
                this.renderTutorialStep();
            });
        });

        // REPLAY TUTORIAL FROM SETTINGS
        const btnMenuTut = document.getElementById('btn-menu-tutorial');
        if (btnMenuTut) {
            btnMenuTut.addEventListener('click', () => {
                document.getElementById('modal-settings').classList.add('hidden');
                this.openTutorial(0);
            });
        }

        // CLASSIC MODE MAIN MENU BUTTON CLICK
        document.getElementById('btn-mode-classic').addEventListener('click', () => {
            document.getElementById('main-menu').classList.add('hidden');
            const targetLvl = this.classicProgress.level || 1;
            this.startLevel(targetLvl, false, 'classic');
        });

        // TIME TRIAL MODE MAIN MENU BUTTON CLICK
        document.getElementById('btn-mode-timetrial').addEventListener('click', () => {
            document.getElementById('main-menu').classList.add('hidden');
            const targetLvl = this.timeTrialProgress.level || 1;
            this.startLevel(targetLvl, false, 'timetrial');
        });

        // RESET CONFIRMATION MODAL CHOICES
        const btnNewGame = document.getElementById('btn-menu-newgame');
        if (btnNewGame) {
            btnNewGame.addEventListener('click', () => {
                document.getElementById('modal-reset-confirm').classList.remove('hidden');
            });
        }

        const btnForceUpdate = document.getElementById('btn-force-update');
        if (btnForceUpdate) {
            btnForceUpdate.onclick = async () => {
                btnForceUpdate.innerText = '⚡ GÜNCELLENİYOR...';
                try {
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                    }
                    if ('serviceWorker' in navigator) {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        await Promise.all(regs.map(reg => reg.unregister()));
                    }
                } catch (e) {
                    console.error('Update error:', e);
                }

                // Force clean reload bypass cache
                window.location.href = window.location.origin + window.location.pathname + '?nocache=' + Date.now();
            };
        }

        document.getElementById('btn-close-reset-confirm').addEventListener('click', () => {
            document.getElementById('modal-reset-confirm').classList.add('hidden');
        });

        document.getElementById('btn-reset-classic').addEventListener('click', () => {
            this.resetClassicProgress();
            document.getElementById('modal-reset-confirm').classList.add('hidden');
            document.getElementById('modal-settings').classList.add('hidden');
            document.getElementById('main-menu').classList.add('hidden');
            this.startLevel(1, true, 'classic');
        });

        document.getElementById('btn-reset-timetrial').addEventListener('click', () => {
            this.resetTimeTrialProgress();
            document.getElementById('modal-reset-confirm').classList.add('hidden');
            document.getElementById('modal-settings').classList.add('hidden');
            document.getElementById('main-menu').classList.add('hidden');
            this.startLevel(1, true, 'timetrial');
        });

        document.getElementById('btn-reset-both').addEventListener('click', () => {
            this.resetClassicProgress();
            this.resetTimeTrialProgress();
            document.getElementById('modal-reset-confirm').classList.add('hidden');
            document.getElementById('modal-settings').classList.add('hidden');
            document.getElementById('main-menu').classList.add('hidden');
            this.startLevel(1, true, this.currentMode);
        });

        document.getElementById('btn-menu-settings').addEventListener('click', () => {
            this.openSettings();
        });

        // REWARDED AD MAIN MENU FLOATING CHEST WIDGET CLICK (DAILY LIMIT 3)
        const btnAdChest = document.getElementById('btn-menu-ad-chest');
        if (btnAdChest) {
            btnAdChest.addEventListener('click', () => {
                const remaining = this.getDailyAdChestRemaining();
                if (remaining <= 0) {
                    this.sound.playLockThud();
                    btnAdChest.classList.add('shaking');
                    setTimeout(() => btnAdChest.classList.remove('shaking'), 250);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    const resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
                    const resetRemaining = Math.max(0, resetTime - Date.now());
                    const timeStr = this.formatTimeLeft(resetRemaining);
                    this.showToast((dict.adChestLimitReached || '⚠️ Bugünkü Ücretsiz Reklam Sandığı Hakkınız Bitti! (0/3 - {time})').replace('{time}', timeStr));
                    return;
                }

                this.sound.playClick();
                this.showRewardedAd(() => {
                    this.useDailyAdChestClaim();
                    this.showToast('🎁 Reklam Ödülü: Görev Başarılı! Sandık Açılıyor...');
                    const stars = this.rollChestStarRating(false);
                    this.triggerChestRewardModal(stars, false);
                });
            });
        }

        // LUCKY WHEEL EVENT LISTENERS
        const btnWheel = document.getElementById('btn-menu-wheel');
        if (btnWheel) {
            btnWheel.addEventListener('click', () => {
                this.sound.playClick();
                this.openWheelModal();
            });
        }

        const btnCloseWheel = document.getElementById('btn-close-wheel');
        if (btnCloseWheel) {
            btnCloseWheel.addEventListener('click', () => {
                document.getElementById('modal-wheel').classList.add('hidden');
            });
        }

        const btnSpinWheel = document.getElementById('btn-spin-wheel');
        if (btnSpinWheel) {
            btnSpinWheel.addEventListener('click', () => {
                this.spinWheelAction();
            });
        }

        const btnCollectWheel = document.getElementById('btn-collect-wheel-reward');
        if (btnCollectWheel) {
            btnCollectWheel.addEventListener('click', () => {
                this.sound.playClick();
                if (this.pendingWheelReward) {
                    if (this.pendingWheelReward.type === 'gold') {
                        this.goldCoins += this.pendingWheelReward.amount;
                        const goldEl = document.getElementById('gold-val');
                        if (goldEl) goldEl.innerText = this.goldCoins;
                    } else {
                        for (let i = 0; i < this.pendingWheelReward.count; i++) {
                            this.awardRandomMissingPuzzlePiece();
                        }
                    }
                    this.pendingWheelReward = null;
                    this.saveGameProgress();
                }
                
                // Re-open wheel modal stage 1 to show updated spin limits (1/2 -> 2/2)
                this.openWheelModal();
            });
        }

        // LEADERBOARD & NICKNAME EVENT LISTENERS
        const btnLeaderboard = document.getElementById('btn-menu-leaderboard');
        if (btnLeaderboard) {
            btnLeaderboard.addEventListener('click', () => {
                this.openLeaderboardModal('overall');
            });
        }

        const btnCloseLeaderboard = document.getElementById('btn-close-leaderboard');
        if (btnCloseLeaderboard) {
            btnCloseLeaderboard.addEventListener('click', () => {
                this.sound.playClick();
                document.getElementById('modal-leaderboard').classList.add('hidden');
            });
        }

        const btnCloseProfile = document.getElementById('btn-close-player-profile');
        if (btnCloseProfile) {
            btnCloseProfile.addEventListener('click', () => {
                this.sound.playClick();
                document.getElementById('modal-player-profile').classList.add('hidden');
            });
        }

        // Leaderboard Category Tabs
        document.querySelectorAll('.lb-tab-btn').forEach(tabBtn => {
            tabBtn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-lb-tab');
                if (targetTab) {
                    this.sound.playClick();
                    this.openLeaderboardModal(targetTab);
                }
            });
        });

        // Registration Modal Dice Buttons & Form Submit
        const btnRandomNick = document.getElementById('btn-random-nickname');
        if (btnRandomNick) {
            btnRandomNick.addEventListener('click', () => {
                this.sound.playClick();
                const inputNick = document.getElementById('input-nickname');
                if (inputNick) inputNick.value = this.getRandomNicknameSuggestion();
            });
        }

        const btnRandomTag = document.getElementById('btn-random-tag');
        if (btnRandomTag) {
            btnRandomTag.addEventListener('click', () => {
                this.sound.playClick();
                const inputTag = document.getElementById('input-tag');
                if (inputTag) inputTag.value = this.getRandomTagSuggestion();
            });
        }

        const inputNickEl = document.getElementById('input-nickname');
        if (inputNickEl) {
            inputNickEl.addEventListener('input', () => {
                // Strip emojis and non-alphanumeric special symbols automatically
                inputNickEl.value = inputNickEl.value.replace(/[^a-zA-Z0-9çğışöüÇĞİŞÖÜ ]/g, '');
            });
        }

        const btnSaveNickname = document.getElementById('btn-save-nickname');
        if (btnSaveNickname) {
            btnSaveNickname.addEventListener('click', () => {
                this.sound.playClick();
                const inputNick = document.getElementById('input-nickname');
                const inputTag = document.getElementById('input-tag');
                const errMsg = document.getElementById('nickname-error-msg');

                const rawNick = inputNick ? inputNick.value.trim() : '';
                const rawTag = inputTag ? inputTag.value.trim() : '';

                if (!rawNick || rawNick.length < 2) {
                    if (errMsg) {
                        errMsg.innerText = '⚠️ KULLANICI ADI HATASI: İsim en az 2 karakter olmalıdır!';
                        errMsg.classList.remove('hidden');
                    }
                    this.sound.playLockThud();
                    if (inputNick) inputNick.focus();
                    return;
                }

                const validNameRegex = /^[a-zA-Z0-9çğışöüÇĞİŞÖÜ ]+$/;
                if (!validNameRegex.test(rawNick)) {
                    if (errMsg) {
                        errMsg.innerText = '⚠️ KULLANICI ADI HATASI: İsimde emoji veya özel sembol kullanılamaz! (Sadece harf ve rakam)';
                        errMsg.classList.remove('hidden');
                    }
                    this.sound.playLockThud();
                    if (inputNick) inputNick.focus();
                    return;
                }

                if (this.isProfaneOrInappropriate(rawNick)) {
                    if (errMsg) {
                        errMsg.innerText = '⚠️ KULLANICI ADI HATASI: Girilen kullanıcı adı uygunsuz sözcük içeremez!';
                        errMsg.classList.remove('hidden');
                    }
                    this.sound.playLockThud();
                    if (inputNick) inputNick.focus();
                    return;
                }

                if (!rawTag || rawTag.length !== 4 || !/^\d{4}$/.test(rawTag)) {
                    if (errMsg) {
                        errMsg.innerText = '⚠️ ETİKET (ID) HATASI: Etiket 4 haneli sayısal bir sayı olmalıdır! (Örn: 0001)';
                        errMsg.classList.remove('hidden');
                    }
                    this.sound.playLockThud();
                    if (inputTag) inputTag.focus();
                    return;
                }

                const targetFullTag = `${rawNick}#${rawTag}`;
                btnSaveNickname.disabled = true;
                btnSaveNickname.innerText = '⏳ KONTROL EDİLİYOR...';

                const myCurrentFullTag = (this.playerProfile && this.playerProfile.fullTag) ? this.playerProfile.fullTag.toLowerCase() : '';
                const myCurrentTag = (this.playerProfile && this.playerProfile.tag) ? this.playerProfile.tag.trim() : '';

                const closeModal = () => {
                    const modalNick = document.getElementById('modal-set-nickname');
                    if (modalNick) {
                        modalNick.classList.add('hidden');
                        modalNick.style.display = 'none';
                    }
                };

                // Asynchronously verify 4-Digit Tag/ID Uniqueness against live Cloud DB!
                this.fetchCloudLeaderboardData().then(cloudPlayers => {
                    btnSaveNickname.disabled = false;
                    btnSaveNickname.innerText = 'KAYDET VE BAŞLA ✨';

                    if (cloudPlayers && Array.isArray(cloudPlayers)) {
                        // Check if the 4-digit ID Tag is taken by ANY OTHER player in the cloud database!
                        const isTagTaken = cloudPlayers.some(p => {
                            if (!p) return false;
                            const cloudTag = (p.tag || (p.fullTag && p.fullTag.includes('#') ? p.fullTag.split('#')[1] : '')).trim();
                            const cloudFullTag = (p.fullTag || '').toLowerCase();
                            
                            // Exclude current device's own existing profile
                            if (myCurrentTag && cloudTag === myCurrentTag) return false;
                            if (myCurrentFullTag && cloudFullTag === myCurrentFullTag) return false;

                            return cloudTag === rawTag || cloudFullTag.endsWith(`#${rawTag.toLowerCase()}`);
                        });

                        if (isTagTaken) {
                            if (errMsg) {
                                errMsg.innerText = `⚠️ ETİKET (ID) HATASI: "#${rawTag}" etiketi (ID) başka bir oyuncu tarafından alınmış! Lütfen 4 haneli farklı bir etiket yazın.`;
                                errMsg.classList.remove('hidden');
                            }
                            this.sound.playLockThud();
                            if (inputTag) inputTag.focus();
                            return;
                        }
                    }

                    if (errMsg) errMsg.classList.add('hidden');
                    this.savePlayerProfile(rawNick, rawTag);
                    closeModal();
                    this.showToast(`✨ Profil Kaydedildi: ${this.playerProfile.fullTag}`);
                    this.syncCloudLeaderboard();
                }).catch(() => {
                    btnSaveNickname.disabled = false;
                    btnSaveNickname.innerText = 'KAYDET VE BAŞLA ✨';
                    if (errMsg) errMsg.classList.add('hidden');
                    this.savePlayerProfile(rawNick, rawTag);
                    closeModal();
                    this.showToast(`✨ Profil Kaydedildi: ${this.playerProfile.fullTag}`);
                    this.syncCloudLeaderboard();
                });
            });
        }

        // REWARDED AD DEFEAT REVIVE CLICK (STRICT MAX 1 PER LEVEL)
        const btnAdRevive = document.getElementById('btn-ad-revive');
        if (btnAdRevive) {
            btnAdRevive.addEventListener('click', () => {
                if (this.levelAdReviveCount >= 1) {
                    this.sound.playLockThud();
                    btnAdRevive.classList.add('shaking');
                    setTimeout(() => btnAdRevive.classList.remove('shaking'), 250);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    this.showToast(dict.adReviveLimitReached || '⚠️ Bu Bölümdeki Reklamla Devam Etme Hakkınız Bitti! (1/1)');
                    return;
                }

                this.sound.playClick();
                this.showRewardedAd(() => {
                    this.sound.playBoosterChime();
                    this.levelAdReviveCount = (this.levelAdReviveCount || 0) + 1;
                    document.getElementById('modal-gameover').classList.add('hidden');
                    
                    // Revive: Unlock emergency 6th slot & return 2 tiles back to board to free space (STRICT MAX 6 SLOTS)
                    this.maxSlotCapacity = 6;
                    this.hasTemporaryExtraSlot = true;
                    const floatSlot = document.getElementById('floating-extra-slot');
                    if (floatSlot) floatSlot.classList.remove('hidden');

                    // Safely return 2 non-matching tiles from tray to board (NO TILES DELETED)
                    this.returnTrayTilesToBoard(2);

                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    this.showToast(`🚨 ${dict.reviveUsedToast || 'Canlı Hak Kullanıldı! 2 Kart Tahtaya Dönüştü!'} (1/1)`);
                    this.checkDeadlockAndAutoShuffle();
                });
            });
        }

        // MID-LEVEL HOME BUTTON QUIT CONFIRMATION (-500 SCORE PENALTY & ZERO IN-LEVEL POINTS KEPT)
        document.getElementById('btn-hud-home').addEventListener('click', () => {
            this.sound.playClick();
            // ONLY show penalty confirmation IF at least one tile was moved in the current level!
            if (this.boardTiles && this.boardTiles.length > 0 && this.hasMovedAnyTileInCurrentLevel) {
                const modalQuit = document.getElementById('modal-confirm-quit');
                if (modalQuit) {
                    modalQuit.classList.remove('hidden');
                    modalQuit.style.display = 'flex';
                }
            } else {
                // ZERO TILES MOVED: EXIT DIRECTLY WITH 0 PENALTY!
                this.stopTimer();
                this.saveGameProgress();
                this.updateMainMenuButtons();
                this.startWheelTimerLoop();
                const gameContainer = document.getElementById('game-container');
                if (gameContainer) gameContainer.classList.add('hidden');
                const boardEl = document.getElementById('board');
                if (boardEl) boardEl.innerHTML = '';
                this.boardTiles = [];
                this.slotTiles = [];
                document.getElementById('main-menu').classList.remove('hidden');
                this.showMainMenuBannerAd();
            }
        });

        const btnCancelQuit = document.getElementById('btn-cancel-quit');
        if (btnCancelQuit) {
            btnCancelQuit.addEventListener('click', () => {
                this.sound.playClick();
                document.getElementById('modal-confirm-quit').classList.add('hidden');
            });
        }

        const btnAcceptQuitPenalty = document.getElementById('btn-accept-quit-penalty');
        if (btnAcceptQuitPenalty) {
            btnAcceptQuitPenalty.addEventListener('click', () => {
                this.sound.playLockThud();
                document.getElementById('modal-confirm-quit').classList.add('hidden');

                // 1. Discard all points accumulated in current unfinished level
                this.score = this.levelStartScore || 0;

                // 2. Deduct 500 points penalty
                this.score = Math.max(0, this.score - 500);

                const scoreEl = document.getElementById('score-val');
                if (scoreEl) scoreEl.innerText = this.score;

                // 3. Reset level tiles
                this.boardTiles = [];
                this.slotTiles = [];
                this.hintHighlights = [];
                const boardContainer = document.getElementById('board');
                if (boardContainer) boardContainer.innerHTML = '';

                // 4. Save progress & sync penalty to Cloud DB
                this.saveGameProgress();

                // 5. Return to main menu
                this.stopTimer();
                this.updateMainMenuButtons();
                this.startWheelTimerLoop();
                const gameContainer = document.getElementById('game-container');
                if (gameContainer) gameContainer.classList.add('hidden');
                document.getElementById('main-menu').classList.remove('hidden');
                this.showMainMenuBannerAd();

                this.showToast('⚠️ Bölümden ayrıldınız! (-500 Puan Cezası Kesildi)');
            });
        }

        // WHEEL AD SPIN PERMISSION MODAL LISTENERS
        const closeAdConfirmModal = () => {
            const m = document.getElementById('modal-wheel-ad-confirm');
            if (m) m.classList.add('hidden');
        };

        const btnCloseAdConfirm = document.getElementById('btn-close-wheel-ad-confirm');
        if (btnCloseAdConfirm) btnCloseAdConfirm.addEventListener('click', closeAdConfirmModal);

        const btnSpinAdCancel = document.getElementById('btn-spin-ad-cancel');
        if (btnSpinAdCancel) btnSpinAdCancel.addEventListener('click', closeAdConfirmModal);

        const btnSpinAdAccept = document.getElementById('btn-spin-ad-accept');
        if (btnSpinAdAccept) {
            btnSpinAdAccept.addEventListener('click', () => {
                closeAdConfirmModal();
                if (!navigator.onLine) {
                    this.sound.playLockThud();
                    this.showToast('📡 Çevrimdışısınız! Reklam izlemek için lütfen internet bağlantınızı açın.');
                    return;
                }
                if (typeof this.pendingAdWheelExecute === 'function') {
                    const exec = this.pendingAdWheelExecute;
                    this.pendingAdWheelExecute = null;
                    this.showRewardedAd(() => {
                        exec();
                    });
                }
            });
        }

        document.getElementById('btn-hud-settings').addEventListener('click', () => {
            this.openSettings();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.currentMode === 'timetrial' && this.timerInterval) {
                    this.stopTimer();
                    this.isTimerPausedForBackground = true;
                }
            } else {
                if (this.currentMode === 'timetrial' && this.isTimerPausedForBackground) {
                    this.isTimerPausedForBackground = false;
                    this.startTimer();
                }
            }
        });

        document.getElementById('btn-close-settings').addEventListener('click', () => {
            document.getElementById('modal-settings').classList.add('hidden');
        });

        document.getElementById('btn-save-settings').addEventListener('click', () => {
            this.saveSettings();
            document.getElementById('modal-settings').classList.add('hidden');
        });

        // Settings Controls - Sound Effects Volume Slider
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
        }

                        // Background Music Track Selector Listeners
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
        updateTrackBtnsUI();



        const btnVib = document.getElementById('btn-toggle-vib');
        btnVib.addEventListener('click', () => {
            this.settings.vibration = !this.settings.vibration;
            this.updateVibBtnUI();
        this.updateAdWidgetUI();
        this.updateWheelTimerState();
            if (this.settings.vibration && navigator.vibrate) {
                navigator.vibrate(40);
            }
        });

        const langs = ['tr', 'en', 'de', 'fr', 'it', 'es', 'pt'];
        langs.forEach(langCode => {
            const btn = document.getElementById(`btn-lang-${langCode}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.settings.lang = langCode;
                    this.saveSettings();
                    this.updateLanguageUI();
                });
            }
        });

        // Boosters Click Handlers
        document.getElementById('btn-hint').addEventListener('click', () => this.useSmartHint());
        document.getElementById('btn-extra-slot').addEventListener('click', () => this.useExtraSlotBooster());
        document.getElementById('btn-shuffle').addEventListener('click', () => this.useShuffleBooster());

        const btnMenuJournal = document.getElementById('btn-menu-journal');
        if (btnMenuJournal) btnMenuJournal.addEventListener('click', () => this.openPuzzleGalleryModal());

        const btnPrevPage = document.getElementById('btn-prev-page');
        if (btnPrevPage) btnPrevPage.addEventListener('click', () => {
            const currentIdx = this.puzzlesCatalog.findIndex(p => p.id === this.activePuzzleId);
            const newIdx = (currentIdx - 1 + this.puzzlesCatalog.length) % this.puzzlesCatalog.length;
            this.activePuzzleId = this.puzzlesCatalog[newIdx].id;
            this.sound.playClick();
            this.renderPuzzleGalleryModal();
        });

        const btnNextPage = document.getElementById('btn-next-page');
        if (btnNextPage) btnNextPage.addEventListener('click', () => {
            const currentIdx = this.puzzlesCatalog.findIndex(p => p.id === this.activePuzzleId);
            const newIdx = (currentIdx + 1) % this.puzzlesCatalog.length;
            this.activePuzzleId = this.puzzlesCatalog[newIdx].id;
            this.sound.playClick();
            this.renderPuzzleGalleryModal();
        });

        const btnGallery = document.getElementById('btn-open-gallery');
        if (btnGallery) btnGallery.addEventListener('click', () => this.openPuzzleGalleryModal());

        const btnCloseGallery = document.getElementById('btn-close-gallery');
        if (btnCloseGallery) btnCloseGallery.addEventListener('click', () => document.getElementById('modal-puzzle-gallery').classList.add('hidden'));

        const btnBuyPiece = document.getElementById('btn-buy-puzzle-piece');
        if (btnBuyPiece) btnBuyPiece.addEventListener('click', () => this.buyPuzzlePieceWithGold());

        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.addEventListener('click', () => this.openChestBox());

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.addEventListener('click', () => this.openChestBox());

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.onclick = () => {
                try { this.sound.playClick(); } catch (e) {}
                
                // Claim exact displayed rewards when clicking Envantere Ekle ve Devam Et!
                if (this.pendingChestReward) {
                    if (this.pendingTotalGoldReward > 0) {
                        this.goldCoins += this.pendingTotalGoldReward;
                    }
                    if (this.pendingAwardedPieces && this.pendingAwardedPieces.length > 0) {
                        for (const piece of this.pendingAwardedPieces) {
                            this.puzzleInventory.push({
                                id: `piece_${Date.now()}_${Math.random()}`,
                                puzzleId: piece.puzzleId,
                                puzzleName: piece.puzzleName,
                                pieceIndex: piece.pieceIndex
                            });
                        }
                    }
                    const goldEl = document.getElementById('gold-val');
                    if (goldEl) goldEl.innerText = this.goldCoins;

                    this.pendingChestReward = null;
                    this.pendingAwardedPieces = null;
                    this.pendingTotalGoldReward = 0;
                    this.saveGameProgress();
                }

                const modalChest = document.getElementById('modal-chest');
                if (modalChest) modalChest.classList.add('hidden');
                this.startLevel(this.level + 1, false, this.currentMode);
            };
        }

        document.getElementById('btn-next-level').addEventListener('click', () => {
            document.getElementById('modal-victory').classList.add('hidden');
            this.startLevel(this.level + 1, false, this.currentMode);
        });

        // RETRY BUTTON DEFEAT PENALTY LOGIC (-2000 SCORE & CANCEL EARNED LEVEL POINTS)
        document.getElementById('btn-retry').addEventListener('click', () => {
            document.getElementById('modal-gameover').classList.add('hidden');

            this.score = Math.max(0, this.levelStartScore - 2000);
            document.getElementById('score-val').innerText = this.score;
            this.saveGameProgress();

            this.startLevel(this.level, false, this.currentMode);
        });

        this.applyLanguage();
    }

    updateMainMenuButtons() {
        const txtClassic = document.getElementById('txt-classic-btn');
        const txtTimeTrial = document.getElementById('txt-timetrial-btn');
        const dict = this.i18n[this.settings.lang];

        const classicLvl = (this.classicProgress && this.classicProgress.level) ? this.classicProgress.level : 1;
        const timeTrialLvl = (this.timeTrialProgress && this.timeTrialProgress.level) ? this.timeTrialProgress.level : 1;

        txtClassic.innerText = dict.classicBtnText.replace('{lvl}', classicLvl);
        txtTimeTrial.innerText = dict.timetrialBtnText.replace('{lvl}', timeTrialLvl);
    }

    openSettings() {
        document.getElementById('slider-volume').value = this.settings.volume;
        document.getElementById('vol-val-text').innerText = `${this.settings.volume}%`;
        this.updateVibBtnUI();
        this.updateLanguageUI();
        document.getElementById('modal-settings').classList.remove('hidden');
    }

    updateVibBtnUI() {
        const btn = document.getElementById('btn-toggle-vib');
        const txt = document.getElementById('vib-btn-text');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (this.settings.vibration) {
            if (btn) btn.classList.add('active');
            if (txt) txt.innerText = dict.vibOn || 'AÇIK';
        } else {
            if (btn) btn.classList.remove('active');
            if (txt) txt.innerText = dict.vibOff || 'KAPALI';
        }
    }

    updateLanguageUI() {
        const langs = ['tr', 'en', 'de', 'fr', 'it', 'es', 'pt'];
        langs.forEach(c => {
            const b = document.getElementById(`btn-lang-${c}`);
            if (b) b.classList.toggle('active', this.settings.lang === c);
        });
        this.applyLanguage();
        this.updateMainMenuButtons();
        this.startWheelTimerLoop();
    }

    applyLanguage() {
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerText = dict[key];
            }
        });

        // Re-render vibration button text in active language
        this.updateVibBtnUI();

        // Re-render main menu buttons with localized level labels
        this.updateMainMenuButtons();
        this.startWheelTimerLoop();

        this.renderTutorialStep();
        this.renderWheelCanvas();
        const modalGallery = document.getElementById('modal-puzzle-gallery');
        if (modalGallery && !modalGallery.classList.contains('hidden')) {
            this.renderPuzzleGalleryModal();
        }
    }

    // =========================================================
    // CUTE BACKGROUND MUSIC ENGINE & MOBILE AUTOPLAY UNLOCKER
    // =========================================================
    getBGMTrackPath() {
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
        const mVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;
        if (!this.bgmPlayer) {
            this.bgmPlayer = new WebAudioBGMPlayer(this.sound);
        }
        this.bgmPlayer.play(newPath, mVol);
        this.updateMusicUI();
    }

    initBackgroundMusic() {
        try {
            if (!this.bgmPlayer) {
                this.bgmPlayer = new WebAudioBGMPlayer(this.sound);
            }
            const trackPath = this.getBGMTrackPath();
            const mVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;
            if (mVol > 0) {
                this.bgmPlayer.play(trackPath, mVol);
                const unlockMusic = () => {
                    const curMVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;
                    if (curMVol > 0 && this.bgmPlayer && !this.bgmPlayer.isPlaying) {
                        this.bgmPlayer.play(trackPath, curMVol);
                    }
                    window.removeEventListener('pointerdown', unlockMusic);
                    window.removeEventListener('touchstart', unlockMusic);
                    window.removeEventListener('click', unlockMusic);
                };
                window.addEventListener('pointerdown', unlockMusic, { passive: true, once: true });
                window.addEventListener('touchstart', unlockMusic, { passive: true, once: true });
                window.addEventListener('click', unlockMusic, { passive: true, once: true });
            }
            this.updateMusicUI();
        } catch (e) {}
    }

    updateMusicUI() {
        const sliderMusic = document.getElementById('slider-music');
        const txtMusicVal = document.getElementById('music-val-text');
        const mVol = (typeof this.settings.musicVolume === 'number') ? this.settings.musicVolume : 30;

        if (this.bgmPlayer) {
            this.bgmPlayer.setVolume(mVol);
        }

        if (sliderMusic && document.activeElement !== sliderMusic) {
            sliderMusic.value = mVol;
        }
        if (txtMusicVal) {
            txtMusicVal.innerText = `${mVol}%`;
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('tile_game_settings');
            if (saved) {
                this.settings = Object.assign(this.settings, JSON.parse(saved));
            }
        } catch (e) {}
        this.sound.setVolume(this.settings.volume);
    }

    saveSettings() {
        try {
            localStorage.setItem('tile_game_settings', JSON.stringify(this.settings));
        } catch (e) {}
        this.sound.setVolume(this.settings.volume);
    }

    triggerVibration() {
        if (this.settings.vibration && navigator.vibrate) {
            try {
                navigator.vibrate(35);
            } catch (e) {}
        }
    }

    updateBoosterBadgesUI() {
        document.getElementById('hint-cost-badge').innerText = this.hintCost;
        document.getElementById('slot-cost-badge').innerText = this.slotCost;
        document.getElementById('shuffle-cost-badge').innerText = this.shuffleCost;
    }

    startLevel(lvl, isNewGame = false, mode = 'classic') {
        this.hideMainMenuBannerAd();
        this.levelAdReviveCount = 0;
        this.boardTiles = [];
        this.slotTiles = [];

        const boardEl = document.getElementById('board');
        if (boardEl) boardEl.innerHTML = '';

        const slotLayerEl = document.getElementById('slot-tiles-layer');
        if (slotLayerEl) slotLayerEl.innerHTML = '';

        // Reset & Clear Chest Reward Modal State completely on start of every level
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';
        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.add('hidden');
        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        this.currentMode = mode;

        if (isNewGame) {
            this.level = 1;
            this.score = 0;
        } else {
            this.level = lvl;
            const saved = (mode === 'classic') ? this.classicProgress : this.timeTrialProgress;
            this.score = saved.score || 0;
        }

        // Store level starting score for penalty calculation
        this.levelStartScore = this.score;
        this.hasMovedAnyTileInCurrentLevel = false;

        // Reset Level Costs & Capacity to Base
        this.hintCost = this.baseHintCost;
        this.slotCost = this.baseSlotCost;
        this.shuffleCost = this.baseShuffleCost;

        this.maxSlotCapacity = 5;
        this.hasTemporaryExtraSlot = false;
        this.extraSlotWasUsed = false;
        document.getElementById('floating-extra-slot').classList.add('hidden');
        this.updateBoosterBadgesUI();

        // Auto Save Progress immediately
        this.saveGameProgress();

        document.getElementById('level-num').innerText = this.level;
        document.getElementById('score-val').innerText = this.score;

        // Apply Dynamic Level Table Theme to Game Arena and Outer Background Wrapper
        const themeIndex = (this.level - 1) % this.bgThemes.length;
        const themeBg = this.bgThemes[themeIndex];
        const gameContainer = document.getElementById('game-container');
        const appWrapper = document.getElementById('app-wrapper');
        if (gameContainer) gameContainer.style.background = themeBg;
        if (appWrapper) appWrapper.style.background = themeBg;

        // SPECIAL STAR FORMATION ON EVERY 10th LEVEL (10, 20, 30, 40...)
        let formationType;
        if (this.level === 2) {
            formationType = 'H_LETTER';
        } else if (this.level === 28) {
            formationType = 'S_LETTER';
        } else if (this.level % 10 === 0) {
            formationType = 'STAR';
        } else {
            const nonStarPool = ['HOURGLASS', 'HEART', 'CIRCLE', 'TRIANGLE', 'FLOWER', 'DIAMOND', 'HELIX', 'TWIN_PEAKS', 'ROYAL_PYRAMID'];
            const specialCount = Math.floor(this.level / 10) + (this.level > 2 ? 1 : 0) + (this.level > 28 ? 1 : 0);
            const idx = (this.level - 1 - specialCount) % nonStarPool.length;
            formationType = nonStarPool[idx >= 0 ? idx : (idx + nonStarPool.length)];
        }

        const safeBoardW = (boardEl && boardEl.clientWidth > 200) ? boardEl.clientWidth : (window.innerWidth || 380);
        const safeBoardH = (boardEl && boardEl.clientHeight > 200) ? boardEl.clientHeight : ((window.innerHeight - 160) || 520);
        const positions = this.generateLayoutPositions(formationType, safeBoardW, safeBoardH);

        // EXACT USER PROGRESSION RULE:
        // 2'Lİ EŞLEME SİSTEMİ (PAIR MATCHING):
        // Oyun 2'li eşleme oyunudur! Tepside 2 aynı kart birleşince patlar.
        // Bu yüzden tahtadaki tüm kartlar ÇİFTLER (Pairs) halinde üretilir!
        const basePairs = 14;
        const extraPairs = Math.floor((this.level - 1) / 10) * 2;
        const totalPairs = Math.min(32, basePairs + extraPairs);
        const totalTilesNeeded = totalPairs * 2;

        const cardW = this.cardW || 48;
        const cardH = this.cardH || 60;
        const stepX = cardW * 0.72;
        const stepY = cardH * 0.78;
        const cx = safeBoardW / 2 - cardW / 2;
        const cy = safeBoardH / 2 - cardH / 2 - 15;

        const initialCount = positions.length;
        while (positions.length < totalTilesNeeded) {
            const idx = positions.length - initialCount;
            const r = (Math.floor(idx / 3) % 3) - 1;
            const c = (idx % 3) - 1;
            const layer = 1 + (Math.floor(idx / 9) % 2);
            positions.push({
                x: Math.round(cx + c * stepX * 0.65),
                y: Math.round(cy + r * stepY * 0.65 - (layer * 6)),
                layer: layer
            });
        }

        const pool = [];
        const activeTypesCount = Math.min(this.types.length, 5 + Math.floor((this.level - 1) / 10) * 2);
        const activeTypes = this.types.slice(0, activeTypesCount);

        for (let i = 0; i < totalPairs; i++) {
            const typeObj = activeTypes[i % activeTypes.length];
            pool.push(typeObj, typeObj); // HER KARTTAN ÇİFT (2 TANE)!
        }

        this.shuffleArray(pool);

        for (let i = 0; i < pool.length; i++) {
            const pos = positions[i];
            const tileData = pool[i];

            const tileEl = document.createElement('div');
            tileEl.className = 'tile';
            tileEl.style.left = `${pos.x}px`;
            tileEl.style.top = `${pos.y}px`;
            tileEl.style.zIndex = (pos.layer * 100) + i + 10;
            tileEl.style.background = tileData.bg;

            const iconContainer = document.createElement('div');
            iconContainer.className = 'tile-icon';

            if (tileData.imgSrc) {
                const imgEl = document.createElement('img');
                imgEl.className = 'tile-img';
                imgEl.src = tileData.imgSrc;
                imgEl.alt = tileData.name;
                iconContainer.appendChild(imgEl);
            } else if (tileData.svg) {
                iconContainer.innerHTML = tileData.svg;
            }

            tileEl.appendChild(iconContainer);
            boardEl.appendChild(tileEl);

            const tileObj = {
                id: `tile_${i}_${Date.now()}`,
                type: tileData.id,
                bg: tileData.bg,
                imgSrc: tileData.imgSrc,
                svg: tileData.svg,
                name: tileData.name,
                x: pos.x,
                y: pos.y,
                layer: pos.layer,
                index: i,
                element: tileEl,
                isLocked: false,
                isInSlot: false
            };

            tileEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.onTileClick(tileObj);
            });
            
            this.boardTiles.push(tileObj);
        }

        this.updateLockStates();

        const badgeTimer = document.getElementById('badge-timer');
        if (this.currentMode === 'timetrial') {
            if (badgeTimer) badgeTimer.classList.remove('hidden');
            const totalTiles = this.boardTiles.length;
            const totalPairs = Math.ceil(totalTiles / 2);
            // Tile-Based Math Formula: 2.0 seconds per pair + 15 seconds base scanning buffer
            const calculatedSecs = Math.round((totalPairs * 2) + 15);
            this.remainingSeconds = Math.max(30, calculatedSecs);
            this.startTimer();
        } else {
            if (badgeTimer) badgeTimer.classList.add('hidden');
            this.stopTimer();
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startTimer() {
        this.stopTimer();
        if (this.currentMode !== 'timetrial') return;

        const timerVal = document.getElementById('timer-val');
        if (timerVal) timerVal.innerText = `${this.remainingSeconds}s`;

        this.timerInterval = setInterval(() => {
            this.remainingSeconds--;
            if (timerVal) timerVal.innerText = `${this.remainingSeconds}s`;

            if (this.remainingSeconds <= 0) {
                this.stopTimer();
                const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                document.getElementById('defeat-icon').innerText = '⏰';
                document.getElementById('defeat-title').innerText = dict.timeUpTitle || 'SÜRE BİTTİ!';
                document.getElementById('defeat-desc').innerText = dict.timeUpDesc || 'Zamana karşı yarışta süre doldu!';
                document.getElementById('modal-gameover').classList.remove('hidden');
                const btnAdRevive = document.getElementById('btn-ad-revive');
                if (btnAdRevive) {
                    const count = this.levelAdReviveCount || 0;
                    const remaining = Math.max(0, 1 - count);
                    if (remaining > 0) {
                        btnAdRevive.style.display = 'block';
                        btnAdRevive.querySelector('span').innerText = `📺 ${dict.adReviveBtn || 'REKLAM İZLE & DEVAM ET'} (${remaining}/1 HAK)`;
                    } else {
                        btnAdRevive.style.display = 'none';
                    }
                }
            }
        }, 1000);
    }


        generateLayoutPositions(formationType, boardW, boardH) {
        const cx = boardW / 2 - this.cardW / 2;
        const cy = boardH / 2 - this.cardH / 2 - 15;
        const stepX = this.cardW * 0.72;
        const stepY = this.cardH * 0.78;
        const pos = [];

        if (formationType === 'HOURGLASS') {
            // KUM SAATI (26 Tiles)
            for (let c = -2; c <= 2; c++) pos.push({ x: cx + c * stepX, y: cy - 2 * stepY, layer: 0 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX, y: cy - 1 * stepY, layer: 0 });
            pos.push({ x: cx, y: cy, layer: 0 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX, y: cy + 1 * stepY, layer: 0 });
            for (let c = -2; c <= 2; c++) pos.push({ x: cx + c * stepX, y: cy + 2 * stepY, layer: 0 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy - 1 * stepY - 6, layer: 1 });
            pos.push({ x: cx + 3, y: cy - 6, layer: 1 });
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy + 1 * stepY - 6, layer: 1 });
            pos.push({ x: cx - stepX * 0.4, y: cy - 12, layer: 2 });
            pos.push({ x: cx + stepX * 0.4, y: cy - 12, layer: 2 });
        } else if (formationType === 'HEART') {
            // KALP (28 Tiles)
            for (let i = 0; i < 18; i++) {
                const t = (i / 18) * Math.PI * 2;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                pos.push({ x: cx + x * 8.5, y: cy + y * 8.5, layer: 0 });
            }
            for (let i = 0; i < 8; i++) {
                const t = (i / 8) * Math.PI * 2;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                pos.push({ x: cx + x * 4.5 + 3, y: cy + y * 4.5 - 6, layer: 1 });
            }
            pos.push({ x: cx - stepX * 0.35, y: cy - 12, layer: 2 });
            pos.push({ x: cx + stepX * 0.35, y: cy - 12, layer: 2 });
        } else if (formationType === 'CIRCLE') {
            // YUVARLAK / DAIRE (28 Tiles)
            for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2;
                pos.push({ x: cx + Math.cos(a) * 115, y: cy + Math.sin(a) * 85, layer: 0 });
            }
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                pos.push({ x: cx + Math.cos(a) * 60 + 3, y: cy + Math.sin(a) * 45 - 6, layer: 1 });
            }
            pos.push({ x: cx - stepX * 0.4, y: cy - stepY * 0.4 - 12, layer: 2 });
            pos.push({ x: cx + stepX * 0.4, y: cy - stepY * 0.4 - 12, layer: 2 });
            pos.push({ x: cx - stepX * 0.4, y: cy + stepY * 0.4 - 12, layer: 2 });
            pos.push({ x: cx + stepX * 0.4, y: cy + stepY * 0.4 - 12, layer: 2 });
        } else if (formationType === 'TRIANGLE') {
            // ÜÇGEN (24 Tiles)
            const rows = [7, 5, 3, 1];
            for (let r = 0; r < rows.length; r++) {
                const count = rows[r];
                const startX = cx - ((count - 1) * stepX * 0.5);
                for (let c = 0; c < count; c++) {
                    pos.push({ x: startX + c * stepX, y: cy + (r - 1.5) * stepY, layer: 0 });
                }
            }
            for (let c = -1; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy + 0.5 * stepY - 6, layer: 1 });
            for (let c = 0; c <= 1; c++) pos.push({ x: cx + (c - 0.5) * stepX + 3, y: cy - 0.5 * stepY - 6, layer: 1 });
            pos.push({ x: cx + 3, y: cy - 1.5 * stepY - 6, layer: 1 });
            pos.push({ x: cx + 3, y: cy - 12, layer: 2 });
            pos.push({ x: cx + 3, y: cy - 18, layer: 2 });
        } else if (formationType === 'H_LETTER') {
            // H HARFİ (24 Tiles)
            const leftX = cx - stepX * 1.6;
            const rightX = cx + stepX * 1.6;
            for (let r = -2; r <= 2; r++) {
                pos.push({ x: leftX, y: cy + r * stepY, layer: 0 });
                pos.push({ x: rightX, y: cy + r * stepY, layer: 0 });
            }
            for (let c = -1; c <= 1; c++) {
                pos.push({ x: cx + c * stepX * 0.9, y: cy, layer: 0 });
            }
            for (let r of [-1, 0, 1]) {
                pos.push({ x: leftX + stepX * 0.5, y: cy + r * stepY - 6, layer: 1 });
                pos.push({ x: rightX - stepX * 0.5, y: cy + r * stepY - 6, layer: 1 });
                pos.push({ x: cx + (r * 0.6) * stepX, y: cy - 6, layer: 1 });
            }
            pos.push({ x: cx - stepX * 0.3, y: cy - 12, layer: 2 });
            pos.push({ x: cx + stepX * 0.3, y: cy - 12, layer: 2 });
        } else if (formationType === 'S_LETTER') {
            // S HARFİ (24 Tiles)
            for (let c = -1; c <= 2; c++) pos.push({ x: cx + c * stepX, y: cy - 2 * stepY, layer: 0 });
            pos.push({ x: cx - 1 * stepX, y: cy - 1 * stepY, layer: 0 });
            for (let c = -1; c <= 2; c++) pos.push({ x: cx + c * stepX, y: cy, layer: 0 });
            pos.push({ x: cx + 2 * stepX, y: cy + 1 * stepY, layer: 0 });
            for (let c = -1; c <= 2; c++) pos.push({ x: cx + c * stepX, y: cy + 2 * stepY, layer: 0 });
            for (let c = 0; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy - 2 * stepY - 6, layer: 1 });
            for (let c = 0; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy - 6, layer: 1 });
            for (let c = 0; c <= 1; c++) pos.push({ x: cx + c * stepX + 3, y: cy + 2 * stepY - 6, layer: 1 });
            pos.push({ x: cx - 1 * stepX + 3, y: cy - 1 * stepY - 6, layer: 1 });
            pos.push({ x: cx + 2 * stepX + 3, y: cy + 1 * stepY - 6, layer: 1 });
            pos.push({ x: cx, y: cy - 12, layer: 2 });
            pos.push({ x: cx + stepX, y: cy - 12, layer: 2 });
        } else if (formationType === 'DIAMOND') {
            // ELMAS (26 Tiles)
            const rowPats = [[1], [3], [5], [7], [5], [3], [1]];
            for (let r = 0; r < rowPats.length; r++) {
                const count = rowPats[r][0];
                const startX = cx - ((count - 1) * stepX * 0.5);
                for (let c = 0; c < count; c++) {
                    pos.push({ x: startX + c * stepX, y: cy + (r - 3) * stepY * 0.85, layer: 0 });
                }
            }
        } else if (formationType === 'HELIX') {
            // SARMAL (24 Tiles)
            for (let layer = 0; layer < 2; layer++) {
                for (let i = 0; i < 12; i++) {
                    const t = (i / 12) * Math.PI * 2;
                    const r = 35 + i * 8 - layer * 10;
                    pos.push({ x: cx + Math.cos(t + layer * 0.8) * r, y: cy + Math.sin(t + layer * 0.8) * r - layer * 6, layer: layer });
                }
            }
        } else if (formationType === 'TWIN_PEAKS') {
            // ÇİFT TEPE (28 Tiles)
            const leftX = cx - stepX * 1.8;
            const rightX = cx + stepX * 1.8;
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    pos.push({ x: leftX + c * stepX, y: cy + r * stepY, layer: 0 });
                    pos.push({ x: rightX + c * stepX, y: cy + r * stepY, layer: 0 });
                }
            }
            for (let r = 0; r <= 1; r++) {
                for (let c = 0; c <= 1; c++) {
                    pos.push({ x: leftX + (c - 0.5) * stepX + 3, y: cy + (r - 0.5) * stepY - 6, layer: 1 });
                    pos.push({ x: rightX + (c - 0.5) * stepX + 3, y: cy + (r - 0.5) * stepY - 6, layer: 1 });
                }
            }
            pos.push({ x: leftX + 3, y: cy - 12, layer: 2 });
            pos.push({ x: rightX + 3, y: cy - 12, layer: 2 });
        } else if (formationType === 'ROYAL_PYRAMID') {
            // 3D PİRAMİT (36 Tiles)
            for (let r = -2; r <= 2; r++) {
                for (let c = -2; c <= 2; c++) {
                    pos.push({ x: cx + c * stepX, y: cy + r * stepY, layer: 0 });
                }
            }
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    pos.push({ x: cx + c * stepX + 3, y: cy + r * stepY - 6, layer: 1 });
                }
            }
            pos.push({ x: cx + 3, y: cy - 12, layer: 2 });
            pos.push({ x: cx + 3, y: cy - 18, layer: 2 });
        } else {
            // YILDIZ (STAR) (18 Tiles)
            const angles = [-Math.PI / 2, -Math.PI / 2 + 0.4 * Math.PI, -Math.PI / 2 + 0.8 * Math.PI, -Math.PI / 2 + 1.2 * Math.PI, -Math.PI / 2 + 1.6 * Math.PI];
            for (let a of angles) pos.push({ x: cx + Math.cos(a) * 130, y: cy + Math.sin(a) * 130, layer: 0 });
            for (let a of [angles[0]+0.2*Math.PI, angles[1]+0.2*Math.PI, angles[2]+0.2*Math.PI, angles[3]+0.2*Math.PI, angles[4]+0.2*Math.PI]) {
                pos.push({ x: cx + Math.cos(a) * 65, y: cy + Math.sin(a) * 65, layer: 0 });
            }
            pos.push({ x: cx, y: cy - stepY, layer: 1 });
            pos.push({ x: cx - stepX, y: cy, layer: 1 });
            pos.push({ x: cx, y: cy, layer: 1 });
            pos.push({ x: cx + stepX, y: cy, layer: 1 });
            pos.push({ x: cx, y: cy + stepY, layer: 1 });
            pos.push({ x: cx + 3, y: cy - 8, layer: 2 });
            pos.push({ x: cx + 3, y: cy - 14, layer: 2 });
        }

        return pos.map(p => ({
            x: Math.round(p.x),
            y: Math.round(p.y),
            layer: p.layer
        }));
    }

    updateLockStates() {
        // STRICT ACCURATE VISIBILITY & CLICKABILITY RULE:
        // A tile is UNLOCKED & CLICKABLE if it is not heavily covered by upper layer cards.
        const cardArea = (this.cardW || 48) * (this.cardH || 60);

        for (let i = 0; i < this.boardTiles.length; i++) {
            const tile = this.boardTiles[i];
            if (tile.isInSlot) continue;

            let totalCoveredArea = 0;

            for (let j = 0; j < this.boardTiles.length; j++) {
                if (i === j) continue;
                const candidateAbove = this.boardTiles[j];
                if (candidateAbove.isInSlot) continue;

                // candidateAbove is visually ON TOP only if it is on a strictly HIGHER layer
                if (candidateAbove.layer > tile.layer) {
                    const overlapW = Math.max(0, this.cardW - Math.abs(tile.x - candidateAbove.x));
                    const overlapH = Math.max(0, this.cardH - Math.abs(tile.y - candidateAbove.y));

                    if (overlapW > 0 && overlapH > 0) {
                        const overlapArea = overlapW * overlapH;
                        totalCoveredArea += overlapArea;
                    }
                }
            }

            const coveredRatio = Math.min(1.0, totalCoveredArea / cardArea);

            // A tile is UNLOCKED & CLICKABLE if less than 40% of its surface is covered by upper layer cards!
            const isLocked = coveredRatio > 0.40;

            tile.isLocked = isLocked;
            if (isLocked) {
                tile.element.classList.add('locked');
                tile.element.classList.remove('unlocked-pop');
                tile.element.style.zIndex = String(10 * tile.layer + (tile.index || 0));
            } else {
                tile.element.classList.remove('locked');
                tile.element.classList.add('unlocked-pop');
                // ELEVATE UNLOCKED CLICKABLE TILES TO THE TOP VISUAL FOREGROUND FOREVER!
                tile.element.style.zIndex = String(5000 + 10 * tile.layer + (tile.index || 0));
            }
        }
    }

    useSmartHint() {
        const dict = this.i18n[this.settings.lang];

        if (this.score < this.hintCost) {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(dict.noScoreHint.replace('{cost}', this.hintCost));
            return;
        }

        this.clearHintHighlights();

        const unlockedBoardTiles = this.boardTiles.filter(t => !t.isLocked && !t.isInSlot);
        let foundMatchTiles = [];

        for (const slotTile of this.slotTiles) {
            const boardMatch = unlockedBoardTiles.find(t => t.type === slotTile.type);
            if (boardMatch) {
                foundMatchTiles = [boardMatch];
                break;
            }
        }

        if (foundMatchTiles.length === 0) {
            const typeGroup = {};
            for (const tile of unlockedBoardTiles) {
                if (!typeGroup[tile.type]) typeGroup[tile.type] = [];
                typeGroup[tile.type].push(tile);

                if (typeGroup[tile.type].length >= 2) {
                    foundMatchTiles = typeGroup[tile.type].slice(0, 2);
                    break;
                }
            }
        }

        if (foundMatchTiles.length > 0) {
            this.score -= this.hintCost;
            document.getElementById('score-val').innerText = this.score;
            this.saveGameProgress();

            // Double the cost for next use in current level (%100 Increase!)
            this.hintCost *= 2;
            this.updateBoosterBadgesUI();

            this.sound.playHintChime();
            this.triggerVibration();

            for (const tile of foundMatchTiles) {
                tile.element.classList.add('hint-highlight');
                this.hintHighlights.push(tile);
            }

            setTimeout(() => this.clearHintHighlights(), 3500);
        } else {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(dict.noHint);
        }
    }

    useExtraSlotBooster() {
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        // SLOT VARKEN PUANLA TEKRAR ALINAMAZ! (Yokken her bittiğinde tekrar alınabilir)
        if (this.hasTemporaryExtraSlot || this.maxSlotCapacity > 5) {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(dict.slotAlreadyActiveToast || '🚨 +1 Ekstra Slot zaten aktif! Kullanılıp kapandığında tekrar alabilirsiniz.');
            return;
        }

        if (this.score < this.slotCost) {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(dict.noScoreSlot.replace('{cost}', this.slotCost));
            return;
        }

        this.score -= this.slotCost;
        document.getElementById('score-val').innerText = this.score;
        this.saveGameProgress();

        // Double the cost for next use in current level (%100 Increase!)
        this.slotCost *= 2;
        this.updateBoosterBadgesUI();

        // Reveal Floating Emergency Slot Holder directly above Center Slot (Index 2)
        this.hasTemporaryExtraSlot = true;
        this.extraSlotWasUsed = false;
        this.maxSlotCapacity = 6;
        document.getElementById('floating-extra-slot').classList.remove('hidden');

        if (this.slotTiles.length >= 5) {
            this.returnTrayTilesToBoard(2);
        }

        this.sound.playBoosterChime();
        this.triggerVibration();

        const floatingSlotBox = document.querySelector('.extra-slot-box');
        const rect = floatingSlotBox.getBoundingClientRect();
        this.fx.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

        this.showToast(dict.slotAdded);
    }

    // SHUFFLE BOARD BOOSTER (5000 Base Score, 2x Double Cost on Each Use)
    useShuffleBooster() {
        const dict = this.i18n[this.settings.lang];

        if (this.score < this.shuffleCost) {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(dict.noScoreShuffle.replace('{cost}', this.shuffleCost));
            return;
        }

        this.score -= this.shuffleCost;
        document.getElementById('score-val').innerText = this.score;
        this.saveGameProgress();

        // Double the cost for next use in current level (5000 -> 10000 -> 20000...)
        this.shuffleCost *= 2;
        this.updateBoosterBadgesUI();

        this.sound.playBoosterChime();
        this.triggerVibration();

        this.autoShuffleBoard();

        const boardEl = document.getElementById('board');
        if (boardEl) {
            const rect = boardEl.getBoundingClientRect();
            this.fx.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
        }

        this.showToast(dict.shuffledMsg);
    }

    clearHintHighlights() {
        for (const tile of this.hintHighlights) {
            if (tile && tile.element) {
                tile.element.classList.remove('hint-highlight');
            }
        }
        this.hintHighlights = [];
    }

    showToast(msg) {
        const toast = document.getElementById('toast-msg');
        if (toast) {
            document.getElementById('toast-text').innerText = msg;
            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2200);
        }
    }

    getTileTypeId(tile) {
        if (!tile) return '';
        if (typeof tile === 'string') return tile;
        if (typeof tile.type === 'string') return tile.type;
        if (tile.type && typeof tile.type === 'object' && tile.type.id) return String(tile.type.id);
        if (tile.id && typeof tile.id === 'string' && !tile.id.startsWith('tile_')) return tile.id;
        return String(tile.type || tile.name || '');
    }

    onTileClick(tile) {
        if (tile.isInSlot || tile.isProcessingClick) return;

        const now = Date.now();
        if (this.lastTileClickTime && (now - this.lastTileClickTime < 50)) {
            return; // Fast tap throttle (50ms)
        }
        this.lastTileClickTime = now;

        tile.isProcessingClick = true;
        setTimeout(() => { tile.isProcessingClick = false; }, 100);

        this.clearHintHighlights();

        if (tile.isLocked) {
            this.sound.playLockThud();
            this.triggerVibration();
            tile.element.classList.add('shaking');
            setTimeout(() => tile.element.classList.remove('shaking'), 180);
            return;
        }

        this.hasMovedAnyTileInCurrentLevel = true;

        if (this.slotTiles.length >= this.maxSlotCapacity) return;

        this.sound.playClick();
        this.triggerVibration();

        tile.isInSlot = true;
        tile.element.classList.remove('locked');

        const boardIdx = this.boardTiles.indexOf(tile);
        if (boardIdx !== -1) {
            this.boardTiles.splice(boardIdx, 1);
        }

        let insertIdx = this.slotTiles.length;
        const currentTypeId = this.getTileTypeId(tile);
        for (let i = 0; i < this.slotTiles.length; i++) {
            if (this.getTileTypeId(this.slotTiles[i]) === currentTypeId) {
                insertIdx = i + 1;
            }
        }

        this.slotTiles.splice(insertIdx, 0, tile);

        const slotLayer = document.getElementById('slot-tiles-layer');
        slotLayer.appendChild(tile.element);

        this.updateLockStates();
        this.rearrangeSlotTiles();
        
        // Loop match check to process any and all formed pairs immediately!
        while (this.checkForMatches()) {}

        setTimeout(() => this.checkDeadlockAndAutoShuffle(), 300);
    }

    rearrangeSlotTiles() {
        const total = this.slotTiles.length;
        if (total === 0) return;

        const layerEl = document.getElementById('slot-tiles-layer');
        const markers = document.querySelectorAll('.slot-marker');
        let layerRect = null;
        if (layerEl && layerEl.getBoundingClientRect) {
            layerRect = layerEl.getBoundingClientRect();
        }

        const cardW = this.cardW || 68;
        const fallbackSpacing = cardW + 12;
        const fallbackStartX = 12;

        for (let i = 0; i < total; i++) {
            const tile = this.slotTiles[i];
            if (!tile || !tile.element) continue;

            if (i < 5) {
                let targetX, targetY, targetW, targetH;
                if (layerRect && markers[i] && markers[i].getBoundingClientRect) {
                    const mRect = markers[i].getBoundingClientRect();
                    targetX = Math.round(mRect.left - layerRect.left);
                    targetY = Math.round(mRect.top - layerRect.top);
                    targetW = Math.round(mRect.width);
                    targetH = Math.round(mRect.height);
                } else {
                    targetX = fallbackStartX + (i * fallbackSpacing);
                    targetY = 10;
                    targetW = cardW;
                    targetH = this.cardH || 88;
                }

                tile.element.style.transition = 'all 0.10s cubic-bezier(0.2, 0.9, 0.3, 1.0)';
                tile.element.style.left = `${targetX}px`;
                tile.element.style.top = `${targetY}px`;
                if (targetW > 0 && targetH > 0) {
                    tile.element.style.width = `${targetW}px`;
                    tile.element.style.height = `${targetH}px`;
                }
                tile.element.style.zIndex = 200 + i;
            } else {
                let centerX, centerY, targetW, targetH;
                if (layerRect && markers[2] && markers[2].getBoundingClientRect) {
                    const mRect = markers[2].getBoundingClientRect();
                    centerX = Math.round(mRect.left - layerRect.left);
                    centerY = Math.round((mRect.top - layerRect.top) - (mRect.height + 15));
                    targetW = Math.round(mRect.width);
                    targetH = Math.round(mRect.height);
                } else {
                    centerX = fallbackStartX + (2 * fallbackSpacing);
                    centerY = 10 - ((this.cardH || 88) + 15);
                    targetW = cardW;
                    targetH = this.cardH || 88;
                }

                this.extraSlotWasUsed = true;

                tile.element.style.transition = 'all 0.10s cubic-bezier(0.2, 0.9, 0.3, 1.0)';
                tile.element.style.left = `${centerX}px`;
                tile.element.style.top = `${centerY}px`;
                if (targetW > 0 && targetH > 0) {
                    tile.element.style.width = `${targetW}px`;
                    tile.element.style.height = `${targetH}px`;
                }
                tile.element.style.zIndex = 600;
            }
        }
    }

    returnTrayTilesToBoard(count = 2) {
        if (!this.slotTiles || this.slotTiles.length === 0) return;

        const tilesToReturn = [];
        const numToMove = Math.min(count, this.slotTiles.length);

        for (let i = 0; i < numToMove; i++) {
            const tile = this.slotTiles.pop();
            if (tile) {
                tile.isInSlot = false;
                tile.isMatching = false;
                tilesToReturn.push(tile);
            }
        }

        tilesToReturn.forEach((tile) => {
            this.boardTiles.push(tile);
            const boardEl = document.getElementById('board');
            if (boardEl && tile.element) {
                boardEl.appendChild(tile.element);
                tile.element.classList.remove('in-slot');
                tile.element.style.transition = 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
                tile.element.style.left = `${tile.x}px`;
                tile.element.style.top = `${tile.y}px`;
                tile.element.style.width = `${this.cardW}px`;
                tile.element.style.height = `${this.cardH}px`;
                tile.layer = Math.max(tile.layer || 1, 2);
                tile.element.style.zIndex = String(200 + (tile.index || 0));
            }
        });

        this.rearrangeSlotTiles();
        this.updateLockStates();
    }

    checkForMatches() {
        if (!this.slotTiles || this.slotTiles.length === 0) return false;

        const group = {};
        for (let i = 0; i < this.slotTiles.length; i++) {
            const tile = this.slotTiles[i];
            if (!tile || tile.isMatching) continue;

            const typeId = this.getTileTypeId(tile);
            if (!typeId) continue;

            if (!group[typeId]) group[typeId] = [];
            group[typeId].push(tile);

            if (group[typeId].length >= 2) {
                this.processPairMatch(group[typeId][0], group[typeId][1]);
                return true;
            }
        }

        if (this.slotTiles.length >= this.maxSlotCapacity) {
            setTimeout(() => {
                if (this.slotTiles.length >= this.maxSlotCapacity) {
                    const dict = this.i18n[this.settings.lang];
                    this.stopTimer();
                    document.getElementById('defeat-icon').innerText = '💔';
                    document.getElementById('defeat-title').innerText = dict.defeatTitle;
                    document.getElementById('defeat-desc').innerText = dict.defeatDesc;
                    document.getElementById('modal-gameover').classList.remove('hidden');
                    const btnAdRevive = document.getElementById('btn-ad-revive');
                    if (btnAdRevive) {
                        const count = this.levelAdReviveCount || 0;
                        const remaining = Math.max(0, 1 - count);
                        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                        if (remaining > 0) {
                            btnAdRevive.style.display = 'block';
                            btnAdRevive.querySelector('span').innerText = `📺 ${dict.adReviveBtn || 'REKLAM İZLE & DEVAM ET'} (${remaining}/1 HAK)`;
                        } else {
                            btnAdRevive.style.display = 'none';
                        }
                    }
                }
            }, 250);
        }

        return false;
    }

    
    // =========================================================
    // DEADLOCK DETECTION & AUTO-SHUFFLE SYSTEM
    // =========================================================

    checkDeadlockAndAutoShuffle() {
        if (this.isAutoShuffling) return false;
        if (!this.boardTiles || this.boardTiles.length <= 1) return false;

        const clickableTiles = this.boardTiles.filter(t => !t.isLocked && !t.isInSlot);
        if (clickableTiles.length === 0) return false;

        // Check if any 2 clickable tiles match each other
        for (let i = 0; i < clickableTiles.length; i++) {
            for (let j = i + 1; j < clickableTiles.length; j++) {
                if (this.getTileTypeId(clickableTiles[i]) === this.getTileTypeId(clickableTiles[j])) {
                    return false; // Valid move exists!
                }
            }
        }

        // Check if any clickable tile matches a tile in slot tray
        for (const bTile of clickableTiles) {
            for (const sTile of this.slotTiles) {
                if (this.getTileTypeId(bTile) === this.getTileTypeId(sTile)) {
                    return false; // Valid move exists!
                }
            }
        }

        // DEADLOCK DETECTED!
        this.isAutoShuffling = true;
        this.showToast('⚡ HAMLE KALMADI! Tahta Otomatik Karıştırılıyor...');
        this.sound.playBoosterChime();
        const boardEl = document.getElementById('board');
        if (boardEl) {
            const rect = boardEl.getBoundingClientRect();
            this.fx.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
        }

        this.autoShuffleBoard();
        setTimeout(() => { this.isAutoShuffling = false; }, 600);
        return true;
    }

    autoShuffleBoard() {
        const remainingTiles = this.boardTiles.filter(t => !t.isInSlot);
        if (remainingTiles.length <= 1) return;

        const tileTypesData = remainingTiles.map(t => ({
            type: t.type,
            bg: t.bg,
            imgSrc: t.imgSrc,
            svg: t.svg,
            name: t.name
        }));

        this.shuffleArray(tileTypesData);

        for (let i = 0; i < remainingTiles.length; i++) {
            const tile = remainingTiles[i];
            const newTypeData = tileTypesData[i];

            tile.type = newTypeData.type;
            tile.bg = newTypeData.bg;
            tile.imgSrc = newTypeData.imgSrc;
            tile.svg = newTypeData.svg;
            tile.name = newTypeData.name;

            tile.element.style.background = tile.bg;
            const iconContainer = tile.element.querySelector('.tile-icon');
            if (iconContainer) {
                iconContainer.innerHTML = '';
                if (tile.imgSrc) {
                    const imgEl = document.createElement('img');
                    imgEl.className = 'tile-img';
                    imgEl.src = tile.imgSrc;
                    imgEl.alt = tile.name || '';
                    iconContainer.appendChild(imgEl);
                } else if (tile.svg) {
                    iconContainer.innerHTML = tile.svg;
                }
            }
        }
        this.updateLockStates();
    }

    processPairMatch(tileA, tileB) {
        tileA.isMatching = true;
        tileB.isMatching = true;

        const idxA = this.slotTiles.indexOf(tileA);
        if (idxA !== -1) this.slotTiles.splice(idxA, 1);

        const idxB = this.slotTiles.indexOf(tileB);
        if (idxB !== -1) this.slotTiles.splice(idxB, 1);

        const rectA = tileA.element.getBoundingClientRect();
        const midX = rectA.left + rectA.width / 2;
        const midY = rectA.top + rectA.height / 2;

        tileA.element.classList.add('matching');
        tileB.element.classList.add('matching');

        const now = Date.now();
        if (now - this.lastMatchTime < 2800) {
            this.comboCount++;
        } else {
            this.comboCount = 1;
        }
        this.lastMatchTime = now;

        const points = 100 * this.comboCount;
        this.score += points;
        document.getElementById('score-val').innerText = this.score;

        if (this.comboCount >= 2) {
            const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
            let title = dict.combo2x || '✨ HARİKA UYUM!';
            if (this.comboCount === 3) title = dict.combo3x || '💖 MUHTEŞEM EŞLEŞME!';
            else if (this.comboCount === 4) title = dict.combo4x || '🌟 SÜPER COMBO!';
            else if (this.comboCount >= 5) title = dict.combo5x || '🌈 EFSANEVİ EŞLEŞME!';
            
            this.showComboBadge(`${title} (+${points})`);
        }

        if (this.currentMode === 'timetrial') {
            this.remainingSeconds += 1;
            const timerVal = document.getElementById('timer-val');
            if (timerVal) timerVal.innerText = `${this.remainingSeconds}s`;
        }

        this.sound.playMatchSound(this.comboCount);
        this.fx.spawnBurst(midX, midY);

        setTimeout(() => {
            if (tileA.element && tileA.element.parentElement) tileA.element.parentElement.removeChild(tileA.element);
            if (tileB.element && tileB.element.parentElement) tileB.element.parentElement.removeChild(tileB.element);

            this.rearrangeSlotTiles();
            this.updateLockStates();

            // Run match check again in a loop after element removal to process any pending pairs
            while (this.checkForMatches()) {}

            // AUTO-CLOSE +1 EMERGENCY SLOT AS SOON AS IT IS USED ONCE & MATCHED
            if (this.hasTemporaryExtraSlot && this.extraSlotWasUsed) {
                this.hasTemporaryExtraSlot = false;
                this.extraSlotWasUsed = false;
                this.maxSlotCapacity = 5;
                const floatSlot = document.getElementById('floating-extra-slot');
                if (floatSlot) floatSlot.classList.add('hidden');
                
                const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
                this.showToast(dict.slotUsedClosedToast || '🚨 +1 ACİL SLOT HAKKI KULLANILDI VE KAPANDI!');
                this.updateBoosterBadgesUI();
            }

            if (this.boardTiles.length === 0 && this.slotTiles.length === 0) {
                this.handleLevelVictory();
            }
        }, 220);
    }


    processPairMatch(tileA, tileB) {
        tileA.isMatching = true;
        tileB.isMatching = true;

        const idxA = this.slotTiles.indexOf(tileA);
        if (idxA !== -1) this.slotTiles.splice(idxA, 1);

        const idxB = this.slotTiles.indexOf(tileB);
        if (idxB !== -1) this.slotTiles.splice(idxB, 1);

        const rectA = tileA.element.getBoundingClientRect();
        const midX = rectA.left + rectA.width / 2;
        const midY = rectA.top + rectA.height / 2;

        tileA.element.classList.add('matching');
        tileB.element.classList.add('matching');

        const now = Date.now();
        if (now - this.lastMatchTime < 2800) {
            this.comboCount++;
        } else {
            this.comboCount = 1;
        }
        this.lastMatchTime = now;

        const points = 100 * this.comboCount;
        this.score += points;
        document.getElementById('score-val').innerText = this.score;

        if (this.comboCount >= 2) {
            const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
            let title = dict.combo2x || '✨ HARİKA UYUM!';
            if (this.comboCount === 3) title = dict.combo3x || '💖 MUHTEŞEM EŞLEŞME!';
            else if (this.comboCount === 4) title = dict.combo4x || '🌟 SÜPER COMBO!';
            else if (this.comboCount >= 5) title = dict.combo5x || '🌈 EFSANEVİ EŞLEŞME!';
            
            this.showComboBadge(`${title} (+${points})`);
        }

        if (this.currentMode === 'timetrial') {
            this.remainingSeconds += 1;
            const timerVal = document.getElementById('timer-val');
            if (timerVal) timerVal.innerText = `${this.remainingSeconds}s`;
        }

        this.sound.playMatchSound(this.comboCount);
        this.fx.spawnBurst(midX, midY);

        setTimeout(() => {
            if (tileA.element.parentElement) tileA.element.parentElement.removeChild(tileA.element);
            if (tileB.element.parentElement) tileB.element.parentElement.removeChild(tileB.element);

            // AUTO-CLOSE +1 EMERGENCY SLOT AS SOON AS IT IS USED ONCE & MATCHED
            if (this.hasTemporaryExtraSlot && this.extraSlotWasUsed) {
                this.hasTemporaryExtraSlot = false;
                this.extraSlotWasUsed = false;
                this.maxSlotCapacity = 5;
                const floatSlot = document.getElementById('floating-extra-slot');
                if (floatSlot) floatSlot.classList.add('hidden');
                
                const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
                this.showToast(dict.slotUsedClosedToast || '🚨 +1 ACİL SLOT HAKKI KULLANILDI VE KAPANDI!');
                this.updateBoosterBadgesUI();
            }

            this.rearrangeSlotTiles();

            const remainingBoardTiles = this.boardTiles.filter(t => !t.isInSlot);
            const activeDomTiles = document.querySelectorAll('#board .tile');

            if ((this.boardTiles.length === 0 || remainingBoardTiles.length === 0 || activeDomTiles.length === 0) && this.slotTiles.length === 0) {
                this.stopTimer();
                this.sound.playVictorySound();
                this.fx.spawnConfetti();

                // Save next unlocked level for active mode (Victory Unlock = true)
                this.saveGameProgress(true);

                const vicModal = document.getElementById('modal-victory');
                if (vicModal) vicModal.classList.add('hidden');

                if (this.level % 10 === 0) {
                    const starRating = this.rollBonusChestStarRating();
                    this.triggerChestRewardModal(starRating, true);
                } else {
                    const starRating = this.rollChestStarRating();
                    this.triggerChestRewardModal(starRating, false);
                }
            } else {
                this.checkForMatches();
            }
        }, 180);
    }

    showComboBadge(text) {
        const badge = document.getElementById('combo-badge');
        document.getElementById('combo-text').innerText = text;
        badge.classList.remove('hidden');

        clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => {
            this.hideComboBadge();
        }, 2200);
    }

    hideComboBadge() {
        document.getElementById('combo-badge').classList.add('hidden');
    }

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[r];
            arr[r] = temp;
        }
    }


    // =========================================================
    // CHEST REWARD SYSTEM (EVERY LEVEL + BONUS EVERY 10 LEVELS)
    // =========================================================

    rollChestStarRating() {
        // Yeni Nadir Yıldız Oranları: %60 1⭐, %28 2⭐, %8 3⭐, %3.5 4⭐, %0.5 5⭐
        const r = Math.random() * 100;
        if (r < 60) return 1;
        if (r < 88) return 2;
        if (r < 96) return 3;
        if (r < 99.5) return 4;
        return 5;
    }

    rollBonusChestStarRating() {
        // Her 10 Bölümde Bir Bonus Sandık Oranları: %65 3⭐, %30 4⭐, %5 5⭐
        const r = Math.random() * 100;
        if (r < 65) return 3;       // 65% -> 3⭐
        if (r < 95) return 4;       // 30% -> 4⭐
        return 5;                    // 5% -> 5⭐
    }

    rollChestReward(starLevel) {
        const r = Math.random() * 100;
        if (starLevel === 1) {
            return (r < 80) ? { gold: 10, pieces: 0 } : { gold: 0, pieces: 1 };
        } else if (starLevel === 2) {
            return (r < 65) ? { gold: 15, pieces: 0 } : { gold: 0, pieces: 1 };
        } else if (starLevel === 3) {
            return (r < 50) ? { gold: 20, pieces: 0 } : { gold: 0, pieces: 1 };
        } else if (starLevel === 4) {
            if (r < 20) return { gold: 35, pieces: 0 };
            if (r < 70) return { gold: 0, pieces: 1 };
            if (r < 95) return { gold: 0, pieces: 2 };
            return { gold: 0, pieces: 3 };
        } else {
            return (r < 40) ? { gold: 0, pieces: 2 } : { gold: 0, pieces: 3 };
        }
    }


    getPuzzleName(puzzleId) {
        return this.getLocalizedPuzzleName(puzzleId);
    }

    triggerChestRewardModal(starLevel, isBonus) {
        this.hasOpenedChestThisLevel = false;

        const starsText = '⭐️'.repeat(starLevel);
        const starDisp = document.getElementById('chest-star-display');
        if (starDisp) starDisp.innerText = starsText;

        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        const titleEl = document.getElementById('chest-modal-title');
        if (titleEl) {
            if (isBonus) {
                titleEl.innerText = (dict.bonusChestStarTitle || '🏆 BONUS {stars} YILDIZLI SANDIK! 🎁').replace('{stars}', starLevel);
            } else {
                titleEl.innerText = (dict.chestStarTitle || '{stars} YILDIZLI SANDIK! 🎁').replace('{stars}', starLevel);
            }
        }

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = dict.chestInitialDesc || 'Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!';

        const chestCard = document.querySelector('.chest-card');
        const chestBox = document.getElementById('chest-box');

        // Dynamic Chest Appearance based on Star Level (1⭐ to 5⭐)
        let chestIcon = '📦';
        let chestClass = 'chest-star-1';

        if (starLevel === 1) {
            chestIcon = '📦';
            chestClass = 'chest-star-1';
        } else if (starLevel === 2) {
            chestIcon = '🧰';
            chestClass = 'chest-star-2';
        } else if (starLevel === 3) {
            chestIcon = '🪙';
            chestClass = 'chest-star-3';
        } else if (starLevel === 4) {
            chestIcon = '💎';
            chestClass = 'chest-star-4';
        } else if (starLevel >= 5) {
            chestIcon = isBonus ? '🏆' : '👑';
            chestClass = 'chest-star-5';
        }

        if (chestBox) {
            chestBox.innerText = chestIcon;
            chestBox.className = `chest-box ${chestClass}`;
            chestBox.style.display = 'inline-block';
        }

        if (chestCard) {
            chestCard.className = `modal-card chest-card card-star-${starLevel}`;
        }

        // Reset Stage 1 Button: Visible, Enabled, Clickable!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) {
            btnOpenChest.style.display = 'inline-block';
            btnOpenChest.classList.remove('hidden');
            btnOpenChest.disabled = false;
            btnOpenChest.style.pointerEvents = 'auto';
        }

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }

    openChestBox() {
        if (this.hasOpenedChestThisLevel) return;
        if (!this.pendingChestReward) return;

        this.hasOpenedChestThisLevel = true;

        // Immediately disable and vanish Stage 1 "ÖDÜLLERİ AL" Button completely!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) {
            btnOpenChest.disabled = true;
            btnOpenChest.style.pointerEvents = 'none';
            btnOpenChest.style.display = 'none';
            btnOpenChest.classList.add('hidden');
        }

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        this.pendingAwardedPieces = [];
        let totalGold = reward.gold || 0;

        if (reward.pieces > 0) {
            for (let i = 0; i < reward.pieces; i++) {
                const pieceData = this.rollAnyPuzzlePiece();
                const isOwned = this.checkIfPieceOwned(pieceData.puzzleId, pieceData.pieceIndex);

                if (isOwned) {
                    // AUTOMATIC 50 GOLD CONVERSION FOR DUPLICATE PUZZLE PIECES!
                    totalGold += 50;
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    const pNameLoc = this.getLocalizedPuzzleName(pieceData.puzzleId);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    const subText = (dict.duplicatePieceConverted || '(Varolan {name} #{idx} Dönüştü!)').replace('{name}', pNameLoc).replace('{idx}', pieceData.pieceIndex + 1);
                    const goldText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', 50);
                    item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">${goldText} <br><small style="font-size:10px; color:#fbbf24;">${subText}</small></span>`;
                    if (rewardListEl) rewardListEl.appendChild(item);
                } else {
                    this.pendingAwardedPieces.push(pieceData);
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    const pNameLoc = this.getLocalizedPuzzleName(pieceData.puzzleId);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    const pieceText = (dict.puzzlePieceEarned || '{name} Parçası #{idx}').replace('{name}', pNameLoc).replace('{idx}', pieceData.pieceIndex + 1);
                    item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${pieceText}</span>`;
                    if (rewardListEl) rewardListEl.appendChild(item);
                }
            }
        }

        if (reward.gold > 0) {
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            const goldTxt = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', reward.gold);
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">${goldTxt}</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        this.pendingTotalGoldReward = totalGold;

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const descEl = document.getElementById('chest-modal-desc');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        if (descEl) descEl.innerText = dict.chestRewardsDesc || '🏆 Sandıktan Çıkan Ödülleriniz:';

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');
    }

    rollAnyPuzzlePiece() {
        const puzzle = this.puzzlesCatalog[Math.floor(Math.random() * this.puzzlesCatalog.length)];
        const pieceIdx = Math.floor(Math.random() * 12);
        return { puzzleId: puzzle.id, puzzleName: puzzle.name, pieceIndex: pieceIdx };
    }

    checkIfPieceOwned(puzzleId, pieceIdx) {
        const placed = this.placedPuzzlePieces[puzzleId] || [];
        if (placed.includes(pieceIdx)) return true;
        const inInv = this.puzzleInventory.some(p => p.puzzleId === puzzleId && p.pieceIndex === pieceIdx);
        if (inInv) return true;
        const inPending = this.pendingAwardedPieces && this.pendingAwardedPieces.some(p => p.puzzleId === puzzleId && p.pieceIndex === pieceIdx);
        if (inPending) return true;
        return false;
    }

    getRandomMissingPieceData() {
        const missing = [];
        for (const puzzle of this.puzzlesCatalog) {
            const placed = this.placedPuzzlePieces[puzzle.id] || [];
            for (let i = 0; i < 12; i++) {
                if (!placed.includes(i)) {
                    // Check if already in inventory or already pending in current chest reveal
                    const inInv = this.puzzleInventory.some(p => p.puzzleId === puzzle.id && p.pieceIndex === i);
                    const inPending = this.pendingAwardedPieces && this.pendingAwardedPieces.some(p => p.puzzleId === puzzle.id && p.pieceIndex === i);
                    if (!inInv && !inPending) {
                        missing.push({ puzzleId: puzzle.id, puzzleName: puzzle.name, pieceIndex: i });
                    }
                }
            }
        }

        if (missing.length === 0) return null;
        const rIdx = Math.floor(Math.random() * missing.length);
        return missing[rIdx];
    }

    getPreviewMissingPieces(count) {
        const list = [];
        for (const puzzle of this.puzzlesCatalog) {
            const placed = this.placedPuzzlePieces[puzzle.id] || [];
            for (let i = 0; i < 12; i++) {
                if (!placed.includes(i)) {
                    const inInv = this.puzzleInventory.some(p => p.puzzleId === puzzle.id && p.pieceIndex === i);
                    if (!inInv) {
                        list.push({ puzzleId: puzzle.id, puzzleName: puzzle.name, pieceIndex: i });
                        if (list.length >= count) return list;
                    }
                }
            }
        }
        return list;
    }

    awardRandomMissingPuzzlePiece() {
        const missing = [];
        for (const puzzle of this.puzzlesCatalog) {
            const placed = this.placedPuzzlePieces[puzzle.id] || [];
            for (let i = 0; i < 12; i++) {
                if (!placed.includes(i)) {
                    const inInv = this.puzzleInventory.some(p => p.puzzleId === puzzle.id && p.pieceIndex === i);
                    if (!inInv) {
                        missing.push({ puzzleId: puzzle.id, puzzleName: puzzle.name, pieceIndex: i });
                    }
                }
            }
        }

        if (missing.length === 0) return null;

        const picked = missing[Math.floor(Math.random() * missing.length)];
        this.puzzleInventory.push({
            id: `piece_${Date.now()}_${Math.random()}`,
            puzzleId: picked.puzzleId,
            pieceIndex: picked.pieceIndex
        });

        return picked;
    }

    buyPuzzlePieceWithGold() {
        if (this.goldCoins < 100) {
            this.sound.playLockThud();
            this.showToast('⚠️ Yetersiz Altın! (100 Altın Gerekli 🪙)');
            const buyBtn = document.getElementById('btn-buy-puzzle-piece');
            if (buyBtn) {
                buyBtn.classList.add('shaking');
                setTimeout(() => buyBtn.classList.remove('shaking'), 250);
            }
            return;
        }

        const added = this.awardRandomMissingPuzzlePiece();
        if (!added) {
            this.showToast('🏆 Tüm Bulmaca Parçaları Zaten Toplandı!');
            return;
        }

        this.goldCoins -= 100;
        const goldEl = document.getElementById('gold-val');
        if (goldEl) goldEl.innerText = this.goldCoins;
        const goldPuzzleEl = document.getElementById('gold-val-puzzle');
        if (goldPuzzleEl) goldPuzzleEl.innerText = this.goldCoins;

        this.sound.playBoosterChime();
        const pNameLoc = this.getLocalizedPuzzleName(added.puzzleId);
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        const msg = (dict.pieceBought || '🎉 1 Parça Alındı: {name} (#{idx})!').replace('{name}', pNameLoc).replace('{idx}', added.pieceIndex + 1);
        this.showToast(msg);
        this.saveGameProgress();
        this.renderPuzzleGalleryModal();
    }

    // =========================================================
    // 12-PIECE DRAG & DROP PUZZLE GALLERY & INVENTORY RENDERER
    // =========================================================

    openPuzzleGalleryModal() {
        document.getElementById('modal-puzzle-gallery').classList.remove('hidden');
        this.renderPuzzleGalleryModal();
    }

    renderPuzzleGalleryModal() {
        const goldEl = document.getElementById('gold-val');
        if (goldEl) goldEl.innerText = this.goldCoins;
        const goldPuzzleEl = document.getElementById('gold-val-puzzle');
        if (goldPuzzleEl) goldPuzzleEl.innerText = this.goldCoins;
        const tabsContainer = document.getElementById('puzzle-selector-tabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = '';
            for (const puzzle of this.puzzlesCatalog) {
                const placed = this.placedPuzzlePieces[puzzle.id] || [];
                const pct = Math.round((placed.length / 12) * 100);
                const isComplete = placed.length === 12;

                const btn = document.createElement('button');
                btn.className = `puzzle-tab-btn ${puzzle.id === this.activePuzzleId ? 'active' : ''}`;
                btn.innerHTML = `<span>${puzzle.name}</span> <span class="puzzle-pct-badge">${isComplete ? '🏆 %100' : `%${pct}`}</span>`;
                btn.addEventListener('click', () => {
                    this.activePuzzleId = puzzle.id;
                    this.renderPuzzleGalleryModal();
                });
                tabsContainer.appendChild(btn);
            }
        }

        const activeIdx = this.puzzlesCatalog.findIndex(p => p.id === this.activePuzzleId);
        const activePuzzle = this.puzzlesCatalog[activeIdx >= 0 ? activeIdx : 0] || this.puzzlesCatalog[0];
        const placedPieces = this.placedPuzzlePieces[activePuzzle.id] || [];
        const activePct = Math.round((placedPieces.length / 12) * 100);
        
        const titleEl = document.getElementById('journal-picture-title');
        if (titleEl) titleEl.innerText = `${activePuzzle.name} (%${activePct})`;

        const pageNumEl = document.getElementById('journal-page-num');
        if (pageNumEl) pageNumEl.innerText = `Sayfa ${activeIdx + 1} / ${this.puzzlesCatalog.length}`;
        const isCompleted = placedPieces.length === 12;

        const badge = document.getElementById('puzzle-completed-badge');
        if (badge) {
            if (placedPieces.length === 12) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        const wrapperEl = (document.querySelector && document.querySelector('.puzzle-board-wrapper')) || document.getElementById('puzzle-board-grid');
        if (wrapperEl && wrapperEl.style) {
            wrapperEl.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
            wrapperEl.style.backgroundSize = '100% 100%';
            wrapperEl.style.backgroundPosition = '0 0';
            wrapperEl.style.backgroundRepeat = 'no-repeat';
        }

        const gridEl = document.getElementById('puzzle-board-grid');
        if (gridEl) {
            gridEl.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const col = i % 3;
                const row = Math.floor(i / 3);

                const slot = document.createElement('div');
                slot.setAttribute('data-slot-index', i);

                if (placedPieces.includes(i)) {
                    slot.className = 'puzzle-slot jigsaw-shaped filled';
                    slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                    slot.style.backgroundSize = '300% 400%';
                    slot.style.backgroundPosition = `${col * 50}% ${row * 33.333333}%`;
                    slot.style.backgroundRepeat = 'no-repeat';
                    slot.style.clipPath = `url(#jigsaw-clip-${i})`;
                    slot.style.webkitClipPath = `url(#jigsaw-clip-${i})`;
                    slot.innerText = '';
                } else {
                    slot.className = 'puzzle-slot jigsaw-shaped empty';
                    slot.style.backgroundImage = 'none';
                    slot.innerText = `#${i + 1}`;
                }

                slot.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    slot.classList.add('drag-over');
                });
                slot.addEventListener('dragleave', () => {
                    slot.classList.remove('drag-over');
                });
                slot.addEventListener('drop', (e) => {
                    e.preventDefault();
                    slot.classList.remove('drag-over');
                    const pieceData = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
                    if (pieceData) {
                        try {
                            const parsed = JSON.parse(pieceData);
                            this.handlePlacePuzzlePiece(parsed.id, parsed.puzzleId, parsed.pieceIndex, i);
                        } catch (err) {}
                    }
                });

                gridEl.appendChild(slot);
            }
        }

        const trayEl = document.getElementById('puzzle-inventory-tray');
        if (trayEl) {
            trayEl.innerHTML = '';
            const unplacedPieces = this.puzzleInventory.filter(p => {
                const placed = this.placedPuzzlePieces[p.puzzleId] || [];
                return !placed.includes(p.pieceIndex);
            });

            if (unplacedPieces.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.style.color = '#94a3b8';
                emptyMsg.style.fontSize = '12px';
                emptyMsg.innerText = 'Envanterinizde henüz yerleştirilmemiş parça yok. Sandık açarak veya Altın ile parça kazanabilirsiniz!';
                trayEl.appendChild(emptyMsg);
            } else {
                for (const pItem of unplacedPieces) {
                    const puzzleDef = this.puzzlesCatalog.find(pz => pz.id === pItem.puzzleId);
                    if (!puzzleDef) continue;

                    const col = pItem.pieceIndex % 3;
                    const row = Math.floor(pItem.pieceIndex / 3);

                    const pieceEl = document.createElement('div');
                    pieceEl.className = 'puzzle-piece-item jigsaw-shaped';
                    pieceEl.style.clipPath = `url(#jigsaw-clip-${pItem.pieceIndex})`;
                    pieceEl.style.webkitClipPath = `url(#jigsaw-clip-${pItem.pieceIndex})`;
                    pieceEl.draggable = true;
                    pieceEl.style.backgroundImage = `url(${puzzleDef.imgSrc})`;
                    pieceEl.style.backgroundSize = '300% 400%';
                    pieceEl.style.backgroundPosition = `${col * 50}% ${row * 33.333333}%`;
                    pieceEl.style.backgroundRepeat = 'no-repeat';

                    const label = document.createElement('div');
                    label.className = 'piece-label';
                    label.innerText = `#${pItem.pieceIndex + 1}`;
                    pieceEl.appendChild(label);

                    pieceEl.addEventListener('dragstart', (e) => {
                        if (e.dataTransfer) {
                            e.dataTransfer.setData('text/plain', JSON.stringify(pItem));
                        }
                    });

                    pieceEl.addEventListener('click', () => {
                        if (this.activePuzzleId === pItem.puzzleId) {
                            this.handlePlacePuzzlePiece(pItem.id, pItem.puzzleId, pItem.pieceIndex, pItem.pieceIndex);
                        } else {
                            this.activePuzzleId = pItem.puzzleId;
                            this.renderPuzzleGalleryModal();
                            const pNameLoc = this.getLocalizedPuzzleName(pItem.puzzleId);
                            const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                            const msg = (dict.tabSwitchedMsg || '{name} sekmesine geçildi! Tekrar dokunarak yerleştirebilirsiniz.').replace('{name}', pNameLoc);
                            this.showToast(msg);
                        }
                    });

                    trayEl.appendChild(pieceEl);
                }
            }
        }
    }

    handlePlacePuzzlePiece(invId, puzzleId, pieceIndex, targetSlotIndex) {
        if (puzzleId !== this.activePuzzleId) {
            const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            this.showToast(dict.wrongTabMsg || 'Lütfen parçayı ait olduğu karakter sekmesine yerleştirin!');
            return;
        }

        if (pieceIndex !== targetSlotIndex) {
            this.sound.playLockThud();
            this.triggerVibration();

            const targetSlot = document.querySelector ? document.querySelector(`[data-slot-index="${targetSlotIndex}"]`) : null;
            if (targetSlot) {
                targetSlot.classList.add('shake-reject');
                setTimeout(() => targetSlot.classList.remove('shake-reject'), 450);
            }

            const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            const msg = (dict.wrongSlotMsg || '❌ Yanlış Yuva! Bu parça #{idx} numaralı yuvaya aittir. Envantere geri döndü.').replace('{idx}', pieceIndex + 1);
            this.showToast(msg);
            return;
        }

        if (!this.placedPuzzlePieces[puzzleId]) {
            this.placedPuzzlePieces[puzzleId] = [];
        }

        if (this.placedPuzzlePieces[puzzleId].includes(pieceIndex)) {
            return;
        }

        this.placedPuzzlePieces[puzzleId].push(pieceIndex);

        const invIdx = this.puzzleInventory.findIndex(p => p.id === invId || (p.puzzleId === puzzleId && p.pieceIndex === pieceIndex));
        if (invIdx !== -1) {
            this.puzzleInventory.splice(invIdx, 1);
        }

        this.sound.playMatchSound(2);
        this.fx.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 30);

        if (this.placedPuzzlePieces[puzzleId].length === 12) {
            this.sound.playVictorySound();
            this.fx.spawnConfetti();
            this.showToast(`🏆 TEBRİKLER! ${this.activePuzzleId.toUpperCase()} BULMACASI TAMAMLANDI!`);
        }

        this.saveGameProgress();
        this.renderPuzzleGalleryModal();
    }

    // =========================================================
    // GOOGLE ADMOB REWARDED VIDEO & INTERSTITIAL AD ENGINE
    // =========================================================

    // =========================================================
    // DAILY AD CHEST LIMIT (3 PER DAY) & PER-LEVEL REVIVE (2 PER LEVEL)
    // =========================================================
    getDailyAdChestRemaining() {
        try {
            const resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
            
            if (resetTime > 0 && Date.now() >= resetTime) {
                localStorage.setItem('tile_game_ad_chest_reset_time', '0');
                localStorage.setItem('tile_game_ad_chest_count', '0');
                return 3;
            }

            const savedCount = parseInt(localStorage.getItem('tile_game_ad_chest_count') || '0', 10);
            
            if (savedCount >= 3 && resetTime === 0) {
                const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                localStorage.setItem('tile_game_ad_chest_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
            }

            return Math.max(0, 3 - savedCount);
        } catch (e) {
            return 3;
        }
    }

    useDailyAdChestClaim() {
        try {
            const currentRemaining = this.getDailyAdChestRemaining();
            const usedSoFar = 3 - currentRemaining;
            const newCount = usedSoFar + 1;
            localStorage.setItem('tile_game_ad_chest_count', newCount.toString());

            if (newCount >= 3) {
                const existingReset = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);
                if (existingReset === 0 || Date.now() >= existingReset) {
                    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                    localStorage.setItem('tile_game_ad_chest_reset_time', (Date.now() + TWENTY_FOUR_HOURS_MS).toString());
                }
            }
            this.updateAdWidgetUI();
        } catch (e) {}
    }

    updateAdWidgetUI() {
        const widgetTag = document.querySelector('.ad-widget-label');
        const remaining = this.getDailyAdChestRemaining();
        let resetTime = parseInt(localStorage.getItem('tile_game_ad_chest_reset_time') || '0', 10);

        if (widgetTag) {
            if (remaining > 0) {
                widgetTag.innerText = `(${remaining}/3)`;
                widgetTag.style.background = '#10b981';
            } else {
                if (resetTime === 0 || Date.now() >= resetTime) {
                    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
                    resetTime = Date.now() + TWENTY_FOUR_HOURS_MS;
                    localStorage.setItem('tile_game_ad_chest_reset_time', resetTime.toString());
                }
                const resetRemaining = Math.max(0, resetTime - Date.now());
                const timeStr = this.formatTimeLeft(resetRemaining);
                widgetTag.innerText = timeStr;
                widgetTag.style.background = '#ef4444';
            }
        }
    }

    // =========================================================
    // CUTE 3D LUCKY WHEEL ENGINE WITH 8-HR COOLDOWN & 24-HR RESET
    // =========================================================
    getDailyWheelSpinsCount() {
        try {
            const resetTime = parseInt(localStorage.getItem('tile_game_wheel_reset_time') || '0', 10);
            const now = Date.now();
            const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

            // Reset 24-hour cycle
            if (resetTime > 0 && now >= resetTime) {
                localStorage.setItem('tile_game_wheel_reset_time', '0');
                localStorage.setItem('tile_game_wheel_spins', '0');
                localStorage.setItem('tile_game_wheel_last_ad_spin_time', '0');
                return 0;
            }

            return parseInt(localStorage.getItem('tile_game_wheel_spins') || '0', 10);
        } catch (e) {
            return 0;
        }
    }

    getLastAdWheelSpinTime() {
        try {
            return parseInt(localStorage.getItem('tile_game_wheel_last_ad_spin_time') || '0', 10);
        } catch (e) {
            return 0;
        }
    }

    incrementWheelSpinsCount(isAdSpin = false) {
        try {
            const currentSpins = this.getDailyWheelSpinsCount();
            const newSpins = currentSpins + 1;
            const now = Date.now();
            const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

            localStorage.setItem('tile_game_wheel_spins', newSpins.toString());
            
            if (isAdSpin) {
                // ONLY set 8-hour cooldown timer when ad spin is executed!
                localStorage.setItem('tile_game_wheel_last_ad_spin_time', now.toString());
            }

            const existingReset = parseInt(localStorage.getItem('tile_game_wheel_reset_time') || '0', 10);
            if (existingReset === 0 || now >= existingReset) {
                localStorage.setItem('tile_game_wheel_reset_time', (now + TWENTY_FOUR_HOURS_MS).toString());
            }

            this.updateWheelTimerState();
        } catch (e) {}
    }

    formatTimeLeft(ms) {
        if (ms <= 0) return '00:00:00';
        const totalSecs = Math.floor(ms / 1000);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateWheelTimerState() {
        const widgetTag = document.querySelector('.wheel-widget-label');
        const statusBadge = document.getElementById('wheel-status-badge');
        const btnSpin = document.getElementById('btn-spin-wheel');
        const txtSpin = document.getElementById('txt-spin-btn');

        const spins = this.getDailyWheelSpinsCount();
        const lastAdSpinTime = this.getLastAdWheelSpinTime();
        const now = Date.now();

        const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
        const cooldownRemaining = (lastAdSpinTime > 0) ? Math.max(0, (lastAdSpinTime + EIGHT_HOURS_MS) - now) : 0;

        if (spins === 0) {
            // STEP 1: FREE SPIN AVAILABLE
            if (widgetTag) {
                widgetTag.innerText = 'ÇARK';
                widgetTag.style.background = '#f59e0b';
            }
            if (statusBadge && txtSpin && btnSpin) {
                statusBadge.innerText = '✨ 1 ÜCRETSİZ ÇEVİRME HAKKI';
                statusBadge.style.color = '#fbbf24';
                txtSpin.innerText = '🎯 ÜCRETSİZ ÇEVİR!';
                btnSpin.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                btnSpin.disabled = false;
            }
        } else if (lastAdSpinTime === 0 || (spins >= 1 && cooldownRemaining <= 0)) {
            // STEP 2: AD SPIN AVAILABLE (Free spin done, 8h cooldown not active)
            if (widgetTag) {
                widgetTag.innerText = '🎬 REKLAM';
                widgetTag.style.background = '#8b5cf6';
            }
            if (statusBadge && txtSpin && btnSpin) {
                statusBadge.innerText = '🎬 1 REKLAMLIK ÇEVİRME HAKKI HAZIR';
                statusBadge.style.color = '#c084fc';
                txtSpin.innerText = '📺 REKLAM İZLE VE ÇEVİR';
                btnSpin.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
                btnSpin.disabled = false;
            }
        } else {
            // STEP 3: 8-HOUR COOLDOWN ACTIVE
            const timeStr = this.formatTimeLeft(cooldownRemaining);
            if (widgetTag) {
                widgetTag.innerText = timeStr;
                widgetTag.style.background = '#64748b';
            }
            if (statusBadge && txtSpin && btnSpin) {
                statusBadge.innerText = `⏳ Reklamlı Çevirme Bekleme Süresi: ${timeStr}`;
                statusBadge.style.color = '#94a3b8';
                txtSpin.innerText = '⏳ BEKLEME SÜRESİNDE';
                btnSpin.style.background = 'linear-gradient(135deg, #475569 0%, #334155 100%)';
                btnSpin.disabled = false;
            }
        }
    }

    startWheelTimerLoop() {
        if (this.wheelTimerInterval) clearInterval(this.wheelTimerInterval);
        this.updateWheelTimerState();
        this.updateAdWidgetUI();
        this.wheelTimerInterval = setInterval(() => {
            this.updateWheelTimerState();
            this.updateAdWidgetUI();
        }, 1000);
    }

    getWheelSegments() {
        const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
        const pasLabel = dict.pasText || 'PAS ❌';

        return [
            { id: 'pas_1', type: 'pas', text: pasLabel, icon: '💨', prob: 5, bg: '#64748b', color: '#ffffff' },
            { id: 'gold_10', type: 'gold', amount: 10, text: '10 ALTIN', icon: '🪙', prob: 28, bg: '#f59e0b', color: '#ffffff' },
            { id: 'piece_1', type: 'piece', count: 1, text: '1 PARÇA', icon: '🧩', prob: 10, bg: '#8b5cf6', color: '#ffffff' },
            { id: 'gold_15', type: 'gold', amount: 15, text: '15 ALTIN', icon: '🪙', prob: 20, bg: '#3b82f6', color: '#ffffff' },
            { id: 'piece_2', type: 'piece', count: 2, text: '2 PARÇA', icon: '🧩', prob: 4, bg: '#ec4899', color: '#ffffff' },
            { id: 'gold_20', type: 'gold', amount: 20, text: '20 ALTIN', icon: '🪙', prob: 14, bg: '#10b981', color: '#ffffff' },
            { id: 'pas_2', type: 'pas', text: pasLabel, icon: '💨', prob: 5, bg: '#475569', color: '#ffffff' },
            { id: 'gold_25', type: 'gold', amount: 25, text: '25 ALTIN', icon: '🪙', prob: 8, bg: '#f97316', color: '#ffffff' },
            { id: 'gold_50', type: 'gold', amount: 50, text: '50 ALTIN', icon: '🪙', prob: 4, bg: '#06b6d4', color: '#ffffff' },
            { id: 'piece_3', type: 'piece', count: 3, text: '3 PARÇA', icon: '🌟', prob: 2, bg: '#eab308', color: '#0f172a' }
        ];
    }

    renderWheelCanvas() {
        const canvas = document.getElementById('wheel-canvas');
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');

        const segments = this.getWheelSegments();
        const cx = 140, cy = 140, r = 135;

        ctx.clearRect(0, 0, 280, 280);

        let currentAngle = 0;
        for (let i = 0; i < segments.length; i++) {
            const segAngle = (segments[i].prob / 100) * (2 * Math.PI);
            const startAngle = currentAngle;
            const endAngle = currentAngle + segAngle;

            ctx.beginPath();
            ctx.fillStyle = segments[i].bg;
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, endAngle);
            ctx.lineTo(cx, cy);
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Render Segment Labels & Icons
            const midAngle = startAngle + segAngle / 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(midAngle);
            ctx.textAlign = 'right';
            ctx.fillStyle = segments[i].color;
            ctx.font = '900 12px sans-serif';

            const degrees = (segments[i].prob / 100) * 360;
            if (degrees < 12) {
                ctx.font = '900 9px sans-serif';
            } else if (degrees < 20) {
                ctx.font = '900 10.5px sans-serif';
            }

            ctx.fillText(`${segments[i].icon} ${this.getWheelSliceLabel(segments[i])}`, r - 12, 4);
            ctx.restore();

            currentAngle = endAngle;
        }
    }

    openWheelModal() {
        this.renderWheelCanvas();
        const disc = document.getElementById('wheel-disc');
        if (disc) disc.style.transform = 'rotate(0deg)';

        this.updateWheelTimerState();
        const modalWheel = document.getElementById('modal-wheel');
        if (modalWheel) modalWheel.classList.remove('hidden');
    }

    rollWheelReward() {
        const segments = this.getWheelSegments();
        const rand = Math.random() * 100;
        let cumulative = 0;

        for (let i = 0; i < segments.length; i++) {
            cumulative += segments[i].prob;
            if (rand <= cumulative) {
                return { seg: segments[i], segIndex: i };
            }
        }
        return { seg: segments[0], segIndex: 0 };
    }

    spinWheelAction() {
        const spins = this.getDailyWheelSpinsCount();
        const lastAdSpinTime = this.getLastAdWheelSpinTime();
        const now = Date.now();
        const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
        const cooldownRemaining = (lastAdSpinTime > 0) ? Math.max(0, (lastAdSpinTime + EIGHT_HOURS_MS) - now) : 0;

        const executeSpin = (isAdSpin = false) => {
            const btnSpin = document.getElementById('btn-spin-wheel');
            if (btnSpin) btnSpin.disabled = true;

            const roll = this.rollWheelReward();
            const selectedSeg = roll.seg;
            const segIndex = roll.segIndex;
            const segments = this.getWheelSegments();

            let cumulativeAngleDeg = 0;
            for (let i = 0; i < segIndex; i++) {
                cumulativeAngleDeg += (segments[i].prob / 100) * 360;
            }
            const segSliceDeg = (selectedSeg.prob / 100) * 360;
            const midAngleDeg = cumulativeAngleDeg + (segSliceDeg / 2);

            let degreesToTarget = 270 - midAngleDeg;
            while (degreesToTarget < 0) degreesToTarget += 360;

            const targetRotationDeg = (360 * 5) + degreesToTarget;

            const disc = document.getElementById('wheel-disc');
            if (disc) {
                disc.style.transform = `rotate(${targetRotationDeg}deg)`;
            }

            this.sound.playBoosterChime();

            setTimeout(() => {
                this.incrementWheelSpinsCount(isAdSpin);

                if (this.fx && typeof this.fx.spawnConfetti === 'function') {
                    this.fx.spawnConfetti();
                }
                this.sound.playVictorySound();

                const modalWheel = document.getElementById('modal-wheel');
                if (modalWheel) modalWheel.classList.add('hidden');

                this.triggerWheelRewardModal(selectedSeg);
            }, 4100);
        };

        if (spins === 0) {
            // Spin 1: FREE SPIN! No ad, no 8-hour cooldown yet!
            executeSpin(false);
        } else {
            // Spin 2+: Check 8-hour cooldown if ad spin was already used
            if (cooldownRemaining > 0) {
                this.sound.playLockThud();
                const timeStr = this.formatTimeLeft(cooldownRemaining);
                this.showToast(`⏳ Reklamlı Çevirme Bekleme Süresinde! (Kalan: ${timeStr})`);
                return;
            }

            // Show Ad Spin Permission Modal before running Ad Spin!
            const modalAdConfirm = document.getElementById('modal-wheel-ad-confirm');
            if (modalAdConfirm) {
                this.pendingAdWheelExecute = () => executeSpin(true);
                modalAdConfirm.classList.remove('hidden');
                modalAdConfirm.style.display = 'flex';
            } else {
                this.showRewardedAd(() => {
                    executeSpin(true);
                });
            }
        }
    }

    triggerWheelRewardModal(seg) {
        const modalChest = document.getElementById('modal-chest');
        const starDisp = document.getElementById('chest-star-display');
        const titleEl = document.getElementById('chest-modal-title');
        const descEl = document.getElementById('chest-modal-desc');
        const btnOpenChest = document.getElementById('btn-open-chest');
        const rewardContent = document.getElementById('chest-reward-content');
        const rewardListEl = document.getElementById('chest-reward-list');
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;

        if (seg.type === 'pas') {
            if (starDisp) starDisp.innerText = '💨 ❌ 💨';
            if (titleEl) titleEl.innerText = dict.pasWonTitle || '💨 PAS GEÇTİN!';
            if (descEl) descEl.innerText = dict.pasWonDesc || 'Bu çevirmede şansın yaver gitmedi, tekrar dene!';
            this.pendingChestReward = { gold: 0, pieces: [] };
        } else if (seg.type === 'gold') {
            if (starDisp) starDisp.innerText = '🎡 🪙 🎡';
            if (titleEl) titleEl.innerText = dict.wheelRewardTitle || '🎡 ŞANS ÇARKI ÖDÜLÜ! 🎉';
            if (descEl) descEl.innerText = dict.wheelRewardDesc || '🏆 Çarktan Çıkan Ödülleriniz:';
            this.pendingChestReward = { gold: seg.amount, pieces: [] };
        } else {
            if (starDisp) starDisp.innerText = '🎡 🧩 🎡';
            if (titleEl) titleEl.innerText = dict.wheelRewardTitle || '🎡 ŞANS ÇARKI ÖDÜLÜ! 🎉';
            if (descEl) descEl.innerText = dict.wheelRewardDesc || '🏆 Çarktan Çıkan Ödülleriniz:';
            
            const awardedPieces = [];
            for (let i = 0; i < seg.count; i++) {
                const piece = this.awardRandomMissingPuzzlePiece();
                if (piece) awardedPieces.push(piece);
            }
            this.pendingChestReward = { gold: 0, pieces: awardedPieces };
        }

        if (btnOpenChest) {
            btnOpenChest.style.display = 'none';
            btnOpenChest.classList.add('hidden');
        }

        this.hasOpenedChestThisLevel = false;

        if (rewardListEl) {
            rewardListEl.innerHTML = '';

            if (seg.type === 'pas') {
                const item = document.createElement('div');
                item.className = 'chest-reward-item reward-gold';
                item.style.borderColor = '#64748b';
                item.innerHTML = `<div class="reward-icon">💨</div><div class="reward-text">${dict.pasWonTitle || 'PAS GEÇTİN!'}</div>`;
                rewardListEl.appendChild(item);
            } else {
                if (this.pendingChestReward.gold > 0) {
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item reward-gold';
                    const goldText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', this.pendingChestReward.gold);
                    item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">${goldText}</div>`;
                    rewardListEl.appendChild(item);
                }

                if (this.pendingChestReward.pieces && this.pendingChestReward.pieces.length > 0) {
                    for (const piece of this.pendingChestReward.pieces) {
                        const item = document.createElement('div');
                        item.className = 'chest-reward-item reward-piece';
                        const localizedName = this.getPuzzleName(piece.puzzleId);
                        if (piece.isDuplicate) {
                            const dupMsg = (dict.duplicatePieceConverted || '(Varolan {name} #{idx} Dönüştü!)').replace('{name}', localizedName).replace('{idx}', piece.pieceIndex + 1);
                            const gText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', 50);
                            item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">${gText} <span class="dup-note">${dupMsg}</span></div>`;
                        } else {
                            const pieceMsg = (dict.puzzlePieceEarned || '{name} Parçası #{idx}').replace('{name}', localizedName).replace('{idx}', piece.pieceIndex + 1);
                            item.innerHTML = `<div class="reward-icon">🧩</div><div class="reward-text">${pieceMsg}</div>`;
                        }
                        rewardListEl.appendChild(item);
                    }
                }
            }
        }

        if (rewardContent) rewardContent.classList.remove('hidden');
        if (modalChest) modalChest.classList.remove('hidden');
    }


    showMainMenuBannerAd() {
        const bannerContainer = document.getElementById('main-menu-ad-banner');
        if (bannerContainer) bannerContainer.classList.remove('hidden');

        // Native Android / H5 AdMob Bridge Integration
        if (window.AndroidAdMob && typeof window.AndroidAdMob.showBannerAd === 'function') {
            window.AndroidAdMob.showBannerAd();
        }
    }

    hideMainMenuBannerAd() {
        const bannerContainer = document.getElementById('main-menu-ad-banner');
        if (bannerContainer) bannerContainer.classList.add('hidden');

        // Native Android / H5 AdMob Bridge Integration
        if (window.AndroidAdMob && typeof window.AndroidAdMob.hideBannerAd === 'function') {
            window.AndroidAdMob.hideBannerAd();
        }
    }

    showRewardedAd(onSuccess, onFailure) {
        // Offline Check: Notify player if internet connection is offline
        if (typeof navigator !== 'undefined' && navigator.onLine === false && !window.AndroidAdMob) {
            this.sound.playLockThud();
            const dict = (this.i18n && this.i18n[this.settings.lang]) ? this.i18n[this.settings.lang] : (this.i18n ? this.i18n.tr : {});
            this.showToast(dict.offlineAdMsg || '📡 Çevrimdışısınız! Reklam izlemek için lütfen internet bağlantınızı açın.');
            if (onFailure) onFailure();
            return;
        }

        // Production Check for Google AdMob H5 / Native Android Bridge
        if (window.AndroidAdMob && typeof window.AndroidAdMob.showRewardedAd === 'function') {
            window.AndroidAdMob.showRewardedAd();
            window.onAdMobRewardSuccess = () => { if (onSuccess) onSuccess(); };
            return;
        }

        if (window.google && window.google.afg && typeof window.google.afg.showAd === 'function') {
            window.google.afg.showAd({
                adSlot: 'rewarded',
                onAdDismissed: () => { if (onSuccess) onSuccess(); }
            });
            return;
        }

        // Official Production & Test AdMob Integration Credentials (All 6 Ad Units Mapped)
        window.admobConfig = {
            appId: "ca-app-pub-5810332619798187~2097711537",
            bannerAdUnitId: "ca-app-pub-5810332619798187/5186661887",
            interstitialAdUnitId: "ca-app-pub-5810332619798187/7152535583",
            rewardedChestAdUnitId: "ca-app-pub-5810332619798187/8395847375",
            rewardedSlotShuffleAdUnitId: "ca-app-pub-5810332619798187/5769684031",
            rewardedWheelAdUnitId: "ca-app-pub-5810332619798187/4526372248",
            rewardedInterstitialAdUnitId: "ca-app-pub-5810332619798187/1151782174"
        };

        // Check for Native Android / Web AdMob Bridge
        if (window.AndroidAdMob && window.AndroidAdMob.showRewardedAd) {
            try {
                window.AndroidAdMob.showRewardedAd(window.admobConfig.rewardedAdUnitId);
                window.onAdMobRewardSuccess = () => {
                    if (onSuccess) onSuccess();
                };
                return;
            } catch (e) {}
        }

        // Web Preview / Browser Testing Rewarded Ad Player
        const adModal = document.getElementById('modal-ad-player');
        const progressBar = document.getElementById('ad-progress-fill');
        const timerText = document.getElementById('ad-timer-countdown');

        if (!adModal) {
            if (onSuccess) onSuccess();
            return;
        }

        adModal.classList.remove('hidden');
        if (progressBar) progressBar.style.width = '0%';

        let secondsLeft = 3;
        if (timerText) timerText.innerText = `Kalan Süre: ${secondsLeft} sn`;

        const interval = setInterval(() => {
            secondsLeft--;
            const pct = Math.round(((3 - secondsLeft) / 3) * 100);
            if (progressBar) progressBar.style.width = `${pct}%`;
            if (timerText) timerText.innerText = `Kalan Süre: ${secondsLeft} sn`;

            if (secondsLeft <= 0) {
                clearInterval(interval);
                setTimeout(() => {
                    adModal.classList.add('hidden');
                    if (onSuccess) onSuccess();
                }, 300);
            }
        }, 1000);
    }

    // -------------------------------------------------------------
    // LEADERBOARD, PLAYER PROFILE & PROFANITY FILTER ENGINE
    // -------------------------------------------------------------
    loadPlayerProfile() {
        try {
            const saved = localStorage.getItem('tile_game_player_profile');
            if (saved) {
                this.playerProfile = JSON.parse(saved);
            }
        } catch (e) {}

        if (!this.playerProfile || !this.playerProfile.nickname) {
            const defaultNick = this.getRandomNicknameSuggestion();
            const defaultTag = this.getRandomTagSuggestion();
            this.savePlayerProfile(defaultNick, defaultTag);
        }
    }

    loadCloudLeaderboardCache() {
        try {
            const raw = localStorage.getItem('tile_game_cloud_lb_cache');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed)) {
                    this.latestCloudDataset = parsed;
                }
            }
        } catch (e) {}
    }

    savePlayerProfile(nickname, tag) {
        const cleanNick = nickname.trim().substring(0, 10);
        const cleanTag = tag.trim().replace(/[^0-9]/g, '').padStart(4, '0').substring(0, 4);
        
        this.playerProfile = {
            nickname: cleanNick,
            tag: cleanTag,
            fullTag: `${cleanNick}#${cleanTag}`,
            registeredAt: Date.now()
        };

        try {
            localStorage.setItem('tile_game_player_profile', JSON.stringify(this.playerProfile));
        } catch (e) {}
    }

    checkFirstTimeRegistration() {
        if (!this.playerProfile || !this.playerProfile.nickname) {
            setTimeout(() => {
                this.openSetNicknameModal();
            }, 600);
        }
    }

    isProfaneOrInappropriate(text) {
        if (!text) return true;
        const normalized = text.toLowerCase().trim();
        
        const blacklist = [
            'amk', 'amq', 'yarrak', 'orospu', 'göt', 'ibne', 'yavsak', 'yavşak',
            'fuck', 'bitch', 'asshole', 'cunt', 'dick', 'bastard', 'pussy', 'nigger', 'nigga'
        ];

        return blacklist.some(badWord => normalized === badWord || normalized.includes(badWord));
    }

    getRandomNicknameSuggestion() {
        const prefixes = ['Kozmik', 'Eşleme', 'Ejder', 'Mistik', 'Panda', 'Tilki', 'Büyülü', 'Zafer', 'Turbo', 'Alfa'];
        const suffixes = ['Ustası', 'Avcısı', 'Kralı', 'Şampiyonu', 'Oyuncu', 'Kaplanı', 'Fırtınası', 'Yıldızı', 'Kahramanı'];
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const s = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${p}${s}`.substring(0, 10);
    }

    getRandomTagSuggestion() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    openSetNicknameModal() {
        const modal = document.getElementById('modal-set-nickname');
        if (!modal) return;

        const inputNick = document.getElementById('input-nickname');
        const inputTag = document.getElementById('input-tag');
        const errMsg = document.getElementById('nickname-error-msg');

        if (errMsg) errMsg.classList.add('hidden');

        if (inputNick) {
            inputNick.value = this.playerProfile ? this.playerProfile.nickname : this.getRandomNicknameSuggestion();
        }
        if (inputTag) {
            inputTag.value = this.playerProfile ? this.playerProfile.tag : this.getRandomTagSuggestion();
        }

        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    getTierTitleAndAvatar(rankNum) {
        if (rankNum === 1) {
            return { title: '👑 Kozmik İlah', avatar: '👑', cssClass: 'top-1' };
        } else if (rankNum === 2) {
            return { title: '🥈 Efsanevi Usta', avatar: '🥈', cssClass: 'top-2' };
        } else if (rankNum === 3) {
            return { title: '🥉 Ejder Şampiyonu', avatar: '🥉', cssClass: 'top-3' };
        } else if (rankNum >= 4 && rankNum <= 10) {
            return { title: '⭐ Elit Usta', avatar: '⭐', cssClass: 'top-10' };
        } else if (rankNum >= 11 && rankNum <= 100) {
            return { title: '💎 Elmas Oyuncu', avatar: '💎', cssClass: 'top-100' };
        } else {
            return { title: '🛡️ Yükselen Yıldız', avatar: '🛡️', cssClass: 'top-1000' };
        }
    }

    getGlobalLeaderboardDataset(category = 'overall') {
        const myName = (this.playerProfile && this.playerProfile.nickname) ? this.playerProfile.nickname : 'Siz';
        const myTag = (this.playerProfile && this.playerProfile.tag) ? this.playerProfile.tag : '0001';
        const myFullTag = `${myName}#${myTag}`;

        const myClassicLvl = (this.classicProgress && this.classicProgress.level) || 1;
        let myClassicScore = (this.classicProgress && typeof this.classicProgress.score === 'number') ? this.classicProgress.score : 0;
        if (this.currentMode === 'classic' && typeof this.score === 'number') {
            myClassicScore = Math.max(myClassicScore, this.score);
        }

        const myTtLvl = (this.timeTrialProgress && this.timeTrialProgress.level) || 1;
        let myTtScore = (this.timeTrialProgress && typeof this.timeTrialProgress.score === 'number') ? this.timeTrialProgress.score : 0;
        if (this.currentMode === 'timetrial' && typeof this.score === 'number') {
            myTtScore = Math.max(myTtScore, this.score);
        }

        const myOverallScore = myClassicScore + myTtScore;

        const countPlacedPuzzles = () => {
            let total = 0;
            for (const pId in this.placedPuzzlePieces) {
                if (this.placedPuzzlePieces[pId] && this.placedPuzzlePieces[pId].length === 12) {
                    total++;
                }
            }
            return total;
        };
        const myPuzzleCount = countPlacedPuzzles();

        const list = [];
        list.push({
            isSelf: true,
            name: myName,
            tag: myTag,
            fullTag: myFullTag,
            classicLvl: myClassicLvl,
            classicScore: myClassicScore,
            ttLvl: myTtLvl,
            ttScore: myTtScore,
            overallScore: myOverallScore,
            puzzles: myPuzzleCount
        });

        // MERGE REAL LIVE ONLINE PLAYERS FROM CLOUD DATABASE
        if (this.latestCloudDataset && Array.isArray(this.latestCloudDataset)) {
            for (const cp of this.latestCloudDataset) {
                if (cp && cp.fullTag && cp.fullTag.toLowerCase() !== myFullTag.toLowerCase()) {
                    const existingIdx = list.findIndex(item => item.fullTag.toLowerCase() === cp.fullTag.toLowerCase());

                    const cpClassicScore = (typeof cp.classicScore === 'number' && cp.classicScore >= 0) ? cp.classicScore : 0;
                    const cpTtScore = (typeof cp.ttScore === 'number' && cp.ttScore >= 0) ? cp.ttScore : 0;
                    const cpOverallScore = (typeof cp.overallScore === 'number' && cp.overallScore >= 0) ? cp.overallScore : (cpClassicScore + cpTtScore);

                    const cloudPlayer = {
                        isSelf: false,
                        name: cp.name || cp.fullTag.split('#')[0],
                        tag: cp.tag || '0000',
                        fullTag: cp.fullTag,
                        classicLvl: (typeof cp.classicLvl === 'number' && cp.classicLvl >= 1) ? cp.classicLvl : 1,
                        classicScore: cpClassicScore,
                        ttLvl: (typeof cp.ttLvl === 'number' && cp.ttLvl >= 1) ? cp.ttLvl : 1,
                        ttScore: cpTtScore,
                        overallScore: cpOverallScore,
                        puzzles: (typeof cp.puzzles === 'number' && cp.puzzles >= 0) ? cp.puzzles : 0
                    };
                    if (existingIdx >= 0) {
                        list[existingIdx] = cloudPlayer;
                    } else {
                        list.push(cloudPlayer);
                    }
                }
            }
        }

        // DETERMINISTIC TIE-BREAKER SORTING
        list.sort((a, b) => {
            if (category === 'classic') {
                if (b.classicScore !== a.classicScore) return b.classicScore - a.classicScore;
                if (b.classicLvl !== a.classicLvl) return b.classicLvl - a.classicLvl;
            } else if (category === 'timetrial') {
                if (b.ttScore !== a.ttScore) return b.ttScore - a.ttScore;
                if (b.ttLvl !== a.ttLvl) return b.ttLvl - a.ttLvl;
            } else {
                if (b.overallScore !== a.overallScore) return b.overallScore - a.overallScore;
            }
            if (b.puzzles !== a.puzzles) return b.puzzles - a.puzzles;
            return a.fullTag.localeCompare(b.fullTag);
        });

        list.forEach((item, idx) => {
            item.rank = idx + 1;
        });

        return list;
    }

    async syncCloudLeaderboard() {
        if (typeof navigator !== 'undefined' && !navigator.onLine) return;
        if (!this.playerProfile || !this.playerProfile.nickname) return;

        try {
            const myName = this.playerProfile.nickname;
            const myTag = this.playerProfile.tag || '0001';
            const myFullTag = `${myName}#${myTag}`;
            
            const myClassicLvl = (this.classicProgress && this.classicProgress.level) || 1;
            let myClassicScore = (this.classicProgress && typeof this.classicProgress.score === 'number') ? this.classicProgress.score : 0;
            if (this.currentMode === 'classic' && typeof this.score === 'number') {
                myClassicScore = Math.max(myClassicScore, this.score);
            }

            const myTtLvl = (this.timeTrialProgress && this.timeTrialProgress.level) || 1;
            let myTtScore = (this.timeTrialProgress && typeof this.timeTrialProgress.score === 'number') ? this.timeTrialProgress.score : 0;
            if (this.currentMode === 'timetrial' && typeof this.score === 'number') {
                myTtScore = Math.max(myTtScore, this.score);
            }
            
            let myPuzzleCount = 0;
            for (const pId in this.placedPuzzlePieces) {
                if (this.placedPuzzlePieces[pId] && this.placedPuzzlePieces[pId].length === 12) {
                    myPuzzleCount++;
                }
            }

            const myEntry = {
                fullTag: myFullTag,
                name: myName,
                tag: myTag,
                classicLvl: myClassicLvl,
                classicScore: myClassicScore,
                ttLvl: myTtLvl,
                ttScore: myTtScore,
                overallScore: myClassicScore + myTtScore,
                puzzles: myPuzzleCount,
                puzzleDataStr: JSON.stringify({
                    goldCoins: this.goldCoins,
                    puzzleInventory: this.puzzleInventory,
                    placedPuzzlePieces: this.placedPuzzlePieces
                }),
                updatedAt: Date.now()
            };

            const cloudUrl = 'https://jsonblob.com/api/jsonBlob/019fcf1b-1d53-7a58-bad9-de2b58944893';
            const mongoApiUrl = 'https://esle-gitsin-3d.vercel.app/api';

            // 1. Primary Sync: Atomic update to MongoDB Atlas Database!
            try {
                const mongoResp = await fetch(mongoApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(myEntry)
                });
                if (mongoResp.ok) {
                    const mongoData = await mongoResp.json();
                    if (mongoData && Array.isArray(mongoData.players)) {
                        this.latestCloudDataset = mongoData.players;
                        try {
                            localStorage.setItem('tile_game_cloud_lb_cache', JSON.stringify(mongoData.players));
                        } catch (cErr) {}
                    }
                }
            } catch (mongoErr) {}

            // 2. Dual Backup Sync: JSONBlob Cloud Storage
            const playerMap = new Map();

            if (this.latestCloudDataset && Array.isArray(this.latestCloudDataset)) {
                for (const p of this.latestCloudDataset) {
                    if (p && p.fullTag) playerMap.set(p.fullTag.toLowerCase(), p);
                }
            }

            try {
                const resp = await fetch(cloudUrl);
                if (resp.ok) {
                    const parsed = await resp.json();
                    if (parsed && Array.isArray(parsed.players)) {
                        for (const p of parsed.players) {
                            if (p && p.fullTag) {
                                const key = p.fullTag.toLowerCase();
                                const existing = playerMap.get(key);
                                if (!existing) {
                                    playerMap.set(key, p);
                                } else {
                                    // Merge intelligently preserving highest scores & max progression!
                                    const merged = {
                                        ...existing,
                                        ...p,
                                        classicLvl: Math.max(existing.classicLvl || 1, p.classicLvl || 1),
                                        classicScore: Math.max(existing.classicScore || 0, p.classicScore || 0),
                                        ttLvl: Math.max(existing.ttLvl || 1, p.ttLvl || 1),
                                        ttScore: Math.max(existing.ttScore || 0, p.ttScore || 0),
                                        puzzles: Math.max(existing.puzzles || 0, p.puzzles || 0),
                                        updatedAt: Math.max(existing.updatedAt || 0, p.updatedAt || 0)
                                    };
                                    merged.overallScore = merged.classicScore + merged.ttScore;
                                    playerMap.set(key, merged);
                                }
                            }
                        }
                    }
                }
            } catch (fetchErr) {}

            // Merge current player's entry safely with Math.max so local progress is never lost
            const myKey = myFullTag.toLowerCase();
            const existingMyData = playerMap.get(myKey);
            if (existingMyData) {
                myEntry.classicLvl = Math.max(existingMyData.classicLvl || 1, myEntry.classicLvl || 1);
                myEntry.classicScore = Math.max(existingMyData.classicScore || 0, myEntry.classicScore || 0);
                myEntry.ttLvl = Math.max(existingMyData.ttLvl || 1, myEntry.ttLvl || 1);
                myEntry.ttScore = Math.max(existingMyData.ttScore || 0, myEntry.ttScore || 0);
                myEntry.puzzles = Math.max(existingMyData.puzzles || 0, myEntry.puzzles || 0);
                myEntry.overallScore = myEntry.classicScore + myEntry.ttScore;
            }
            playerMap.set(myKey, myEntry);

            const updatedPlayers = Array.from(playerMap.values());
            updatedPlayers.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));

            const finalPlayers = updatedPlayers.slice(0, 1000);
            this.latestCloudDataset = finalPlayers;

            try {
                localStorage.setItem('tile_game_cloud_lb_cache', JSON.stringify(finalPlayers));
            } catch (cacheErr) {}

            await fetch(cloudUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ players: finalPlayers })
            });
        } catch (e) {
            console.log('[CloudSync] Exception:', e);
        }
    }

    async fetchCloudLeaderboardData() {
        if (typeof navigator !== 'undefined' && !navigator.onLine) return null;
        try {
            const mongoApiUrl = 'https://esle-gitsin-3d.vercel.app/api';
            try {
                const mResp = await fetch(mongoApiUrl);
                if (mResp.ok) {
                    const mData = await mResp.json();
                    if (mData && Array.isArray(mData.players)) {
                        return mData.players;
                    }
                }
            } catch (mErr) {}

            const cloudUrl = 'https://jsonblob.com/api/jsonBlob/019fcf1b-1d53-7a58-bad9-de2b58944893';
            const resp = await fetch(cloudUrl);
            if (!resp.ok) return null;
            const data = await resp.json();
            if (data && Array.isArray(data.players)) {
                return data.players;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async openLeaderboardModal(activeCategory = 'overall') {
        this.sound.playClick();

        if (!navigator.onLine) {
            this.sound.playLockThud();
            this.showToast('🌐 Liderlik Tablosunu Görebilmek İçin İnternet Bağlantınızı Kontrol Edin!');
            return;
        }

        const modal = document.getElementById('modal-leaderboard');
        if (!modal) return;

        this.currentLeaderboardCategory = activeCategory;

        document.querySelectorAll('.lb-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-lb-tab') === activeCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 1. Instantly render local dataset for zero latency
        this.renderLeaderboardList(activeCategory);

        modal.classList.remove('hidden');
        modal.style.display = 'flex';

        // 2. Perform atomic cloud sync & render stable merged list
        await this.syncCloudLeaderboard();
        this.renderLeaderboardList(activeCategory);

        // 3. Auto Live Polling while modal is visible (every 15s)
        if (this.leaderboardPollInterval) clearInterval(this.leaderboardPollInterval);
        this.leaderboardPollInterval = setInterval(async () => {
            if (modal.classList.contains('hidden') || modal.style.display === 'none') {
                clearInterval(this.leaderboardPollInterval);
                return;
            }
            await this.syncCloudLeaderboard();
            this.renderLeaderboardList(this.currentLeaderboardCategory);
        }, 15000);
    }

    renderLeaderboardList(category = 'overall') {
        const listContainer = document.getElementById('leaderboard-list-container');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        const dataset = this.getGlobalLeaderboardDataset(category);
        const selfItem = dataset.find(d => d.isSelf) || dataset[0];

        const displayLimit = Math.min(1000, dataset.length);
        for (let i = 0; i < displayLimit; i++) {
            const player = dataset[i];
            const tierInfo = this.getTierTitleAndAvatar(player.rank);

            const rowEl = document.createElement('div');
            rowEl.className = `lb-player-row ${tierInfo.cssClass} ${player.isSelf ? 'self-highlight' : ''}`;
            
            let displayScore = 0;
            if (category === 'classic') displayScore = player.classicScore;
            else if (category === 'timetrial') displayScore = player.ttScore;
            else displayScore = player.overallScore;

            const safeTag = String(player.fullTag).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const safeTitle = String(tierInfo.title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

            rowEl.innerHTML = `
                <div class="lb-rank-num">#${player.rank}</div>
                <div class="lb-player-info">
                    <span class="lb-name-tag">${safeTag} ${player.isSelf ? '(Siz)' : ''}</span>
                    <span class="lb-tier-badge">${safeTitle}</span>
                </div>
                <div class="lb-score-val">${displayScore.toLocaleString()} Puan</div>
            `;

            rowEl.addEventListener('click', () => {
                this.sound.playClick();
                this.openPlayerProfileModal(player);
            });

            listContainer.appendChild(rowEl);
        }

        const selfRankBadge = document.getElementById('self-rank-badge');
        const selfNameTag = document.getElementById('self-name-tag');
        const selfTitleBadge = document.getElementById('self-title-badge');
        const selfScoreVal = document.getElementById('self-score-val');

        if (selfItem) {
            const selfTier = this.getTierTitleAndAvatar(selfItem.rank);
            if (selfRankBadge) selfRankBadge.innerText = `#${selfItem.rank}`;
            if (selfNameTag) selfNameTag.innerText = `SİZ: ${selfItem.fullTag}`;
            if (selfTitleBadge) selfTitleBadge.innerText = selfTier.title;
            
            let selfDisplayScore = 0;
            if (category === 'classic') selfDisplayScore = selfItem.classicScore;
            else if (category === 'timetrial') selfDisplayScore = selfItem.ttScore;
            else selfDisplayScore = selfItem.overallScore;

            if (selfScoreVal) selfScoreVal.innerText = `${selfDisplayScore.toLocaleString()} Puan`;
        }
    }

    openPlayerProfileModal(player) {
        this.sound.playClick();
        const modal = document.getElementById('modal-player-profile');
        if (!modal) return;

        const tierInfo = this.getTierTitleAndAvatar(player.rank || 1);

        const avatarFrame = document.getElementById('profile-avatar-frame');
        const nameTag = document.getElementById('profile-name-tag');
        const titleBadge = document.getElementById('profile-title-badge');
        const rankText = document.getElementById('profile-global-rank');

        const classicLvl = document.getElementById('profile-classic-level');
        const classicScore = document.getElementById('profile-classic-score');
        const ttLvl = document.getElementById('profile-timetrial-level');
        const ttScore = document.getElementById('profile-timetrial-score');
        const puzzleCount = document.getElementById('profile-puzzle-count');

        if (avatarFrame) avatarFrame.innerText = tierInfo.avatar;
        if (nameTag) nameTag.innerText = player.fullTag;
        if (titleBadge) titleBadge.innerText = tierInfo.title;
        if (rankText) rankText.innerText = `Küresel Sıralama: #${player.rank || 1}`;

        if (classicLvl) classicLvl.innerText = `Seviye ${player.classicLvl || 1}`;
        if (classicScore) classicScore.innerText = `${(player.classicScore || 0).toLocaleString()} Puan`;

        if (ttLvl) ttLvl.innerText = `Seviye ${player.ttLvl || 1}`;
        if (ttScore) ttScore.innerText = `${(player.ttScore || 0).toLocaleString()} Puan`;

        if (puzzleCount) puzzleCount.innerText = `${player.puzzles || 0} / 12 Tamamlandı`;

        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}


// Initialize Game Engine Immediately (Handles DOM Ready State & Deferred Script Loader)
function bootGameEngine() {
    if (window.gameInstance) return;
    try {
        window.gameInstance = new TileMatchingGame();
    } catch (e) {
        console.error('[EsleGitsin3D] CRITICAL: Game init failed:', e);
        const introStage = document.getElementById('cybercore-intro-stage');
        if (introStage && introStage.parentNode) {
            introStage.parentNode.removeChild(introStage);
        }
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
            mainMenu.style.display = 'flex';
            mainMenu.style.opacity = '1';
            mainMenu.style.pointerEvents = 'auto';
        }
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(bootGameEngine, 1);
} else {
    window.addEventListener('DOMContentLoaded', bootGameEngine);
}
window.addEventListener('load', bootGameEngine);

// Global uncaught error safety net - never let screen freeze
window.addEventListener('error', (e) => {
    console.error('[EsleGitsin3D] Uncaught error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('[EsleGitsin3D] Unhandled promise rejection:', e.reason);
});
