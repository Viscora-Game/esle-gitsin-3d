import re

# Step 1: Update index.html to add data-i18n to all text elements
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements_html = [
    ('<span>📖 YAPBOZ GÜNLÜĞÜ</span>', '<span data-i18n="journalBtnText">📖 YAPBOZ GÜNLÜĞÜ</span>'),
    ('<span>⚙️ AYARLAR</span>', '<span data-i18n="settingsTitle">⚙️ AYARLAR</span>'),
    ('<span>📖 NASIL OYNANIR? (REHBER)</span>', '<span data-i18n="howToPlayBtnText">📖 NASIL OYNANIR? (REHBER)</span>'),
    ('<span>🔄 SIFIRLA VE YENİ OYUN BAŞLAT</span>', '<span data-i18n="newGameBtn">🔄 SIFIRLA VE YENİ OYUN BAŞLAT</span>'),
    ('<h2 class="modal-title">🔄 HANGİ MOD SIFIRLANSIN?</h2>', '<h2 class="modal-title" data-i18n="resetModalTitle">🔄 HANGİ MOD SIFIRLANSIN?</h2>'),
    ('<p class="reset-desc">Sıfırlamak istediğiniz oyun modunu seçin:</p>', '<p class="reset-desc" data-i18n="resetModalDesc">Sıfırlamak istediğiniz oyun modunu seçin:</p>'),
    ('<span>🎮 KLASİK MODU SIFIRLA</span>', '<span data-i18n="resetClassicBtn">🎮 KLASİK MODU SIFIRLA</span>'),
    ('<span>⏱️ ZAMANA KARŞI MODU SIFIRLA</span>', '<span data-i18n="resetTimeTrialBtn">⏱️ ZAMANA KARŞI MODU SIFIRLA</span>'),
    ('<span>💥 HER İKİ MODU DA SIFIRLA</span>', '<span data-i18n="resetBothBtn">💥 HER İKİ MODU DA SIFIRLA</span>'),
    ('<span class="hud-label">SEVİYE</span>', '<span class="hud-label" data-i18n="levelLabel">SEVİYE</span>'),
    ('<span class="hud-label">ALTIN</span>', '<span class="hud-label" data-i18n="goldLabel">ALTIN</span>'),
    ('<span class="booster-text">İPUCU</span>', '<span class="booster-text" data-i18n="hintLabel">İPUCU</span>'),
    ('<span class="booster-text">+1 SLOT</span>', '<span class="booster-text" data-i18n="slotBtnLabel">+1 SLOT</span>'),
    ('<span class="booster-text">KARIŞTIR</span>', '<span class="booster-text" data-i18n="shuffleBtnLabel">KARIŞTIR</span>'),
    ('<div class="extra-slot-badge">🚨 ACİL SLOT</div>', '<div class="extra-slot-badge" data-i18n="emergencySlotTitle">🚨 ACİL SLOT</div>'),
    ('<span>🎁 ÖDÜLLERİ AL</span>', '<span data-i18n="chestOpenBtn">🎁 ÖDÜLLERİ AL</span>'),
    ('<span>▶ ENVANTERE EKLE VE DEVAM ET</span>', '<span data-i18n="chestCollectBtn">▶ ENVANTERE EKLE VE DEVAM ET</span>'),
    ('<span class="journal-ribbon">📖 YAPBOZ GÜNLÜĞÜ</span>', '<span class="journal-ribbon" data-i18n="journalBtnText">📖 YAPBOZ GÜNLÜĞÜ</span>'),
    ('<button id="btn-prev-page" class="journal-nav-btn">◀ ÖNCEKİ SAYFA</button>', '<button id="btn-prev-page" class="journal-nav-btn" data-i18n="prevPageBtn">◀ ÖNCEKİ SAYFA</button>'),
    ('<button id="btn-next-page" class="journal-nav-btn">SONRAKİ SAYFA ▶</button>', '<button id="btn-next-page" class="journal-nav-btn" data-i18n="nextPageBtn">SONRAKİ SAYFA ▶</button>'),
    ('<h3 class="inventory-title">📦 ENVANTER (Parçaları Tahtaya Sürükleyin veya Dokunun):</h3>', '<h3 class="inventory-title" data-i18n="inventoryTitle">📦 ENVANTER (Parçaları Tahtaya Sürükleyin veya Dokunun):</h3>'),
    ('<span>🧩 1 Parça Al</span>', '<span data-i18n="buyPieceBtn">🧩 1 Parça Al</span>'),
    ('<span class="buy-cost-tag">🪙 100 Altın</span>', '<span class="buy-cost-tag" data-i18n="buyPieceCostTag">🪙 100 Altın</span>'),
    ('<button id="btn-tut-prev" class="btn-secondary tut-btn-prev hidden">⬅️ GERİ</button>', '<button id="btn-tut-prev" class="btn-secondary tut-btn-prev hidden" data-i18n="prevBtn">⬅️ GERİ</button>'),
    ('<button id="btn-tut-next" class="btn-primary tut-btn-next">İLERİ ➡️</button>', '<button id="btn-tut-next" class="btn-primary tut-btn-next" data-i18n="nextBtn">İLERİ ➡️</button>')
]

for old, new in replacements_html:
    if old in html:
        html = html.replace(old, new)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated index.html with complete data-i18n tags!')
