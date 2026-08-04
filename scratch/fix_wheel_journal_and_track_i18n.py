with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 1. Update music track buttons in index.html with data-i18n attributes
old_track_btns = """                        <div class="lang-grid-selector">
                            <button id="btn-track-carefree" class="lang-btn active">🌸 Carefree</button>
                            <button id="btn-track-duck" class="lang-btn">🦆 Ördekçik</button>
                            <button id="btn-track-monkeys" class="lang-btn">🐒 Marimba</button>
                        </div>"""

new_track_btns = """                        <div class="lang-grid-selector">
                            <button id="btn-track-carefree" class="lang-btn active" data-i18n="trackCarefree">🌸 Carefree</button>
                            <button id="btn-track-duck" class="lang-btn" data-i18n="trackDuck">🦆 Ördekçik</button>
                            <button id="btn-track-monkeys" class="lang-btn" data-i18n="trackMarimba">🐒 Marimba</button>
                        </div>"""

if old_track_btns in html_content:
    html_content = html_content.replace(old_track_btns, new_track_btns, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 2. Update game.js
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add new localization keys to i18n dictionary for all 7 languages
new_i18n_keys = {
    'tr': {
        'trackCarefree': '🌸 Carefree',
        'trackDuck': '🦆 Ördekçik',
        'trackMarimba': '🐒 Marimba',
        'pieceWord': 'PARÇA',
        'piecesWord': 'PARÇA',
        'pageWord': 'Sayfa',
        'emptyInventoryMsg': 'Envanterinizde henüz yerleştirilmemiş parça yok. Sandık açarak veya Altın ile parça kazanabilirsiniz!',
        'puzzles': {
            'cat': 'Pamuk Kedi 😻', 'fox': 'Sevimli Tilki 🦊', 'panda': 'Tatlı Panda 🐼', 'dragon': 'Büyülü Ejderha 🐲',
            'shiba': 'Neşeli Shiba 🐶', 'unicorn': 'Işıltılı Tekboynuz 🦄', 'lion': 'Cesur Aslan 🦁', 'bunny': 'Sevimli Tavşan 🐰',
            'owl': 'Bilge Baykuş 🦉', 'red_panda': 'Kızıl Panda 🐾', 'frog': 'Neşeli Kurbağa 🐸', 'penguin': 'Sevimli Penguen 🐧'
        }
    },
    'en': {
        'trackCarefree': '🌸 Carefree',
        'trackDuck': '🦆 Little Duck',
        'trackMarimba': '🐒 Marimba',
        'pieceWord': 'PIECE',
        'piecesWord': 'PIECES',
        'pageWord': 'Page',
        'emptyInventoryMsg': 'No unplaced pieces in your inventory. Win pieces from chests or buy with Gold!',
        'puzzles': {
            'cat': 'Fluffy Cat 😻', 'fox': 'Cute Fox 🦊', 'panda': 'Sweet Panda 🐼', 'dragon': 'Magic Dragon 🐲',
            'shiba': 'Happy Shiba 🐶', 'unicorn': 'Sparkly Unicorn 🦄', 'lion': 'Brave Lion 🦁', 'bunny': 'Cute Bunny 🐰',
            'owl': 'Wise Owl 🦉', 'red_panda': 'Red Panda 🐾', 'frog': 'Happy Frog 🐸', 'penguin': 'Cute Penguin 🐧'
        }
    },
    'de': {
        'trackCarefree': '🌸 Carefree',
        'trackDuck': '🦆 Entchen',
        'trackMarimba': '🐒 Marimba',
        'pieceWord': 'TEIL',
        'piecesWord': 'TEILE',
        'pageWord': 'Seite',
        'emptyInventoryMsg': 'Keine platzierten Teile im Inventar. Gewinne Teile aus Truhen oder kaufe mit Gold!',
        'puzzles': {
            'cat': 'Flauschige Katze 😻', 'fox': 'Süßer Fuchs 🦊', 'panda': 'Süßer Panda 🐼', 'dragon': 'Zauberdrache 🐲',
            'shiba': 'Fröhlicher Shiba 🐶', 'unicorn': 'Glitzer-Einhorn 🦄', 'lion': 'Tapferer Löwe 🦁', 'bunny': 'Süßes Hase 🐰',
            'owl': 'Weise Eule 🦉', 'red_panda': 'Roter Panda 🐾', 'frog': 'Fröhlicher Frosch 🐸', 'penguin': 'Süßer Pinguin 🐧'
        }
    },
    'fr': {
        'trackCarefree': '🌸 Carefree',
        'trackDuck': '🦆 Caneton',
        'trackMarimba': '🐒 Marimba',
        'pieceWord': 'PIÈCE',
        'piecesWord': 'PIÈCES',
        'pageWord': 'Page',
        'emptyInventoryMsg': 'Aucune pièce non placée dans votre inventaire. Gagnez des pièces dans les coffres ou achetez avec de l\'Or!',
        'puzzles': {
            'cat': 'Chat Doux 😻', 'fox': 'Mignon Renard 🦊', 'panda': 'Doux Panda 🐼', 'dragon': 'Dragon Magique 🐲',
            'shiba': 'Shiba Joyeux 🐶', 'unicorn': 'Licorne Étincelante 🦄', 'lion': 'Brave Lion 🦁', 'bunny': 'Mignon Lapin 🐰',
            'owl': 'Chouette Sage 🦉', 'red_panda': 'Panda Roux 🐾', 'frog': 'Grenouille Joyeuse 🐸', 'penguin': 'Mignon Pingouin 🐧'
        }
    },
    'it': {
        'trackCarefree': '🌸 Carefree',
        'trackDuck': '🦆 Paperotto',
        'trackMarimba': '🐒 Marimba',
        'pieceWord': 'PEZZO',
        'piecesWord': 'PEZZI',
        'pageWord': 'Pagina',
        'emptyInventoryMsg': 'Nessun pezzo non posizionato nell\'inventario. Vinci pezzi dai bauli o acquista con Oro!',
        'puzzles': {
            'cat': 'Gatto Soffice 😻', 'fox': 'Volpe Carina 🦊', 'panda': 'Panda Dolce 🐼', 'dragon': 'Drago Magico 🐲',
            'shiba': 'Shiba Felice 🐶', 'unicorn': 'Unicorno Brillante 🦄', 'lion': 'Leone Coraggioso 🦁', 'bunny': 'Coniglietto Carino 🐰',
            'owl': 'Gufo Saggio 🦉', 'red_panda': 'Panda Rosso 🐾', 'frog': 'Rana Felice 🐸', 'penguin': 'Pinguino Carino 🐧'
        }
    },
    'es': {
        'trackCarefree': '🌸 Carefree',
        'trackDuck': '🦆 Patito',
        'trackMarimba': '🐒 Marimba',
        'pieceWord': 'PIEZA',
        'piecesWord': 'PIEZAS',
        'pageWord': 'Página',
        'emptyInventoryMsg': '¡No hay piezas sin colocar en tu inventario. Gana piezas en cofres o compra con Oro!',
        'puzzles': {
            'cat': 'Gato Esponjoso 😻', 'fox': 'Zorro Lindo 🦊', 'panda': 'Panda Dulce 🐼', 'dragon': 'Dragón Mágico 🐲',
            'shiba': 'Shiba Alegre 🐶', 'unicorn': 'Unicornio Brillante 🦄', 'lion': 'León Valiente 🦁', 'bunny': 'Conejo Lindo 🐰',
            'owl': 'Búho Sabio 🦉', 'red_panda': 'Panda Rojo 🐾', 'frog': 'Rana Alegre 🐸', 'penguin': 'Pingüino Lindo 🐧'
        }
    },
    'pt': {
        'trackCarefree': '🌸 Carefree',
        'trackDuck': '🦆 Patinho',
        'trackMarimba': '🐒 Marimba',
        'pieceWord': 'PEÇA',
        'piecesWord': 'PEÇAS',
        'pageWord': 'Página',
        'emptyInventoryMsg': 'Nenhuma peça não colocada em seu inventário. Ganhe peças em baús ou compre com Ouro!',
        'puzzles': {
            'cat': 'Gato Fofo 😻', 'fox': 'Raposa Fofa 🦊', 'panda': 'Panda Fofo 🐼', 'dragon': 'Dragão Mágico 🐲',
            'shiba': 'Shiba Alegre 🐶', 'unicorn': 'Unicórnio Brilhante 🦄', 'lion': 'Leão Valente 🦁', 'bunny': 'Coelhinho Fofo 🐰',
            'owl': 'Coruja Sábia 🦉', 'red_panda': 'Panda Vermelho 🐾', 'frog': 'Sapo Alegre 🐸', 'penguin': 'Pinguim Fofo 🐧'
        }
    }
}

# Update renderWheelCanvas to use localized goldWord and pieceWord
old_wheel_text = "const text = slice.type === 'gold' ? `${slice.value} ALTIN` : (slice.type === 'piece' ? `${slice.value} PARÇA` : (dict.pasText || 'PAS ❌'));"
new_wheel_text = """const goldWord = dict.goldLabel || 'ALTIN';
            const pieceWord = slice.value > 1 ? (dict.piecesWord || 'PARÇA') : (dict.pieceWord || 'PARÇA');
            const pasWord = dict.pasText || 'PAS ❌';
            const text = slice.type === 'gold' ? `${slice.value} ${goldWord}` : (slice.type === 'piece' ? `${slice.value} ${pieceWord}` : pasWord);"""

if old_wheel_text in js_content:
    js_content = js_content.replace(old_wheel_text, new_wheel_text, 1)

# Update renderPuzzleGalleryModal page indicator and empty inventory msg
old_page_indicator = "document.getElementById('gallery-page-indicator').innerText = `Sayfa ${this.currentGalleryIndex + 1} / ${this.puzzles.length}`;"
new_page_indicator = "document.getElementById('gallery-page-indicator').innerText = `${dict.pageWord || 'Sayfa'} ${this.currentGalleryIndex + 1} / ${this.puzzles.length}`;"

if old_page_indicator in js_content:
    js_content = js_content.replace(old_page_indicator, new_page_indicator, 1)

old_empty_msg = '<div class="empty-inventory-msg">Envanterinizde henüz yerleştirilmemiş parça yok. Sandık açarak veya Altın ile parça kazanabilirsiniz!</div>'
new_empty_msg = '<div class="empty-inventory-msg">' + "${dict.emptyInventoryMsg || 'Envanterinizde henüz yerleştirilmemiş parça yok. Sandık açarak veya Altın ile parça kazanabilirsiniz!'}" + '</div>'

if old_empty_msg in js_content:
    js_content = js_content.replace(old_empty_msg, new_empty_msg, 1)

# Update puzzle names in renderPuzzleGalleryModal header
old_title_code = "document.getElementById('gallery-puzzle-title').innerText = puzzle.name;"
new_title_code = """const puzzleDict = (dict.puzzles && dict.puzzles[puzzle.id]) ? dict.puzzles[puzzle.id] : puzzle.name;
        document.getElementById('gallery-puzzle-title').innerText = puzzleDict;"""

if old_title_code in js_content:
    js_content = js_content.replace(old_title_code, new_title_code, 1)

# Insert the new dictionary keys into each language in game.js
for lang, keys in new_i18n_keys.items():
    lang_marker = f"{lang}: {{"
    idx = js_content.find(lang_marker)
    if idx != -1:
        insert_str = "\n"
        for k, v in keys.items():
            if k == 'puzzles':
                puz_str = ",\n                ".join([f'{pk}: "{pv}"' for pk, pv in v.items()])
                insert_str += f"                puzzles: {{\n                {puz_str}\n                }},\n"
            else:
                insert_str += f'                {k}: "{v}",\n'
        js_content = js_content[:idx + len(lang_marker)] + insert_str + js_content[idx + len(lang_marker):]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
