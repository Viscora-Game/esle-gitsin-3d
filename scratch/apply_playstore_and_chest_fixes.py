with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add global contextmenu preventer at the end of game.js
contextmenu_code = """
// Prevent native context menu & long-press menus globally for Play Store / Native App mode
window.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
"""

if "window.addEventListener('contextmenu'" not in content:
    content += contextmenu_code
    print('Added global contextmenu prevention!')

# 2. Enhance wrong piece drop handling in handlePlacePuzzlePiece
wrong_piece_target = """        if (pieceIndex !== targetSlotIndex) {
            this.sound.playLockThud();
            this.triggerVibration();
            this.showToast(`Bu parça #${pieceIndex + 1} numaralı yuvaya aittir!`);
            return;
        }"""

wrong_piece_replacement = """        if (pieceIndex !== targetSlotIndex) {
            this.sound.playLockThud();
            this.triggerVibration();

            const targetSlot = document.querySelector(`[data-slot-index="${targetSlotIndex}"]`);
            if (targetSlot) {
                targetSlot.classList.add('shake-reject');
                setTimeout(() => targetSlot.classList.remove('shake-reject'), 450);
            }

            this.showToast(`❌ Yanlış Yuva! Bu parça #${pieceIndex + 1} numaralı yuvaya aittir. Envantere geri döndü.`);
            return;
        }"""

if wrong_piece_target in content:
    content = content.replace(wrong_piece_target, wrong_piece_replacement)
    print('Enhanced wrong piece drop shake-reject animation!')

# 3. Ensure victory trigger hides modal-victory before opening modal-chest
vic_hide_target = """                if (this.level % 10 === 0) {
                    const starRating = this.rollBonusChestStarRating();
                    this.triggerChestRewardModal(starRating, true);
                } else {
                    const starRating = this.rollChestStarRating();
                    this.triggerChestRewardModal(starRating, false);
                }"""

vic_hide_replacement = """                const vicModal = document.getElementById('modal-victory');
                if (vicModal) vicModal.classList.add('hidden');

                if (this.level % 10 === 0) {
                    const starRating = this.rollBonusChestStarRating();
                    this.triggerChestRewardModal(starRating, true);
                } else {
                    const starRating = this.rollChestStarRating();
                    this.triggerChestRewardModal(starRating, false);
                }"""

if vic_hide_target in content:
    content = content.replace(vic_hide_target, vic_hide_replacement)
    print('Ensured modal-victory is hidden when chest modal opens!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
