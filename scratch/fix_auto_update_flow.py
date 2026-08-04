# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

old_sw_block = """    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js?v=6.0.0').then((reg) => {
            reg.update();

            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('Yeni surum yuklendi, sayfa yenileniyor...');
                  window.location.reload();
                }
              });
            });
          }).catch((err) => {
            console.error('ServiceWorker Kayit Hatasi:', err);
          });
        });
      }
    </script>"""

new_sw_block = """    <script>
      if ('serviceWorker' in navigator) {
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });

        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js?v=6.0.0').then((reg) => {
            reg.update();
            setInterval(() => { reg.update(); }, 15000);
          }).catch((err) => {
            console.error('ServiceWorker Kayit Hatasi:', err);
          });
        });
      }
    </script>"""

if old_sw_block in html_content:
    html_content = html_content.replace(old_sw_block, new_sw_block)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# 2. Update game.js btnForceUpdate handler
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

old_force_btn = """        const btnForceUpdate = document.getElementById('btn-force-update');
        if (btnForceUpdate) {
            btnForceUpdate.onclick = () => {
                try {
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(regs => {
                            for (let reg of regs) reg.unregister();
                        });
                    }
                    if ('caches' in window) {
                        caches.keys().then(keys => {
                            for (let key of keys) caches.delete(key);
                        });
                    }
                } catch (e) {}

                // Instant hard cache reload using location bypass
                const targetUrl = window.location.origin + window.location.pathname + '?v=' + Date.now();
                window.location.href = targetUrl;
            };
        }"""

new_force_btn = """        const btnForceUpdate = document.getElementById('btn-force-update');
        if (btnForceUpdate) {
            btnForceUpdate.onclick = async () => {
                btnForceUpdate.innerText = '⚡ GÜNCELLENİYOR...';
                try {
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                    }
                    if ('serviceWorker' in navigator) {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        await Promise.all(regs.map(reg => reg.unregister()));
                    }
                } catch (e) {
                    console.error('Update error:', e);
                }

                // Force clean reload bypass cache
                window.location.href = window.location.origin + window.location.pathname + '?nocache=' + Date.now();
            };
        }"""

if old_force_btn in js_content:
    js_content = js_content.replace(old_force_btn, new_force_btn)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

import subprocess
res = subprocess.run(['node', '-c', 'game.js'], capture_output=True, text=True)
print('Node Syntax Check Return Code:', res.returncode)
print('Node Stdout:', res.stdout)
print('Node Stderr:', res.stderr)
