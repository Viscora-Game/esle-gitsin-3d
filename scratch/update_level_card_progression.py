with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Update activeTypesCount to 5 base types (includes Shiba in levels 1-10, Unicorn in 11-20)
old_types_calc = "const activeTypesCount = Math.min(this.types.length, 4 + Math.floor((this.level - 1) / 10) * 2);"
new_types_calc = "const activeTypesCount = Math.min(this.types.length, 5 + Math.floor((this.level - 1) / 10));"

if old_types_calc in js_content:
    js_content = js_content.replace(old_types_calc, new_types_calc, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
