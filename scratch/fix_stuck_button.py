with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update btnCollectChest in initUI to be 100% unconditional
old_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.onclick = () => {
            if (!this.canCollectRewards) return;
            this.sound.playClick();
            document.getElementById('modal-chest').classList.add('hidden');
            this.startLevel(this.level + 1, false, this.currentMode);
        };"""

new_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.onclick = () => {
                try { this.sound.playClick(); } catch (e) {}
                const modalChest = document.getElementById('modal-chest');
                if (modalChest) modalChest.classList.add('hidden');
                this.startLevel(this.level + 1, false, this.currentMode);
            };
        }"""

if old_bind in content:
    content = content.replace(old_bind, new_bind)
    print('Updated btnCollectChest to be 100% unconditional!')

# 2. Update triggerChestRewardModal to remove canClickChest
old_trigger = """    triggerChestRewardModal(starLevel, isBonus) {
        this.canClickChest = false;
        setTimeout(() => { this.canClickChest = true; }, 600);"""

new_trigger = """    triggerChestRewardModal(starLevel, isBonus) {"""

if old_trigger in content:
    content = content.replace(old_trigger, new_trigger)
    print('Removed canClickChest block from triggerChestRewardModal!')

# 3. Update openChestBox to remove canClickChest and canCollectRewards checks
old_open = """    openChestBox() {
        if (!this.canClickChest) return;
        if (!this.pendingChestReward) return;

        this.canCollectRewards = false;
        setTimeout(() => { this.canCollectRewards = true; }, 500);"""

new_open = """    openChestBox() {
        if (!this.pendingChestReward) return;"""

if old_open in content:
    content = content.replace(old_open, new_open)
    print('Removed canClickChest and canCollectRewards checks from openChestBox!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
