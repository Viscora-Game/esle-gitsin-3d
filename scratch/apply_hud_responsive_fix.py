import re

# Step 1: Update styles.css for responsive HUD and booster pills
with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace booster pill CSS in styles.css
old_booster_css = """.hud-bottom-boosters {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.booster-pill {
    flex: 1;
    max-width: 120px;
    padding: 6px 8px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, filter 0.2s ease;
}"""

new_booster_css = """.hud-bottom-boosters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    overflow: hidden;
}

.booster-pill {
    flex: 1 1 0;
    min-width: 0;
    padding: 6px 4px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    font-size: clamp(9px, 2.5vw, 12px);
    font-weight: 900;
    cursor: pointer;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, filter 0.2s ease;
    overflow: hidden;
}"""

if old_booster_css in css_content:
    css_content = css_content.replace(old_booster_css, new_booster_css)
    print('Updated hud-bottom-boosters and booster-pill CSS!')

# Update booster text & cost badge CSS
old_text_css = """.booster-text {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.2px;
}"""

new_text_css = """.booster-text {
    font-size: clamp(9px, 2.5vw, 11px);
    font-weight: 900;
    letter-spacing: 0.1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
}

.cost-badge {
    background: var(--accent-gold);
    color: #0f172a;
    font-size: clamp(8px, 2.2vw, 10px);
    font-weight: 900;
    padding: 2px 4px;
    border-radius: 6px;
    transition: all 0.2s ease;
    flex-shrink: 0;
    white-space: nowrap;
}"""

if old_text_css in css_content:
    css_content = css_content.replace(old_text_css, new_text_css)
    print('Updated booster-text and cost-badge CSS!')

# Update hud-item & hud-info-group CSS
old_hud_item = """.hud-item {
    background: rgba(255, 255, 255, 0.08);
    padding: 5px 10px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
}"""

new_hud_item = """.hud-item {
    background: rgba(255, 255, 255, 0.08);
    padding: 4px 6px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 3px;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    flex-shrink: 1;
    min-width: 0;
    white-space: nowrap;
}"""

if old_hud_item in css_content:
    css_content = css_content.replace(old_hud_item, new_hud_item)
    print('Updated hud-item CSS!')

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

# Step 2: Update game.js for concise Italian and Portuguese booster labels
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = js_content.replace('hintLabel: "SUGGERIMENTO"', 'hintLabel: "SUGGERIM."')
js_content = js_content.replace('shuffleBtnLabel: "EMBARALHAR"', 'shuffleBtnLabel: "MISTURAR"')

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Updated Italian and Portuguese booster labels in game.js!')
