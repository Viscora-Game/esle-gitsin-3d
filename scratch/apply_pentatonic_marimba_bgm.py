with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Update Audio path to audio/bgm_cute.wav
old_audio_path = "this.bgMusic = new Audio('audio/bgm_cute.mp3');"
new_audio_path = "this.bgMusic = new Audio('audio/bgm_cute.wav');"

if old_audio_path in js_content:
    js_content = js_content.replace(old_audio_path, new_audio_path, 1)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# Update sw.js cache path
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

old_sw_path = "'./audio/bgm_cute.mp3'"
new_sw_path = "'./audio/bgm_cute.wav'"

if old_sw_path in sw_content:
    sw_content = sw_content.replace(old_sw_path, new_sw_path, 1)

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
