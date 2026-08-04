    // =========================================================
    // CHEST REWARD SYSTEM (EVERY 10 LEVELS)
    // =========================================================

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

    triggerChestRewardModal(starLevel) {
        const starsText = '⭐️'.repeat(starLevel);
        const starDisp = document.getElementById('chest-star-display');
        if (starDisp) starDisp.innerText = starsText;

        const titleEl = document.getElementById('chest-modal-title');
        if (titleEl) titleEl.innerText = `${starLevel} YILDIZLI SEVİYE SANDIĞI! 🎁`;

        const chestBox = document.getElementById('chest-box');
        if (chestBox) {
            chestBox.innerText = '📦';
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

        const activePuzzle = this.puzzlesCatalog.find(p => p.id === this.activePuzzleId) || this.puzzlesCatalog[0];
        const placedPieces = this.placedPuzzlePieces[activePuzzle.id] || [];
        const isCompleted = placedPieces.length === 12;

        const badge = document.getElementById('puzzle-completed-badge');
        if (badge) {
            if (isCompleted) badge.classList.remove('hidden');
            else badge.classList.add('hidden');
        }

        const gridEl = document.getElementById('puzzle-board-grid');
        if (gridEl) {
            gridEl.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const col = i % 3;
                const row = Math.floor(i / 3);

                const slot = document.createElement('div');
                slot.className = `puzzle-slot ${placedPieces.includes(i) ? 'filled' : ''}`;
                slot.dataset.slotIndex = i;

                if (placedPieces.includes(i)) {
                    slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                    slot.style.backgroundSize = '300% 400%';
                    slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;
                } else {
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
                    pieceEl.className = 'puzzle-piece-item';
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
            this.showToast(`Bu parça #${pieceIndex + 1} numaralı yuvaya aittir!`);
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
