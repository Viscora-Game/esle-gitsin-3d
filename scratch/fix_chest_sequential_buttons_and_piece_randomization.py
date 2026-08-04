with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Make sure btn-open-chest and chest-reward-content are properly hidden/shown sequentially
old_modal_html = """        <!-- CHEST OPENING REWARD MODAL -->
        <div id="modal-chest" class="modal-overlay hidden">
            <div class="modal-card chest-card">
                <div class="chest-star-rating">
                    <span id="chest-star-display">⭐️⭐️⭐️⭐️⭐️</span>
                </div>
                <h2 id="chest-modal-title" class="modal-title">ÖDÜL SANDIĞI! 🎁</h2>
                <p id="chest-modal-desc" class="modal-desc">Bölüm Başarısı! Sandığınızı açmak için aşağıdaki butona basın!</p>
                
                <div id="chest-box-container" class="chest-box-container">
                    <div id="chest-box" class="chest-box">📦</div>
                </div>

                <!-- Stage 1 Button: ÖDÜLLERİ AL 🎁 -->
                <button id="btn-open-chest" class="btn-primary chest-open-btn">
                    <span>🎁 ÖDÜLLERİ AL</span>
                </button>

                <!-- Stage 2 Content: Revealed Rewards List & Envantere Ekle Button -->
                <div id="chest-reward-content" class="chest-reward-content hidden">
                    <div id="chest-reward-list" class="chest-reward-list"></div>
                    <button id="btn-collect-chest" class="btn-primary collect-btn">
                        <span>▶ ENVANTERE EKLE VE DEVAM ET</span>
                    </button>
                </div>
            </div>
        </div>"""

new_modal_html = """        <!-- CHEST OPENING REWARD MODAL -->
        <div id="modal-chest" class="modal-overlay hidden">
            <div class="modal-card chest-card">
                <div class="chest-star-rating">
                    <span id="chest-star-display">⭐️⭐️⭐️⭐️⭐️</span>
                </div>
                <h2 id="chest-modal-title" class="modal-title">ÖDÜL SANDIĞI! 🎁</h2>
                <p id="chest-modal-desc" class="modal-desc">Bölüm Başarısı! Ödüllerinizi görmek için butona basın!</p>
                
                <div id="chest-box-container" class="chest-box-container">
                    <div id="chest-box" class="chest-box">📦</div>
                </div>

                <!-- Stage 1 Button: ÖDÜLLERİ AL 🎁 (Sadece 1. Aşamada Görünür) -->
                <button id="btn-open-chest" class="btn-primary chest-open-btn">
                    <span>🎁 ÖDÜLLERİ AL</span>
                </button>

                <!-- Stage 2 Content: Ödüller & Envantere Ekle (Sadece 2. Aşamada Görünür) -->
                <div id="chest-reward-content" class="chest-reward-content hidden">
                    <div id="chest-reward-list" class="chest-reward-list"></div>
                    <button id="btn-collect-chest" class="btn-primary collect-btn">
                        <span>▶ ENVANTERE EKLE VE DEVAM ET</span>
                    </button>
                </div>
            </div>
        </div>"""

if old_modal_html in html_content:
    html_content = html_content.replace(old_modal_html, new_modal_html)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print('Updated index.html modal-chest structure!')

with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Update triggerChestRewardModal to strictly hide Stage 2 and show Stage 1 button
old_trigger = """    triggerChestRewardModal(starLevel, isBonus) {
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

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = 'Sandığı açmak için kutuya dokunun!';

        const chestBoxContainer = document.getElementById('chest-box-container');
        if (chestBoxContainer) chestBoxContainer.onclick = () => this.openChestBox();
        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.onclick = () => this.openChestBox();
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.remove('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

new_trigger = """    triggerChestRewardModal(starLevel, isBonus) {
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

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = 'Bölüm Başarısı! Ödüllerinizi görmek için aşağıdaki ÖDÜLLERİ AL butonuna basın!';

        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.innerText = isBonus ? '🎁' : '📦';
            chestBox.style.display = 'inline-block';
        }

        // Show Stage 1 Button, Hide Stage 2 Content completely!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.remove('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');

        this.pendingChestReward = this.rollChestReward(starLevel);
    }"""

if old_trigger in js_content:
    js_content = js_content.replace(old_trigger, new_trigger)
    print('Updated triggerChestRewardModal for Stage 1 button visibility!')

# Update openChestBox to hide Stage 1 button and show Stage 2 content
old_open = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        if (reward.gold > 0) {
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        if (reward.pieces > 0) {
            const samplePieces = this.getPreviewMissingPieces(reward.pieces);
            for (const p of samplePieces) {
                const item = document.createElement('div');
                item.className = 'chest-reward-item';
                item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${p.puzzleName} (#${p.pieceIndex + 1})</span>`;
                if (rewardListEl) rewardListEl.appendChild(item);
            }
        }

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = '🏆 Sandıktan Çıkan Ödülleriniz:';

        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.add('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');
    }"""

new_open = """    openChestBox() {
        if (!this.pendingChestReward) return;

        const reward = this.pendingChestReward;
        const rewardListEl = document.getElementById('chest-reward-list');
        if (rewardListEl) rewardListEl.innerHTML = '';

        this.sound.playVictorySound();
        this.fx.spawnConfetti();

        if (reward.gold > 0) {
            const item = document.createElement('div');
            item.className = 'chest-reward-item';
            item.innerHTML = `<span class="reward-icon">🪙</span><span class="reward-val">+${reward.gold} ALTIN</span>`;
            if (rewardListEl) rewardListEl.appendChild(item);
        }

        if (reward.pieces > 0) {
            const samplePieces = this.getPreviewMissingPieces(reward.pieces);
            for (const p of samplePieces) {
                const item = document.createElement('div');
                item.className = 'chest-reward-item';
                item.innerHTML = `<span class="reward-icon">🧩</span><span class="reward-val">${p.puzzleName} (#${p.pieceIndex + 1})</span>`;
                if (rewardListEl) rewardListEl.appendChild(item);
            }
        }

        const chestBox = document.getElementById('chest-box');
        if (chestBox) chestBox.innerText = '✨';

        const descEl = document.getElementById('chest-modal-desc');
        if (descEl) descEl.innerText = '🏆 Sandıktan Çıkan Ödülleriniz:';

        // Hide Stage 1 Button, Unhide Stage 2 Content!
        const btnOpenChest = document.getElementById('btn-open-chest');
        if (btnOpenChest) btnOpenChest.classList.add('hidden');

        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');
    }"""

if old_open in js_content:
    js_content = js_content.replace(old_open, new_open)
    print('Updated openChestBox!')

# Update awardRandomMissingPuzzlePiece and getPreviewMissingPieces for TRULY RANDOM pieces across catalog
old_award = """    awardRandomMissingPuzzlePiece() {
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

        const piece = missing[0];
        this.puzzleInventory.push(piece);
        return piece;
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
    }"""

new_award = """    awardRandomMissingPuzzlePiece() {
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

        // Pick a TRULY RANDOM missing puzzle piece from any character in the catalog!
        const rIdx = Math.floor(Math.random() * missing.length);
        const piece = missing[rIdx];
        this.puzzleInventory.push(piece);
        return piece;
    }

    getPreviewMissingPieces(count) {
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

        this.shuffleArray(missing);
        return missing.slice(0, count);
    }"""

if old_award in js_content:
    js_content = js_content.replace(old_award, new_award)
    print('Updated awardRandomMissingPuzzlePiece & getPreviewMissingPieces for truly random character selection!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
