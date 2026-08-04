import re

with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any single-quoted i18n value line containing an internal apostrophe
# e.g. key: 'text with ' inside' -> key: "text with ' inside"
def fix_line(match):
    key = match.group(1)
    val = match.group(2)
    return f'{key}: "{val}"'

# Regex matches key: 'val' where val contains single quotes
content = re.sub(r"(\b[a-zA-Z0-9_]+\b):\s*'([^'\n]*'[^'\n]*)'", fix_line, content)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
