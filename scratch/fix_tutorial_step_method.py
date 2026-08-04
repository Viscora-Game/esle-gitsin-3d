with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace renderTutorialStep with getTutorialSlides + dynamic language support
old_render_step = """    renderTutorialStep() {
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
    }"""

new_render_step = """    getTutorialSlides() {
        const lang = (this.settings && this.settings.lang) ? this.settings.lang : 'tr';
        const slides = {
            tr: [
                { avatar: 'images/fox.jpg', name: 'FOXİ (Kozmik Tilki)', title: 'EŞLE GİTSİN! 3D\'YE HOŞ GELDİN 🦊', body: 'Tahtadaki kilitli olmayan (üstü açık) 2 aynı kartı tepsine aktararak eşleştir! 5 slotlu tepsi dolmadan tüm kartları temizle ve bölümleri geç!' },
                { avatar: 'images/panda.jpg', name: 'PANDİ (Sevimli Panda)', title: '🎮 İKİ FARKLI OYUN MODU', body: '• KLASİK MOD: Süre stresi olmadan rahatça bulmaca çöz.\\n• ZAMANA KARŞI MOD: Zamana karşı yarış! Süre dolmadan tüm kartları hızlıca eşleştir!' },
                { avatar: 'images/unicorn.jpg', name: 'UNİKA (Büyülü Tekboynuz)', title: '💡 GÜÇLÜ JOKER BİRİMLERİ', body: '• İPUCU (300 Puan): Açık 2 eşleşen kartı parlatır.\\n• +1 SLOT (1000 Puan): Tepsiye acil 6. slot açar.\\n• KARIŞTIR (5000 Puan): Tahtadaki kartları harmanlar!' },
                { avatar: 'images/lion.jpg', name: 'LEO (Kral Aslan)', title: '⚙️ AYARLAR VE SIFIRLAMA', body: 'Ayarlardan ses, titreşim ve dili değiştirebilir, bu rehberi tekrar açabilir veya istediğin modu baştan sıfırlayabilirsin. Bol şans!' }
            ],
            en: [
                { avatar: 'images/fox.jpg', name: 'FOXI (Cosmic Fox)', title: 'WELCOME TO MATCH & GO! 3D 🦊', body: 'Match 2 open identical tiles by tapping them to send to tray! Clear all tiles before the 5-slot tray fills up!' },
                { avatar: 'images/panda.jpg', name: 'PANDI (Cute Panda)', title: '🎮 TWO EXCITING GAME MODES', body: '• CLASSIC MODE: Relax and solve puzzles without time limits.\\n• TIME TRIAL MODE: Race against time! Match all tiles before the clock runs out!' },
                { avatar: 'images/unicorn.jpg', name: 'UNIKA (Magical Unicorn)', title: '💡 POWERFUL BOOSTERS', body: '• HINT (300 Pts): Highlights 2 open matching tiles.\\n• +1 SLOT (1000 Pts): Opens an emergency 6th slot.\\n• SHUFFLE (5000 Pts): Shuffles all tiles on the board!' },
                { avatar: 'images/lion.jpg', name: 'LEO (King Lion)', title: '⚙️ SETTINGS & RESET', body: 'Customize volume, vibration, and language from settings, replay this guide, or reset your game progress. Good luck!' }
            ],
            de: [
                { avatar: 'images/fox.jpg', name: 'FOXI (Kosmischer Fuchs)', title: 'WILLKOMMEN BEI MATCH & GO! 3D 🦊', body: 'Kombiniere 2 gleiche offene Kacheln! Räume das Brett ab, bevor die 5 Ablageplätze voll sind!' },
                { avatar: 'images/panda.jpg', name: 'PANDI (Süßer Panda)', title: '🎮 ZWEI SPIELMODI', body: '• KLASSISCH: Entspanntes Rätseln ohne Zeitdruck.\\n• ZEITRENNEN: Rennen gegen die Zeit! Kombiniere schnell alle Kacheln!' },
                { avatar: 'images/unicorn.jpg', name: 'UNIKA (Zauber-Einhorn)', title: '💡 STARKE BOOSTER', body: '• HINWEIS (300 Pkt): Hebt 2 passende Kacheln hervor.\\n• +1 SLOT (1000 Pkt): Öffnet einen Notfall-Slot.\\n• MISCHEN (5000 Pkt): Mischt alle Kacheln neu!' },
                { avatar: 'images/lion.jpg', name: 'LEO (König Löwe)', title: '⚙️ EINSTELLUNGEN & RESET', body: 'Passe Lautstärke, Vibration und Sprache an, öffne diese Anleitung oder setze den Fortschritt zurück. Viel Glück!' }
            ],
            fr: [
                { avatar: 'images/fox.jpg', name: 'FOXI (Renard Cosmique)', title: 'BIENVENUE SUR MATCH & GO! 3D 🦊', body: 'Associez 2 cartes identiques ouvertes! Videz le plateau avant que le support à 5 emplacements ne se remplisse!' },
                { avatar: 'images/panda.jpg', name: 'PANDI (Panda Mignon)', title: '🎮 DEUX MODES DE JEU', body: '• CLASSIQUE: Résolvez des puzzles sans limite de temps.\\n• CONTRE-LA-MONTRE: Course contre le montre! Associez rapidement!' },
                { avatar: 'images/unicorn.jpg', name: 'UNIKA (Licorne Magique)', title: '💡 POWER-UPS PUISSANTS', body: '• INDICE (300 Pts): Illumine 2 cartes identiques.\\n• +1 EMPLACEMENT (1000 Pts): Ouvre un 6e emplacement d\'urgence.\\n• MÉLANGER (5000 Pts): Mélange toutes les cartes!' },
                { avatar: 'images/lion.jpg', name: 'LEO (Roi Lion)', title: '⚙️ PARAMÈTRES & RÉINITIALISATION', body: 'Ajustez le son, les vibrations et la langue, rejouez ce guide ou réinitialisez votre progression. Bonne chance!' }
            ],
            it: [
                { avatar: 'images/fox.jpg', name: 'FOXI (Volpe Cosmica)', title: 'BENVENUTO SU MATCH & GO! 3D 🦊', body: 'Abbina 2 tessere uguali scoperte! Sgombra il tabellone prima che lo slot da 5 si riempia!' },
                { avatar: 'images/panda.jpg', name: 'PANDI (Panda Tenero)', title: '🎮 DUE MODALITÀ DI GIOCO', body: '• CLASSICA: Risolvi i puzzle senza limiti di tempo.\\n• CRONOMETRO: Corsa contro il tempo! Abbina prima che scada il tempo!' },
                { avatar: 'images/unicorn.jpg', name: 'UNIKA (Unicorno Magico)', title: '💡 POTENTI POTENZIAMENTI', body: '• SUGGERIMENTO (300 Pt): Evidenzia 2 tessere uguali.\\n• +1 SLOT (1000 Pt): Apre un 6° slot di emergenza.\\n• MESCOLA (5000 Pt): Rimescola tutte le tessere!' },
                { avatar: 'images/lion.jpg', name: 'LEO (Re Leone)', title: '⚙️ IMPOSTAZIONI & RESET', body: 'Personalizza audio, vibrazione e lingua, rileggi questa guida o resetta la partita. Buona fortuna!' }
            ],
            es: [
                { avatar: 'images/fox.jpg', name: 'FOXI (Zorro Cósmico)', title: '¡BIENVENIDO A MATCH & GO! 3D 🦊', body: '¡Empareja 2 fichas iguales destapadas! ¡Limpia el tablero antes de que se llene el soporte de 5 casillas!' },
                { avatar: 'images/panda.jpg', name: 'PANDI (Panda Lindo)', title: '🎮 DOS MODOS DE JUEGO', body: '• CLÁSICO: Resuelve puzzles sin límite de tiempo.\\n• CONTRARELOJ: ¡Carrera contra el tiempo! ¡Empareja rápido!' },
                { avatar: 'images/unicorn.jpg', name: 'UNIKA (Unicornio Mágico)', title: '💡 POTENTES POTENCIADORES', body: '• PISTA (300 Pts): Resalta 2 fichas iguales.\\n• +1 CASILLA (1000 Pts): Abre una 6ª casilla de emergencia.\\n• MEZCLAR (5000 Pts): ¡Mezcla las fichas del tablero!' },
                { avatar: 'images/lion.jpg', name: 'LEO (Rey León)', title: '⚙️ AJUSTES Y REINICIO', body: 'Ajusta el volumen, vibración e idioma, vuelve a leer esta guía o reinicia tu progreso. ¡Buena suerte!' }
            ],
            pt: [
                { avatar: 'images/fox.jpg', name: 'FOXI (Raposa Cósmica)', title: 'BEM-VINDO AO MATCH & GO! 3D 🦊', body: 'Combine 2 peças iguais abertas! Limpe o tabuleiro antes que o suporte de 5 espaços fique cheio!' },
                { avatar: 'images/panda.jpg', name: 'PANDI (Panda Fofo)', title: '🎮 DOIS MODOS DE JOGO', body: '• CLÁSSICO: Resolva puzzles sem limite de tempo.\\n• CONTRA-RELÓGIO: Corrida contra o tempo! Combine tudo rapidamente!' },
                { avatar: 'images/unicorn.jpg', name: 'UNIKA (Unicórnio Mágico)', title: '💡 PODEROSOS BOOSTERS', body: '• DICA (300 Pts): Destaca 2 peças iguais abertas.\\n• +1 ESPAÇO (1000 Pts): Abre um 6º espaço de emergência.\\n• EMBARALHAR (5000 Pts): Embaralha todas as peças!' },
                { avatar: 'images/lion.jpg', name: 'LEO (Rei Leão)', title: '⚙️ CONFIGURAÇÕES E RESET', body: 'Ajuste volume, vibração e idioma, reveja este guia ou reinicie o seu progresso. Boa sorte!' }
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
    }"""

if old_render_step in js_content:
    js_content = js_content.replace(old_render_step, new_render_step)
    print('Updated renderTutorialStep method!')

# Update applyLanguage to call renderTutorialStep
js_content = js_content.replace('this.renderTutorialSlide();', 'this.renderTutorialStep();')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
