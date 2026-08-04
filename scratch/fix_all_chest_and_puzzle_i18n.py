with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add getPuzzleName method & chest dictionary entries to this.i18n
chest_i18n_additions = [
    ('tr: {', 'tr: {\n                chestStarTitle: "{stars} YILDIZLI SANDIK! 🎁",\n                bonusChestStarTitle: "🏆 BONUS {stars} YILDIZLI SANDIK! 🎁",\n                chestInitialDesc: "Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!",\n                chestGoldRewardText: "+{gold} ALTIN",\n                duplicatePieceConverted: "(Varolan {name} #{idx} Dönüştü!)",\n                puzzlePieceEarned: "{name} Parçası #{idx}",'),
    ('en: {', 'en: {\n                chestStarTitle: "{stars}-STAR CHEST! 🎁",\n                bonusChestStarTitle: "🏆 BONUS {stars}-STAR CHEST! 🎁",\n                chestInitialDesc: "Level Complete! Press OPEN CHEST below to see your rewards!",\n                chestGoldRewardText: "+{gold} GOLD",\n                duplicatePieceConverted: "(Owned {name} #{idx} Converted!)",\n                puzzlePieceEarned: "{name} Piece #{idx}",'),
    ('de: {', 'de: {\n                chestStarTitle: "{stars}-STERNE TRUHE! 🎁",\n                bonusChestStarTitle: "🏆 BONUS {stars}-STERNE TRUHE! 🎁",\n                chestInitialDesc: "Level geschafft! Klicke unten auf TRUHE ÖFFNEN!",\n                chestGoldRewardText: "+{gold} GOLD",\n                duplicatePieceConverted: "(Bereits vorhanden: {name} #{idx} umgewandelt!)",\n                puzzlePieceEarned: "{name} Teil #{idx}",'),
    ('fr: {', 'fr: {\n                chestStarTitle: "COFFRE {stars} ÉTOILE(S)! 🎁",\n                bonusChestStarTitle: "🏆 COFFRE BONUS {stars} ÉTOILE(S)! 🎁",\n                chestInitialDesc: "Niveau Réussi! Cliquez sur OUVRIR LE COFFRE ci-dessous!",\n                chestGoldRewardText: "+{gold} OR",\n                duplicatePieceConverted: "({name} #{idx} déjà possédé converti!)",\n                puzzlePieceEarned: "Pièce {name} #{idx}",'),
    ('it: {', 'it: {\n                chestStarTitle: "BAULE A {stars} STELLE! 🎁",\n                bonusChestStarTitle: "🏆 BAULE BONUS A {stars} STELLE! 🎁",\n                chestInitialDesc: "Livello Completato! Clicca APRI IL BAULE qui sotto!",\n                chestGoldRewardText: "+{gold} ORO",\n                duplicatePieceConverted: "({name} #{idx} già posseduto convertito!)",\n                puzzlePieceEarned: "Pezzo {name} #{idx}",'),
    ('es: {', 'es: {\n                chestStarTitle: "¡COFRE DE {stars} ESTRELLA(S)! 🎁",\n                bonusChestStarTitle: "🏆 ¡COFRE BONUS DE {stars} ESTRELLA(S)! 🎁",\n                chestInitialDesc: "¡Nivel Completado! ¡Pulsa ABRIR COFRE abajo!",\n                chestGoldRewardText: "+{gold} ORO",\n                duplicatePieceConverted: "({name} #{idx} ya poseído convertido!)",\n                puzzlePieceEarned: "Pieza {name} #{idx}",'),
    ('pt: {', 'pt: {\n                chestStarTitle: "BAÚ DE {stars} ESTRELA(S)! 🎁",\n                bonusChestStarTitle: "🏆 BAÚ BÔNUS DE {stars} ESTRELA(S)! 🎁",\n                chestInitialDesc: "Nível Concluído! Clique em ABRIR BAÚ abaixo!",\n                chestGoldRewardText: "+{gold} OURO",\n                duplicatePieceConverted: "({name} #{idx} já possuído convertido!)",\n                puzzlePieceEarned: "Peça {name} #{idx}",')
]

for old, new in chest_i18n_additions:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

# Add getPuzzleName method definition
get_puzzle_name_code = """
    getPuzzleName(puzzleId) {
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
    }
"""

