with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Update SoundSynth gains to make sound effects crisp & loud over background music
sound_gains = [
    ('gain.gain.setValueAtTime(0.35 * this.masterVolume', 'gain.gain.setValueAtTime(0.85 * this.masterVolume'),
    ('gain.gain.setValueAtTime(0.25 * this.masterVolume', 'gain.gain.setValueAtTime(0.80 * this.masterVolume'),
    ('gain.gain.setValueAtTime(0.45 * this.masterVolume', 'gain.gain.setValueAtTime(0.80 * this.masterVolume'),
    ('gain.gain.setValueAtTime(0.3 * this.masterVolume', 'gain.gain.setValueAtTime(0.70 * this.masterVolume'),
    ('gain.gain.setValueAtTime(0.4 * this.masterVolume', 'gain.gain.setValueAtTime(0.90 * this.masterVolume')
]

for old_gain, new_gain in sound_gains:
    js_content = js_content.replace(old_gain, new_gain)

# 2. Update updateMusicUI background music scaling to ultra-soft 0.05 max
old_scaling = 'const targetVol = (mVol / 100) * 0.15;'
new_scaling = 'const targetVol = (mVol / 100) * 0.05;'

if old_scaling in js_content:
    js_content = js_content.replace(old_scaling, new_scaling)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
