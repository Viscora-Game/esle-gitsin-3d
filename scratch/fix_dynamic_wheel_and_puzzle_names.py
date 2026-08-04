with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Add getLocalizedPuzzleName & getWheelSliceLabel helper methods to TileMatchingGame
helper_methods = """    getLocalizedPuzzleName(puzzleId) {
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        if (dict.puzzles && dict.puzzles[puzzleId]) {
            return dict.puzzles[puzzleId];
        }
        if (this.puzzles) {
            const p = this.puzzles.find(x => x.id === puzzleId);
            if (p) return p.name;
        }
        return puzzleId;
    }

    getWheelSliceLabel(slice) {
        const dict = this.i18n[this.settings.lang] || this.i18n.tr;
        if (slice.type === 'gold') {
            return `${slice.amount} ${dict.goldLabel || 'ALTIN'}`;
        } else if (slice.type === 'piece') {
            const pWord = slice.count > 1 ? (dict.piecesWord || 'PARÇA') : (dict.pieceWord || 'PARÇA');
            return `${slice.count} ${pWord}`;
        } else {
            return dict.pasText || 'PAS ❌';
        }
    }"""

if "getLocalizedPuzzleName(" not in js_content:
    target_start = "class TileMatchingGame {"
    idx = js_content.find(target_start)
    if idx != -1:
        insert_idx = js_content.find("constructor() {", idx)
        js_content = js_content[:insert_idx] + helper_methods + "\n\n    " + js_content[insert_idx:]

# 2. Update renderWheelCanvas to use getWheelSliceLabel
old_canvas_text = "ctx.fillText(`${segments[i].icon} ${segments[i].text}`, r - 12, 4);"
new_canvas_text = "ctx.fillText(`${segments[i].icon} ${this.getWheelSliceLabel(segments[i])}`, r - 12, 4);"

if old_canvas_text in js_content:
    js_content = js_content.replace(old_canvas_text, new_canvas_text)

# 3. Update renderPuzzleGalleryModal header title & inventory cards to use getLocalizedPuzzleName
old_title_line = "const puzzleDict = (dict.puzzles && dict.puzzles[puzzle.id]) ? dict.puzzles[puzzle.id] : puzzle.name;\n        document.getElementById('gallery-puzzle-title').innerText = puzzleDict;"
new_title_line = "document.getElementById('gallery-puzzle-title').innerText = this.getLocalizedPuzzleName(puzzle.id);"

if old_title_line in js_content:
    js_content = js_content.replace(old_title_line, new_title_line)

# Replace hardcoded item.puzzleName in inventory cards
old_inv_card_title = "${item.puzzleName}"
new_inv_card_title = "${this.getLocalizedPuzzleName(item.puzzleId)}"

if old_inv_card_title in js_content:
    js_content = js_content.replace(old_inv_card_title, new_inv_card_title)

# 4. Make applyLanguage re-render Wheel Canvas and Puzzle Gallery Modal
old_apply_lang = "this.renderTutorialStep();"
new_apply_lang = """this.renderTutorialStep();
        this.renderWheelCanvas();
        const modalGallery = document.getElementById('modal-puzzle-gallery');
        if (modalGallery && !modalGallery.classList.contains('hidden')) {
            this.renderPuzzleGalleryModal();
        }"""

if old_apply_lang in js_content and "this.renderWheelCanvas();" not in js_content[js_content.find("applyLanguage()"):js_content.find("applyLanguage()") + 1000]:
    # Replace in applyLanguage
    apply_lang_idx = js_content.find("applyLanguage() {")
    if apply_lang_idx != -1:
        tut_idx = js_content.find("this.renderTutorialStep();", apply_lang_idx)
        if tut_idx != -1:
            js_content = js_content[:tut_idx] + new_apply_lang + js_content[tut_idx + len("this.renderTutorialStep();"):]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
