/**
 * Tile Club / GamoVation Style Mobile Stack Tile Pairing Game Engine
 * Features:
 * - Dynamic Dual-Language Game Title (TR: "EŞLE GİTSİN! 3D" | EN: "TILE MATCH 3D").
 * - Cute Playful Game Font ('Fredoka').
 * - INFINITE ENDLESS CAMPAIGN (Level 100+ Endless Mode).
 * - Geometric 5-Pointed STAR Layout Formation for Level 10, 20, 30...
 * - Settings Controller: Sound Volume, Vibration Toggle, Language Selector (TR/EN).
 * - Smart Hint System (300 Score Cost).
 * - Multiplier Combo System (Katlanan Puan).
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
        this.cardW = 74;
        this.cardH = 94;
        this.maxSlotCapacity = 5;

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
            { id: 'deer', name: 'Orman Geyiği', bg: '#fefce8', svg: `<svg viewBox="0 0 100 100" class="svg-icon"><path d="M 30 10 L 40 30 M 70 10 L 60 30" stroke="#92400e" stroke-width="4"/><circle cx="50" cy="52" r="30" fill="#b45309"/><ellipse cx="50" cy="64" rx="16" ry="12" fill="#fef3c7"/><circle cx="38" cy="46" r="4" fill="#451a03"/><circle cx="62" cy="46" r="4" fill="#451a03"/><ellipse cx="50" cy="60" rx="5" ry="4" fill="#451a03"/></svg>` },
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

        this.formations = ['HEART', 'CIRCLE', 'DIAMOND', 'PYRAMID', 'BUTTERFLY'];

        this.level = 1;
        this.score = 0;

        // Settings State
        this.settings = {
            volume: 80,
            vibration: true,
            lang: 'tr'
        };

        // i18n Translations (With Dual-Language Game Title Localization!)
        this.i18n = {
            tr: {
                gameTitle: 'EŞLE GİTSİN! 3D',
                play: 'OYNA',
                settings: 'AYARLAR',
                settingsTitle: '⚙️ AYARLAR',
                volLabel: '🔊 Ses Düzeyi',
                vibLabel: '📳 Titreşim',
                langLabel: '🌐 Dil Desteği',
                saveBtn: 'KAYDET VE KAPAT',
                levelLabel: 'SEVİYE',
                hintLabel: 'İPUCU',
                scoreLabel: 'SKOR',
                victoryTitle: 'TEBRİKLER!',
                victoryDesc: 'Bölümdeki tüm kartları başarıyla eşleştirdiniz!',
                nextLevelBtn: 'SONRAKİ BÖLÜM',
                defeatTitle: 'SLOT DOLDU!',
                defeatDesc: 'Tepside boş alan kalmadı ve eşleşen kart bulunamadı.',
                retryBtn: 'TEKRAR DENE',
                vibOn: 'AÇIK',
                vibOff: 'KAPALI',
                noScore: 'Yetersiz Skor! (300 Puan Gerekli)',
                noHint: 'Şu an açık eşleşen kart bulunamadı!',
                menuSubtitle: 'Eşleme ve Zeka Macerası'
            },
            en: {
                gameTitle: 'TILE MATCH 3D',
                play: 'PLAY',
                settings: 'SETTINGS',
                settingsTitle: '⚙️ SETTINGS',
                volLabel: '🔊 Sound Volume',
                vibLabel: '📳 Vibration',
                langLabel: '🌐 Language',
                saveBtn: 'SAVE & CLOSE',
                levelLabel: 'LEVEL',
                hintLabel: 'HINT',
                scoreLabel: 'SCORE',
                victoryTitle: 'VICTORY!',
                victoryDesc: 'You matched all tiles on the board!',
                nextLevelBtn: 'NEXT LEVEL',
                defeatTitle: 'SLOT FULL!',
                defeatDesc: 'No empty slot available and no pairs found.',
                retryBtn: 'TRY AGAIN',
                vibOn: 'ON',
                vibOff: 'OFF',
                noScore: 'Not Enough Score! (300 Required)',
                noHint: 'No matching unlocked tiles available!',
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
        this.initUI();
    }

    initUI() {
        // Main Menu Buttons
        document.getElementById('btn-menu-play').addEventListener('click', () => {
            document.getElementById('main-menu').classList.add('hidden');
            this.startLevel(1);
        });

        document.getElementById('btn-menu-settings').addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('btn-hud-home').addEventListener('click', () => {
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

        // Hint & Modals
        document.getElementById('btn-hint').addEventListener('click', () => this.useSmartHint());

        document.getElementById('btn-next-level').addEventListener('click', () => {
            document.getElementById('modal-victory').classList.add('hidden');
            this.startLevel(this.level + 1);
        });

        document.getElementById('btn-retry').addEventListener('click', () => {
            document.getElementById('modal-gameover').classList.add('hidden');
            this.startLevel(this.level);
        });

        this.applyLanguage();
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

    startLevel(lvl) {
        this.level = lvl;
        document.getElementById('level-num').innerText = this.level;
        document.getElementById('score-val').innerText = this.score;

        // Apply Random Dynamic Level Background Gradient
        const themeIndex = (this.level - 1) % this.bgThemes.length;
        document.getElementById('game-container').style.background = this.bgThemes[themeIndex];

        // SPECIAL STAR FORMATION ON EVERY 10th LEVEL (10, 20, 30, 40...)
        let formationType = this.formations[(this.level - 1) % this.formations.length];
        if (this.level % 10 === 0) {
            formationType = 'STAR';
        }

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

        const positions = this.generateLayoutPositions(formationType, pool.length, boardEl.clientWidth, boardEl.clientHeight);

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

    generateLayoutPositions(formationType, totalCount, boardW, boardH) {
        const positions = [];
        const centerX = boardW / 2 - this.cardW / 2;
        const centerY = boardH / 2 - this.cardH / 2 - 10;

        const stepX = 76;
        const stepY = 96;

        if (formationType === 'STAR') {
            const numPoints = 10;
            const starCoords = [];

            for (let k = 0; k < numPoints; k++) {
                const angle = -Math.PI / 2 + k * (Math.PI / 5);
                const r = (k % 2 === 0) ? 135 : 70;
                starCoords.push({
                    x: centerX + Math.cos(angle) * r,
                    y: centerY + Math.sin(angle) * r
                });
            }

            const tilesPerEdge = Math.max(1, Math.floor((totalCount - 4) / 10));
            let placed = 0;

            for (let k = 0; k < numPoints; k++) {
                const p1 = starCoords[k];
                const p2 = starCoords[(k + 1) % numPoints];

                for (let t = 0; t < tilesPerEdge; t++) {
                    if (placed >= totalCount) break;
                    const alpha = t / tilesPerEdge;
                    const px = p1.x + alpha * (p2.x - p1.x);
                    const py = p1.y + alpha * (p2.y - p1.y);

                    positions.push({ x: px, y: py, layer: 0 });
                    placed++;
                }
                if (placed >= totalCount) break;
            }

            let stackLayer = 1;
            while (placed < totalCount) {
                const layerOffset = stackLayer * -10;
                const hubs = [
                    { x: centerX - 30 + layerOffset, y: centerY - 35 + layerOffset },
                    { x: centerX + 30 + layerOffset, y: centerY - 35 + layerOffset },
                    { x: centerX - 30 + layerOffset, y: centerY + 35 + layerOffset },
                    { x: centerX + 30 + layerOffset, y: centerY + 35 + layerOffset }
                ];

                for (const hub of hubs) {
                    if (placed >= totalCount) break;
                    positions.push({ x: hub.x, y: hub.y, layer: stackLayer });
                    placed++;
                }
                stackLayer++;
            }
        } else if (formationType === 'HEART') {
            const layer0Count = Math.min(totalCount, 16);
            for (let i = 0; i < totalCount; i++) {
                const layer = Math.floor(i / layer0Count);
                const t = (i % layer0Count) * (Math.PI * 2 / layer0Count);
                
                const scale = (layer === 0) ? 9.2 : 5.5;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

                const posX = centerX + hx * scale + (layer * -6);
                const posY = centerY + hy * scale + (layer * -12);

                positions.push({ x: posX, y: posY, layer: layer });
            }
        } else if (formationType === 'CIRCLE') {
            for (let i = 0; i < totalCount; i++) {
                const layer = Math.floor(i / 12);
                const radius = (layer === 0) ? 130 : 65;
                const countInRing = (layer === 0) ? 12 : 6;
                const angle = (i % countInRing) * (Math.PI * 2 / countInRing);

                const posX = centerX + Math.cos(angle) * radius + (layer * -6);
                const posY = centerY + Math.sin(angle) * radius + (layer * -12);

                positions.push({ x: posX, y: posY, layer: layer });
            }
        } else if (formationType === 'DIAMOND') {
            let placed = 0;
            let layer = 0;
            const dims = [4, 3, 2];

            while (placed < totalCount) {
                const dim = dims[layer % dims.length];

                for (let x = 0; x < dim; x++) {
                    for (let y = 0; y < dim; y++) {
                        if (placed >= totalCount) break;

                        const rotX = (x - y) * stepX * 0.5;
                        const rotY = (x + y) * stepY * 0.35;

                        const posX = centerX + rotX + (layer * -6);
                        const posY = centerY + rotY - 45 + (layer * -12);

                        positions.push({ x: posX, y: posY, layer: layer });
                        placed++;
                    }
                    if (placed >= totalCount) break;
                }
                layer++;
            }
        } else if (formationType === 'BUTTERFLY') {
            for (let i = 0; i < totalCount; i++) {
                const layer = Math.floor(i / 14);
                const t = (i % 14) * (Math.PI * 2 / 14);

                const radius = 105 * (Math.sin(t) * Math.sin(t) + Math.cos(3 * t) * Math.cos(3 * t));
                const posX = centerX + Math.cos(t) * radius * 0.95 + (layer * -6);
                const posY = centerY + Math.sin(t) * radius * 0.95 + (layer * -12);

                positions.push({ x: posX, y: posY, layer: layer });
            }
        } else {
            let layer = 0;
            let placed = 0;
            let gridW = 4;
            let gridH = 4;

            while (placed < totalCount) {
                const offsetX = (gridW - 1) * stepX * 0.5;
                const offsetY = (gridH - 1) * stepY * 0.5;

                for (let x = 0; x < gridW; x++) {
                    for (let y = 0; y < gridH; y++) {
                        if (placed >= totalCount) break;

                        const layerOffsetX = (layer % 2 === 1) ? stepX * 0.5 : 0;
                        const layerOffsetY = (layer % 2 === 1) ? stepY * 0.5 : 0;

                        const posX = centerX + (x * stepX) - offsetX + layerOffsetX;
                        const posY = centerY + (y * stepY) - offsetY + layerOffsetY;

                        positions.push({ x: posX, y: posY, layer: layer });
                        placed++;
                    }
                    if (placed >= totalCount) break;
                }

                layer++;
                gridW = Math.max(2, gridW - 1);
                gridH = Math.max(2, gridH - 1);
            }
        }

        return positions;
    }

    updateLockStates() {
        const thresholdX = this.cardW * 0.85;
        const thresholdY = this.cardH * 0.85;

        for (let i = 0; i < this.boardTiles.length; i++) {
            const tile = this.boardTiles[i];
            if (tile.isInSlot) continue;

            let isLocked = false;

            for (let j = 0; j < this.boardTiles.length; j++) {
                if (i === j) continue;
                const candidateAbove = this.boardTiles[j];
                if (candidateAbove.isInSlot) continue;

                const isAbove = (candidateAbove.layer > tile.layer) ||
                                (candidateAbove.layer === tile.layer && j > i);

                if (isAbove) {
                    const distX = Math.abs(tile.x - candidateAbove.x);
                    const distY = Math.abs(tile.y - candidateAbove.y);

                    if (distX < thresholdX && distY < thresholdY) {
                        isLocked = true;
                        break;
                    }
                }
            }

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

        if (this.score < 300) {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(dict.noScore);
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
            this.score -= 300;
            document.getElementById('score-val').innerText = this.score;

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
        }, 2000);
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
    }

    rearrangeSlotTiles() {
        const total = this.slotTiles.length;
        if (total === 0) return;

        const trayW = 390;
        const spacing = (trayW - 20) / this.maxSlotCapacity;
        const startX = 10 + (spacing - this.cardW) / 2;

        for (let i = 0; i < total; i++) {
            const tile = this.slotTiles[i];
            const targetX = startX + (i * spacing);
            const targetY = 10;

            tile.element.style.transition = 'all 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)';
            tile.element.style.left = `${targetX}px`;
            tile.element.style.top = `${targetY}px`;
            tile.element.style.zIndex = 200 + i;
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
                    document.getElementById('modal-gameover').classList.remove('hidden');
                }
            }, 250);
        }
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

            this.rearrangeSlotTiles();

            if (this.boardTiles.length === 0 && this.slotTiles.length === 0) {
                this.sound.playVictorySound();
                this.fx.spawnConfetti();
                document.getElementById('victory-score').innerText = this.score;
                document.getElementById('modal-victory').classList.remove('hidden');
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
}

// Initialize Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new TileMatchingGame();
});
