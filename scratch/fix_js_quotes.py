with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix un-escaped single quotes in i18n dictionary
content = content.replace("timeUpTitle: 'TIME'S UP!'", "timeUpTitle: \"TIME'S UP!\"")
content = content.replace("defeatDesc: 'Plus d'espace disponible sur le plateau.'", "defeatDesc: \"Plus d'espace disponible sur le plateau.\"")
content = content.replace("timeUpDesc: 'Le temps s'est écoulé dans le contre-la-montre!'", "timeUpDesc: \"Le temps s'est écoulé dans le contre-la-montre!\"")
content = content.replace("slotAdded: 'Emplacement d'urgence débloqué! 🚨'", "slotAdded: \"Emplacement d'urgence débloqué! 🚨\"")

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
