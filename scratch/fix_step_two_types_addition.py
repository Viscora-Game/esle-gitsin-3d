with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Update formula to base 5 + 2 extra types every 10 levels
old_formula = "const activeTypesCount = Math.min(this.types.length, 5 + Math.floor((this.level - 1) / 10));"
new_formula = "const activeTypesCount = Math.min(this.types.length, 5 + Math.floor((this.level - 1) / 10) * 2);"

if old_formula in js_content:
    js_content = js_content.replace(old_formula, new_formula, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
