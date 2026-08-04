# 1. Update AndroidManifest.xml to add android:screenOrientation="portrait"
with open('twa_project/app/src/main/AndroidManifest.xml', 'r', encoding='utf-8') as f:
    manifest_xml = f.read()

if 'android:screenOrientation="portrait"' not in manifest_xml:
    manifest_xml = manifest_xml.replace(
        '<activity android:name="LauncherActivity"',
        '<activity android:name="LauncherActivity"\n            android:screenOrientation="portrait"'
    )

with open('twa_project/app/src/main/AndroidManifest.xml', 'w', encoding='utf-8') as f:
    f.write(manifest_xml)

# 2. Update twa_project/app/build.gradle and twa-manifest.json to versionCode 10 & v6.7.0
with open('twa_project/app/build.gradle', 'r', encoding='utf-8') as f:
    gradle_content = f.read()

gradle_content = gradle_content.replace('versionCode 9', 'versionCode 10')
gradle_content = gradle_content.replace('versionName "6.6.0"', 'versionName "6.7.0"')

with open('twa_project/app/build.gradle', 'w', encoding='utf-8') as f:
    f.write(gradle_content)

with open('twa_project/twa-manifest.json', 'r', encoding='utf-8') as f:
    manifest_twa = f.read()

manifest_twa = manifest_twa.replace('"appVersionCode": 9', '"appVersionCode": 10')
manifest_twa = manifest_twa.replace('"appVersionName": "6.6.0"', '"appVersionName": "6.7.0"')
manifest_twa = manifest_twa.replace('"appVersion": "6.6.0"', '"appVersion": "6.7.0"')

with open('twa_project/twa-manifest.json', 'w', encoding='utf-8') as f:
    f.write(manifest_twa)

# 3. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

html_content = html_content.replace('game.js?v=6.6.0', 'game.js?v=6.7.0')
html_content = html_content.replace('sw.js?v=6.6.0', 'sw.js?v=6.7.0')
html_content = html_content.replace('v6.6.0', 'v6.7.0')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 4. Update sw.js
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

sw_content = sw_content.replace('esle-gitsin-3d-v6.6.0', 'esle-gitsin-3d-v6.7.0')

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

print("Portrait mode locked in AndroidManifest.xml & version bumped to versionCode 10 / v6.7.0!")
