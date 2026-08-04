with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

bad = 'const targetSlot = document.querySelector(`[data-slot-index="${targetSlotIndex}"]`);'
good = 'const targetSlot = document.querySelector ? document.querySelector(`[data-slot-index="${targetSlotIndex}"]`) : null;'

if bad in content:
    content = content.replace(bad, good)
    with open('game.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated querySelector check safely!')

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
