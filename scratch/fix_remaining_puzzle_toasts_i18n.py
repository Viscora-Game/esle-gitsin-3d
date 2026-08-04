with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Update i18n dictionary with tabSwitchedMsg and wrongTabMsg
new_messages = {
    'tr': {
        'tabSwitchedMsg': '{name} sekmesine geçildi! Tekrar dokunarak yerleştirebilirsiniz.',
        'wrongTabMsg': 'Lütfen parçayı ait olduğu karakter sekmesine yerleştirin!'
    },
    'en': {
        'tabSwitchedMsg': 'Switched to {name} tab! Tap again to place piece.',
        'wrongTabMsg': 'Please place the piece in its correct character tab!'
    },
    'de': {
        'tabSwitchedMsg': 'Zum Tab {name} gewechselt! Zum Platzieren erneut tippen.',
        'wrongTabMsg': 'Bitte platziere das Teil im richtigen Charakter-Tab!'
    },
    'fr': {
        'tabSwitchedMsg': 'Onglet {name} ouvert! Touchez à nouveau pour placer la pièce.',
        'wrongTabMsg': 'Veuillez placer la pièce dans l\'onglet de personnage correspondant!'
    },
    'it': {
        'tabSwitchedMsg': 'Passato alla scheda {name}! Tocca di nuovo per posizionare.',
        'wrongTabMsg': 'Inserisci il pezzo nella scheda del personaggio corretta!'
    },
    'es': {
        'tabSwitchedMsg': '¡Cambiado a la pestaña {name}! Toca de nuevo para colocar.',
        'wrongTabMsg': '¡Coloca la pieza en la pestaña de personaje correcta!'
    },
    'pt': {
        'tabSwitchedMsg': 'Mudado para a aba {name}! Toque novamente para colocar.',
        'wrongTabMsg': 'Por favor, coloque a peça na aba de personagem correta!'
    }
}

for lang, msg in new_messages.items():
    lang_marker = f"{lang}: {{"
    idx = js_content.find(lang_marker)
    if idx != -1:
        insert_str = f'\n                tabSwitchedMsg: "{msg["tabSwitchedMsg"]}",\n                wrongTabMsg: "{msg["wrongTabMsg"]}",\n'
        js_content = js_content[:idx + len(lang_marker)] + insert_str + js_content[idx + len(lang_marker):]

# 2. Make getPuzzleName defer to getLocalizedPuzzleName
old_get_puz_name = """    getPuzzleName(puzzleId) {
        const lang = (this.settings && this.settings.lang) ? this.settings.lang : 'tr';
        const names = {
            cat: { tr: "Pamuk Kedi 🐱", en: "Fluffy Cat 🐱", de: "Flauschige Katze 🐱", fr: "Chat Doux 🐱", it: "Gatto Morbido 🐱", es: "Gato Esponjoso 🐱", pt: "Gato Fofo 🐱" },
            shiba: { tr: "Tatlı Shiba 🐕", en: "Sweet Shiba 🐕", de: "Süßer Shiba 🐕", fr: "Shiba Mignon 🐕", it: "Dolce Shiba 🐕", es: "Dulce Shiba 🐕", pt: "Doce Shiba 🐕" },
            panda: { tr: "Şirin Panda 🐼", en: "Cute Panda 🐼", de: "Niedlicher Panda 🐼", fr: "Panda Mignon 🐼", it: "Panda Tenero 🐼", es: "Panda Lindo 🐼", pt: "Panda Fofo 🐼" },
            dragon: { tr: "Sevimli Ejderha 🐉", en: "Cute Dragon 🐉", de: "Niedlicher Drache 🐉", fr: "Dragon Mignon 🐉", it: "Drago Tenero 🐉", es: "Dragón Lindo 🐉", pt: "Dragão Fofo 🐉" },
            fox: { tr: "Komik Tilki 🦊", en: "Funny Fox 🦊", de: "Lustiger Fuchs 🦊", fr: "Renard Rigolo 🦊", it: "Volpe Buffa 🦊", es: "Zorro Divertido 🦊", pt: "Raposa Engraçada 🦊" },
            lion: { tr: "Kral Aslan 🦁", en: "King Lion 🦁", de: "König Löwe 🦁", fr: "Roi Lion 🦁", it: "Re Leone 🦁", es: "Rey León 🦁", pt: "Rei Leão 🦁" },
            bunny: { tr: "Minik Tavşan 🐰", en: "Tiny Bunny 🐰", de: "Kleines Hasenkind 🐰", fr: "Petit Lapin 🐰", it: "Piccolo Coniglio 🐰", es: "Pequeno Conejo 🐰", pt: "Pequeno Coelho 🐰" },
            owl: { tr: "Bilge Baykuş 🦉", en: "Wise Owl 🦉", de: "Weise Eule 🦉", fr: "Hibou Sage 🦉", it: "Gufo Saggio 🦉", es: "Búho Sabio 🦉", pt: "Coruja Sábia 🦉" },
            unicorn: { tr: "Büyülü Tekboynuz 🦄", en: "Magical Unicorn 🦄", de: "Zauber-Einhorn 🦄", fr: "Licorne Magique 🦄", it: "Unicorno Magico 🦄", es: "Unicornio Mágico 🦄", pt: "Unicórnio Mágico 🦄" },
            penguin: { tr: "Sevimli Penguen 🐧", en: "Cute Penguin 🐧", de: "Niedlicher Pinguin 🐧", fr: "Pingouin Mignon 🐧", it: "Pinguino Tenero 🐧", es: "Pingüino Lindo 🐧", pt: "Pinguim Fofo 🐧" },
            red_panda: { tr: "Kırmızı Panda 🐾", en: "Red Panda 🐾", de: "Roter Panda 🐾", fr: "Panda Roux 🐾", it: "Panda Rosso 🐾", es: "Panda Rojo 🐾", pt: "Panda Vermelho 🐾" },
            frog: { tr: "Tatlı Kurbağa 🐸", en: "Sweet Frog 🐸", de: "Süßer Frosch 🐸", fr: "Grenouille Douce 🐸", it: "Dolce Rana 🐸", es: "Dulce Rana 🐸", pt: "Doce Rã 🐸" }
        };
        const pObj = names[puzzleId] || names.cat;
        return pObj[lang] || pObj.tr;
    }"""

