with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove pointerEvents hacks from triggerChestRewardModal
bad_trigger = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) btnCollectChest.style.pointerEvents = 'none';"""

if bad_trigger in content:
    content = content.replace(bad_trigger, '')
    print('Removed pointerEvents hack from triggerChestRewardModal!')

# Remove pointerEvents hacks from openChestBox
bad_open = """        const btnCollectChest = document.getElementById('btn-collect-chest');
        if (btnCollectChest) {
            btnCollectChest.style.pointerEvents = 'none';
            setTimeout(() => { btnCollectChest.style.pointerEvents = 'auto'; }, 450);
        }"""

if bad_open in content:
    content = content.replace(bad_open, '')
    print('Removed pointerEvents hack from openChestBox!')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
