with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update rearrangeSlotTiles math in game.js
old_rearrange = """        const trayW = 390;
        const standard5Capacity = 5;
        const spacing = (trayW - 20) / standard5Capacity;
        const startX = 10 + (spacing - this.cardW) / 2;

        for (let i = 0; i < total; i++) {
            const tile = this.slotTiles[i];

            if (i < 5) {
                // Bottom Tray 5 Standard Slots (Always 100% Standard Full Size!)
                const targetX = startX + (i * spacing);
                const targetY = 10;"""

new_rearrange = """        const trayW = 410;
        const standard5Capacity = 5;
        const spacing = 82;
        const startX = 7;

        for (let i = 0; i < total; i++) {
            const tile = this.slotTiles[i];

            if (i < 5) {
                // Bottom Tray 5 Standard Slots (100% Centered inside Slot Marker Frames!)
                const targetX = startX + (i * spacing);
                const targetY = 10;"""

if old_rearrange in content:
    content = content.replace(old_rearrange, new_rearrange)
    print('Updated rearrangeSlotTiles positioning math!')

# 2. Update btnCollectChest event listener in initUI to advance directly to next level
old_collect_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.addEventListener('click', () => {
            document.getElementById('modal-chest').classList.add('hidden');
            document.getElementById('victory-score').innerText = this.score;
            document.getElementById('modal-victory').classList.remove('hidden');
        });"""

new_collect_bind = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.addEventListener('click', () => {
            document.getElementById('modal-chest').classList.add('hidden');
            this.startLevel(this.level + 1, false, this.currentMode);
        });"""

if old_collect_bind in content:
    content = content.replace(old_collect_bind, new_collect_bind)
    print('Updated btnCollectChest to directly start next level!')

# 3. Add 400ms click protection to btn-collect-chest when chest opens
old_trigger = """        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');"""

new_trigger = """        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.add('hidden');

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.style.pointerEvents = 'none';

        const modalChest = document.getElementById('modal-chest');
        if (modalChest) modalChest.classList.remove('hidden');"""

if old_trigger in content:
    content = content.replace(old_trigger, new_trigger)
    print('Added click protection when chest modal triggers!')

# Re-enable btn-collect-chest inside openChestBox after 400ms
old_open = """        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');"""

new_open = """        const rewardContent = document.getElementById('chest-reward-content');
        if (rewardContent) rewardContent.classList.remove('hidden');

        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.style.pointerEvents = 'none';
            setTimeout(() => { btnCollectChest.style.pointerEvents = 'auto'; }, 450);
        }"""

if old_open in content:
    content = content.replace(old_open, new_open)
    print('Re-enabled btnCollectChest after 450ms delay in openChestBox!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
