with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Bind #btn-menu-journal and page flipping buttons in initUI()
target_bind = "const btnGallery = document.getElementById('btn-open-gallery');"

addition_bind = """const btnMenuJournal = document.getElementById('btn-menu-journal');
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

        const btnGallery = document.getElementById('btn-open-gallery');"""

if target_bind in content:
    content = content.replace(target_bind, addition_bind)
    print('Bound Journal menu button and page flipping buttons!')

# 2. Update renderPuzzleGalleryModal to set journal page title & page num, and clipPath on slots & inventory items
slot_target = "slot.className = `puzzle-slot ${placedPieces.includes(i) ? 'filled' : ''}`;"
slot_replacement = """slot.className = `puzzle-slot jigsaw-shaped ${placedPieces.includes(i) ? 'filled' : ''}`;
                slot.style.clipPath = `url(#jigsaw-clip-${i})`;
                slot.style.webkitClipPath = `url(#jigsaw-clip-${i})`;"""

if slot_target in content:
    content = content.replace(slot_target, slot_replacement)
    print('Updated puzzle slots with jigsaw clip-path!')

piece_target = "pieceEl.className = 'puzzle-piece-item';"
piece_replacement = """pieceEl.className = 'puzzle-piece-item jigsaw-shaped';
                    pieceEl.style.clipPath = `url(#jigsaw-clip-${pItem.pieceIndex})`;
                    pieceEl.style.webkitClipPath = `url(#jigsaw-clip-${pItem.pieceIndex})`;"""

if piece_target in content:
    content = content.replace(piece_target, piece_replacement)
    print('Updated inventory puzzle pieces with jigsaw clip-path!')

# Header update in renderPuzzleGalleryModal
render_header_target = "const activePuzzle = this.puzzlesCatalog.find(p => p.id === this.activePuzzleId) || this.puzzlesCatalog[0];"
render_header_replacement = """const activeIdx = this.puzzlesCatalog.findIndex(p => p.id === this.activePuzzleId);
        const activePuzzle = this.puzzlesCatalog[activeIdx >= 0 ? activeIdx : 0] || this.puzzlesCatalog[0];
        
        const titleEl = document.getElementById('journal-picture-title');
        if (titleEl) titleEl.innerText = activePuzzle.name;

        const pageNumEl = document.getElementById('journal-page-num');
        if (pageNumEl) pageNumEl.innerText = `Sayfa ${activeIdx + 1} / ${this.puzzlesCatalog.length}`;"""

if render_header_target in content:
    content = content.replace(render_header_target, render_header_replacement)
    print('Updated Journal header & page counter in renderPuzzleGalleryModal!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