if "getPuzzleName" not in js_content:
    insert_before = "    triggerChestRewardModal("
    if insert_before in js_content:
        js_content = js_content.replace(insert_before, get_puzzle_name_code + "\n" + insert_before, 1)

# Update triggerChestRewardModal title and description to use i18n
old_trigger_chest = """        const titleEl = document.getElementById('chest-modal-title');
        if (titleEl) {
            if (isBonus) {
                titleEl.innerText = `🏆 BONUS ${starLevel} YILDIZLI SANDIK! 🎁`;
            } else {
                titleEl.innerText = `${starLevel} YILDIZLI SANDIK! 🎁`;
            }
        }

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = 'Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!';"""

new_trigger_chest = """        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        const titleEl = document.getElementById('chest-modal-title');
        if (titleEl) {
            if (isBonus) {
                titleEl.innerText = (dict.bonusChestStarTitle || '🏆 BONUS {stars} YILDIZLI SANDIK! 🎁').replace('{stars}', starLevel);
            } else {
                titleEl.innerText = (dict.chestStarTitle || '{stars} YILDIZLI SANDIK! 🎁').replace('{stars}', starLevel);
            }
        }

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = dict.chestInitialDesc || 'Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!';"""

if old_trigger_chest in js_content:
    js_content = js_content.replace(old_trigger_chest, new_trigger_chest, 1)

# Update openChestBox reward rendering to use i18n and getPuzzleName
old_open_chest_box = """        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = '🏆 Sandıktan Çıkan Ödülleriniz:';

        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) {
            rewardListEl.innerHTML = '';
            
            if (goldReward > 0) {
                const item = document.createElement('div');
                item.className = 'chest-reward-item reward-gold';
                item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">+${goldReward} ALTIN</div>`;
                rewardListEl.appendChild(item);
            }

            if (awardedPieces.length > 0) {
                for (const piece of awardedPieces) {
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item reward-piece';
                    if (piece.isDuplicate) {
                        item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">+50 ALTIN <span class="dup-note">(Varolan ${piece.puzzleName} #${piece.pieceIndex + 1} Dönüştü!)</span></div>`;
                    } else {
                        item.innerHTML = `<div class="reward-icon">🧩</div><div class="reward-text">${piece.puzzleName} Parçası #${piece.pieceIndex + 1}</div>`;
                    }
                    rewardListEl.appendChild(item);
                }
            }
        }"""

new_open_chest_box = """        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = dict.chestRewardsDesc || '🏆 Sandıktan Çıkan Ödülleriniz:';

        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) {
            rewardListEl.innerHTML = '';
            
            if (goldReward > 0) {
                const item = document.createElement('div');
                item.className = 'chest-reward-item reward-gold';
                const goldText = (dict.chestGoldRewardText || '+{gold} ALTIN').replace('{gold}', goldReward);
                item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">${goldText}</div>`;
                rewardListEl.appendChild(item);
            }

            if (awardedPieces.length > 0) {
                for (const piece of awardedPieces) {
                    const item = document.createElement('div');
                    item.className = 'chest-reward-item reward-piece';
                    const localizedName = this.getPuzzleName(piece.puzzleId);
                    if (piece.isDuplicate) {
                        const dupMsg = (dict.duplicatePieceConverted || '(Varolan {name} #{idx} Dönüştü!)').replace('{name}', localizedName).replace('{idx}', piece.pieceIndex + 1);
                        item.innerHTML = `<div class="reward-icon">🪙</div><div class="reward-text">+50 ALTIN <span class="dup-note">${dupMsg}</span></div>`;
                    } else {
                        const pieceMsg = (dict.puzzlePieceEarned || '{name} Parçası #{idx}').replace('{name}', localizedName).replace('{idx}', piece.pieceIndex + 1);
                        item.innerHTML = `<div class="reward-icon">🧩</div><div class="reward-text">${pieceMsg}</div>`;
                    }
                    rewardListEl.appendChild(item);
                }
            }
        }"""

if old_open_chest_box in js_content:
    js_content = js_content.replace(old_open_chest_box, new_open_chest_box, 1)

# Update renderPuzzleGalleryModal title to use getPuzzleName
old_journal_title = "if (journalTitle) journalTitle.innerText = activePuzzle.name;"
new_journal_title = "if (journalTitle) journalTitle.innerText = this.getPuzzleName(activePuzzle.id);"
if old_journal_title in js_content:
    js_content = js_content.replace(old_journal_title, new_journal_title)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
