with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update renderPuzzleGalleryModal slot rendering loop
target_code = """        const gridEl = document.getElementById('puzzle-board-grid');
        if (gridEl) {
            gridEl.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const col = i % 3;
                const row = Math.floor(i / 3);

                const slot = document.createElement('div');
                slot.className = `puzzle-slot jigsaw-shaped ${placedPieces.includes(i) ? 'filled' : ''}`;
                slot.style.clipPath = `url(#jigsaw-clip-${i})`;
                slot.style.webkitClipPath = `url(#jigsaw-clip-${i})`;
                slot.setAttribute('data-slot-index', i);

                slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                slot.style.backgroundSize = '300% 400%';
                slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;

                if (placedPieces.includes(i)) {
                    slot.classList.remove('watermark');
                    slot.innerText = '';
                } else {
                    slot.classList.add('watermark');
                    slot.innerText = `#${i + 1}`;
                }"""

replacement_code = """        const wrapperEl = document.querySelector('.puzzle-board-wrapper');
        if (wrapperEl) {
            wrapperEl.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
            wrapperEl.style.backgroundSize = 'cover';
            wrapperEl.style.backgroundPosition = 'center';
        }

        const gridEl = document.getElementById('puzzle-board-grid');
        if (gridEl) {
            gridEl.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const col = i % 3;
                const row = Math.floor(i / 3);

                const slot = document.createElement('div');
                slot.setAttribute('data-slot-index', i);

                if (placedPieces.includes(i)) {
                    slot.className = 'puzzle-slot jigsaw-shaped filled';
                    slot.style.backgroundImage = `url(${activePuzzle.imgSrc})`;
                    slot.style.backgroundSize = '300% 400%';
                    slot.style.backgroundPosition = `${col * 50}% ${row * 33.333}%`;
                    slot.style.clipPath = `url(#jigsaw-clip-${i})`;
                    slot.style.webkitClipPath = `url(#jigsaw-clip-${i})`;
                    slot.innerText = '';
                } else {
                    slot.className = 'puzzle-slot jigsaw-shaped empty';
                    slot.style.backgroundImage = 'none';
                    slot.innerText = `#${i + 1}`;
                }"""

if target_code in content:
    content = content.replace(target_code, replacement_code)
    print('Updated renderPuzzleGalleryModal jigsaw slot rendering logic!')
else:
    print('Target code not found, checking alternative...')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
