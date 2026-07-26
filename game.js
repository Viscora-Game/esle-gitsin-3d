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
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    setVolume(volPct) {
        this.masterVolume = Math.max(0, Math.min(1, volPct / 100));
    }

    playClick() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.35 * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playTick() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.25 * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playLockThud() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.14);

        gain.gain.setValueAtTime(0.45 * this.masterVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.14);
    }

    playHintChime() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;

        const notes = [659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

            gain.gain.setValueAtTime(0.3 * this.masterVolume, this.ctx.currentTime + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.05 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.05);
            osc.stop(this.ctx.currentTime + idx * 0.05 + 0.2);
        });
    }

    playBoosterChime() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;

        const notes = [523.25, 659.25, 783.99, 1046.50, 1567.98];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

            gain.gain.setValueAtTime(0.35 * this.masterVolume, this.ctx.currentTime + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.06 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.06);
            osc.stop(this.ctx.currentTime + idx * 0.06 + 0.25);
        });
    }

    playMatchSound(comboMultiplier = 1) {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;

        const baseFreq = 523.25 * (1 + (comboMultiplier - 1) * 0.15);
        const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2.0];
        
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

            gain.gain.setValueAtTime(0.3 * this.masterVolume, this.ctx.currentTime + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.04 + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.04);
            osc.stop(this.ctx.currentTime + idx * 0.04 + 0.18);
        });
    }

    playVictorySound() {
        this.init();
        if (!this.ctx || this.masterVolume <= 0) return;

        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

            gain.gain.setValueAtTime(0.35 * this.masterVolume, this.ctx.currentTime + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.07 + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.07);
            osc.stop(this.ctx.currentTime + idx * 0.07 + 0.3);
        });
    }
}

