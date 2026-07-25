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
        this.types = [
            { id: 'fox', name: '4-Kuyruklu Tilki', bg: '#fff7ed', imgSrc: 'images/fox.jpg' },
            { id: 'cat', name: 'Kozmik Kedi', bg: '#faf5ff', imgSrc: 'images/cat.jpg' },
            { id: 'panda', name: 'Sevimli Panda', bg: '#f0fdf4', imgSrc: 'images/panda.jpg' },
            { id: 'dragon', name: 'Deniz Ejderhası', bg: '#f0f9ff', imgSrc: 'images/dragon.jpg' },
            { id: 'shiba', name: 'Shiba Inu', bg: '#fefce8', imgSrc: 'images/shiba.jpg' },
            { id: 'unicorn', name: 'Büyülü Tekboynuz', bg: '#fae8ff', imgSrc: 'images/unicorn.jpg' },
            { id: 'lion', name: 'Kral Aslan', bg: '#fffbebf', imgSrc: 'images/lion.jpg' },
            { id: 'bunny', name: 'Sihirli Tavşan', bg: '#fdf2f8', imgSrc: 'images/bunny.jpg' },
            { id: 'owl', name: 'Bilge Baykuş', bg: '#f1f5f9', imgSrc: 'images/owl.jpg' },
            { id: 'red_panda', name: 'Kızıl Panda', bg: '#fff2e6', imgSrc: 'images/red_panda.jpg' },
            { id: 'frog', name: 'Prens Kurbağa', bg: '#ecfdf5', imgSrc: 'images/frog.jpg' },
            { id: 'penguin', name: 'Kutup Pengueni', bg: '#f0f9ff', imgSrc: 'images/penguin.jpg' },
            { id: 'koala', name: 'Okaliptüs Koala', bg: '#f8fafc', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="20" cy="30" r="16" fill="#94a3b8"/><circle cx="80" cy="30" r="16" fill="#94a3b8"/><circle cx="50" cy="55" r="32" fill="#cbd5e1"/><circle cx="38" cy="48" r="4" fill="#0f172a"/><circle cx="62" cy="48" r="4" fill="#0f172a"/><ellipse cx="50" cy="62" rx="9" ry="12" fill="#1e293b"/></svg>` },
            { id: 'giraffe', name: 'Benekli Zürafa', bg: '#fefce8', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><path d="M42 12 L46 32 M58 12 L54 32" stroke="#d97706" stroke-width="4"/><circle cx="42" cy="12" r="5" fill="#d97706"/><circle cx="58" cy="12" r="5" fill="#d97706"/><ellipse cx="50" cy="52" rx="28" ry="34" fill="#f59e0b"/><ellipse cx="50" cy="64" rx="18" ry="14" fill="#fef08a"/><circle cx="40" cy="46" r="4" fill="#451a03"/><circle cx="60" cy="46" r="4" fill="#451a03"/><ellipse cx="50" cy="60" rx="6" ry="4" fill="#78350f"/></svg>` },
            { id: 'monkey', name: 'Neşeli Maymun', bg: '#fff7ed', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="18" cy="50" r="14" fill="#b45309"/><circle cx="82" cy="50" r="14" fill="#b45309"/><circle cx="50" cy="50" r="32" fill="#d97706"/><ellipse cx="50" cy="56" rx="22" ry="18" fill="#ffedd5"/><circle cx="38" cy="44" r="4" fill="#451a03"/><circle cx="62" cy="44" r="4" fill="#451a03"/><path d="M 42 62 Q 50 68 58 62" stroke="#78350f" stroke-width="3" fill="none"/></svg>` },
            { id: 'elephant', name: 'Minik Fil', bg: '#f1f5f9', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="18" cy="46" r="18" fill="#94a3b8"/><circle cx="82" cy="46" r="18" fill="#94a3b8"/><circle cx="50" cy="50" r="30" fill="#cbd5e1"/><path d="M 46 54 Q 50 78 56 70" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="38" cy="44" r="4" fill="#0f172a"/><circle cx="62" cy="44" r="4" fill="#0f172a"/></svg>` },
            { id: 'tiger', name: 'Çizgili Kaplan', bg: '#fff7ed', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><polygon points="20,20 40,40 16,50" fill="#ea580c"/><polygon points="80,20 60,40 84,50" fill="#ea580c"/><circle cx="50" cy="52" r="32" fill="#f97316"/><path d="M 30 52 Q 50 40 70 52 Q 70 76 50 82 Q 30 76 30 52 Z" fill="#ffffff"/><circle cx="38" cy="46" r="4" fill="#451a03"/><circle cx="62" cy="46" r="4" fill="#451a03"/><polygon points="50,56 45,62 55,62" fill="#451a03"/></svg>` },
            { id: 'wolf', name: 'Gümüş Kurt', bg: '#f8fafc', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><polygon points="20,18 42,40 16,50" fill="#64748b"/><polygon points="80,18 58,40 84,50" fill="#64748b"/><circle cx="50" cy="52" r="32" fill="#94a3b8"/><polygon points="50,40 32,70 68,70" fill="#ffffff"/><circle cx="38" cy="46" r="4" fill="#0f172a"/><circle cx="62" cy="46" r="4" fill="#0f172a"/><ellipse cx="50" cy="58" rx="6" ry="4" fill="#0f172a"/></svg>` },
            { id: 'bear', name: 'Boz Ayı', bg: '#fff7ed', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="24" cy="24" r="14" fill="#78350f"/><circle cx="76" cy="24" r="14" fill="#78350f"/><circle cx="50" cy="52" r="34" fill="#92400e"/><ellipse cx="50" cy="62" rx="18" ry="14" fill="#fef3c7"/><circle cx="38" cy="46" r="4" fill="#451a03"/><circle cx="62" cy="46" r="4" fill="#451a03"/><ellipse cx="50" cy="58" rx="7" ry="5" fill="#451a03"/></svg>` },
            { id: 'deer', name: 'Orman Geyiği', bg: '#fefce8', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><path d="M 30 10 L 40 30 M 70 10 L 60 30" stroke="#92400e" stroke-width="4"/><circle cx="50" cy="52" r="30" fill="#b45309"/><ellipse cx="50" cy="64" rx="16" ry="12" fill="#fef3c7"/><circle cx="38" cy="44" r="4" fill="#451a03"/><circle cx="62" cy="44" r="4" fill="#451a03"/><ellipse cx="50" cy="60" rx="5" ry="4" fill="#451a03"/></svg>` },
            { id: 'hippo', name: 'Tombul Suaygırı', bg: '#fae8ff', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="26" cy="28" r="10" fill="#c084fc"/><circle cx="74" cy="28" r="10" fill="#c084fc"/><circle cx="50" cy="50" r="32" fill="#e879f9"/><ellipse cx="50" cy="64" rx="24" ry="18" fill="#f0abfc"/><circle cx="38" cy="44" r="4" fill="#4c1d95"/><circle cx="62" cy="44" r="4" fill="#4c1d95"/><circle cx="42" cy="60" r="3" fill="#4c1d95"/><circle cx="58" cy="60" r="3" fill="#4c1d95"/></svg>` },
            { id: 'parrot', name: 'Renkli Papağan', bg: '#f0fdf4', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="50" cy="50" r="32" fill="#22c55e"/><path d="M 48 50 Q 72 58 48 70" fill="#f59e0b"/><circle cx="40" cy="42" r="4" fill="#0f172a"/><circle cx="41" cy="41" r="1.5" fill="#ffffff"/></svg>` }
        ];

        // Background Themes
        this.bgThemes = [
            'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0b0f19 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #064e3b 0%, #022c22 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #4c1d95 0%, #2e1065 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #831843 0%, #500724 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #134e4a 0%, #042f2e 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #7c2d12 0%, #451a03 80%, #060913 100%)'
        ];

        // 10 Rich Symmetrical Mahjong Formations Pool!
        this.formations = [
            'ROYAL_PYRAMID', 
            'CASTLE', 
            'HOURGLASS', 
            'SHIELD', 
            'FLOWER', 
            'HELIX', 
            'HEART', 
            'TWIN_PEAKS', 
            'STAR', 
            'DIAMOND'
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
        let formationType = this.formations[(this.level - 1) % this.formations.length];

        // Reset Combo & Hints
        this.comboCount = 1;
        this.hideComboBadge();
        this.clearHintHighlights();

        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';
        document.getElementById('slot-tiles-layer').innerHTML = '';

        this.boardTiles = [];
        this.slotTiles = [];

        const activeTypesCount = (this.level <= 100) 
            ? Math.min(this.types.length, 4 + Math.floor((this.level - 1) / 10) * 2)
            : this.types.length;
            
        const activeTypes = this.types.slice(0, activeTypesCount);

        const totalPairs = Math.min(26, 8 + Math.floor((this.level - 1) / 5) * 2);
        const pool = [];

        for (let i = 0; i < totalPairs; i++) {
            const typeObj = activeTypes[i % activeTypes.length];
            pool.push(typeObj, typeObj); // Pair
        }

        this.shuffleArray(pool);

        const safeBoardW = (boardEl && boardEl.clientWidth > 100) ? boardEl.clientWidth : 380;
        const safeBoardH = (boardEl && boardEl.clientHeight > 100) ? boardEl.clientHeight : 520;
        const positions = this.generateLayoutPositions(formationType, pool.length, safeBoardW, safeBoardH);

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

        /* GamoVation Style Mobile Stack Tile Pairing Game Engine
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
        this.types = [
            { id: 'fox', name: '4-Kuyruklu Tilki', bg: '#fff7ed', imgSrc: 'images/fox.jpg' },
            { id: 'cat', name: 'Kozmik Kedi', bg: '#faf5ff', imgSrc: 'images/cat.jpg' },
            { id: 'panda', name: 'Sevimli Panda', bg: '#f0fdf4', imgSrc: 'images/panda.jpg' },
            { id: 'dragon', name: 'Deniz Ejderhası', bg: '#f0f9ff', imgSrc: 'images/dragon.jpg' },
            { id: 'shiba', name: 'Shiba Inu', bg: '#fefce8', imgSrc: 'images/shiba.jpg' },
            { id: 'unicorn', name: 'Büyülü Tekboynuz', bg: '#fae8ff', imgSrc: 'images/unicorn.jpg' },
            { id: 'lion', name: 'Kral Aslan', bg: '#fffbebf', imgSrc: 'images/lion.jpg' },
            { id: 'bunny', name: 'Sihirli Tavşan', bg: '#fdf2f8', imgSrc: 'images/bunny.jpg' },
            { id: 'owl', name: 'Bilge Baykuş', bg: '#f1f5f9', imgSrc: 'images/owl.jpg' },
            { id: 'red_panda', name: 'Kızıl Panda', bg: '#fff2e6', imgSrc: 'images/red_panda.jpg' },
            { id: 'frog', name: 'Prens Kurbağa', bg: '#ecfdf5', imgSrc: 'images/frog.jpg' },
            { id: 'penguin', name: 'Kutup Pengueni', bg: '#f0f9ff', imgSrc: 'images/penguin.jpg' },
            { id: 'koala', name: 'Okaliptüs Koala', bg: '#f8fafc', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="20" cy="30" r="16" fill="#94a3b8"/><circle cx="80" cy="30" r="16" fill="#94a3b8"/><circle cx="50" cy="55" r="32" fill="#cbd5e1"/><circle cx="38" cy="48" r="4" fill="#0f172a"/><circle cx="62" cy="48" r="4" fill="#0f172a"/><ellipse cx="50" cy="62" rx="9" ry="12" fill="#1e293b"/></svg>` },
            { id: 'giraffe', name: 'Benekli Zürafa', bg: '#fefce8', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><path d="M42 12 L46 32 M58 12 L54 32" stroke="#d97706" stroke-width="4"/><circle cx="42" cy="12" r="5" fill="#d97706"/><circle cx="58" cy="12" r="5" fill="#d97706"/><ellipse cx="50" cy="52" rx="28" ry="34" fill="#f59e0b"/><ellipse cx="50" cy="64" rx="18" ry="14" fill="#fef08a"/><circle cx="40" cy="46" r="4" fill="#451a03"/><circle cx="60" cy="46" r="4" fill="#451a03"/><ellipse cx="50" cy="60" rx="6" ry="4" fill="#78350f"/></svg>` },
            { id: 'monkey', name: 'Neşeli Maymun', bg: '#fff7ed', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="18" cy="50" r="14" fill="#b45309"/><circle cx="82" cy="50" r="14" fill="#b45309"/><circle cx="50" cy="50" r="32" fill="#d97706"/><ellipse cx="50" cy="56" rx="22" ry="18" fill="#ffedd5"/><circle cx="38" cy="44" r="4" fill="#451a03"/><circle cx="62" cy="44" r="4" fill="#451a03"/><path d="M 42 62 Q 50 68 58 62" stroke="#78350f" stroke-width="3" fill="none"/></svg>` },
            { id: 'elephant', name: 'Minik Fil', bg: '#f1f5f9', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="18" cy="46" r="18" fill="#94a3b8"/><circle cx="82" cy="46" r="18" fill="#94a3b8"/><circle cx="50" cy="50" r="30" fill="#cbd5e1"/><path d="M 46 54 Q 50 78 56 70" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="38" cy="44" r="4" fill="#0f172a"/><circle cx="62" cy="44" r="4" fill="#0f172a"/></svg>` },
            { id: 'tiger', name: 'Çizgili Kaplan', bg: '#fff7ed', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><polygon points="20,20 40,40 16,50" fill="#ea580c"/><polygon points="80,20 60,40 84,50" fill="#ea580c"/><circle cx="50" cy="52" r="32" fill="#f97316"/><path d="M 30 52 Q 50 40 70 52 Q 70 76 50 82 Q 30 76 30 52 Z" fill="#ffffff"/><circle cx="38" cy="46" r="4" fill="#451a03"/><circle cx="62" cy="46" r="4" fill="#451a03"/><polygon points="50,56 45,62 55,62" fill="#451a03"/></svg>` },
            { id: 'wolf', name: 'Gümüş Kurt', bg: '#f8fafc', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><polygon points="20,18 42,40 16,50" fill="#64748b"/><polygon points="80,18 58,40 84,50" fill="#64748b"/><circle cx="50" cy="52" r="32" fill="#94a3b8"/><polygon points="50,40 32,70 68,70" fill="#ffffff"/><circle cx="38" cy="46" r="4" fill="#0f172a"/><circle cx="62" cy="46" r="4" fill="#0f172a"/><ellipse cx="50" cy="58" rx="6" ry="4" fill="#0f172a"/></svg>` },
            { id: 'bear', name: 'Boz Ayı', bg: '#fff7ed', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="24" cy="24" r="14" fill="#78350f"/><circle cx="76" cy="24" r="14" fill="#78350f"/><circle cx="50" cy="52" r="34" fill="#92400e"/><ellipse cx="50" cy="62" rx="18" ry="14" fill="#fef3c7"/><circle cx="38" cy="46" r="4" fill="#451a03"/><circle cx="62" cy="46" r="4" fill="#451a03"/><ellipse cx="50" cy="58" rx="7" ry="5" fill="#451a03"/></svg>` },
            { id: 'deer', name: 'Orman Geyiği', bg: '#fefce8', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><path d="M 30 10 L 40 30 M 70 10 L 60 30" stroke="#92400e" stroke-width="4"/><circle cx="50" cy="52" r="30" fill="#b45309"/><ellipse cx="50" cy="64" rx="16" ry="12" fill="#fef3c7"/><circle cx="38" cy="44" r="4" fill="#451a03"/><circle cx="62" cy="44" r="4" fill="#451a03"/><ellipse cx="50" cy="60" rx="5" ry="4" fill="#451a03"/></svg>` },
            { id: 'hippo', name: 'Tombul Suaygırı', bg: '#fae8ff', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="26" cy="28" r="10" fill="#c084fc"/><circle cx="74" cy="28" r="10" fill="#c084fc"/><circle cx="50" cy="50" r="32" fill="#e879f9"/><ellipse cx="50" cy="64" rx="24" ry="18" fill="#f0abfc"/><circle cx="38" cy="44" r="4" fill="#4c1d95"/><circle cx="62" cy="44" r="4" fill="#4c1d95"/><circle cx="42" cy="60" r="3" fill="#4c1d95"/><circle cx="58" cy="60" r="3" fill="#4c1d95"/></svg>` },
            { id: 'parrot', name: 'Renkli Papağan', bg: '#f0fdf4', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><circle cx="50" cy="50" r="32" fill="#22c55e"/><path d="M 48 50 Q 72 58 48 70" fill="#f59e0b"/><circle cx="40" cy="42" r="4" fill="#0f172a"/><circle cx="41" cy="41" r="1.5" fill="#ffffff"/></svg>` }
        ];

        // Background Themes
        this.bgThemes = [
            'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0b0f19 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #064e3b 0%, #022c22 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #4c1d95 0%, #2e1065 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #831843 0%, #500724 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #134e4a 0%, #042f2e 80%, #060913 100%)',
            'radial-gradient(circle at 50% 20%, #7c2d12 0%, #451a03 80%, #060913 100%)'
        ];

        // 10 Rich Symmetrical Mahjong Formations Pool!
        this.formations = [
            'ROYAL_PYRAMID', 
            'CASTLE', 
            'HOURGLASS', 
            'SHIELD', 
            'FLOWER', 
            'HELIX', 
            'HEART', 
            'TWIN_PEAKS', 
            'STAR', 
            'DIAMOND'
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

}

}
}

// Initialize Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new TileMatchingGame();
});
