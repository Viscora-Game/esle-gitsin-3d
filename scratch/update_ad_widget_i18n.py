with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

dict_updates = [
    ('tr: {', 'tr: {\n                adWidgetTag: "ÜCRETSİZ",'),
    ('en: {', 'en: {\n                adWidgetTag: "FREE",'),
    ('de: {', 'de: {\n                adWidgetTag: "GRATIS",'),
    ('fr: {', 'fr: {\n                adWidgetTag: "GRATUIT",'),
    ('it: {', 'it: {\n                adWidgetTag: "GRATIS",'),
    ('es: {', 'es: {\n                adWidgetTag: "GRATIS",'),
    ('pt: {', 'pt: {\n                adWidgetTag: "GRÁTIS",')
]

for old, new in dict_updates:
    if old in js_content:
        js_content = js_content.replace(old, new, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