new_get_puz_name = """    getPuzzleName(puzzleId) {
        return this.getLocalizedPuzzleName(puzzleId);
    }"""

if old_get_puz_name in js_content:
    js_content = js_content.replace(old_get_puz_name, new_get_puz_name)

# 3. Update toast messages in click handlers
old_toast_1 = "this.showToast(`${puzzleDef.name} sekmesine geçildi! Tekrar dokunarak yerleştirebilirsiniz.`);"
new_toast_1 = """const pNameLoc = this.getLocalizedPuzzleName(pItem.puzzleId);
                            const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                            const msg = (dict.tabSwitchedMsg || '{name} sekmesine geçildi! Tekrar dokunarak yerleştirebilirsiniz.').replace('{name}', pNameLoc);
                            this.showToast(msg);"""

if old_toast_1 in js_content:
    js_content = js_content.replace(old_toast_1, new_toast_1)

old_toast_2 = "this.showToast('Lütfen parçayı ait olduğu karakter sekmesine yerleştirin!');"
new_toast_2 = """const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            this.showToast(dict.wrongTabMsg || 'Lütfen parçayı ait olduğu karakter sekmesine yerleştirin!');"""

if old_toast_2 in js_content:
    js_content = js_content.replace(old_toast_2, new_toast_2)

old_toast_3 = "this.showToast(`❌ Yanlış Yuva! Bu parça #${pieceIndex + 1} numaralı yuvaya aittir. Envantere geri döndü.`);"
new_toast_3 = """const dict = this.i18n[this.settings.lang] || this.i18n.tr;
            const msg = (dict.wrongSlotMsg || '❌ Yanlış Yuva! Bu parça #{idx} numaralı yuvaya aittir. Envantere geri döndü.').replace('{idx}', pieceIndex + 1);
            this.showToast(msg);"""

if old_toast_3 in js_content:
    js_content = js_content.replace(old_toast_3, new_toast_3)

# 4. Update buy piece toast (line 3547)
old_buy_toast = "this.showToast(`🎉 1 Parça Alındı: ${added.puzzleName} (#${added.pieceIndex + 1})!`);"
new_buy_toast = """const pNameLoc = this.getLocalizedPuzzleName(added.puzzleId);
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        const msg = (dict.pieceBought || '🎉 1 Parça Alındı: {name} (#{idx})!').replace('{name}', pNameLoc).replace('{idx}', added.pieceIndex + 1);
        this.showToast(msg);"""

if old_buy_toast in js_content:
    js_content = js_content.replace(old_buy_toast, new_buy_toast)

# 5. Update chest item html (lines 3413 and 3419)
old_chest_item_1 = "item.innerHTML = `<span class=\"reward-icon\">🪙</span><span class=\"reward-val\">+50 ALTIN <br><small style=\"font-size:10px; color:#fbbf24;\">(Varolan ${pieceData.puzzleName} #${pieceData.pieceIndex + 1} Dönüştü!)</small></span>`;"
new_chest_item_1 = """const pNameLoc = this.getLocalizedPuzzleName(pieceData.puzzleId);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    const subText = (dict.duplicatePieceConverted || '(Varolan {name} #{idx} Dönüştü!)').replace('{name}', pNameLoc).replace('{idx}', pieceData.pieceIndex + 1);
                    const goldText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', 50);
                    item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">${goldText} <br><small style="font-size:10px; color:#fbbf24;">${subText}</small></span>`;"""

if old_chest_item_1 in js_content:
    js_content = js_content.replace(old_chest_item_1, new_chest_item_1)

old_chest_item_2 = "item.innerHTML = `<span class=\"reward-icon\">🧩</span><span class=\"reward-val\">${pieceData.puzzleName} (#${pieceData.pieceIndex + 1})</span>`;"
new_chest_item_2 = """const pNameLoc = this.getLocalizedPuzzleName(pieceData.puzzleId);
                    const dict = this.i18n[this.settings.lang] || this.i18n.tr;
                    const pieceText = (dict.puzzlePieceEarned || '{name} Parçası #{idx}').replace('{name}', pNameLoc).replace('{idx}', pieceData.pieceIndex + 1);
                    item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${pieceText}</span>`;"""

if old_chest_item_2 in js_content:
    js_content = js_content.replace(old_chest_item_2, new_chest_item_2)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
