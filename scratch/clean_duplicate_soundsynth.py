with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find first class SoundSynth and second class SoundSynth
first_idx = content.find("class SoundSynth {")
second_idx = content.find("class SoundSynth {", first_idx + 1)
particle_idx = content.find("class ParticleFX {")

if second_idx != -1 and particle_idx != -1:
    content = content[:second_idx] + content[particle_idx:]

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
