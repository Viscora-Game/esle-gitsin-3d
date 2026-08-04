import csv
import os

translations = [
    {
        "Language": "tr-TR",
        "Title": "Eşle Gitsin! 3D",
        "Short description": "Eğlenceli 3D kart eşleme ve bulmaca macerası! Çarkıfelek ve yapboz günlüğü!",
        "Full description": """Eşle Gitsin! 3D ile eğlenceli ve zeka dolu bir 3D eşleştirme macerasına hazır olun! 

Sevimli hayvan kartlarını eşleştirin, 5 slotlu tepsiyi doldurmadan tahtayı temizleyin ve bölümleri geçin!

🎮 OYUN ÖZELLİKLERİ:
• 2 Farklı Oyun Modu: Rahatlatıcı Klasik Mod veya heyecan dolu Zamana Karşı Mod!
• Yapboz Günlüğü: Bölümleri geçtikçe ve sandık açtıkça sevimli yapboz parçalarını toplayın ve günlüğünüzü tamamlayın!
• Şans Çarkı: Günlük çarkı çevirin, sürpriz altın ve yapboz parçaları kazanın!
• Güçlü Jokerler: İpucu, +1 Acil Slot ve Tahtayı Karıştır jokerleri ile zorlu seviyeleri kolayca aşın!
• 7 Dil Desteği ve Muhteşem 3D Grafikler!

Hemen indirin ve eşleştirme macerasına başlayın!"""
    },
    {
        "Language": "en-US",
        "Title": "Match & Go! 3D",
        "Short description": "Fun 3D card matching & puzzle adventure! Wheel of fortune & jigsaw diary!",
        "Full description": """Get ready for a fun and brain-boosting 3D matching adventure with Match & Go! 3D!

Match cute animal cards, clear the board before your 5-slot tray fills up, and advance through exciting levels!

🎮 GAME FEATURES:
• 2 Game Modes: Relaxing Classic Mode or thrilling Time Trial Mode!
• Jigsaw Diary: Collect cute puzzle pieces from chests and complete your character diary!
• Lucky Wheel: Spin the daily wheel to win gold coins and surprise puzzle pieces!
• Powerful Boosters: Use Hint, +1 Emergency Slot, and Shuffle to clear tough levels!
• Beautiful 3D Graphics & Smooth Gameplay!

Download now and join the matching fun!"""
    },
    {
        "Language": "de-DE",
        "Title": "Match & Go! 3D",
        "Short description": "Spannendes 3D-Karten-Matching & Puzzlespiel! Glücksrad & Puzzletagebuch!",
        "Full description": """Mach dich bereit für ein unterhaltsames 3D-Matching-Abenteuer mit Match & Go! 3D!

Kombiniere süße Tierkarten, räume das Spielfeld ab, bevor deine 5 Ablageplätze voll sind, und meistere aufregende Level!

🎮 SPIELFUNKTIONEN:
• 2 Spielmodi: Entspannter Klassik-Modus oder aufregender Zeitmodus!
• Puzzle-Tagebuch: Sammele Puzzle-Teile aus Truhen und vervollständige dein Buch!
• Glücksrad: Drehe täglich am Rad und gewinne Goldmünzen & Überraschungsteile!
• Nützliche Booster: Nutze Hinweise, +1 Zusatz-Slot und Mischen!

Jetzt herunterladen und mit dem Spielen beginnen!"""
    },
    {
        "Language": "es-ES",
        "Title": "Match & Go! 3D",
        "Short description": "¡Divertida aventura de emparejar cartas 3D! ¡Rueda de la fortuna y diario!",
        "Full description": """¡Prepárate para una divertida aventura de emparejamiento 3D con Match & Go! 3D!

¡Empareja lindas cartas de animales, limpia el tablero antes de que se llene tu bandeja de 5 casillas y supera niveles!

🎮 CARACTERÍSTICAS DEL JUEGO:
• 2 Modos de Juego: ¡Modo Clásico relajante o Modo Contra el Tiempo lleno de emoción!
• Diario de Rompecabezas: ¡Colecciona piezas de cofres y completa tu diario!
• Rueda de la Fortuna: ¡Gira la rueda diaria y gana monedas de oro y piezas sorpresa!
• Potenciadores Útiles: ¡Pistas, +1 Casilla de Emergencia y Mezclar!

¡Descárgalo ahora y diviértete emparejando!"""
    },
    {
        "Language": "fr-FR",
        "Title": "Match & Go! 3D",
        "Short description": "Jeu d'association de cartes 3D passionnant! Roue de la fortune et journal!",
        "Full description": """Préparez-vous pour une aventure d'association 3D amusante avec Match & Go! 3D!

Associez de superbes cartes d'animaux, videz le plateau avant que votre plateau de 5 emplacements ne se remplisse!

🎮 CARACTÉRISTIQUES DU JEU:
• 2 Modes de Jeu: Mode Classique relaxant ou Mode Contre-la-montre palpitant!
• Journal de Puzzle: Collectionnez les pièces de puzzle et complétez votre journal!
• Roue de la Fortune: Tournez la roue quotidienne pour gagner des pièces d'or!
• Boosters Puissants: Indication, +1 Emplacement d'urgence et Mélange!

Téléchargez maintenant et profitez du jeu!"""
    },
    {
        "Language": "pt-BR",
        "Title": "Match & Go! 3D",
        "Short description": "Divertida aventura 3D de combinar cartas! Roleta da sorte e diário!",
        "Full description": """Prepare-se para uma divertida aventura 3D de combinação com Match & Go! 3D!

Combine cartas fofas de animais, limpe o tabuleiro antes que sua bandeja de 5 slots encha e passe de nível!

🎮 RECURSOS DO JOGO:
• 2 Modos de Jogo: Modo Clássico relaxante ou Modo Contra o Tempo empolgante!
• Diário de Quebra-Cabeça: Colete peças de baús e complete seu diário de personagens!
• Roleta da Sorte: Gire a roleta diária para ganhar moedas de ouro e peças surpresa!
• Boosters Poderosos: Dica, +1 Slot de Emergência e Embaralhar!

Baixe agora e comece a combinar!"""
    }
]

file_paths = [
    r"c:\Users\Acer\OneDrive\Masaüstü\Eşleme Oyunu\play_store_translations.csv",
    r"c:\Users\Acer\OneDrive\Masaüstü\play_store_translations.csv"
]

for fp in file_paths:
    with open(fp, mode='w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=["Language", "Title", "Short description", "Full description"])
        writer.writeheader()
        for row in translations:
            writer.writerow(row)
    print("Generated CSV at:", fp)
