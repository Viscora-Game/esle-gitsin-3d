with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Add board-mat-frame inside #board-container in index.html
old_board_container = """            <!-- Main Stacked Pyramid Board Area -->
            <main id="board-container">
                <div id="board"></div>
            </main>"""

new_board_container = """            <!-- Main Stacked Pyramid Board Area -->
            <main id="board-container">
                <!-- Luxury Glassmorphic Board Mat Frame with Corner Accents -->
                <div class="board-mat-frame">
                    <div class="mat-corner corner-tl">✨</div>
                    <div class="mat-corner corner-tr">✨</div>
                    <div class="mat-corner corner-bl">✨</div>
                    <div class="mat-corner corner-br">✨</div>
                </div>
                <div id="board"></div>
            </main>"""

if old_board_container in html_content:
    html_content = html_content.replace(old_board_container, new_board_container, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Now add board-mat-frame styles in styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

mat_css = """
/* Luxury Glassmorphic Board Mat Frame & Corner Accents */
.board-mat-frame {
    position: absolute;
    inset: 10px 12px 14px 12px;
    background: rgba(15, 23, 42, 0.22);
    border: 2px dashed rgba(251, 191, 36, 0.28);
    border-radius: 24px;
    box-shadow: inset 0 0 35px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(3px);
    pointer-events: none;
    z-index: 0;
}

.mat-corner {
    position: absolute;
    font-size: 13px;
    color: #fbbf24;
    opacity: 0.45;
    user-select: none;
    pointer-events: none;
}

.mat-corner.corner-tl { top: 8px; left: 10px; }
.mat-corner.corner-tr { top: 8px; right: 10px; }
.mat-corner.corner-bl { bottom: 8px; left: 10px; }
.mat-corner.corner-br { bottom: 8px; right: 10px; }
"""

if ".board-mat-frame" not in css_content:
    css_content += mat_css

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print('Successfully added board-mat-frame to index.html and styles.css!')
