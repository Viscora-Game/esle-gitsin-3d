# 1. Update manifest.json to display: "fullscreen"
with open('manifest.json', 'r', encoding='utf-8') as f:
    web_manifest = f.read()

web_manifest = web_manifest.replace('"display": "standalone"', '"display": "fullscreen"')

with open('manifest.json', 'w', encoding='utf-8') as f:
    f.write(web_manifest)

# 2. Update twa_project/twa-manifest.json to display: "fullscreen", versionCode 11, v6.8.0
with open('twa_project/twa-manifest.json', 'r', encoding='utf-8') as f:
    manifest_twa = f.read()

manifest_twa = manifest_twa.replace('"display": "standalone"', '"display": "fullscreen"')
manifest_twa = manifest_twa.replace('"appVersionCode": 10', '"appVersionCode": 11')
manifest_twa = manifest_twa.replace('"appVersionName": "6.7.0"', '"appVersionName": "6.8.0"')
manifest_twa = manifest_twa.replace('"appVersion": "6.7.0"', '"appVersion": "6.8.0"')

with open('twa_project/twa-manifest.json', 'w', encoding='utf-8') as f:
    f.write(manifest_twa)

# 3. Update twa_project/app/build.gradle to versionCode 11 & v6.8.0
with open('twa_project/app/build.gradle', 'r', encoding='utf-8') as f:
    gradle_content = f.read()

gradle_content = gradle_content.replace('versionCode 10', 'versionCode 11')
gradle_content = gradle_content.replace('versionName "6.7.0"', 'versionName "6.8.0"')

with open('twa_project/app/build.gradle', 'w', encoding='utf-8') as f:
    f.write(gradle_content)

# 4. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

html_content = html_content.replace('game.js?v=6.7.0', 'game.js?v=6.8.0')
html_content = html_content.replace('sw.js?v=6.7.0', 'sw.js?v=6.8.0')
html_content = html_content.replace('v6.7.0', 'v6.8.0')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 5. Update sw.js
with open('sw.js', 'r', encoding='utf-8') as f:
    sw_content = f.read()

sw_content = sw_content.replace('esle-gitsin-3d-v6.7.0', 'esle-gitsin-3d-v6.8.0')

with open('sw.js', 'w', encoding='utf-8') as f:
    f.write(sw_content)

# 6. Update twa_project/app/src/main/AndroidManifest.xml for Fullscreen activity theme
with open('twa_project/app/src/main/AndroidManifest.xml', 'r', encoding='utf-8') as f:
    android_manifest = f.read()

android_manifest = android_manifest.replace(
    'android:theme="@android:style/Theme.Translucent.NoTitleBar"',
    'android:theme="@android:style/Theme.NoTitleBar.Fullscreen"'
)

with open('twa_project/app/src/main/AndroidManifest.xml', 'w', encoding='utf-8') as f:
    f.write(android_manifest)

print("Immersive Fullscreen enabled & version bumped to versionCode 11 / v6.8.0!")
