def make_jigsaw_path(top, right, bottom, left):
    d = ['M 0 0']
    if top == 'flat': d.append('L 1 0')
    elif top == 'tab': d.append('L 0.38 0 C 0.38 -0.18, 0.62 -0.18, 0.62 0 L 1 0')
    elif top == 'hole': d.append('L 0.38 0 C 0.38 0.18, 0.62 0.18, 0.62 0 L 1 0')
    
    if right == 'flat': d.append('L 1 1')
    elif right == 'tab': d.append('L 1 0.38 C 1.18 0.38, 1.18 0.62, 1 0.62 L 1 1')
    elif right == 'hole': d.append('L 1 0.38 C 0.82 0.38, 0.82 0.62, 1 0.62 L 1 1')
    
    if bottom == 'flat': d.append('L 0 1')
    elif bottom == 'tab': d.append('L 0.62 1 C 0.62 1.18, 0.38 1.18, 0.38 1 L 0 1')
    elif bottom == 'hole': d.append('L 0.62 1 C 0.62 0.82, 0.38 0.82, 0.38 1 L 0 1')
    
    if left == 'flat': d.append('L 0 0')
    elif left == 'tab': d.append('L 0 0.62 C -0.18 0.62, -0.18 0.38, 0 0.38 L 0 0')
    elif left == 'hole': d.append('L 0 0.62 C 0.18 0.62, 0.18 0.38, 0 0.38 L 0 0')
    
    d.append('Z')
    return ' '.join(d)

grid_types = [
    ('flat', 'tab', 'hole', 'flat'),
    ('flat', 'hole', 'tab', 'hole'),
    ('flat', 'flat', 'hole', 'tab'),
    ('tab', 'hole', 'tab', 'flat'),
    ('hole', 'tab', 'hole', 'tab'),
    ('tab', 'flat', 'tab', 'hole'),
    ('hole', 'tab', 'hole', 'flat'),
    ('tab', 'hole', 'tab', 'hole'),
    ('hole', 'flat', 'hole', 'tab'),
    ('tab', 'hole', 'flat', 'flat'),
    ('hole', 'tab', 'flat', 'hole'),
    ('tab', 'flat', 'flat', 'tab')
]

res = ['<svg width="0" height="0" style="position:absolute;"><defs>']
for i, (t, r, b, l) in enumerate(grid_types):
    path_d = make_jigsaw_path(t, r, b, l)
    res.append(f'  <clipPath id="jigsaw-clip-{i}" clipPathUnits="objectBoundingBox"><path d="{path_d}"/></clipPath>')
res.append('</defs></svg>')

output = '\n'.join(res)
with open('scratch/svg_clips.html', 'w', encoding='utf-8') as f:
    f.write(output)

print(output)