class ParticleFX {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    spawnBurst(x, y, count = 24) {
        const colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#c084fc', '#ffffff', '#ec4899'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.03 + 0.02
            });
        }
    }

    spawnConfetti() {
        const colors = ['#fbbf24', '#ef4444', '#10b981', '#38bdf8', '#c084fc', '#f43f5e'];
        for (let i = 0; i < 70; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 5 + 3,
                radius: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.005
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

class TileMatchingGame {
    constructor() {
        this.cardW = 70;
        this.cardH = 90;
        this.maxSlotCapacity = 5;
        this.hasTemporaryExtraSlot = false;
        this.extraSlotWasUsed = false;

        // Dynamic In-Level Cost System (%100 Cost Increase on each use in same level)
        this.baseHintCost = 300;
        this.baseSlotCost = 1000;
        this.baseShuffleCost = 5000;

        this.hintCost = 300;
        this.slotCost = 1000;
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

        // Background Themes
        this.bgThemes = [
            'radial-gradient(circle at 50% 38%, rgba(52, 211, 153, 0.22) 0%, transparent 65%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px), radial-gradient(circle at center, #064e3b 0%, #022c22 75%, #01140e 100%)',
            'radial-gradient(circle at 50% 38%, rgba(251, 191, 36, 0.20) 0%, transparent 65%), repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 14px), radial-gradient(circle at center, #5c2418 0%, #3a150e 75%, #170704 100%)',
            'radial-gradient(circle at 50% 38%, rgba(56, 189, 248, 0.22) 0%, transparent 65%), repeating-linear-gradient(60deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 8px), radial-gradient(circle at center, #1e3a8a 0%, #172554 75%, #060913 100%)',
            'radial-gradient(circle at 50% 38%, rgba(192, 132, 252, 0.22) 0%, transparent 65%), repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px), radial-gradient(circle at center, #581c87 0%, #3b0764 75%, #140326 100%)',
            'radial-gradient(circle at 50% 38%, rgba(245, 158, 11, 0.22) 0%, transparent 65%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 16px), radial-gradient(circle at center, #7c2d12 0%, #451a03 75%, #0f0401 100%)',
            'radial-gradient(circle at 50% 38%, rgba(244, 63, 94, 0.22) 0%, transparent 65%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px), radial-gradient(circle at center, #831843 0%, #500724 75%, #1f020c 100%)',
            'radial-gradient(circle at 50% 38%, rgba(129, 140, 248, 0.22) 0%, transparent 65%), repeating-linear-gradient(30deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 9px), radial-gradient(circle at center, #312e81 0%, #1e1b4b 75%, #060913 100%)'
        ];

        // 10 Rich Symmetrical Mahjong Formations Pool!
        this.formations = [
            'HOURGLASS', 'H_LETTER', 'HEART', 'CIRCLE', 'TRIANGLE', 'FLOWER', 'DIAMOND', 'HELIX', 'TWIN_PEAKS', 'S_LETTER', 'ROYAL_PYRAMID', 'STAR'
        ];

        // Settings State
        this.settings = {
            volume: 80,
            vibration: true,
            lang: 'tr'
        };

        // i18n Translations
        this.i18n = {
            tr: {
                gameTitle: 'EŞLE GİTSİN! 3D',
                play: 'OYNA',
                classicBtnText: '🎮 KLASİK MOD (SEVİYE {lvl})',
                timetrialBtnText: '⏱️ ZAMANA KARŞI MOD (SEVİYE {lvl})',
                newGameBtn: '🔄 SIFIRLA VE YENİ OYUN BAŞLAT',
                settings: 'AYARLAR',
                settingsTitle: '⚙️ AYARLAR',
                volLabel: '🔊 Ses Düzeyi',
                vibLabel: '📳 Titreşim',
                langLabel: '🌐 Dil Desteği',
                saveBtn: 'KAYDET VE KAPAT',
                levelLabel: 'SEVİYE',
                hintLabel: 'İPUCU',
                slotBtnLabel: '+1 SLOT',
                scoreLabel: 'SKOR',
                victoryTitle: 'TEBRİKLER!',
                victoryDesc: 'Bölümdeki tüm kartları başarıyla eşleştirdiniz!',
                nextLevelBtn: 'SONRAKİ BÖLÜM',
                defeatTitle: 'SLOT DOLDU!',
                defeatDesc: 'Tepside boş alan kalmadı ve eşleşen kart bulunamadı.',
                timeUpTitle: 'SÜRE BİTTİ!',
                timeUpDesc: 'Zamana karşı yarışta süre doldu!',
                penaltyText: 'CEZA: -2000 Puan (Kazanılan puanlar silindi)',
                retryBtn: 'TEKRAR DENE (-2000 PUAN)',
                vibOn: 'AÇIK',
                vibOff: 'KAPALI',
                noScoreHint: 'Yetersiz Skor! ({cost} Puan Gerekli)',
                noScoreSlot: 'Yetersiz Skor! ({cost} Puan Gerekli)',
                noScoreShuffle: 'Yetersiz Skor! ({cost} Puan Gerekli)',
                noHint: 'Şu an açık eşleşen kart bulunamadı!',
                slotAdded: 'Ortadaki Slot Üstüne Acil Yuva Açıldı! 🚨',
                shuffledMsg: 'Tahtadaki Kartlar Karıştırıldı! 🔀',
                menuSubtitle: 'Eşleme ve Zeka Macerası'
            },
            en: {
                gameTitle: 'TILE MATCH 3D',
                play: 'PLAY',
                classicBtnText: '🎮 CLASSIC MODE (LEVEL {lvl})',
                timetrialBtnText: '⏱️ TIME TRIAL MODE (LEVEL {lvl})',
                newGameBtn: 'RESET & START NEW GAME',
                settings: 'SETTINGS',
                settingsTitle: 'SETTINGS',
                volLabel: '🔊 Sound Volume',
                vibLabel: '📳 Vibration',
                langLabel: '🌐 Language',
                saveBtn: 'SAVE & CLOSE',
                levelLabel: 'LEVEL',
                hintLabel: 'HINT',
                slotBtnLabel: '+1 SLOT',
                scoreLabel: 'SCORE',
                victoryTitle: 'VICTORY!',
                victoryDesc: 'You matched all tiles on the board!',
                nextLevelBtn: 'NEXT LEVEL',
                defeatTitle: 'SLOT FULL!',
                defeatDesc: 'No empty slot available and no pairs found.',
                timeUpTitle: 'TIME\'S UP!',
                timeUpDesc: 'Time ran out in Time Trial mode!',
                penaltyText: 'PENALTY: -2000 Points (Earned points reset)',
                retryBtn: 'RETRY (-2000 PTS)',
                vibOn: 'ON',
                vibOff: 'OFF',
                noScoreHint: 'Not Enough Score! ({cost} Required)',
                noScoreSlot: 'Not Enough Score! ({cost} Required)',
                noScoreShuffle: 'Not Enough Score! ({cost} Required)',
                noHint: 'No matching unlocked tiles available!',
                slotAdded: 'Emergency Slot Opened Above Center Slot! 🚨',
                shuffledMsg: 'Board Tiles Reshuffled! 🔀',
                menuSubtitle: 'Matching & Logic Puzzle Adventure'
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
        this.initUI();
        this.checkFirstTimeTutorial();
    }

    loadGameProgress() {
        try {
            const savedClassic = localStorage.getItem('tile_game_classic');
            if (savedClassic) {
                const parsed = JSON.parse(savedClassic);
                if (parsed && parsed.level) this.classicProgress = parsed;
            }

            const savedTimeTrial = localStorage.getItem('tile_game_timetrial');
            if (savedTimeTrial) {
                const parsed = JSON.parse(savedTimeTrial);
                if (parsed && parsed.level) this.timeTrialProgress = parsed;
            }
        
            const savedPuzzleData = localStorage.getItem('tile_game_puzzle_data');
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

    saveGameProgress() {
        try {
            const data = {
                level: this.level,
                score: this.score,
                timestamp: Date.now()
            };

            if (this.currentMode === 'classic') {
                this.classicProgress = data;
                localStorage.setItem('tile_game_classic', JSON.stringify(data));
            } else {
                this.timeTrialProgress = data;
                localStorage.setItem('tile_game_timetrial', JSON.stringify(data));
            }
        
            const puzzleData = {
                goldCoins: this.goldCoins,
                puzzleInventory: this.puzzleInventory,
                placedPuzzlePieces: this.placedPuzzlePieces
            };
            localStorage.setItem('tile_game_puzzle_data', JSON.stringify(puzzleData));
            const goldEl = document.getElementById('gold-val');
            if (goldEl) goldEl.innerText = this.goldCoins;
} catch (e) {}
    }

    resetClassicProgress() {
        try {
            localStorage.removeItem('tile_game_classic');
        } catch (e) {}
        this.classicProgress = { level: 1, score: 0 };
    }

    resetTimeTrialProgress() {
        try {
            localStorage.removeItem('tile_game_timetrial');
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

    renderTutorialStep() {
        const slide = this.tutorialSlides[this.currentTutStep];
        document.getElementById('tut-avatar-img').src = slide.avatar;
        document.getElementById('tut-badge-name').innerText = slide.name;
        document.getElementById('tut-title').innerText = slide.title;
        document.getElementById('tut-body').innerText = slide.body;

        // Render Dots
        const dots = document.querySelectorAll('.tut-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === this.currentTutStep);
        });

        // Navigation Buttons
        const btnPrev = document.getElementById('btn-tut-prev');
        const btnNext = document.getElementById('btn-tut-next');

        if (this.currentTutStep === 0) {
            btnPrev.classList.add('hidden');
        } else {
            btnPrev.classList.remove('hidden');
        }

        if (this.currentTutStep === this.tutorialSlides.length - 1) {
            btnNext.innerText = 'ANLADIM, BAŞLA! 🎉';
        } else {
            btnNext.innerText = 'İLERİ ➡️';
        }
    }

    initUI() {
        this.updateMainMenuButtons();

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

        document.getElementById('btn-hud-home').addEventListener('click', () => {
            this.stopTimer();
            this.saveGameProgress();
            this.updateMainMenuButtons();
            document.getElementById('main-menu').classList.remove('hidden');
        });

        document.getElementById('btn-hud-settings').addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('btn-close-settings').addEventListener('click', () => {
            document.getElementById('modal-settings').classList.add('hidden');
        });

        document.getElementById('btn-save-settings').addEventListener('click', () => {
            this.saveSettings();
            document.getElementById('modal-settings').classList.add('hidden');
        });

        // Settings Controls
        const sliderVol = document.getElementById('slider-volume');
        sliderVol.addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            document.getElementById('vol-val-text').innerText = `${this.settings.volume}%`;
            this.sound.setVolume(this.settings.volume);
        });

        const btnVib = document.getElementById('btn-toggle-vib');
        btnVib.addEventListener('click', () => {
            this.settings.vibration = !this.settings.vibration;
            this.updateVibBtnUI();
            if (this.settings.vibration && navigator.vibrate) {
                navigator.vibrate(40);
            }
        });

        document.getElementById('btn-lang-tr').addEventListener('click', () => {
            this.settings.lang = 'tr';
            this.updateLanguageUI();
        });

        document.getElementById('btn-lang-en').addEventListener('click', () => {
            this.settings.lang = 'en';
            this.updateLanguageUI();
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

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.addEventListener('click', () => this.openChestBox());

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.addEventListener('click', () => {
            document.getElementById('modal-chest').classList.add('hidden');
            document.getElementById('victory-score').innerText = this.score;
            document.getElementById('modal-victory').classList.remove('hidden');
        });

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
        const dict = this.i18n[this.settings.lang];

        if (this.settings.vibration) {
            btn.classList.add('active');
            txt.innerText = dict.vibOn;
        } else {
            btn.classList.remove('active');
            txt.innerText = dict.vibOff;
        }
    }

    updateLanguageUI() {
        document.getElementById('btn-lang-tr').classList.toggle('active', this.settings.lang === 'tr');
        document.getElementById('btn-lang-en').classList.toggle('active', this.settings.lang === 'en');
        this.applyLanguage();
        this.updateMainMenuButtons();
    }

    applyLanguage() {
        const dict = this.i18n[this.settings.lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerText = dict[key];
            }
        });
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
        this.boardTiles = [];
        this.slotTiles = [];

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

        // Apply Random Dynamic Level Background Gradient
        const themeIndex = (this.level - 1) % this.bgThemes.length;
        document.getElementById('game-container').style.background = this.bgThemes[themeIndex];

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

        const boardEl = document.getElementById('board');
        const safeBoardW = (boardEl && boardEl.clientWidth > 200) ? boardEl.clientWidth : (window.innerWidth || 380);
        const safeBoardH = (boardEl && boardEl.clientHeight > 200) ? boardEl.clientHeight : ((window.innerHeight - 160) || 520);
        const positions = this.generateLayoutPositions(formationType, safeBoardW, safeBoardH);

        // EXACT USER PROGRESSION RULE:
        // Level 1 starts at EXACTLY 14 pairs (28 tiles).
        // Every 10 levels adds +2 pairs (+4 tiles), capping strictly at 32 pairs (64 tiles) at Level 90+.
        // Unlimited / Endless Levels!
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

        for (let i = 0; i < totalPairs; i++) {
            const activeTypesCount = Math.min(this.types.length, 4 + Math.floor((this.level - 1) / 10) * 2);
        const activeTypes = this.types.slice(0, activeTypesCount);
        const typeObj = activeTypes[i % activeTypes.length];
            pool.push(typeObj, typeObj);
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
                const dict = this.i18n[this.settings.lang];
                document.getElementById('defeat-icon').innerText = '⏰';
                document.getElementById('defeat-title').innerText = dict.defeatTitle;
                document.getElementById('defeat-desc').innerText = dict.defeatDesc;
                document.getElementById('modal-gameover').classList.remove('hidden');
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
        // STRICT 60% VISIBILITY CLICKABILITY RULE:
        // A tile is UNLOCKED & CLICKABLE if at least 60% of its surface is visible (coveredRatio <= 0.40).
        // It is locked ONLY if covered by more than 40% (coveredRatio > 0.40).
        const cardArea = this.cardW * this.cardH;

        for (let i = 0; i < this.boardTiles.length; i++) {
            const tile = this.boardTiles[i];
            if (tile.isInSlot) continue;

            let totalCoveredArea = 0;

            for (let j = 0; j < this.boardTiles.length; j++) {
                if (i === j) continue;
                const candidateAbove = this.boardTiles[j];
                if (candidateAbove.isInSlot) continue;

                // candidateAbove is visually ON TOP if it is on a higher layer OR higher z-index (index) on same layer
                const isAbove = (candidateAbove.layer > tile.layer) ||
                                (candidateAbove.layer === tile.layer && candidateAbove.index > tile.index);

                if (isAbove) {
                    const overlapW = Math.max(0, this.cardW - Math.abs(tile.x - candidateAbove.x));
                    const overlapH = Math.max(0, this.cardH - Math.abs(tile.y - candidateAbove.y));

                    if (overlapW > 0 && overlapH > 0) {
                        const overlapArea = overlapW * overlapH;
                        totalCoveredArea += overlapArea;
                    }
                }
            }

            const coveredRatio = Math.min(1.0, totalCoveredArea / cardArea);

            // STRICT 60% VISIBILITY RULE:
            // If at least 60% of tile surface is visible (coveredRatio <= 0.40), it is UNLOCKED & CLICKABLE!
            // It is locked ONLY if covered by more than 40% by upper tiles (coveredRatio > 0.40).
            const isLocked = coveredRatio > 0.40;

            tile.isLocked = isLocked;
            if (isLocked) {
                tile.element.classList.add('locked');
            } else {
                tile.element.classList.remove('locked');
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
        const dict = this.i18n[this.settings.lang];

        if (this.score < this.slotCost) {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(dict.noScoreSlot.replace('{cost}', this.slotCost));
            return;
        }

        this.score -= this.slotCost;
        document.getElementById('score-val').innerText = this.score;

        // Double the cost for next use in current level (%100 Increase!)
        this.slotCost *= 2;
        this.updateBoosterBadgesUI();

        // Reveal Floating Emergency Slot Holder directly above Center Slot (Index 2)
        this.hasTemporaryExtraSlot = true;
        this.extraSlotWasUsed = false;
        this.maxSlotCapacity = 6;
        document.getElementById('floating-extra-slot').classList.remove('hidden');

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

        // Double the cost for next use in current level (5000 -> 10000 -> 20000...)
        this.shuffleCost *= 2;
        this.updateBoosterBadgesUI();

        this.sound.playBoosterChime();
        this.triggerVibration();

        // Collect all remaining active board tiles
        const remainingTiles = this.boardTiles.filter(t => !t.isInSlot);
        if (remainingTiles.length === 0) return;

        // Extract type data & shuffle
        const tileTypesData = remainingTiles.map(t => ({
            type: t.type,
            bg: t.bg,
            imgSrc: t.imgSrc,
            svg: t.svg,
            name: t.name
        }));

        this.shuffleArray(tileTypesData);

        // Re-assign shuffled types to existing tile elements with spin animation
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
            iconContainer.innerHTML = '';

            if (tile.imgSrc) {
                const imgEl = document.createElement('img');
                imgEl.className = 'tile-img';
                imgEl.src = tile.imgSrc;
                imgEl.alt = tile.name;
                iconContainer.appendChild(imgEl);
            } else if (tile.svg) {
                iconContainer.innerHTML = tile.svg;
            }

            // Spin animation effect
            tile.element.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            tile.element.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                tile.element.style.transform = '';
            }, 320);
        }

        this.updateLockStates();

        const boardEl = document.getElementById('board');
        const rect = boardEl.getBoundingClientRect();
        this.fx.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);

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
        document.getElementById('toast-text').innerText = msg;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2200);
    }

    onTileClick(tile) {
        if (tile.isInSlot) return;

        this.clearHintHighlights();

        if (tile.isLocked) {
            this.sound.playLockThud();
            this.triggerVibration();
            tile.element.classList.add('shaking');
            setTimeout(() => tile.element.classList.remove('shaking'), 180);
            return;
        }

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
        for (let i = 0; i < this.slotTiles.length; i++) {
            if (this.slotTiles[i].type === tile.type) {
                insertIdx = i + 1;
            }
        }

        this.slotTiles.splice(insertIdx, 0, tile);

        const slotLayer = document.getElementById('slot-tiles-layer');
        slotLayer.appendChild(tile.element);

        this.updateLockStates();
        this.rearrangeSlotTiles();
        this.checkForMatches();
        setTimeout(() => this.checkDeadlockAndAutoShuffle(), 300);
    }

    rearrangeSlotTiles() {
        const total = this.slotTiles.length;
        if (total === 0) return;

        const trayW = 390;
        const standard5Capacity = 5;
        const spacing = (trayW - 20) / standard5Capacity;
        const startX = 10 + (spacing - this.cardW) / 2;

        for (let i = 0; i < total; i++) {
            const tile = this.slotTiles[i];

            if (i < 5) {
                // Bottom Tray 5 Standard Slots (Always 100% Standard Full Size!)
                const targetX = startX + (i * spacing);
                const targetY = 10;

                tile.element.style.transition = 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
                tile.element.style.left = `${targetX}px`;
                tile.element.style.top = `${targetY}px`;
                tile.element.style.zIndex = 200 + i;
            } else {
                // 6th Emergency Tile positioned EXACTLY CENTERED DIRECTLY ABOVE CENTER SLOT #3 (Index 2)!
                const centerX = startX + (2 * spacing);
                const centerY = 10 - 105;

                this.extraSlotWasUsed = true;

                tile.element.style.transition = 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
                tile.element.style.left = `${centerX}px`;
                tile.element.style.top = `${centerY}px`;
                tile.element.style.zIndex = 600;
            }
        }
    }

    checkForMatches() {
        const group = {};
        for (let i = 0; i < this.slotTiles.length; i++) {
            const tile = this.slotTiles[i];
            if (tile.isMatching) continue;

            if (!group[tile.type]) group[tile.type] = [];
            group[tile.type].push(tile);

            if (group[tile.type].length >= 2) {
                this.processPairMatch(group[tile.type][0], group[tile.type][1]);
                return;
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
                }
            }, 250);
        }
    }

    
    // =========================================================
    // DEADLOCK DETECTION & AUTO-SHUFFLE SYSTEM
    // =========================================================

    checkDeadlockAndAutoShuffle() {
        if (this.boardTiles.length === 0) return false;

        const clickableTiles = this.boardTiles.filter(t => !t.isLocked && !t.isInSlot);

        // Check if any 2 clickable tiles match each other
        for (let i = 0; i < clickableTiles.length; i++) {
            for (let j = i + 1; j < clickableTiles.length; j++) {
                if (clickableTiles[i].type.id === clickableTiles[j].type.id) {
                    return false; // Valid move exists!
                }
            }
        }

        // Check if any clickable tile matches a tile in slot tray
        for (const bTile of clickableTiles) {
            for (const sTile of this.slotTiles) {
                if (bTile.type.id === sTile.type.id) {
                    return false; // Valid move exists!
                }
            }
        }

        // DEADLOCK DETECTED!
        this.showToast('⚡ HAMLE KALMADI! Tahta Otomatik Karıştırılıyor...');
        this.sound.playBoosterChime();
        this.fx.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 40);

        this.autoShuffleBoard();
        return true;
    }

    autoShuffleBoard() {
        if (this.boardTiles.length <= 1) return;

        const types = this.boardTiles.map(t => t.type);
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = types[i];
            types[i] = types[j];
            types[j] = temp;
        }

        this.boardTiles.forEach((tile, idx) => {
            tile.type = types[idx];
            const img = tile.element.querySelector('.tile-character');
            if (img) img.src = tile.type.imgSrc;
            const bg = tile.element.querySelector('.tile-face');
            if (bg) bg.style.background = tile.type.bg || '#ffffff';
        });

        this.updateBoardTileStates();
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
            this.showComboBadge(`🔥 ${this.comboCount}x COMBO! (+${points})`);
        }

        this.sound.playMatchSound(this.comboCount);
        this.fx.spawnBurst(midX, midY);

        setTimeout(() => {
            if (tileA.element.parentElement) tileA.element.parentElement.removeChild(tileA.element);
            if (tileB.element.parentElement) tileB.element.parentElement.removeChild(tileB.element);

            // LIFECYCLE RULE: ONLY DISAPPEAR ONCE A TILE ENTERED SLOT 6 AND HAS BEEN CLEARED!
            if (this.hasTemporaryExtraSlot && this.extraSlotWasUsed && this.slotTiles.length <= 5) {
                this.maxSlotCapacity = 5;
                this.hasTemporaryExtraSlot = false;
                this.extraSlotWasUsed = false;
                document.getElementById('floating-extra-slot').classList.add('hidden');
            }

            this.rearrangeSlotTiles();

            const remainingBoardTiles = this.boardTiles.filter(t => !t.isInSlot);
            const activeDomTiles = document.querySelectorAll('#board .tile');

            if ((this.boardTiles.length === 0 || remainingBoardTiles.length === 0 || activeDomTiles.length === 0) && this.slotTiles.length === 0) {
                this.stopTimer();
                this.sound.playVictorySound();
                this.fx.spawnConfetti();

                // Save next unlocked level for active mode
                this.saveGameProgress();

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
        // Normal Sandık Yıldız Oranları: %55 1⭐, %30 2⭐, %10 3⭐, %7 4⭐, %3 5⭐
        const r = Math.random() * 105;
        if (r < 55) return 1;
        if (r < 85) return 2;
        if (r < 95) return 3;
        if (r < 102) return 4;
        return 5;
    }

    rollBonusChestStarRating() {
        const r = Math.random() * 100;
        if (r < 50) return 3;       // 50% -> 3⭐
        if (r < 85) return 4;       // 35% -> 4⭐
        return 5;                    // 15% -> 5⭐
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

    triggerChestRewardModal(starLevel, isBonus) {
        const starsText = '⭐️'.repeat(starLevel);
        const starDisp = document.getElementById('chest-star-display');
        if (starDisp) starDisp.innerText = starsText;

        const titleEl = document.getElementById('chest-modal-title');
        if (titleEl) {
            if (isBonus) {
                titleEl.innerText = `🏆 BONUS ${starLevel} YILDIZLI SANDIK! 🎁`;
            } else {
                titleEl.innerText = `${starLevel} YILDIZLI SANDIK! 🎁`;
            }
        }

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }

    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        if (reward.gold > 0) {
            this.goldCoins += reward.gold;
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        if (reward.pieces > 0) {
            for (let i = 0; i < reward.pieces; i++) {
                const addedPiece = this.awardRandomMissingPuzzlePiece();
                if (addedPiece && rewardListEl) {
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item';
                    item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${addedPiece.puzzleName} (#${addedPiece.pieceIndex + 1})</span>`;
                    rewardListEl.appendChild(item);
                }
            }
        }

        const goldEl = document.getElementById('gold-val');
        if (goldEl) goldEl.innerText = this.goldCoins;

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.addEventListener('click', () => this.openChestBox());
        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '🎁';

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');

        this.saveGameProgress();
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
            this.showToast('Yetersiz Altın! (100 Altın Gerekli 🪙)');
            return;
        }

        const added = this.awardRandomMissingPuzzlePiece();
        if (!added) {
            this.showToast('Tüm Bulmaca Parçaları Zaten Toplandı! 🏆');
            return;
        }

        this.goldCoins -= 100;
        const goldEl = document.getElementById('gold-val');
        if (goldEl) goldEl.innerText = this.goldCoins;

        this.sound.playBoosterChime();
        this.showToast(`🎉 1 Parça Alındı: ${added.puzzleName} (#${added.pieceIndex + 1})!`);
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
        const tabsContainer = document.getElementById('puzzle-selector-tabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = '';
            for (const puzzle of this.puzzlesCatalog) {
                const placed = this.placedPuzzlePieces[puzzle.id] || [];
                const isComplete = placed.length === 12;

                const btn = document.createElement('button');
                btn.className = `puzzle-tab-btn ${puzzle.id === this.activePuzzleId ? 'active' : ''}`;
                btn.innerHTML = `<span>${puzzle.name}</span> <span>${isComplete ? '🏆' : `${placed.length}/12`}</span>`;
                btn.addEventListener('click', () => {
                    this.activePuzzleId = puzzle.id;
                    this.renderPuzzleGalleryModal();
                });
                tabsContainer.appendChild(btn);
            }
        }

        const activeIdx = this.puzzlesCatalog.findIndex(p => p.id === this.activePuzzleId);
        const activePuzzle = this.puzzlesCatalog[activeIdx >= 0 ? activeIdx : 0] || this.puzzlesCatalog[0];
        
        const titleEl = document.getElementById('journal-picture-title');
        if (titleEl) titleEl.innerText = activePuzzle.name;

        const pageNumEl = document.getElementById('journal-page-num');
        if (pageNumEl) pageNumEl.innerText = `Sayfa ${activeIdx + 1} / ${this.puzzlesCatalog.length}`;
        const placedPieces = this.placedPuzzlePieces[activePuzzle.id] || [];
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
        if (wrapperEl) {
            wrapperEl.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
            wrapperEl.style.backgroundSize = 'cover';
            wrapperEl.style.backgroundPosition = 'center';
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
                    slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;
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
                    pieceEl.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;

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
                            this.showToast(`${puzzleDef.name} sekmesine geçildi! Tekrar dokunarak yerleştirebilirsiniz.`);
                        }
                    });

                    trayEl.appendChild(pieceEl);
                }
            }
        }
    }

    handlePlacePuzzlePiece(invId, puzzleId, pieceIndex, targetSlotIndex) {
        if (puzzleId !== this.activePuzzleId) {
            this.showToast('Lütfen parçayı ait olduğu karakter sekmesine yerleştirin!');
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

            this.showToast(`❌ Yanlış Yuva! Bu parça #${pieceIndex + 1} numaralı yuvaya aittir. Envantere geri döndü.`);
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

}

// Initialize Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new TileMatchingGame();
});

// Prevent native context menu & long-press menus globally for Play Store / Native App mode
window.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
