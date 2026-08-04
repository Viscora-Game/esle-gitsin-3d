# 1. Update twa_project/app/build.gradle to versionCode 14 & v7.1.0
with open('twa_project/app/build.gradle', 'r', encoding='utf-8') as f:
    gradle_content = f.read()

gradle_content = gradle_content.replace('versionCode 13', 'versionCode 14')
gradle_content = gradle_content.replace('versionName "7.0.0"', 'versionName "7.1.0"')

with open('twa_project/app/build.gradle', 'w', encoding='utf-8') as f:
    f.write(gradle_content)

# 2. Update twa_project/twa-manifest.json to versionCode 14 & v7.1.0
with open('twa_project/twa-manifest.json', 'r', encoding='utf-8') as f:
    manifest_twa = f.read()

manifest_twa = manifest_twa.replace('"appVersionCode": 13', '"appVersionCode": 14')
manifest_twa = manifest_twa.replace('"appVersionName": "7.0.0"', '"appVersionName": "7.1.0"')
manifest_twa = manifest_twa.replace('"appVersion": "7.0.0"', '"appVersion": "7.1.0"')

with open('twa_project/twa-manifest.json', 'w', encoding='utf-8') as f:
    f.write(manifest_twa)

# 3. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

html_content = html_content.replace('game.js?v=7.0.0', 'game.js?v=7.1.0')
html_content = html_content.replace('sw.js?v=7.0.0', 'sw.js?v=7.1.0')
html_content = html_content.replace('v7.0.0', 'v7.1.0')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 4. Update sw.js
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

sw_content = sw_content.replace('esle-gitsin-3d-v7.0.0', 'esle-gitsin-3d-v7.1.0')

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

print("Bumped to versionCode 14 & versionName 7.1.0!")
